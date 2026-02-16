/**
 * Slide 01 — Product
 * Parallax effect on the product image + asset preload.
 */
SBSlider.registerSlideInit(function (root) {
    var slide1       = root.querySelector('.sb-slide-1');
    var productImage = root.querySelector('.sb-product-image');

    if (!slide1 || !productImage) return;

    /* Claim slide 0 — we handle readiness ourselves */
    SBSlider.claimSlide(root, 0);

    /* Mark ready once the product image has loaded */
    function onImageReady() {
        SBSlider.markSlideReady(root, 0);
    }

    if (productImage.complete && productImage.naturalWidth > 0) {
        onImageReady();
    } else {
        productImage.onload  = onImageReady;
        productImage.onerror = onImageReady;   // don't block on broken images
    }

    /* Parallax on cursor move */
    slide1.addEventListener('mousemove', function (e) {
        if (!slide1.classList.contains('sb-active')) return;

        var rect   = slide1.getBoundingClientRect();
        var deltaX = (e.clientX - rect.left - rect.width  / 2) / (rect.width  / 2);
        var deltaY = (e.clientY - rect.top  - rect.height / 2) / (rect.height / 2);

        productImage.style.transform =
            'translate(' + (deltaX * 30) + 'px, ' + (deltaY * 30) + 'px) scale(1.05)';
    });

    slide1.addEventListener('mouseleave', function () {
        productImage.style.transform = 'translate(0, 0) scale(1)';
    });
});
