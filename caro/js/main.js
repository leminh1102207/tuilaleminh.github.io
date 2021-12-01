const size = 16; // 15 x 15 = 225 (ô)
const maxWin = 5; // điều kiện để chiến thắng - tối thiểu 5 ô thẳng hàng
var xoPlayer = 1; // người chơi hiện tại, khởi đầu là O (0 là O, 1 là X)
var xoStart = false; // bắt đầu chơi
var xoWin = []; // chiến thắng

// tạo game
function Loaded() {
    xoPlayer = 0; // người chơi hiện tại, khởi đầu là O (0 là O, 1 là X)
    xoWin = [];

    var table = document.getElementById("table");
    var row = document.getElementsByClassName("row");
    var square = document.getElementsByClassName("square");

    // tạo bảng và gán player = -1 (trống)
    table.innerHTML = "";
    for (y = 0; y < size; y++) {
        table.innerHTML += '<tr class="row"></tr>';
        for (x = 0; x < size; x++) {
            var div = '<div class="square" onClick="Click(id)" onMouseOver="mouseOver(id)" onMouseOut="mouseOut(id)"></div>';
            row.item(y).innerHTML += '<td class="col">' + div + '</td>';
            square.item(x + y * size).setAttribute("id", (x + y * size).toString());
            square.item(x + y * size).setAttribute("player", "-1");
        }
    }
}

// bắt đầu
function Click(id) {
    if (!xoStart) return;
    var square = document.getElementsByClassName("square");
    var pos = parseInt(id);
    if (square.item(pos).getAttribute("player") != "-1") return;
    var path = "url('./image/o.png')";
    if (xoPlayer == 1) path = "url('./image/x.png')";
    square.item(pos).style.backgroundImage = path;
    square.item(pos).setAttribute("player", xoPlayer.toString());

    var win = winGame();
    var winner = xoPlayer; // người chiến thắng bằng người chơi hiện tại
    if (!win) { // nếu chưa thắng thì tiếp tục đánh
        bot();
        win = winGame();
        winner = 1; // máy đánh
    }

    if (win) { // nếu thắng thì hiển thị kết quả ra màn hình
        var mess = 'ewwww, gà thế :))';
        if (winner == 0) mess = 'chơi lại nào bạn ơi';
        alert(mess);
        xoStart = false; // kết thúc trò chơi
    }
}

// chiến lược minimax
function maxab(a, b) {
    if (a > b) return a;
    else return b;
}

function minab(a, b) {
    if (a < b) return a;
    else return b;
}

// hiệu ứng di chuột (hover)
function mouseOver(id) {
    if (!xoStart) return;
    var square = document.getElementsByClassName("square");
    var pos = parseInt(id);
    square.item(pos).style.backgroundColor = "#70e000";
}

function mouseOut(id) {
    if (!xoStart) return;
    var square = document.getElementsByClassName("square");
    var pos = parseInt(id);
    square.item(pos).style.backgroundColor = "#ffffff";
}

function winGame() {
    var result = false; // biến kết quả
    var board = getBoard();
    // duyệt bảng
    for (x = 0; x < size; x++) {
        for (y = 0; y < size; y++) {
            if (winNgang(x, y, board) || winDoc(x, y, board) || winCheo1(x, y, board) ||
                winCheo2(x, y, board)) { // nếu 1 trong 4 trường hợp trên đúng thì win
                var square = document.getElementsByClassName("square");
                for (i = 0; i < xoWin.length; i++) {
                    square.item(xoWin[i]).style.backgroundColor = "#ffe66d"; // tô màu nước chiến thắng
                }
                result = true; // trả kết quả về true
            }
        }
    }
    return result;
}

// thắng theo chiều ngang
function winNgang(x, y, board) {
    xoWin = [];
    var count = 0, // đếm số giá trị giống nhau
        counto = 0; // đếm số lần bị chặn
    var player = board[x + y * size]; // vị trí người chơi
    if (player == -1) return false; // nếu vị trí trống return false

    // duyệt phía trước điểm hiện tại
    if (x > 0) { // nếu điểm hiện tại không nằm sát viền thì xét điểm ngay phía trước nó đặt là p
        var p = board[x - 1 + y * size]; // điểm xát bên trái
        if (p != player && p != -1) counto++; // nếu p khác giá trị ở điểm hiện tại và p không bằng rỗng thì bị chặn => +1 counto  
    }
    // duyệt phía sau điểm hiện tại
    for (i = x; i < size; i++) { // duyệt từ điểm hiện tại đến hết
        var p = board[i + y * size]; // điểm xát bên phải
        if (p == player && p != -1) { // nếu p giống giá trị ở điểm hiện tại và p không bằng rỗng thì +1 count
            count++;
            xoWin.push(i + y * size); // đẩy vào mảng chiến thắng
        } else { if (p != -1) counto++; break; }; // nếu p khác giá trị ở điểm hiện tại và p không bằng rỗng thì bị chặn => +1 counto
    }
    if (count >= maxWin) { // nếu số giá trị giống nhau lớn hơn hoặc bằng điều kiện chiến thắng thì win
        return true;
    }
    return false;
}

// thắng theo chiều dọc
function winDoc(x, y, board) {
    xoWin = [];
    var count = 0,
        counto = 0;
    var player = board[x + y * size];
    if (player == -1) return false;

    if (y > 0) {
        var p = board[x + (y - 1) * size];
        if (p != player && p != -1) counto++;
    }

    for (i = y; i < size; i++) {
        var p = board[x + i * size];
        if (p == player && p != -1) {
            count++;
            xoWin.push(x + i * size);
        } else { if (p != -1) counto++; break; };
    }
    if (count >= maxWin) {
        return true;
    }
    return false;
}
// thắng theo đường chéo / (từ dưới lên trên)
function winCheo1(x, y, board) {
    xoWin = [];
    if (x > size - maxWin || y < maxWin - 1) return false; // Nếu x > 15 - 5 = 10 thì loại (điều kiện x nằm ở góc thì không thể có đường chéo đạt maxWin)
    var count = 0,
        counto = 0;
    var player = board[x + y * size]; // vị trí người chơi
    if (player == -1) return false; // rỗng -> loại

    if (y < size - 1 && x > 0) { // xét điểm không nằm xát cạnh (nếu nằm xát cạnh thì coi như bị chặn 1 đầu) 
        var p = board[x - 1 + (y + 1) * size]; // điểm chéo p 
        if (p != player && p != -1) counto++; // nếu p khác giá trị ở điểm hiện tại và p không bằng rỗng thì bị chặn => +1 counto
    }
    // duyệt từ đầu đến kịch sử dụng hàm minimax
    for (i = 0; i <= minab(size - x, y); i++) {
        var p = board[(x + i) + (y - i) * size]; // điểm chéo cận trên
        if (p == player && p != -1) { // nếu p giống giá trị ở điểm hiện tại và p không bằng rỗng thì +1 count (số giá trị trùng)
            count++;
            xoWin.push((x + i) + (y - i) * size); // đẩy vào xoWin
        } else { if (p != -1) counto++; break; }; // nếu p khác giá trị ở điểm hiện tại và p không bằng rỗng thì bị chặn => +1 counto
    }
    if (count >= maxWin) { // nếu số giá trị giống nhau lớn hơn hoặc bằng điều kiện chiến thắng thì win
        return true;
    }
    return false;
}
// thắng theo đường chéo \, từ dưới lên trên
function winCheo2(x, y, board) {
    xoWin = [];
    if (x > size - maxWin || y > size - maxWin) return false;
    var count = 0,
        counto = 0;
    var player = board[x + y * size];
    if (player == -1) return false;

    if (y > 0 && x > 0) {
        var p = board[x - 1 + (y - 1) * size];
        if (p != player && p != -1) counto++;
    }

    for (i = 0; i < minab(size - x, size - y); i++) {
        var p = board[(x + i) + (y + i) * size];
        if (p == player && p != -1) {
            count++;
            xoWin.push((x + i) + (y + i) * size);
        } else { if (p != -1) counto++; break; };
    }
    if (count >= maxWin) {
        return true;
    }
    return false;
}

function playGame() {
    Loaded();
    xoStart = true;
}