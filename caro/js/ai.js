/* ----------------------------------------------------------
→ Giải thuật Minimax là giải thuật tìm kiếm theo chiều sâu. -
Ta cài đặt thuật toán bằng phương pháp đệ quy.              -
→ Về lý thuyết, chiến lược Minimax cho phép ta tìm được     -
nước đi tối ưu cho MAX, nhưng thực tế không cho phép        -
làm như vậy vì vấn đề bộ nhớ và thời gian.                  -
→ Ta có thể giới hạn không gian trạng thái theo một độ sâu  -
nhất định của cây hay giới hạn các node con theo một quy    -
tắc nào đó (Đây là chiến lược tính trước bao nhiêu nước     -
đi).                                                        -
------------------------------------------------------------*/
// Trọng số đánh giá
var tancong = [0, 2, 4, 20, 100, 105, 110, 115, 120, 130];
var phongthu = [0, 1, 3, 15, 55, 56, 57, 58, 60, 62];
function bot() { // AI
    if (!xoStart) return;
    var max = -Infinity; // khởi tạo mặc định là âm vô cùng
    var px = py = -1; // đánh tất cả các ô mặc định giá trị là -1
    var TBoard = getBoard(); // Get bảng đánh dấu
    // Duyệt các điểm chưa đánh trong bảng để tìm ra điểm tốt nhất (mảng 1 chiều)
    // Duyệt từ trên xuống dưới từ trái qua phải
    for (y = 0; y < size; y++) { // size là kích thước bàn cở (mặc định là 15 ô)
        for (x = 0; x < size; x++) {
            if (TBoard[x + y * size] == -1) { // ô được đánh dấu mang giá trị -1 (rỗng) thì đánh X
                TBoard[x + y * size] = 1; // giả sử đánh X
                var mark = getMark(x, y, TBoard); // logic getBoard()
                console.log(mark) // show console
                TBoard[x + y * size] = -1; // trả giá trị về rỗng
                if (mark > max) { // lưu điểm tốt nhất tìm được
                    px = x;
                    py = y;
                    max = mark;
                }
            }
        }
    }
    var sqr = document.getElementsByClassName("square"); // trả về tất cả các phần tử trong square (mảng 1 chiều)
    sqr.item(px + py * size).setAttribute("player", "1");
    sqr.item(px + py * size).style.backgroundImage = "url('./image/x.png')";

}

function getBoard() {
    var TBoard = []; // vị trí đánh
    var sqr = document.getElementsByClassName("square");
    for (i = 0; i < size * size; i++) { // duyệt bảng
        TBoard.push(parseInt(sqr.item(i).getAttribute("player"))); // lấy giá trị đánh đẩy vào bảng
    }
    return TBoard;
}

function getMark(x, y, Tboard) {
    var result = tancong[getNgang(x, y, Tboard, 1)] + tancong[getDoc(x, y, Tboard, 1)] +
        tancong[getCheo1(x, y, Tboard, 1)] + tancong[getCheo2(x, y, Tboard, 1)];

    result = result + phongthu[getNgang(x, y, Tboard, 0)] + phongthu[getDoc(x, y, Tboard, 0)] +
        phongthu[getCheo1(x, y, Tboard, 0)] + phongthu[getCheo2(x, y, Tboard, 0)];

    return result;
}

// Đếm trên hàng ngang
function getNgang(x, y, TBoard, player) {
    var count = 0, //  đếm giá trị giống player
        counto = 0; // Đếm số lần bị chặn
    // duyệt trước 
    for (i = x - 1; i > 0; i--) {
        if (TBoard[i + y * size] == player) count++; // nếu TBoard tại vị trí giống giá trị ở điểm hiện tại player thì +1 count
        else {
            if (TBoard[i + y * size] != -1) // nếu TBoard tại vị trí không bằng rỗng thì bị chặn -> +1 counto
                counto++;
            break;
        }
    }
    // duyệt sau
    for (i = x + 1; i < size; i++) {
        if (TBoard[i + y * size] == player) count++;
        else {
            if (TBoard[i + y * size] != -1)
                counto++;
            break;
        }
    }
    if (counto == 2) return 0; // Bị chặn cả 2 đầu
    if ((x == 0 || x == size - 1) && count < 4) counto++; // Điểm sát cạnh +1 counto
    if (count <= counto) return 0; // Bị chặn nhiều hơn
    else if (count - counto >= 3) return count + counto; // Xảy ra khi x thắng hoặc o sắp thắng
    else return count - counto; // < 3
}
// Đếm trên hàng dọc
function getDoc(x, y, TBoard, player) {
    var count = 0,
        counto = 0;
    for (i = y - 1; i > 0; i--) {
        if (TBoard[x + i * size] == player) count++;
        else { if (TBoard[x + i * size] != -1) counto++; break; }
    }
    for (i = y + 1; i < size; i++) {
        if (TBoard[x + i * size] == player) count++;
        else { if (TBoard[x + i * size] != -1) counto++; break; }
    }
    if (counto == 2) return 0;
    if ((y == 0 || y == size - 1) && count < 4) counto++;
    if (count <= counto) return 0;
    else if (count - counto >= 3) return count + counto;
    else return count - counto;
}
// Đếm trên đường chéo / (từ dưới lên)
function getCheo1(x, y, TBoard, player) {
    var count = 0,
        counto = 0;
    for (i = 1; i < minab(size - x, y + 1); i++) {
        if (TBoard[(x + i) + (y - i) * size] == player) count++;
        else { if (TBoard[(x + i) + (y - i) * size] != -1) counto++; break; }
    }
    for (i = 1; i < minab(x + 1, size - y); i++) {
        if (TBoard[(x - i) + (y + i) * size] == player) count++;
        else { if (TBoard[(x - i) + (y + i) * size] != -1) counto++; break; }
    }
    if (counto == 2) return 0;
    if ((x == 0 || x == size - 1 || y == 0 || y == size - 1) && count < 4) counto++;
    if (count <= counto) return 0;
    else if (count - counto >= 3) return count + counto;
    else return count - counto;
}
// Đếm trên đường chéo \ (từ dưới lên)
function getCheo2(x, y, TBoard, player) {
    var count = 0,
        counto = 0;
    for (i = 1; i < minab(x + 1, y + 1); i++) {
        if (TBoard[(x - i) + (y - i) * size] == player) count++;
        else { if (TBoard[(x - i) + (y - i) * size] != -1) counto++; break; }
    }
    for (i = 1; i < minab(size - x, size - y); i++) {
        if (TBoard[(x + i) + (y + i) * size] == player) count++;
        else { if (TBoard[(x + i) + (y + i) * size] != -1) counto++; break; }
    }
    if (counto == 2) return 0;
    if ((x == 0 || x == size - 1 || y == 0 || y == size - 1) && count < 4) counto++;
    if (count <= counto) return 0;
    else if (count - counto >= 3) return count + counto;
    else return count - counto;
}