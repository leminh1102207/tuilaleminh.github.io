var loader = function() {
    setTimeout(function() {
        $('#loader').css({
            'opacity': 0,
            'visibility': 'hidden'
        });
    }, 5000);
};
$(function() {
    loader();
});