// Global variables holding game data
var numflags = 0;
var num_tiles = 0;
var num_rows = 9;
var num_cols = 9;
var num_mines = 10;
var rxc = num_rows*num_cols;
var rxc_1 = rxc-num_rows;
var row = num_rows;
var board = new Array(num_rows * num_cols);     // Hidden from player. (0-8, and "mine" initially)
var visib = new Array(num_rows * num_cols);     // Visible to the player.  (Blank tiles initially)
var where = new Array(num_rows * num_cols);     // Tells game where the tile is relative to board. (Top, Bottom, 0, Bottomright...)
var gameover = false;
var myTimer;
var exdays = 365;
var solver_tried = false;
var solver_tried_once = false;
var open_tiles = 0;
// Why is github so difficult -_-

function changeBoardSize(){
    var width = $("#size_chosen").val();
    if(width == 9){
        num_cols = 9;
        num_rows = 9;
        num_mines = 10;
        rxc = num_rows*num_cols;
        rxc_1 = rxc-num_rows;
        row = num_rows;
        board = new Array(num_rows * num_cols);
        visib = new Array(num_rows * num_cols);
        where = new Array(num_rows * num_cols);
    }
    else if(width == 16){
        num_cols = 16;
        num_rows = 16;
        num_mines = 40;
        rxc = num_rows*num_cols;
        rxc_1 = rxc-num_rows;
        row = num_rows;
        board = new Array(num_rows * num_cols);
        visib = new Array(num_rows * num_cols);
        where = new Array(num_rows * num_cols);
    }

    maketable();
    newGame();
}

// converts time on clock to integer seconds
function getSeconds(str) {
    var p = str.split(':'),
        s = 0, m = 1;

    while (p.length > 0) {
        s += m * parseInt(p.pop(), 10);
        m *= 60;
    }

    return s;
}

function changeScreen(){
    if($("#body").hasClass("bright_screen")){

        $("#body").removeClass("bright_screen");
        $("#body").addClass("dark_screen");

        $("label").removeClass("black");
        $("label").addClass("white");

        $("#game_title").removeClass("black");
        $("#game_title").addClass("white");

        $(".reveal").removeClass("bright_screen")
        $(".reveal").addClass("dark_screen")
    }
    else{
        $("#body").addClass("bright_screen");
        $("#body").removeClass("dark_screen");

        $("label").removeClass("white");
        $("label").addClass("black");

        $("#game_title").removeClass("white");
        $("#game_title").addClass("black");

        $(".reveal").removeClass("dark_screen")
        $(".reveal").addClass("bright_screen")
    }
}

function secondsToTime(sec) {
    var hr = Math.floor(sec / 3600);
    var min = Math.floor((sec - (hr * 3600))/60);
    sec -= ((hr * 3600) + (min * 60));
    sec += ''; min += '';
    while (min.length < 2) {min = '0' + min;}
    while (sec.length < 2) {sec = '0' + sec;}
    hr = (hr)?hr+':':'';
    return hr + min + ':' + sec;
}

function getCookie(cname) {
    var name = cname + "=";
    var ca = document.cookie.split(';');
    for(var i=0; i<ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0)==' ') c = c.substring(1);
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}

function checkTopScore(new_score){
    var size = $("#size_chosen").val();
    var cookie_name = "topscore"+"/"+size+"/"+num_mines;
    var old_score = getCookie(cookie_name);
    if(old_score != ""){
        if(old_score > new_score && solver_tried_once == false){
            createTopScore(cookie_name, new_score, exdays);
            return true;
        }
        else
            return false;
    }
    else if(solver_tried_once == false){
        createTopScore(cookie_name, new_score, exdays);
        return true;
    }
    else
        return false;
}

function createTopScore(cname,cvalue,exdays) {
    var d = new Date();
    d.setTime(d.getTime() + (exdays*24*60*60*1000));
    var expires = "expires=" + d.toGMTString();
    document.cookie = cname+"="+cvalue+"; "+expires;
}

function showTopScore(){
    var size = $("#size_chosen").val();
    var cookie_name = "topscore"+"/"+size+"/"+num_mines;
    var old_score = getCookie(cookie_name);
    var score = secondsToTime(old_score);
    if(old_score == "")
        display = "No best time yet.";
    else
        display = "Your best time: " + score;

    $("#best_time_display").text(display);
    $('#best_time_display').foundation('open');
}

// Win  scenario
function youwin(n) {
    stopTime();
    gameover = true;

    var win_time = $("#thetime").val();
    var win_time_s = getSeconds(win_time);
    var beatOldScore = checkTopScore(win_time_s);
    if(beatOldScore){
        display = 'You win! New best time: '+win_time+'!';
    }
    else
        display = 'You win!';

    $("#game_over_modal").removeClass();
    
    // show the modal
    if($("#body").hasClass("bright_screen"))
      $("#game_over_modal").addClass('bet_success reveal');

    else
      $("#game_over_modal").addClass('dark_success reveal');

    $("#game_over_span").text(display);
    $('#game_over_modal').foundation('open');
}
// Lose scenario
function youlose() {
    stopTime();
    gameover = true;
    if (num_tiles == 0) display = 'You Lose. Bad Luck.';
    else display = 'You Lose.';

    // show the modal
    if($("#body").hasClass("bright_screen")){
      $("#game_over_modal").removeClass();
      $("#game_over_modal").addClass('bet_fail reveal');
    }
    else {
      $("#game_over_modal").removeClass();
      $("#game_over_modal").addClass('dark_fail reveal');
    }

    $("#game_over_span").text(display);
    $('#game_over_modal').foundation('open');
}

function you_stuck() {
  // show the modal
  $("#game_over_modal").removeClass();

  if($("#body").hasClass("bright_screen")){
    $("#game_over_modal").addClass('bright_screen reveal');
  }
  else {
    $("#game_over_modal").addClass('dark_screen reveal');
  }

  $("#game_over_span").text("Stuck!");
  $('#game_over_modal').foundation('open');
}

// Calls solver() if user hasnt clicked, otherwise S1(0)
function solve() {
    solver_tried = true;
    solver_tried_once = true;

    if (clicked == false)
        solver();
    else
        S1(0);

    solver_tried = false;
}

// This is called if user hasnt clicked any squares yet
function solver() {
    var squares_clicked = new Array(num_rows * num_cols);
    for (var i = 0; i < rxc; i++)
        squares_clicked[i] = 0;

    // click randomly until we hit mine or find a zero square
    while (true) {
        i = Math.floor((Math.random() * rxc) + 0); // i ranges from 0-255

        if (squares_clicked[i] == 1 || touching_number(i)) {
            continue;
        }
        else {
            squares_clicked[i] = 1;
            var r = clicky(i);                    // r ranges from (-1, 0, ... , 8) to represent (losing, blank, ... , 8)


            if (r == 0) {
                find_ones();
                S1(i);
                break;
            }

            else if (r == 1) {
                if (where[i] == "0") {
                    if (touching_all_tiles(i)) {
                        var p = guess_a_touching(i);
                        clicky(p);
                    }
                }
            }
            else if (r == undefined) { break; }
            else {
                switch (where[i]) {
                    case "topleft":
                        if (r == 3) {
                            if (document.images[i + 1].src != "https://rawgit.com/Davatata/Mine-Finder/master/png/flag.png")
                            { rightclick(i + 1); squares_clicked[i + 1] = 1; }
                            if (document.images[i + row].src != "https://rawgit.com/Davatata/Mine-Finder/master/png/flag.png")
                            { rightclick(i + row); squares_clicked[i + row] = 1; }
                            if (document.images[i + (row+1)].src != "https://rawgit.com/Davatata/Mine-Finder/master/png/flag.png")
                            { rightclick(i + (row+1)); squares_clicked[i + (row+1)] = 1; }
                        }
                        break;

                    case "topright":
                        if (r == 3) {
                            if (document.images[i - 1].src != "https://rawgit.com/Davatata/Mine-Finder/master/png/flag.png")
                            { rightclick(i - 1); squares_clicked[i - 1] = 1; }
                            if (document.images[i + row].src != "https://rawgit.com/Davatata/Mine-Finder/master/png/flag.png")
                            { rightclick(i + row); squares_clicked[i + row] = 1; }
                            if (document.images[i + (row-1)].src != "https://rawgit.com/Davatata/Mine-Finder/master/png/flag.png")
                            { rightclick(i + (row-1)); squares_clicked[i + (row-1)] = 1; }

                        }

                        break;

                    case "bottomleft":
                        if (r == 3) {
                            if (document.images[i + 1].src != "https://rawgit.com/Davatata/Mine-Finder/master/png/flag.png")
                            { rightclick(i + 1); squares_clicked[i + 1] = 1; }
                            if (document.images[i - row].src != "https://rawgit.com/Davatata/Mine-Finder/master/png/flag.png")
                            { rightclick(i - row); squares_clicked[i - row] = 1; }
                            if (document.images[i - (row-1)].src != "https://rawgit.com/Davatata/Mine-Finder/master/png/flag.png")
                            { rightclick(i - (row-1)); squares_clicked[i - (row-1)] = 1; }

                        }
                        break;

                    case "bottomright":
                        if (r == 3) {
                            if (document.images[i - 1].src != "https://rawgit.com/Davatata/Mine-Finder/master/png/flag.png")
                            { rightclick(i - 1); squares_clicked[i - 1] = 1; }
                            if (document.images[i - row].src != "https://rawgit.com/Davatata/Mine-Finder/master/png/flag.png")
                            { rightclick(i - row); squares_clicked[i - row] = 1; }
                            if (document.images[i - (row+1)].src != "https://rawgit.com/Davatata/Mine-Finder/master/png/flag.png")
                            { rightclick(i - (row+1)); squares_clicked[i - (row+1)] = 1; }

                        }
                        break;

                    case "top":
                        if (r == 5) {
                            if (document.images[i - 1].src != "https://rawgit.com/Davatata/Mine-Finder/master/png/flag.png")
                            { rightclick(i - 1); squares_clicked[i - 1] = 1; }
                            if (document.images[i + 1].src != "https://rawgit.com/Davatata/Mine-Finder/master/png/flag.png")
                            { rightclick(i + 1); squares_clicked[i + 1] = 1; }
                            if (document.images[i + (row-1)].src != "https://rawgit.com/Davatata/Mine-Finder/master/png/flag.png")
                            { rightclick(i + (row-1)); squares_clicked[i + (row-1)] = 1; }
                            if (document.images[i + row].src != "https://rawgit.com/Davatata/Mine-Finder/master/png/flag.png")
                            { rightclick(i + row); squares_clicked[i + row] = 1; }
                            if (document.images[i + (row+1)].src != "https://rawgit.com/Davatata/Mine-Finder/master/png/flag.png")
                            { rightclick(i + (row+1)); squares_clicked[i + (row+1)] = 1; }

                        }
                        break;

                    case "left":
                        if (r == 5) {
                            if (document.images[i - row].src != "https://rawgit.com/Davatata/Mine-Finder/master/png/flag.png")
                            { rightclick(i - row); squares_clicked[i - row] = 1; }
                            if (document.images[i + row].src != "https://rawgit.com/Davatata/Mine-Finder/master/png/flag.png")
                            { rightclick(i + row); squares_clicked[i + row] = 1; }
                            if (document.images[i + 1].src != "https://rawgit.com/Davatata/Mine-Finder/master/png/flag.png")
                            { rightclick(i + 1); squares_clicked[i + 1] = 1; }
                            if (document.images[i - (row-1)].src != "https://rawgit.com/Davatata/Mine-Finder/master/png/flag.png")
                            { rightclick(i - (row-1)); squares_clicked[i - (row-1)] = 1; }
                            if (document.images[i + (row+1)].src != "https://rawgit.com/Davatata/Mine-Finder/master/png/flag.png")
                            { rightclick(i + (row+1)); squares_clicked[i + (row+1)] = 1; }

                        }
                        break;

                    case "right":
                        if (r == 5) {
                            if (document.images[i - row].src != "https://rawgit.com/Davatata/Mine-Finder/master/png/flag.png")
                            { rightclick(i - row); squares_clicked[i - row] = 1; }
                            if (document.images[i + row].src != "https://rawgit.com/Davatata/Mine-Finder/master/png/flag.png")
                            { rightclick(i + row); squares_clicked[i + row] = 1; }
                            if (document.images[i - 1].src != "https://rawgit.com/Davatata/Mine-Finder/master/png/flag.png")
                            { rightclick(i - 1); squares_clicked[i - 1] = 1; }
                            if (document.images[i + (row-1)].src != "https://rawgit.com/Davatata/Mine-Finder/master/png/flag.png")
                            { rightclick(i + (row-1)); squares_clicked[i + (row-1)] = 1; }
                            if (document.images[i - (row+1)].src != "https://rawgit.com/Davatata/Mine-Finder/master/png/flag.png")
                            { rightclick(i - (row+1)); squares_clicked[i - (row+1)] = 1; }

                        }
                        break;

                    case "bottom":
                        if (r == 5) {
                            if (document.images[i - 1].src != "https://rawgit.com/Davatata/Mine-Finder/master/png/flag.png")
                            { rightclick(i - 1); squares_clicked[i - 1] = 1; }
                            if (document.images[i - row].src != "https://rawgit.com/Davatata/Mine-Finder/master/png/flag.png")
                            { rightclick(i - row); squares_clicked[i - row] = 1; }
                            if (document.images[i + 1].src != "https://rawgit.com/Davatata/Mine-Finder/master/png/flag.png")
                            { rightclick(i + 1); squares_clicked[i + 1] = 1; }
                            if (document.images[i - (row-1)].src != "https://rawgit.com/Davatata/Mine-Finder/master/png/flag.png")
                            { rightclick(i - (row-1)); squares_clicked[i - (row-1)] = 1; }
                            if (document.images[i - (row+1)].src != "https://rawgit.com/Davatata/Mine-Finder/master/png/flag.png")
                            { rightclick(i - (row+1)); squares_clicked[i - (row+1)] = 1; }

                        }
                        break;

                    case "0":
                        if (r == 8) {
                            if (document.images[i - 1].src != "https://rawgit.com/Davatata/Mine-Finder/master/png/flag.png")
                            { rightclick(i - 1); squares_clicked[i - 1] = 1; }
                            if (document.images[i + 1].src != "https://rawgit.com/Davatata/Mine-Finder/master/png/flag.png")
                            { rightclick(i + 1); squares_clicked[i + 1] = 1; }
                            if (document.images[i + row].src != "https://rawgit.com/Davatata/Mine-Finder/master/png/flag.png")
                            { rightclick(i + row); squares_clicked[i + row] = 1; }
                            if (document.images[i - row].src != "https://rawgit.com/Davatata/Mine-Finder/master/png/flag.png")
                            { rightclick(i - row); squares_clicked[i - row] = 1; }
                            if (document.images[i - (row+1)].src != "https://rawgit.com/Davatata/Mine-Finder/master/png/flag.png")
                            { rightclick(i - (row+1)); squares_clicked[i - (row+1)] = 1; }
                            if (document.images[i + (row+1)].src != "https://rawgit.com/Davatata/Mine-Finder/master/png/flag.png")
                            { rightclick(i + (row+1)); squares_clicked[i + (row+1)] = 1; }
                            if (document.images[i + (row-1)].src != "https://rawgit.com/Davatata/Mine-Finder/master/png/flag.png")
                            { rightclick(i + (row-1)); squares_clicked[i + (row-1)] = 1; }
                            if (document.images[i - (row-1)].src != "https://rawgit.com/Davatata/Mine-Finder/master/png/flag.png")
                            { rightclick(i - (row-1)); squares_clicked[i - (row-1)] = 1; }

                        }
                        break;
                }
            }
        }
    }
}

// Check number of flags being touched by position i
// Check number of tiles touching position i
function S2(i, e) {
    switch (where[i]) {
        case "topleft":
            if (num_flags_TL(i) == e)
            { clicky(i + 1); clicky(i + row); clicky(i + (row+1)); }
            else if (num_tiles_TL(i) == e)
                right_click_TL(i);
            break;
        case "topright":
            if (num_flags_TR(i) == e)
            { clicky(i - 1); clicky(i + row); clicky(i + (row-1)); }
            else if (num_tiles_TR(i) == e)
                right_click_TR(i);
            break;

        case "bottomleft":
            if (num_flags_BL(i) == e)
            { clicky(i + 1); clicky(i - row); clicky(i - (row-1)); }
            else if (num_tiles_BL(i) == e)
                right_click_BL(i);
            break;

        case "bottomright":
            if (num_flags_BR(i) == e)
            { clicky(i - 1); clicky(i - row); clicky(i - (row+1)); }
            else if (num_tiles_BR(i) == e)
                right_click_BR(i);
            break;

        case "top":
            if (num_flags_T(i) == e)
            { clicky(i - 1); clicky(i + 1); clicky(i + (row-1)); clicky(i + row); clicky(i + (row+1)); }
            else if (num_tiles_T(i) == e)
                right_click_T(i);
            break;

        case "left":
            if (num_flags_L(i) == e)
            { clicky(i - row); clicky(i + row); clicky(i + 1); clicky(i - (row-1)); clicky(i + (row+1)); }
            else if (num_tiles_L(i) == e)
                right_click_L(i);
            break;

        case "right":
            if (num_flags_R(i) == e)
            { clicky(i - row); clicky(i + row); clicky(i - 1); clicky(i + (row-1)); clicky(i - (row+1)); }
            else if (num_tiles_R(i) == e)
                right_click_R(i);
            break;

        case "bottom":
            if (num_flags_B(i) == e)
            { clicky(i - 1); clicky(i - row); clicky(i + 1); clicky(i - (row-1)); clicky(i - (row+1)); }
            else if (num_tiles_B(i) == e)
                right_click_B(i);
            break;

        case "0":
            if ((num_flags_0(i)) == e)
            { clicky(i - 1); clicky(i + 1); clicky(i + row); clicky(i - row); clicky(i - (row+1)); clicky(i + (row+1)); clicky(i + (row-1)); clicky(i - (row-1)); }
            else if ((num_tiles_0(i)) == e)
                right_click_0(i);
            break;
    }
}

// Send the number displayed by position i to S2()
function check_tile(i) {

    if (visib[i] == "1")
        S2(i, 1);
    else if (visib[i] == "2")
        S2(i, 2);
    else if (visib[i] == "3")
        S2(i, 3);
    else if (visib[i] == "4")
        S2(i, 4);
    else if (visib[i] == "5")
        S2(i, 5);
    else if (visib[i] == "6")
        S2(i, 6);
    else if (visib[i] == "7")
        S2(i, 7);
    else if (visib[i] == "8")
        S2(i, 8);
    else { }

}

// S1 calls most of solving functions and actions
function S1(p) {
    var runs = 0;
    while (gameover == false) {
        var updated = numflags;
        for (var i = 0; i < rxc; i++) {
            check_tile(i);
            find_ones();
        }

        if (numflags == (num_mines - 1)) {
            var tile1 = 0;
            var tile2 = 0;
            for (var i = 0; i < rxc; i++) {
                if ((visib[i] == "tile") && (document.images[i] != "https://rawgit.com/Davatata/Mine-Finder/master/png/flag.png")) {
                    tile1++;
                    tile2 = i;
                }
            }
            if (tile1 == 1)
                rightclick(tile2);
        }


        else if (numflags == num_mines) {
            for (var i = 0; i < rxc; i++) {
                clicky(i);
            }
            youwin();
        }

        if (updated == numflags) {
            runs += 1;
            if (runs > 4) {
                you_stuck();
                break;
            }
        }
    }

}

// Find  1-1 pairs next to borders
function find_ones() {
    for (var i = 0; i < row; i++) {
        if ((visib[i] == "1") && (visib[i + row] == "1")) {
            if (where[i] == "topleft") { clicky(i + (row*2)); clicky(i + ((row*2) + 1)); }
            else if (where[i] == "topright") { clicky(i + ((row*2) - 1)); clicky(i + (row*2)); }
            else { clicky(i + ((row*2) - 1)); clicky(i + (row*2)); clicky(i + ((row*2) + 1)); }
        }
    }

    for (var i = 0; i < (rxc - row + 1); i = i + row) {
        if ((visib[i] == "1") && (visib[i + 1] == "1")) {
            if (where[i] == "topleft") { clicky(i + 2); clicky(i + (row + 2)); }
            else if (where[i] == "bottomleft") { clicky(i + 2); clicky(i - (row - 2)); }
            else { clicky(i - (row - 2)); clicky(i + 2); clicky(i + (row + 2)); }
        }
    }

    for (var i = (row-1); i < rxc; i = i + row) {
        if ((visib[i] == "1") && (visib[i - 1] == "1")) {
            if (where[i] == "topright") { clicky(i - 2); clicky(i + (row - 2)); }
            else if (where[i] == "bottomright") { clicky(i - 2); clicky(i - (row + 2)); }
            else { clicky(i - (row + 2)); clicky(i - 2); clicky(i + (row - 2)); }
        }
    }

    for (var i = (rxc - row); i < rxc; i++) {
        if ((visib[i] == "1") && (visib[i - row] == "1")) {
            if (where[i] == "bottomleft") { clicky(i - (row*2)); clicky(i - ((row*2) - 1)); }
            else if (where[i] == "bottomright") { clicky(i - (row*2)); clicky(i - ((row*2) + 1)); }
            else { clicky(i - ((row*2) + 1)); clicky(i - (row*2)); clicky(i - ((row*2) - 1)); }
        }
    }
}



// Take guess
function guess_one(i) {
    if (where[i] == "0") {
        clicky(i);
    }
}

// Check if a "middle" tile is surrounded by all unopened tiles.
function touching_all_tiles(i) {
    if(count_tiles(i) == 8)
        return true;
    return false;
}

function guess_a_touching(i) {
    var pos = [i - 1, i + 1, i + row, i - row, i - (row+1), i + (row+1), i + (row-1), i - (row-1)];
    i = Math.floor((Math.random() * 8) + 0);
    return pos[i];
}
