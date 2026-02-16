/**
 * Slide 02 — Congress
 * Parallax effect on content layer + character image + asset preload.
 *
 * Performance architecture:
 *   mousemove  → store target position (zero DOM reads/writes)
 *   RAF loop   → lerp interpolation  → two transform3d writes (GPU-composited)
 *   Result: 60 fps, buttery smooth, zero layout thrashing
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

    /* ── Parallax config ──────────────────────── */

    var LERP          = 0.08;  // Interpolation speed
    var CONTENT_RANGE = 25;    // Max px for content layer
    var CHAR_RANGE_X  = 35;    // Max px for character X
    var CHAR_RANGE_Y  = 20;    // Max px for character Y
    var EPSILON       = 0.1;   // Sub-pixel stop threshold

    /* ── State: input → store → RAF → render ─── */

    /* Content layer */
    var tCX = 0, tCY = 0;
    var cCX = 0, cCY = 0;

    /* Character image (offset from CSS center) */
    var tChX = 0, tChY = 0;
    var cChX = 0, cChY = 0;

    var rafId = 0;
    var isActive = false;

    /* Cached layout — computed ONCE, updated on resize */
    var rectLeft = 0, rectTop = 0, halfW = 0, halfH = 0;

    function cacheRect() {
        var r = slide2.getBoundingClientRect();
        rectLeft = r.left;
        rectTop  = r.top;
        halfW    = r.width  / 2;
        halfH    = r.height / 2;
    }

    /* ── Render loop (single RAF, two elements) ── */

    function tick() {
        cCX  += (tCX  - cCX)  * LERP;
        cCY  += (tCY  - cCY)  * LERP;
        cChX += (tChX - cChX) * LERP;
        cChY += (tChY - cChY) * LERP;

        /* Two composite-only writes per frame — GPU handles the rest.
         * Character uses translate(-50%) for CSS centering + translate3d for parallax offset.
         * This avoids calc() inside transform and works regardless of image load state. */
        content.style.transform =
            'translate3d(' + cCX + 'px,' + cCY + 'px,0)';
        character.style.transform =
            'translate(-50%)translate3d(' + cChX + 'px,' + cChY + 'px,0)';

        var settled =
            Math.abs(tCX  - cCX)  < EPSILON &&
            Math.abs(tCY  - cCY)  < EPSILON &&
            Math.abs(tChX - cChX) < EPSILON &&
            Math.abs(tChY - cChY) < EPSILON;

        if (!settled) {
            rafId = requestAnimationFrame(tick);
        } else {
            cCX = tCX; cCY = tCY;
            cChX = tChX; cChY = tChY;
            content.style.transform =
                'translate3d(' + cCX + 'px,' + cCY + 'px,0)';
            character.style.transform =
                'translate(-50%)translate3d(' + cChX + 'px,' + cChY + 'px,0)';
            rafId = 0;
        }
    }

    function ensureLoop() {
        if (!rafId) rafId = requestAnimationFrame(tick);
    }

    /* ── Input handlers (ZERO DOM reads/writes) ── */

    slide2.addEventListener('mousemove', function (e) {
        if (!isActive) return;

        var nx = (e.clientX - rectLeft - halfW) / halfW;
        var ny = (e.clientY - rectTop  - halfH) / halfH;

        tCX  = nx * CONTENT_RANGE;
        tCY  = ny * CONTENT_RANGE;
        tChX = nx * CHAR_RANGE_X;
        tChY = ny * CHAR_RANGE_Y;

        ensureLoop();
    }, { passive: true });

    slide2.addEventListener('mouseleave', function () {
        tCX = 0; tCY = 0;
        tChX = 0; tChY = 0;
        ensureLoop(); /* Lerp smoothly glides back to center */
    }, { passive: true });

    /* ── Visibility tracking (MutationObserver) ── */

    function onActivate() {
        isActive = true;
        cacheRect();
    }

    function onDeactivate() {
        isActive = false;
        tCX = 0; tCY = 0; tChX = 0; tChY = 0;
        cCX = 0; cCY = 0; cChX = 0; cChY = 0;
        if (rafId) { cancelAnimationFrame(rafId); rafId = 0; }
        content.style.transform   = '';
        character.style.transform = '';
    }

    var observer = new MutationObserver(function () {
        var nowActive = slide2.classList.contains('sb-active');
        if (nowActive && !isActive)  onActivate();
        else if (!nowActive && isActive) onDeactivate();
    });
    observer.observe(slide2, { attributes: true, attributeFilter: ['class'] });

    /* Initial state */
    if (slide2.classList.contains('sb-active')) onActivate();

    /* Recache dimensions on resize (debounced) */
    var resizeTimer;
    window.addEventListener('resize', function () {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(function () { if (isActive) cacheRect(); }, 200);
    }, { passive: true });
});
