/**
 * Slide 01 — Product
 * Parallax effect on the product image following cursor.
 */
SBSlider.registerSlideInit(function (root) {
    var slide1 = root.querySelector('.sb-slide-1');
    var productImage = root.querySelector('.sb-product-image');

    if (!slide1 || !productImage) return;

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
