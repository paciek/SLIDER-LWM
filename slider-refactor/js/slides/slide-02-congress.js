/* ============================================
   SLIDE 02 - CONGRESS
   Parallax effect on content and character
   ============================================ */

SBSlider.registerSlideInit(function () {
    var slide2 = document.querySelector('.sb-slider-root .sb-slide-2');
    var congressContent = document.getElementById('sb-congress-content');
    var congressCharacter = document.getElementById('sb-congress-character');

    if (!slide2 || !congressContent || !congressCharacter) return;

    slide2.addEventListener('mousemove', function (e) {
        if (!slide2.classList.contains('sb-active')) return;

        var rect = slide2.getBoundingClientRect();
        var x = e.clientX - rect.left;
        var y = e.clientY - rect.top;
        var deltaX = (x - rect.width / 2) / (rect.width / 2);
        var deltaY = (y - rect.height / 2) / (rect.height / 2);

        congressContent.style.transform =
            'translate(' + (deltaX * 25) + 'px, ' + (deltaY * 25) + 'px)';
        congressCharacter.style.transform =
            'translateX(calc(-50% + ' + (deltaX * 35) + 'px)) translateY(' + (deltaY * 20) + 'px)';
    });

    slide2.addEventListener('mouseleave', function () {
        congressContent.style.transform = 'translate(0, 0)';
        congressCharacter.style.transform = 'translateX(-50%) translateY(0)';
    });
});
