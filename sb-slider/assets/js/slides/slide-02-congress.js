/**
 * Slide 02 — Congress
 * Parallax effect on content layer + character image + asset preload.
 */
SBSlider.registerSlideInit(function (root) {
    var slide2    = root.querySelector('.sb-slide-2');
    var content   = root.querySelector('.sb-slide-2 .sb-content-layer');
    var character = root.querySelector('.sb-slide-2 .sb-character-image');

    if (!slide2 || !content || !character) return;

    /* Claim slide 1 — we handle readiness */
    SBSlider.claimSlide(root, 1);

    /* Mark ready once the character image has loaded */
    function onImageReady() {
        SBSlider.markSlideReady(root, 1);
    }

    if (character.complete && character.naturalWidth > 0) {
        onImageReady();
    } else {
        character.onload  = onImageReady;
        character.onerror = onImageReady;
    }

    /* Parallax on cursor move */
    slide2.addEventListener('mousemove', function (e) {
        if (!slide2.classList.contains('sb-active')) return;

        var rect   = slide2.getBoundingClientRect();
        var deltaX = (e.clientX - rect.left - rect.width  / 2) / (rect.width  / 2);
        var deltaY = (e.clientY - rect.top  - rect.height / 2) / (rect.height / 2);

        content.style.transform =
            'translate(' + (deltaX * 25) + 'px, ' + (deltaY * 25) + 'px)';
        character.style.transform =
            'translateX(calc(-50% + ' + (deltaX * 35) + 'px)) translateY(' + (deltaY * 20) + 'px)';
    });

    slide2.addEventListener('mouseleave', function () {
        content.style.transform   = 'translate(0, 0)';
        character.style.transform = 'translateX(-50%) translateY(0)';
    });
});
