/* ============================================
   SLIDE 01 - PRODUCT
   Parallax effect on product image
   ============================================ */

SBSlider.registerSlideInit(function () {
    var slide1 = document.querySelector('.sb-slider-root .sb-slide-1');
    var productImage = document.getElementById('sb-product-image');

    if (!slide1 || !productImage) return;

    slide1.addEventListener('mousemove', function (e) {
        if (!slide1.classList.contains('sb-active')) return;

        var rect = slide1.getBoundingClientRect();
        var x = e.clientX - rect.left;
        var y = e.clientY - rect.top;
        var deltaX = (x - rect.width / 2) / (rect.width / 2);
        var deltaY = (y - rect.height / 2) / (rect.height / 2);

        productImage.style.transform =
            'translate(' + (deltaX * 30) + 'px, ' + (deltaY * 30) + 'px) scale(1.05)';
    });

    slide1.addEventListener('mouseleave', function () {
        productImage.style.transform = 'translate(0, 0) scale(1)';
    });
});
