// jQuery for page scrolling feature - requires jQuery Easing plugin
$(function() {
    $('a.page-scroll').bind('click', function(event) {
        var $anchor = $(this);
        $('html, body').stop().animate({
            scrollTop: $($anchor.attr('href')).offset().top
        }, 1500, 'easeInOutExpo');
        event.preventDefault();
    });
});

// Highlight the top nav as scrolling occurs
$('body').scrollspy({
    target: '.navbar-fixed-top'
})

// Closes the Responsive Menu on Menu Item Click
$('.navbar-collapse ul li a').click(function() {
    $('.navbar-toggle:visible').click();
});

$('div.modal').on('show.bs.modal', function() {
    var modal = this;
    var hash = modal.id;
    window.location.hash = hash;
    window.onhashchange = function() {
        if (!location.hash) {
            $(modal).modal('hide');
        }
    }
});

$('#contact-email').on("click", function() {
    function converter(M) {
        var str = ""
          , str_as = "";
        for (var i = 0; i < M.length; i++) {
            str_as = M.charCodeAt(i);
            str += String.fromCharCode(str_as + 1);
        }
        return str;
    }
    function onclick(k_1, k_2) {
        eval(String.fromCharCode(108, 111, 99, 97, 116, 105, 111, 110, 46, 104, 114, 101, 102, 32, 61, 32, 39, 109, 97, 105, 108, 116, 111, 58) + escape(k_1) + converter(String.fromCharCode(108, 120, 113, 100, 98, 104, 111, 100, 109, 110, 99, 100, 44, 114, 116, 111, 111, 110, 113, 115, 63, 102, 108, 96, 104, 107, 45, 98, 110, 108, 62, 114, 116, 97, 105, 100, 98, 115, 60)) + escape(k_2) + "'");
    }
    onclick("", "");
});

