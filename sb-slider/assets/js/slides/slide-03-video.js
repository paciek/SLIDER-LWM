/**
 * Slide 03 — Video
 * Letter-by-letter focus-in text animation.
 * Runs only on first activation (one-shot).
 */

/* The animation function is called from showSlide() in core
   when the user first navigates to slide 3. */
LWMHeroSlider.initSlide3Animations = function (root) {
    var slide3 = root.querySelector('.lwm-hero-slide-3');
    if (!slide3) return;

    var titleLines  = slide3.querySelectorAll('.lwm-hero-video-title .lwm-hero-line');
    var description = slide3.querySelector('.lwm-hero-video-description');
    var button      = slide3.querySelector('.lwm-hero-video-cta');

    var startDelay    = 0.2;   // seconds
    var letterStagger = 0.04;  // 40 ms between letters

    /* Count letters in title */
    var totalTitleLetters = 0;
    for (var l = 0; l < titleLines.length; l++) {
        totalTitleLetters += titleLines[l].textContent.length;
    }

    /* Count letters in description */
    var descText         = description ? description.textContent : '';
    var totalDescLetters = descText.length;

    /* ── Animate title letter-by-letter ───────── */
    var letterIdx = 0;
    for (var li = 0; li < titleLines.length; li++) {
        var line = titleLines[li];
        var text = line.textContent;
        line.textContent = '';

        for (var ci = 0; ci < text.length; ci++) {
            var span = document.createElement('span');
            span.className = 'lwm-hero-letter';
            span.textContent = text[ci];
            span.style.animationDelay = (startDelay + letterIdx * letterStagger) + 's';
            line.appendChild(span);
            letterIdx++;
        }
    }

    /* ── Animate description letter-by-letter ─── */
    if (description && descText) {
        description.textContent = '';

        for (var di = 0; di < descText.length; di++) {
            var dSpan = document.createElement('span');
            dSpan.style.display   = 'inline-block';
            dSpan.style.opacity   = '0';
            dSpan.style.filter    = 'blur(20px)';
            dSpan.textContent     = descText[di];
            dSpan.style.animation =
                'lwm-hero-letterFocusIn 0.9s cubic-bezier(0.165, 0.84, 0.44, 1) ' +
                (startDelay + di * letterStagger) + 's forwards';
            description.appendChild(dSpan);
        }
    }

    /* ── Button appears after ~40 % of letters ── */
    if (button) {
        var maxLetters       = Math.max(totalTitleLetters, totalDescLetters);
        var buttonStartAfter = Math.floor(maxLetters * 0.4);
        button.style.animationDelay = (startDelay + buttonStartAfter * letterStagger) + 's';
    }

    /* Start CSS animations */
    slide3.classList.add('lwm-hero-first-time-active');

    /* After all animations finish → lock visible state */
    var maxL        = Math.max(totalTitleLetters, totalDescLetters);
    var totalAnimMs = (startDelay + maxL * letterStagger + 0.9) * 1000;

    setTimeout(function () {
        slide3.classList.remove('lwm-hero-first-time-active');
        slide3.classList.add('lwm-hero-animation-completed');
    }, totalAnimMs);
};

/* ── Readiness: claim + mark immediately ────────
 * Video has preload="auto"; the animation itself doesn't
 * start until showSlide navigates here, so the slide
 * is ready as soon as DOM is parsed.                       */
LWMHeroSlider.registerSlideInit(function (root) {
    LWMHeroSlider.claimSlide(root, 2);
    LWMHeroSlider.markSlideReady(root, 2);
});
