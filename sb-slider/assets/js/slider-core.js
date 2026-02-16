/**
 * SB Slider — Core Logic
 *
 * Multi-instance: each .sb-slider-root on the page gets its own
 * independent state (currentSlide, events, timers).
 *
 * Wrapped in IIFE to avoid polluting global scope / conflicting
 * with jQuery, GSAP, or page-builder scripts.
 */
;(function () {
    'use strict';

    var SBSlider = window.SBSlider = {

        /** Per-slide init functions registered by slide-*.js files. */
        _slideInits: [],

        /**
         * Register a per-slide initializer.
         * @param {function(HTMLElement)} fn  Receives the slider root element.
         */
        registerSlideInit: function (fn) {
            this._slideInits.push(fn);
        },

        /**
         * Placeholder — overwritten by slide-03-video.js.
         * @param {HTMLElement} root
         */
        initSlide3Animations: function () {},

        /* ─── Instance initializer ───────────────────────── */

        /**
         * Initialise one slider instance.
         *
         * @param {HTMLElement} root    The .sb-slider-root element.
         * @param {Object}      opts    { autoplay, interval, start }
         */
        init: function (root, opts) {
            opts = opts || {};

            var slides      = root.querySelectorAll('.sb-slide');
            var navButtons  = root.querySelectorAll('.sb-slider-nav button');
            var totalSlides = slides.length;
            var videoEl     = root.querySelector('.sb-slide-3 video');
            var currentSlide        = 0;
            var slide3AnimPlayed    = false;
            var autoplayTimer       = null;

            /* ── showSlide ────────────────────────────────── */

            function showSlide(index) {
                var i;

                for (i = 0; i < slides.length; i++) {
                    slides[i].classList.remove('sb-active');
                }
                for (i = 0; i < navButtons.length; i++) {
                    navButtons[i].classList.remove('sb-active');
                }

                slides[index].classList.add('sb-active');
                if (navButtons[index]) {
                    navButtons[index].classList.add('sb-active');
                }
                currentSlide = index;

                /* Video control (slide 3 = index 2) */
                if (videoEl) {
                    if (index === 2) {
                        videoEl.currentTime = 0;
                        videoEl.play().catch(function () {});

                        if (!slide3AnimPlayed) {
                            SBSlider.initSlide3Animations(root);
                            slide3AnimPlayed = true;
                        }
                    } else {
                        videoEl.pause();
                    }
                }

                /* Phone levitation on slide 5 (index 4) */
                if (index === 4) {
                    var phone = root.querySelector('.sb-phone-mockup');
                    if (phone) {
                        setTimeout(function () {
                            phone.classList.add('sb-loaded');
                        }, 1700);
                    }
                }

                /* Reset autoplay timer on manual interaction */
                if (opts.autoplay && autoplayTimer) {
                    clearInterval(autoplayTimer);
                    autoplayTimer = setInterval(function () {
                        showSlide((currentSlide + 1) % totalSlides);
                    }, opts.interval || 5000);
                }
            }

            /* ── Navigation: arrows ───────────────────────── */

            var prevBtn = root.querySelector('.sb-slider-arrow.sb-prev');
            var nextBtn = root.querySelector('.sb-slider-arrow.sb-next');

            if (prevBtn) {
                prevBtn.onclick = function () {
                    showSlide((currentSlide - 1 + totalSlides) % totalSlides);
                };
            }
            if (nextBtn) {
                nextBtn.onclick = function () {
                    showSlide((currentSlide + 1) % totalSlides);
                };
            }

            /* ── Navigation: dots ─────────────────────────── */

            for (var k = 0; k < navButtons.length; k++) {
                (function (idx) {
                    navButtons[idx].onclick = function () {
                        showSlide(idx);
                    };
                })(k);
            }

            /* ── Video unlock (autoplay policy) ───────────── */

            if (videoEl) {
                videoEl.play().catch(function () {
                    var unlock = function () {
                        videoEl.play().catch(function () {});
                        window.removeEventListener('touchstart', unlock);
                        window.removeEventListener('click', unlock);
                    };
                    window.addEventListener('touchstart', unlock, { once: true });
                    window.addEventListener('click', unlock, { once: true });
                });
            }

            /* ── Run per-slide initializers ────────────────── */

            for (var s = 0; s < SBSlider._slideInits.length; s++) {
                SBSlider._slideInits[s](root);
            }

            /* ── Show initial slide ───────────────────────── */

            showSlide(opts.start || 0);

            /* ── Autoplay ─────────────────────────────────── */

            if (opts.autoplay) {
                autoplayTimer = setInterval(function () {
                    showSlide((currentSlide + 1) % totalSlides);
                }, opts.interval || 5000);
            }
        }
    };

    /* ─── Auto-init all sliders on DOMContentLoaded ──────── */

    document.addEventListener('DOMContentLoaded', function () {
        var sliders = document.querySelectorAll('.sb-slider-root[data-sb-slider]');

        for (var i = 0; i < sliders.length; i++) {
            var opts = {};
            try {
                opts = JSON.parse(sliders[i].getAttribute('data-sb-options') || '{}');
            } catch (e) { /* ignore */ }

            SBSlider.init(sliders[i], opts);
        }
    });

})();
