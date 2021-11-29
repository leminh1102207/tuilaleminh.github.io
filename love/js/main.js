// Thay đổi ngày bắt đầu đếm tại đây - cấu trúc => YYYY/MM/DD
//const yourDate = new Date("2021-05-25T00:00:00"),
var a= prompt("ngày 2 bạn quen nhau :3\nexample : 2021-05-25")
var boy = prompt("nhập tên bạn nam");
var girl = prompt("nhập tên bạn nữ");
const yourDate = new Date(a),
    // Thay đổi bài hát tại đây
    music = ['ido', 'noinaycoanh', 'nguoiamphu', 'duong-toi-cho-em-ve-lofi-ver-buitruonglinh-x-freak-d', 'gap-go-yeu-duong-va-duoc-ben-em', 'nam-doi-ban-tay-kay-tran-official-music-video', 'nhung-ban-lofi-freak-d-mix-ver-1.0', 'the-playah-ballad-soobin-hoang-son-ft-slimv-special-version-1-hour'];
document.addEventListener('DOMContentLoaded', function() {
    var rootTime = document.querySelector("time");
    document.querySelector("anni").textContent = `${(yourDate.getDate()>9)?yourDate.getDate():"0"+yourDate.getDate()}-${(yourDate.getMonth()>8)?(yourDate.getMonth()+1):"0"+(yourDate.getMonth()+1)}-${yourDate.getFullYear()}`;
    document.querySelector("date").textContent = Math.floor(Math.floor((new Date() - yourDate) / 1000) / 60 / 60 / 24) + " DAYS";

    function olock() {
        var today = new Date(),
            hrs = (Math.floor(Math.floor((today - yourDate) / 1000) / 60 / 60)) % 24,
            min = (Math.floor(Math.floor((today - yourDate) / 1000) / 60)) % 60,
            sec = Math.floor((today - yourDate) / 1000) % 60;
        rootTime.textContent = `${(hrs>9)?hrs:"0"+hrs}:${(min>9)?min:"0"+min}:${(sec>9)?sec:"0"+sec}`;
    }
    olock();
    var timer = setInterval(function() {
        olock()
    }, 1000);
    // Thay đổi link ramdom bài hát tại đây
    document.querySelector("audio").setAttribute("src", `./music/${music[Math.floor(Math.random()*music.length)]}.mp3`);
    document.getElementsByTagName("body")[0].insertAdjacentHTML(
        "beforeend",
        "<center><div id='mask'></div></center>"
    );
    document.querySelector("girl").textContent = girl;
    document.querySelector("boy").textContent = boy;
}, false);
