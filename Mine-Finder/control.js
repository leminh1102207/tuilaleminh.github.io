function newGame() {
    clock = 0;
    numflags = 0;
    num_tiles = 0;
    gameover = false;
    clicked = false;
    solver_tried = false;
    solver_tried_once = false;

    for (var i = 0; i < num_rows * num_cols; i++) {
        visib[i] = "tile";
        board[i] = "0";
        document.images[i].src = "https://rawgit.com/Davatata/Mine-Finder/master/png/" + visib[i] + ".png";
	}

    //set up 40 mines
    for (var i = 0; i < num_mines; i++) {
        board[i] = "mine";
	}

    //randomize the mines
    for (var i = 0; i < num_rows * num_cols; i++) {
        var rand = Math.floor(Math.random() * (i + 1));
        var temp = board[rand];
        board[rand] = board[i];
        board[i] = temp;
	}

    var start_time = new Date();
    begin = start_time.getTime();
    stopTime();
    myTimer = setInterval(function () { updateTimer() }, 1000);

    //call to set up mines
    setboard();

    document.getElementById("theflags").value = numflags + "/" + num_mines;


}

// pause execution
function sleep(miliseconds) {
	var currentTime = new Date().getTime();

	while (currentTime + miliseconds >= new Date().getTime()) {
	}
}

//sets up the numbers according to mine placement
function setboard() {

    for (var i = 0; i < num_rows * num_cols; i++) where[i] = board[i];
    where[0] = "topleft"; where[num_rows-1] = "topright"; where[rxc - num_rows] = "bottomleft"; where[rxc - 1] = "bottomright";
    for (var i = 1; i < num_rows-1; i++) where[i] = "top";
    for (var i = num_rows; i < rxc_1; i += num_rows) where[i] = "left";
    for (var i = (num_rows*2-1); i < rxc-1; i += num_rows) where[i] = "right";
    for (var i = rxc_1+1; i < rxc-1; i++) where[i] = "bottom";

    for (var i = 0; i < num_rows * num_cols; i++) {
        if (board[i] == "mine") continue;
        switch (where[i]) {
            case "topleft": board[i] = check(i + 1) + check(i + row) + check(i + (row+1)); break;
            case "topright": board[i] = check(i - 1) + check(i + row) + check(i + (row-1)); break;
            case "bottomleft": board[i] = check(i + 1) + check(i - row) + check(i - (row-1)); break;
            case "bottomright": board[i] = check(i - 1) + check(i - row) + check(i - (row+1)); break;
            case "top": board[i] = check(i - 1) + check(i + 1) + check(i + (row-1)) + check(i + row) + check(i + (row+1)); break;
            case "left": board[i] = check(i - row) + check(i + row) + check(i + 1) + check(i - (row-1)) + check(i + (row+1)); break;
            case "right": board[i] = check(i - row) + check(i + row) + check(i - 1) + check(i + (row-1)) + check(i - (row+1)); break;
            case "bottom": board[i] = check(i - 1) + check(i - row) + check(i + 1) + check(i - (row-1)) + check(i - (row+1)); break;
            case "0": board[i] = check(i - 1) + check(i + 1) + check(i + row) + check(i - row) + check(i - (row+1)) + check(i + (row+1)) + check(i + (row-1)) + check(i - (row-1)); break;

		}
	}
}

//if cell contains 0, reveal all neighbors until numbers are reached
function reveal(n) {

    if (board[n] == 0 && (document.images[n].src == "https://rawgit.com/Davatata/Mine-Finder/master/png/tile.png")) {
        document.images[n].src = "https://rawgit.com/Davatata/Mine-Finder/master/png/" + board[n] + ".png"; visib[n] = board[n];
        revealer(n);

	}

    else if (board[n] == 0 && (document.images[n].src == "https://rawgit.com/Davatata/Mine-Finder/master/png/flag.png")) {
        numflags--;
        document.images[n].src = "https://rawgit.com/Davatata/Mine-Finder/master/png/" + board[n] + ".png"; visib[n] = board[n];
        document.getElementById("theflags").value = numflags + "/" + num_mines;
        revealer(n);

	}
    else if (board[n] != "mine" && (document.images[n].src == "https://rawgit.com/Davatata/Mine-Finder/master/png/flag.png")) {
        numflags--;
        document.images[n].src = "https://rawgit.com/Davatata/Mine-Finder/master/png/" + board[n] + ".png"; visib[n] = board[n];
        document.getElementById("theflags").value = numflags + "/" + num_mines;

	}



    else {
        document.images[n].src = "https://rawgit.com/Davatata/Mine-Finder/master/png/" + board[n] + ".png"; visib[n] = board[n];
	}

}

function revealer(i) {
    switch (where[i]) {
        case "topleft":
            if(visib[i + 1] == "tile") reveal(i + 1);
            if(visib[i + row] == "tile") reveal(i + row);
            if(visib[i + (row+1)] == "tile") reveal(i + (row+1));
            break;
        case "topright":
            if(visib[i - 1] == "tile") reveal(i - 1);
            if(visib[i + row] == "tile") reveal(i + row);
            if(visib[i + (row-1)] == "tile") reveal(i + (row-1));
            break;
        case "bottomleft":
            if(visib[i + 1] == "tile") reveal(i + 1);
            if(visib[i - row] == "tile") reveal(i - row);
            if(visib[i - (row-1)] == "tile") reveal(i - (row-1));
            break;
        case "bottomright":
            if(visib[i - 1] == "tile") reveal(i - 1);
            if(visib[i - row] == "tile") reveal(i - row);
            if(visib[i - (row+1)] == "tile") reveal(i - (row+1));
            break;
        case "top":
            if(visib[i - 1] == "tile") reveal(i - 1);
            if(visib[i + 1] == "tile")  reveal(i + 1);
            if(visib[i + (row-1)] == "tile") reveal(i + (row-1));
            if(visib[i + row] == "tile") reveal(i + row);
            if(visib[i + (row+1)] == "tile") reveal(i + (row+1));
            break;
        case "left":
            if(visib[i - row] == "tile") reveal(i - row);
            if(visib[i + row] == "tile") reveal(i + row);
            if(visib[i + 1] == "tile") reveal(i + 1);
            if(visib[i - (row-1)] == "tile") reveal(i - (row-1));
            if(visib[i + (row+1)] == "tile") reveal(i + (row+1));
            break;
        case "right":
            if(visib[i - row] == "tile") reveal(i - row);
            if(visib[i + row] == "tile") reveal(i + row);
            if(visib[i - 1] == "tile") reveal(i - 1);
            if(visib[i + (row-1)] == "tile") reveal(i + (row-1));
            if(visib[i - (row+1)] == "tile") reveal(i - (row+1));
            break;
        case "bottom":
            if(visib[i - 1] == "tile") reveal(i - 1);
            if(visib[i - row] == "tile") reveal(i - row);
            if(visib[i + 1] == "tile") reveal(i + 1);
            if(visib[i - (row-1)] == "tile") reveal(i - (row-1));
            if(visib[i - (row+1)] == "tile") reveal(i - (row+1));
            break;
        case "0":
            if(visib[i - 1] == "tile") reveal(i - 1);
            if(visib[i + 1] == "tile") reveal(i + 1);
            if(visib[i + row] == "tile") reveal(i + row);
            if(visib[i - row] == "tile") reveal(i - row);
            if(visib[i - (row+1)] == "tile") reveal(i - (row+1));
            if(visib[i + (row+1)] == "tile") reveal(i + (row+1));
            if(visib[i + (row-1)] == "tile") reveal(i + (row-1));
            if(visib[i - (row-1)] == "tile") reveal(i - (row-1));
            break;
        case "mine": break;

	}
}

function getTiles(){
    var unopened_tiles = 0;
    if(!solver_tried){
        for(var i = 0; i < rxc; i++){
            if(visib[i] == "tile")
                unopened_tiles++;
        }
    }
    return unopened_tiles;
}

function putFlags(){
    for(var i = 0; i < rxc; i++){
        if(visib[i] == "tile")
            document.images[i].src = "https://rawgit.com/Davatata/Mine-Finder/master/png/flag.png";
    }

    $("#theflags").val(num_mines + "/" + num_mines);
    return;
}

function stopTime(){
    //console.log("Caution: time has been stopped");
    clearInterval(myTimer);
}

//handles left clicks
function clicky(n) {
    clicked = true;

    if (gameover == true) { }
    else if (document.images[n].src == "https://rawgit.com/Davatata/Mine-Finder/master/png/flag.png")
	   return;

    else if (board[n] == "mine") {
        for (var i = 0; i < num_rows * num_cols; i++) {
            if (document.images[i].src == "https://rawgit.com/Davatata/Mine-Finder/master/png/flag.png" && board[i] != "mine")
			board[i] = "xflag";

            document.images[i].src = "https://rawgit.com/Davatata/Mine-Finder/master/png/" + board[i] + ".png";
		}
        document.images[n].src = "https://rawgit.com/Davatata/Mine-Finder/master/png/redmine.png";
        youlose();
        return -1;
	}

    else if (board[n] == 0)
    {
        reveal(n);
        num_tiles++;
        if(getTiles() == num_mines){
            putFlags();
            youwin();
        }
        return visib[n];
    }

    else {
        document.images[n].src = "https://rawgit.com/Davatata/Mine-Finder/master/png/" + board[n] + ".png";

        num_tiles++;
        visib[n] = board[n];
        if(getTiles() == num_mines){
            putFlags();
            youwin();
        }
        return visib[n];
    }



}

//handle right click to place or remove flags, update flag counter
function rightclick(n) {
    if (document.images[n].src == "https://rawgit.com/Davatata/Mine-Finder/master/png/flag.png") {
        document.images[n].src = "https://rawgit.com/Davatata/Mine-Finder/master/png/tile.png";
        numflags--;
	}

    else if (document.images[n].src == "https://rawgit.com/Davatata/Mine-Finder/master/png/tile.png") {
        document.images[n].src = "https://rawgit.com/Davatata/Mine-Finder/master/png/flag.png";
        numflags++;
	}

    document.getElementById("theflags").value = numflags + "/" + num_mines;
    if ((num_tiles == (rxc - num_mines)) && (numflags == num_mines)) youwin();
    return false;
}

//creates a num_cols*num_rows table using HTML
function maketable() {
    $("#board").html();
    var board_make = '';
    //document.write('<table border="0" cellspacing="0" cellpadding="0">');

    var n = 0;
    for (var i = 0; i < num_rows; i++) {
        //document.write('<tr>');
		board_make+= '<tr>';
        for (var j = 0; j < num_cols; j++) {
            //document.write('<td><a HREF="" onClick="clicky(' + n + '); return false;" onContextMenu="return rightclick(' + n + '); return false;"><img SRC="https://rawgit.com/Davatata/Mine-Finder/master/png/tile.png" WIDTH="24" HEIGHT="24"></a></td>');
            board_make += '<td><a HREF="" onClick="clicky(' + n + '); return false;" onContextMenu="return rightclick(' + n + '); return false;"><img SRC="https://rawgit.com/Davatata/Mine-Finder/master/png/tile.png"></a></td>';
            n++;
		}

        //document.write('</tr>');
        board_make += '</tr>';
	}

    //document.write('</table>');
    board_make += '</table>';
    $("#board").html(board_make);
}


function toggle_solve_button() {
    $('#solve_button').toggle();
    $("#solving").toggle();
}

//called every second after game starts and displayed in Time text field
function updateTimer() {
    var t_secs = "";
    var t_min = "";
    var curTime = new Date();

    var secs = (curTime.getTime() - begin) / 1000;
    secs = secs.toFixed(0);

    var min = 0;
    while (secs >= 60) {
        min++;
        secs = secs - 60;
	}

    if (min < 10)
	t_min = "0" + min.toString();
    else
	t_min = min.toString();
    if (secs < 10)
	t_secs = "0" + secs.toString();
    else
	t_secs = secs.toString();
    document.getElementById("thetime").value = t_min + ":" + t_secs;
}


//check if cell has mine
function check(i) {
    if (board[i] == "mine") return 1;
    else return 0;
}

// These functions return number of tiles/ number of flags touched by position i and perform right click on i
function num_tiles_TL(i) {
    var x = 0;
    if ((visib[i + 1] == "tile")) { x++; }
    if ((visib[i + row] == "tile")) { x++; }
    if ((visib[i + (row+1)] == "tile")) { x++; }
    return x;
}

function num_flags_TL(i) {
    var x = 0;
    if (document.images[i + 1].src == "https://rawgit.com/Davatata/Mine-Finder/master/png/flag.png") { x++; }
    if (document.images[i + row].src == "https://rawgit.com/Davatata/Mine-Finder/master/png/flag.png") { x++; }
    if (document.images[i + (row+1)].src == "https://rawgit.com/Davatata/Mine-Finder/master/png/flag.png") { x++; }
    return x;
}

function right_click_TL(i) {
    if (document.images[i + 1].src != "https://rawgit.com/Davatata/Mine-Finder/master/png/flag.png") { rightclick(i + 1); }//check_tile(i + 1); }
    if (document.images[i + row].src != "https://rawgit.com/Davatata/Mine-Finder/master/png/flag.png") { rightclick(i + row); }//check_tile(i + row); }
    if (document.images[i + (row+1)].src != "https://rawgit.com/Davatata/Mine-Finder/master/png/flag.png") { rightclick(i + (row+1)); }//check_tile(i + (row+1)); }
}

function num_tiles_TR(i) {
    var x = 0;
    if ((visib[i - 1] == "tile")) { x++; }
    if ((visib[i + row] == "tile")) { x++; }
    if ((visib[i + (row-1)] == "tile")) { x++; }
    return x;
}

function num_flags_TR(i) {
    var x = 0;
    if (document.images[i - 1].src == "https://rawgit.com/Davatata/Mine-Finder/master/png/flag.png") { x++; }
    if (document.images[i + row].src == "https://rawgit.com/Davatata/Mine-Finder/master/png/flag.png") { x++; }
    if (document.images[i + (row-1)].src == "https://rawgit.com/Davatata/Mine-Finder/master/png/flag.png") { x++; }
    return x;
}

function right_click_TR(i) {
    if (document.images[i - 1].src != "https://rawgit.com/Davatata/Mine-Finder/master/png/flag.png") { rightclick(i - 1); }//check_tile(i - 1); }
    if (document.images[i + row].src != "https://rawgit.com/Davatata/Mine-Finder/master/png/flag.png") { rightclick(i + row); }//check_tile(i + row); }
    if (document.images[i + (row-1)].src != "https://rawgit.com/Davatata/Mine-Finder/master/png/flag.png") { rightclick(i + (row-1)); }//check_tile(i + (row-1)); }
}

function num_tiles_BL(i) {
    var x = 0;
    if ((visib[i + 1] == "tile")) { x++; }
    if ((visib[i - row] == "tile")) { x++; }
    if ((visib[i - (row-1)] == "tile")) { x++; }
    return x;
}

function num_flags_BL(i) {
    var x = 0;
    if (document.images[i + 1].src == "https://rawgit.com/Davatata/Mine-Finder/master/png/flag.png") { x++; }
    if (document.images[i - row].src == "https://rawgit.com/Davatata/Mine-Finder/master/png/flag.png") { x++; }
    if (document.images[i - (row-1)].src == "https://rawgit.com/Davatata/Mine-Finder/master/png/flag.png") { x++; }
    return x;
}

function right_click_BL(i) {
    if (document.images[i + 1].src != "https://rawgit.com/Davatata/Mine-Finder/master/png/flag.png") { rightclick(i + 1); }//check_tile(i + 1); }
    if (document.images[i - row].src != "https://rawgit.com/Davatata/Mine-Finder/master/png/flag.png") { rightclick(i - row); }//check_tile(i - row); }
    if (document.images[i - (row-1)].src != "https://rawgit.com/Davatata/Mine-Finder/master/png/flag.png") { rightclick(i - (row-1)); }//check_tile(i - (row-1)); }
}

function num_tiles_BR(i) {
    var x = 0;
    if ((visib[i - 1] == "tile")) { x++; }
    if ((visib[i - row] == "tile")) { x++; }
    if ((visib[i - (row+1)] == "tile")) { x++; }

    return x;
}

function num_flags_BR(i) {
    var x = 0;
    if (document.images[i - 1].src == "https://rawgit.com/Davatata/Mine-Finder/master/png/flag.png") { x++; }
    if (document.images[i - row].src == "https://rawgit.com/Davatata/Mine-Finder/master/png/flag.png") { x++; }
    if (document.images[i - (row+1)].src == "https://rawgit.com/Davatata/Mine-Finder/master/png/flag.png") { x++; }

    return x;
}

function right_click_BR(i) {
    if (document.images[i - 1].src != "https://rawgit.com/Davatata/Mine-Finder/master/png/flag.png") { rightclick(i - 1); }//check_tile(i - 1); }
    if (document.images[i - row].src != "https://rawgit.com/Davatata/Mine-Finder/master/png/flag.png") { rightclick(i - row); }//check_tile(i - row); }
    if (document.images[i - (row+1)].src != "https://rawgit.com/Davatata/Mine-Finder/master/png/flag.png") { rightclick(i - (row+1)); }//check_tile(i - (row+1)); }
}

function num_tiles_T(i) {
    var x = 0;
    if ((visib[i - 1] == "tile")) { x++; }
    if ((visib[i + 1] == "tile")) { x++; }
    if ((visib[i + (row-1)] == "tile")) { x++; }
    if ((visib[i + row] == "tile")) { x++; }
    if ((visib[i + (row+1)] == "tile")) { x++; }
    return x;
}

function num_flags_T(i) {
    var x = 0;
    if (document.images[i - 1].src == "https://rawgit.com/Davatata/Mine-Finder/master/png/flag.png") { x++; }
    if (document.images[i + 1].src == "https://rawgit.com/Davatata/Mine-Finder/master/png/flag.png") { x++; }
    if (document.images[i + (row-1)].src == "https://rawgit.com/Davatata/Mine-Finder/master/png/flag.png") { x++; }
    if (document.images[i + row].src == "https://rawgit.com/Davatata/Mine-Finder/master/png/flag.png") { x++; }
    if (document.images[i + (row+1)].src == "https://rawgit.com/Davatata/Mine-Finder/master/png/flag.png") { x++; }
    return x;
}

function right_click_T(i) {
    if (document.images[i - 1].src != "https://rawgit.com/Davatata/Mine-Finder/master/png/flag.png") { rightclick(i - 1); }//check_tile(i - 1); }
    if (document.images[i + 1].src != "https://rawgit.com/Davatata/Mine-Finder/master/png/flag.png") { rightclick(i + 1); }//check_tile(i + 1); }
    if (document.images[i + (row-1)].src != "https://rawgit.com/Davatata/Mine-Finder/master/png/flag.png") { rightclick(i + (row-1)); }//check_tile(i + (row-1)); }
    if (document.images[i + row].src != "https://rawgit.com/Davatata/Mine-Finder/master/png/flag.png") { rightclick(i + row); }//check_tile(i + row); }
    if (document.images[i + (row+1)].src != "https://rawgit.com/Davatata/Mine-Finder/master/png/flag.png") { rightclick(i + (row+1)); }//check_tile(i + (row+1)); }
}

function num_tiles_L(i) {
    var x = 0;
    if ((visib[i - row] == "tile")) { x++; }
    if ((visib[i + row] == "tile")) { x++; }
    if ((visib[i + 1] == "tile")) { x++; }
    if ((visib[i - (row-1)] == "tile")) { x++; }
    if ((visib[i + (row+1)] == "tile")) { x++; }
    return x;
}

function num_flags_L(i) {
    var x = 0;
    if (document.images[i - row].src == "https://rawgit.com/Davatata/Mine-Finder/master/png/flag.png") { x++; }
    if (document.images[i + row].src == "https://rawgit.com/Davatata/Mine-Finder/master/png/flag.png") { x++; }
    if (document.images[i + 1].src == "https://rawgit.com/Davatata/Mine-Finder/master/png/flag.png") { x++; }
    if (document.images[i - (row-1)].src == "https://rawgit.com/Davatata/Mine-Finder/master/png/flag.png") { x++; }
    if (document.images[i + (row+1)].src == "https://rawgit.com/Davatata/Mine-Finder/master/png/flag.png") { x++; }
    return x;
}

function right_click_L(i) {
    if (document.images[i - row].src != "https://rawgit.com/Davatata/Mine-Finder/master/png/flag.png") { rightclick(i - row); }//check_tile(i - row); }
    if (document.images[i + row].src != "https://rawgit.com/Davatata/Mine-Finder/master/png/flag.png") { rightclick(i + row); }//check_tile(i + row); }
    if (document.images[i + 1].src != "https://rawgit.com/Davatata/Mine-Finder/master/png/flag.png") { rightclick(i + 1); }//check_tile(i + 1); }
    if (document.images[i - (row-1)].src != "https://rawgit.com/Davatata/Mine-Finder/master/png/flag.png") { rightclick(i - (row-1)); }//check_tile(i - (row-1)); }
    if (document.images[i + (row+1)].src != "https://rawgit.com/Davatata/Mine-Finder/master/png/flag.png") { rightclick(i + (row+1)); }//check_tile(i + (row+1)); }
}

function num_tiles_R(i) {
    var x = 0;
    if ((visib[i - row] == "tile")) { x++; }
    if ((visib[i + row] == "tile")) { x++; }
    if ((visib[i - 1] == "tile")) { x++; }
    if ((visib[i + (row-1)] == "tile")) { x++; }
    if ((visib[i - (row+1)] == "tile")) { x++; }
    return x;
}

function num_flags_R(i) {
    var x = 0;
    if (document.images[i - row].src == "https://rawgit.com/Davatata/Mine-Finder/master/png/flag.png") { x++; }
    if (document.images[i + row].src == "https://rawgit.com/Davatata/Mine-Finder/master/png/flag.png") { x++; }
    if (document.images[i - 1].src == "https://rawgit.com/Davatata/Mine-Finder/master/png/flag.png") { x++; }
    if (document.images[i + (row-1)].src == "https://rawgit.com/Davatata/Mine-Finder/master/png/flag.png") { x++; }
    if (document.images[i - (row+1)].src == "https://rawgit.com/Davatata/Mine-Finder/master/png/flag.png") { x++; }
    return x;
}

function right_click_R(i) {
    if (document.images[i - row].src != "https://rawgit.com/Davatata/Mine-Finder/master/png/flag.png") { rightclick(i - row); }//check_tile(i - row); }
    if (document.images[i + row].src != "https://rawgit.com/Davatata/Mine-Finder/master/png/flag.png") { rightclick(i + row); }//check_tile(i + row); }
    if (document.images[i - 1].src != "https://rawgit.com/Davatata/Mine-Finder/master/png/flag.png") { rightclick(i - 1); }//check_tile(i - 1); }
    if (document.images[i + (row-1)].src != "https://rawgit.com/Davatata/Mine-Finder/master/png/flag.png") { rightclick(i + (row-1)); }//check_tile(i + (row-1)); }
    if (document.images[i - (row+1)].src != "https://rawgit.com/Davatata/Mine-Finder/master/png/flag.png") { rightclick(i - (row+1)); }//check_tile(i - (row+1)); }
}

function num_tiles_B(i) {
    var x = 0;
    if ((visib[i - 1] == "tile")) { x++; }
    if ((visib[i - row] == "tile")) { x++; }
    if ((visib[i + 1] == "tile")) { x++; }
    if ((visib[i - (row-1)] == "tile")) { x++; }
    if ((visib[i - (row+1)] == "tile")) { x++; }
    return x;
}

function num_flags_B(i) {
    var x = 0;
    if (document.images[i - 1].src == "https://rawgit.com/Davatata/Mine-Finder/master/png/flag.png") { x++; }
    if (document.images[i - row].src == "https://rawgit.com/Davatata/Mine-Finder/master/png/flag.png") { x++; }
    if (document.images[i + 1].src == "https://rawgit.com/Davatata/Mine-Finder/master/png/flag.png") { x++; }
    if (document.images[i - (row-1)].src == "https://rawgit.com/Davatata/Mine-Finder/master/png/flag.png") { x++; }
    if (document.images[i - (row+1)].src == "https://rawgit.com/Davatata/Mine-Finder/master/png/flag.png") { x++; }
    return x;
}

function right_click_B(i) {
    if (document.images[i - 1].src != "https://rawgit.com/Davatata/Mine-Finder/master/png/flag.png") { rightclick(i - 1); }//check_tile(i - 1); }
    if (document.images[i - row].src != "https://rawgit.com/Davatata/Mine-Finder/master/png/flag.png") { rightclick(i - row); }//check_tile(i - row); }
    if (document.images[i + 1].src != "https://rawgit.com/Davatata/Mine-Finder/master/png/flag.png") { rightclick(i + 1); }//check_tile(i + 1); }
    if (document.images[i - (row-1)].src != "https://rawgit.com/Davatata/Mine-Finder/master/png/flag.png") { rightclick(i - (row-1)); }//check_tile(i - (row-1)); }
    if (document.images[i - (row+1)].src != "https://rawgit.com/Davatata/Mine-Finder/master/png/flag.png") { rightclick(i - (row+1)); }//check_tile(i - (row+1)); }
}

function num_tiles_0(i) {
    var x = 0;
    if ((visib[i - 1]  == "tile")) { x++; }
    if ((visib[i + 1]  == "tile")) { x++; }
    if ((visib[i + row] == "tile")) { x++; }
    if ((visib[i - row] == "tile")) { x++; }
    if ((visib[i - (row+1)] == "tile")) { x++; }
    if ((visib[i + (row+1)] == "tile")) { x++; }
    if ((visib[i + (row-1)] == "tile")) { x++; }
    if ((visib[i - (row-1)] == "tile")) { x++; }

    return x;
}
function num_flags_0(i) {
    var x = 0;
    if (document.images[i - 1].src == "https://rawgit.com/Davatata/Mine-Finder/master/png/flag.png") { x++; }
    if (document.images[i + 1].src == "https://rawgit.com/Davatata/Mine-Finder/master/png/flag.png") { x++; }
    if (document.images[i + row].src == "https://rawgit.com/Davatata/Mine-Finder/master/png/flag.png") { x++; }
    if (document.images[i - row].src == "https://rawgit.com/Davatata/Mine-Finder/master/png/flag.png") { x++; }
    if (document.images[i - (row+1)].src == "https://rawgit.com/Davatata/Mine-Finder/master/png/flag.png") { x++; }
    if (document.images[i + (row+1)].src == "https://rawgit.com/Davatata/Mine-Finder/master/png/flag.png") { x++; }
    if (document.images[i + (row-1)].src == "https://rawgit.com/Davatata/Mine-Finder/master/png/flag.png") { x++; }
    if (document.images[i - (row-1)].src == "https://rawgit.com/Davatata/Mine-Finder/master/png/flag.png") { x++; }
    return x;
}
function right_click_0(i) {
    if (document.images[i - 1].src != "https://rawgit.com/Davatata/Mine-Finder/master/png/flag.png") { rightclick(i - 1); }//check_tile(i - 1); }
    if (document.images[i + 1].src != "https://rawgit.com/Davatata/Mine-Finder/master/png/flag.png") { rightclick(i + 1); }//check_tile(i + 1); }
    if (document.images[i - row].src != "https://rawgit.com/Davatata/Mine-Finder/master/png/flag.png") { rightclick(i - row); }//check_tile(i + row); }
    if (document.images[i + row].src != "https://rawgit.com/Davatata/Mine-Finder/master/png/flag.png") { rightclick(i + row); }//check_tile(i - row); }
    if (document.images[i - (row+1)].src != "https://rawgit.com/Davatata/Mine-Finder/master/png/flag.png") { rightclick(i - (row+1)); }//check_tile(i - (row+1)); }
    if (document.images[i + (row+1)].src != "https://rawgit.com/Davatata/Mine-Finder/master/png/flag.png") { rightclick(i + (row+1)); }//check_tile(i + (row+1)); }
    if (document.images[i - (row-1)].src != "https://rawgit.com/Davatata/Mine-Finder/master/png/flag.png") { rightclick(i - (row-1)); }//check_tile(i + (row-1)); }
    if (document.images[i + (row-1)].src != "https://rawgit.com/Davatata/Mine-Finder/master/png/flag.png") { rightclick(i + (row-1)); }//check_tile(i - (row-1)); }
}

// Update number of mines on board, start new game
function change_mines_with_input(){
  num = $("#change_mines_input").val();
  var grid = $("#size_chosen").val();
  if(grid == 16){
    if (!(num < 1) && !(num > 100)) {
        num_mines = num;
        newGame();
    }
  }
  else if(grid == 9){
    if (!(num < 1) && !(num > 30)) {
        num_mines = num;
        newGame();
    }
  }

}

// Display label depending on grid size
function change_num_mines() {
    var grid = $("#size_chosen").val();

    if(grid == 16){
        $("#mines_number_suggestion").text("Enter number (1 - 100)");
    }
    else if(grid == 9){
        $("#mines_number_suggestion").text("Enter number (1 - 30)");
    }
    $( "#change_mines_input" ).focus();
}

// Return number of tiles touching position i
function count_tiles(i) {
    switch (where[i]) {
        case "topleft":
		var x = num_tiles_TL(i);
		return x;
		break;
        case "topright":
		var x = num_tiles_TR(i);
		return x;
		break;

        case "bottomleft":
		var x = num_tiles_BL(i);
		return x;
		break;

        case "bottomright":
		var x = num_tiles_BR(i);
		return x;
		break;

        case "top":
		var x = num_tiles_T(i);
		return x;
		break;

        case "left":
		var x = num_tiles_L(i);
		return x;
		break;

        case "right":
		var x = num_tiles_R(i);
		return x;
		break;

        case "bottom":
		var x = num_tiles_B(i);
		return x;
		break;

        case "0":
		var x = num_tiles_0(i);
		return x;
		break;
	}
}

function touching_number(i) {
    switch (where[i]) {
        case "topleft":
		var x = num_tiles_TL(i);
		return x != 3;
		break;
        case "topright":
		var x = num_tiles_TR(i);
		return x != 3;
		break;

        case "bottomleft":
		var x = num_tiles_BL(i);
		return x != 3;
		break;

        case "bottomright":
		var x = num_tiles_BR(i);
		return x != 3;
		break;

        case "top":
		var x = num_tiles_T(i);
		return x != 5;
		break;

        case "left":
		var x = num_tiles_L(i);
		return x != 5;
		break;

        case "right":
		var x = num_tiles_R(i);
		return x != 5;
		break;

        case "bottom":
		var x = num_tiles_B(i);
		return x != 5;
		break;

        case "0":
		var x = num_tiles_0(i);
		return x != 8;
		break;
	}
}

function confirmNewGame(){
  if (!gameover){
    if (confirm('Are you sure? Progress will be lost.')) {
        newGame();
    }
  } else {
    newGame();
  }
}
