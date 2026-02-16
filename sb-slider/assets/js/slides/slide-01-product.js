/**
 * Slide 01 — Product
 * Parallax effect on the product image + asset preload.
 *
 * Performance architecture:
 *   mousemove  → store target position (zero DOM reads/writes)
 *   RAF loop   → lerp interpolation  → single transform3d write
 *   Result: 60 fps, buttery smooth, zero layout thrashing
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
        productImage.onerror = onImageReady;
    }

    /* ── Parallax config ──────────────────────── */

    var LERP      = 0.08;  // Interpolation speed (lower = smoother glide)
    var RANGE     = 30;    // Max px displacement
    var SCALE_ON  = 1.05;  // Scale while cursor is over slide
    var SCALE_OFF = 1.0;   // Scale at rest
    var EPSILON   = 0.1;   // Sub-pixel threshold to stop the loop

    /* ── State: input → store → RAF → render ─── */

    var targetX = 0, targetY = 0, targetScale = SCALE_OFF;
    var currentX = 0, currentY = 0, currentScale = SCALE_OFF;
    var rafId = 0;
    var isActive = false;

    /* Cached layout — computed ONCE, updated on resize (never in mousemove) */
    var rectLeft = 0, rectTop = 0, halfW = 0, halfH = 0;

    function cacheRect() {
        var r = slide1.getBoundingClientRect();
        rectLeft = r.left;
        rectTop  = r.top;
        halfW    = r.width  / 2;
        halfH    = r.height / 2;
    }

    /* ── Render loop (single RAF per slide instance) ── */

    function tick() {
        currentX     += (targetX     - currentX)     * LERP;
        currentY     += (targetY     - currentY)     * LERP;
        currentScale += (targetScale - currentScale) * LERP;

        /* Single composite-only write — GPU handles the rest */
        productImage.style.transform =
            'translate3d(' + currentX + 'px,' + currentY + 'px,0)scale(' + currentScale + ')';

        /* Keep looping until fully settled */
        var settled =
            Math.abs(targetX - currentX)         < EPSILON &&
            Math.abs(targetY - currentY)         < EPSILON &&
            Math.abs(targetScale - currentScale) < 0.001;

        if (!settled) {
            rafId = requestAnimationFrame(tick);
        } else {
            /* Snap to exact target — no sub-pixel drift */
            currentX = targetX;
            currentY = targetY;
            currentScale = targetScale;
            productImage.style.transform =
                'translate3d(' + currentX + 'px,' + currentY + 'px,0)scale(' + currentScale + ')';
            rafId = 0;
        }
    }

    function ensureLoop() {
        if (!rafId) rafId = requestAnimationFrame(tick);
    }

    /* ── Input handlers (ZERO DOM reads/writes) ── */

    slide1.addEventListener('mousemove', function (e) {
        if (!isActive) return;

        /* Only store normalized position — render happens in RAF */
        var nx = (e.clientX - rectLeft - halfW) / halfW;
        var ny = (e.clientY - rectTop  - halfH) / halfH;

        targetX     = nx * RANGE;
        targetY     = ny * RANGE;
        targetScale = SCALE_ON;

        ensureLoop();
    }, { passive: true });

    slide1.addEventListener('mouseleave', function () {
        targetX     = 0;
        targetY     = 0;
        targetScale = SCALE_OFF;
        ensureLoop(); /* Lerp smoothly glides back to center */
    }, { passive: true });

    /* ── Visibility tracking (MutationObserver) ── *
     * Replaces classList.contains check in every mousemove.
     * Fires only when class attribute actually changes.       */

    function onActivate() {
        isActive = true;
        cacheRect();
    }

    function onDeactivate() {
        isActive = false;
        targetX = 0; targetY = 0; targetScale = SCALE_OFF;
        currentX = 0; currentY = 0; currentScale = SCALE_OFF;
        if (rafId) { cancelAnimationFrame(rafId); rafId = 0; }
        productImage.style.transform =
            'translate3d(0,0,0)scale(' + SCALE_OFF + ')';
    }

    var observer = new MutationObserver(function () {
        var nowActive = slide1.classList.contains('sb-active');
        if (nowActive && !isActive)  onActivate();
        else if (!nowActive && isActive) onDeactivate();
    });
    observer.observe(slide1, { attributes: true, attributeFilter: ['class'] });

    /* Initial state */
    if (slide1.classList.contains('sb-active')) onActivate();

    /* Recache dimensions on resize (debounced) */
    var resizeTimer;
    window.addEventListener('resize', function () {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(function () { if (isActive) cacheRect(); }, 200);
    }, { passive: true });
});
