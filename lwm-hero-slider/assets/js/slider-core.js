/**
 * LWM Hero Slider — Core Logic (production build)
 *
 * Features:
 *   - Multi-instance: each .lwm-hero-slider-root is independent
 *   - Readiness system: slides must signal ready before navigation
 *   - FOUC prevention: loader hidden only after start slide is ready
 *   - Header-offset auto-detection (#masthead + #wpadminbar)
 *   - Safety timeout: force-reveals after 5 s even if assets stall
 *
 * All code wrapped in IIFE — no globals except window.LWMHeroSlider.
 */
;(function () {
    'use strict';

    var SAFETY_TIMEOUT = 5000; // ms — force-reveal if assets stall

    var LWMHeroSlider = window.LWMHeroSlider = {

        /** Per-slide init callbacks registered by slide-*.js files. */
        _slideInits: [],

        /**
         * Register a per-slide initializer.
         * Called by each slide-XX.js at parse time.
         *
         * @param {function(HTMLElement)} fn  Receives the slider root element.
         */
        registerSlideInit: function (fn) {
            this._slideInits.push(fn);
        },

        /**
         * Placeholder — overwritten by slide-03-video.js.
         */
        initSlide3Animations: function () {},

        /* ─── Readiness API ────────────────────────── */

        /**
         * Claim a slide — tells core "I will call markSlideReady myself,
         * do NOT auto-mark this slide".
         *
         * @param {HTMLElement} root       The .lwm-hero-slider-root element.
         * @param {number}      slideIndex Zero-based slide index.
         */
        claimSlide: function (root, slideIndex) {
            if (root._lwmHeroInstance) {
                root._lwmHeroInstance.claimed[slideIndex] = true;
            }
        },

        /**
         * Mark a slide as ready for display.
         * When the start slide becomes ready the loader is removed.
         *
         * @param {HTMLElement} root       The .lwm-hero-slider-root element.
         * @param {number}      slideIndex Zero-based slide index.
         */
        markSlideReady: function (root, slideIndex) {
            if (root._lwmHeroInstance) {
                root._lwmHeroInstance.markReady(slideIndex);
            }
        },

        /* ─── Instance initializer ─────────────────── */

        /**
         * Initialise one slider instance.
         *
         * @param {HTMLElement} root  The .lwm-hero-slider-root element.
         * @param {Object}      opts  { autoplay, interval, start, headerOffset }
         */
        init: function (root, opts) {
            opts = opts || {};

            var slides         = root.querySelectorAll('.lwm-hero-slide');
            var navButtons     = root.querySelectorAll('.lwm-hero-slider-nav button');
            var totalSlides    = slides.length;
            var videoEl        = root.querySelector('.lwm-hero-slide-3 video');
            var currentSlide   = opts.start || 0;
            var slide3AnimPlayed = false;
            var autoplayTimer  = null;

            /* ── Readiness tracking ─────────────────── */

            var readySlides  = {};   // slideIndex → true
            var claimed      = {};   // slideIndex → true (won't auto-mark)
            var allForceReady = false;

            var instance = {
                claimed: claimed,

                markReady: function (slideIndex) {
                    if (readySlides[slideIndex]) return;
                    readySlides[slideIndex] = true;

                    /* When start slide is ready → reveal the slider */
                    if (slideIndex === (opts.start || 0)) {
                        revealSlider();
                    }
                }
            };

            root._lwmHeroInstance = instance;

            function isSlideReady(index) {
                return allForceReady || !!readySlides[index];
            }

            function revealSlider() {
                if (root.classList.contains('lwm-hero-ready')) return;
                root.classList.add('lwm-hero-ready');

                /* Remove loader element after CSS fade-out (500 ms) */
                var loader = root.querySelector('.lwm-hero-loader');
                if (loader) {
                    setTimeout(function () { loader.remove(); }, 600);
                }
            }

            /* Safety timeout — force everything visible */
            setTimeout(function () {
                allForceReady = true;
                revealSlider();
            }, SAFETY_TIMEOUT);

            /* ── showSlide ─────────────────────────── */

            function showSlide(index) {
                /* Block navigation to slides that aren't ready yet */
                if (!isSlideReady(index)) return;

                var i;
                for (i = 0; i < slides.length; i++) {
                    slides[i].classList.remove('lwm-hero-active');
                }
                for (i = 0; i < navButtons.length; i++) {
                    navButtons[i].classList.remove('lwm-hero-active');
                }

                slides[index].classList.add('lwm-hero-active');
                if (navButtons[index]) {
                    navButtons[index].classList.add('lwm-hero-active');
                }
                currentSlide = index;

                /* Video control (slide 3 = index 2) */
                if (videoEl) {
                    if (index === 2) {
                        videoEl.currentTime = 0;
                        videoEl.play().catch(function () {});

                        if (!slide3AnimPlayed) {
                            LWMHeroSlider.initSlide3Animations(root);
                            slide3AnimPlayed = true;
                        }
                    } else {
                        videoEl.pause();
                    }
                }

                /* Phone levitation on slide 5 (index 4) —
                 * Listen for slide-in animation end, then switch to levitation.
                 * On return visits .lwm-hero-entered is already set → CSS handles
                 * instant resume via animation-play-state. */
                if (index === 4) {
                    var phone = root.querySelector('.lwm-hero-phone-mockup');
                    if (phone && !phone.classList.contains('lwm-hero-entered') && !phone._lwmHeroListening) {
                        phone._lwmHeroListening = true;
                        phone.addEventListener('animationend', function handler(e) {
                            if (e.animationName === 'lwm-hero-slideInPhone') {
                                phone.removeEventListener('animationend', handler);
                                phone.classList.add('lwm-hero-entered');
                            }
                        });
                    }
                }

                /* Reset autoplay timer so full interval applies */
                resetAutoplay();
            }

            /* ── Autoplay ──────────────────────────── */

            function resetAutoplay() {
                if (!opts.autoplay) return;
                if (autoplayTimer) clearInterval(autoplayTimer);
                autoplayTimer = setInterval(function () {
                    var next = (currentSlide + 1) % totalSlides;
                    if (isSlideReady(next)) {
                        showSlide(next);
                    }
                    /* If next slide isn't ready, skip this tick —
                       autoplay will try again at the next interval. */
                }, opts.interval || 5000);
            }

            /* ── Navigation: arrows ────────────────── */

            var prevBtn = root.querySelector('.lwm-hero-slider-arrow.lwm-hero-prev');
            var nextBtn = root.querySelector('.lwm-hero-slider-arrow.lwm-hero-next');

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

            /* ── Navigation: dots ──────────────────── */

            for (var k = 0; k < navButtons.length; k++) {
                (function (idx) {
                    navButtons[idx].onclick = function () {
                        showSlide(idx);
                    };
                })(k);
            }

            /* ── Video unlock (autoplay policy) ────── */

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

            /* ── Run per-slide initializers ─────────── */

            for (var s = 0; s < LWMHeroSlider._slideInits.length; s++) {
                LWMHeroSlider._slideInits[s](root);
            }

            /* Auto-mark unclaimed slides as ready */
            for (var si = 0; si < totalSlides; si++) {
                if (!claimed[si]) {
                    instance.markReady(si);
                }
            }

            /* ── Show initial slide ────────────────── */

            showSlide(opts.start || 0);

            /* ── Start autoplay ────────────────────── */

            if (opts.autoplay) {
                resetAutoplay();
            }

            /* ── Header offset compensation ─────────── *
             *
             * Desktop only (≥1025 px).
             *
             * Algorithm:
             *   1. If opts.headerOffset is set → use that value.
             *   2. Otherwise detect #masthead + #wpadminbar heights.
             *   3. Set CSS variable --lwm-hero-header-offset on root.
             *   4. Critical CSS applies:
             *        margin-top: calc(-1 * var(--lwm-hero-header-offset))
             *      which pulls the slider up behind the header.
             *   5. Recalculate on window resize (debounced).
             */

            var resizeTimer;

            function updateHeaderOffset() {
                var isDesktop = window.matchMedia('(min-width: 1025px)').matches;

                if (!isDesktop) {
                    root.style.setProperty('--lwm-hero-header-offset', '0px');
                    return;
                }

                /* Forced value from shortcode attribute */
                if (typeof opts.headerOffset === 'number' && opts.headerOffset > 0) {
                    root.style.setProperty('--lwm-hero-header-offset', opts.headerOffset + 'px');
                    return;
                }

                /* Auto-detect */
                var offset   = 0;
                var masthead = document.getElementById('masthead');
                var adminbar = document.getElementById('wpadminbar');

                if (masthead) offset += masthead.getBoundingClientRect().height;
                if (adminbar) offset += adminbar.getBoundingClientRect().height;

                root.style.setProperty('--lwm-hero-header-offset', offset + 'px');
            }

            updateHeaderOffset();

            window.addEventListener('resize', function () {
                clearTimeout(resizeTimer);
                resizeTimer = setTimeout(updateHeaderOffset, 150);
            });
        }
    };

    /* ─── Auto-init all sliders on DOMContentLoaded ──── */

    document.addEventListener('DOMContentLoaded', function () {
        var sliders = document.querySelectorAll('.lwm-hero-slider-root[data-lwm-hero-slider]');

        for (var i = 0; i < sliders.length; i++) {
            var opts = {};
            try {
                opts = JSON.parse(sliders[i].getAttribute('data-lwm-hero-options') || '{}');
            } catch (e) { /* ignore */ }

            LWMHeroSlider.init(sliders[i], opts);
        }
    });

})();
