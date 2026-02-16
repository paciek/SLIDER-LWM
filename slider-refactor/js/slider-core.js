/* ============================================
   SLIDER CORE - Main Logic
   Navigation, slide switching, video controls
   ============================================ */

window.SBSlider = {
    currentSlide: 0,
    totalSlides: 6,
    slides: null,
    navButtons: null,
    videoSlide: null,

    /* Registry for per-slide initializers */
    _slideInitializers: [],

    /**
     * Register a function to run after all slides are loaded.
     * Used by individual slide JS files.
     */
    registerSlideInit: function (fn) {
        this._slideInitializers.push(fn);
    },

    /**
     * Main initialization — call after slide HTML is in the DOM.
     */
    init: function () {
        var root = document.querySelector('.sb-slider-root');
        if (!root) return;

        this.slides = root.querySelectorAll('.sb-slide');
        this.navButtons = root.querySelectorAll('.sb-slider-nav button');
        this.videoSlide = root.querySelector('#sb-video-slide');
        this.totalSlides = this.slides.length;

        this._bindNavigation(root);
        this._initVideoUnlock();

        /* Run per-slide initializers */
        for (var i = 0; i < this._slideInitializers.length; i++) {
            this._slideInitializers[i]();
        }

        /* Show first slide (already has sb-active in HTML) */
        this.showSlide(0);
    },

    /**
     * Switch to slide at given index.
     */
    showSlide: function (index) {
        var i;

        for (i = 0; i < this.slides.length; i++) {
            this.slides[i].classList.remove('sb-active');
        }
        for (i = 0; i < this.navButtons.length; i++) {
            this.navButtons[i].classList.remove('sb-active');
        }

        this.slides[index].classList.add('sb-active');
        this.navButtons[index].classList.add('sb-active');
        this.currentSlide = index;

        /* Video control (slide 3, index 2) */
        if (this.videoSlide) {
            if (index === 2) {
                this.videoSlide.currentTime = 0;
                this.videoSlide.play().catch(function () {});

                /* Trigger letter animation only once */
                if (!this._slide3AnimationPlayed && typeof this.initSlide3Animations === 'function') {
                    this.initSlide3Animations();
                    this._slide3AnimationPlayed = true;
                }
            } else {
                this.videoSlide.pause();
            }
        }

        /* Phone levitation on slide 5 (index 4) */
        if (index === 4) {
            var phoneMockup = document.getElementById('sb-phone-mockup');
            if (phoneMockup) {
                setTimeout(function () {
                    phoneMockup.classList.add('sb-loaded');
                }, 1700);
            }
        }
    },

    /* ---- Private helpers ---- */

    _bindNavigation: function (root) {
        var self = this;
        var prevBtn = root.querySelector('#sb-prev-slide');
        var nextBtn = root.querySelector('#sb-next-slide');

        if (prevBtn) {
            prevBtn.onclick = function () {
                self.showSlide((self.currentSlide - 1 + self.totalSlides) % self.totalSlides);
            };
        }
        if (nextBtn) {
            nextBtn.onclick = function () {
                self.showSlide((self.currentSlide + 1) % self.totalSlides);
            };
        }

        for (var i = 0; i < this.navButtons.length; i++) {
            (function (idx) {
                self.navButtons[idx].onclick = function () {
                    self.showSlide(idx);
                };
            })(i);
        }
    },

    _slide3AnimationPlayed: false,

    _initVideoUnlock: function () {
        var video = this.videoSlide;
        if (!video) return;

        video.play().catch(function () {
            var unlock = function () {
                video.play().catch(function () {});
                window.removeEventListener('touchstart', unlock);
                window.removeEventListener('click', unlock);
            };
            window.addEventListener('touchstart', unlock, { once: true });
            window.addEventListener('click', unlock, { once: true });
        });
    }
};
