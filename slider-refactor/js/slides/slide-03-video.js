/* ============================================
   SLIDE 03 - VIDEO
   Letter-by-letter focus-in text animation
   Runs only once (first activation)
   ============================================ */

SBSlider.initSlide3Animations = function () {
    var slide3 = document.querySelector('.sb-slider-root .sb-slide-3');
    if (!slide3) return;

    var titleLines = slide3.querySelectorAll('.sb-video-title .sb-line');
    var description = slide3.querySelector('.sb-video-description');
    var button = slide3.querySelector('.sb-video-cta');

    var startDelay = 0.2;
    var letterStagger = 0.04; // 40 ms between letters

    /* Count total letters in title */
    var totalTitleLetters = 0;
    for (var l = 0; l < titleLines.length; l++) {
        totalTitleLetters += titleLines[l].textContent.length;
    }

    /* Count total letters in description */
    var descriptionText = description ? description.textContent : '';
    var totalDescLetters = descriptionText.length;

    /* Animate title letter-by-letter */
    var letterIndex = 0;
    for (var li = 0; li < titleLines.length; li++) {
        var line = titleLines[li];
        var text = line.textContent;
        line.textContent = '';

        for (var ci = 0; ci < text.length; ci++) {
            var span = document.createElement('span');
            span.className = 'sb-letter';
            span.textContent = text[ci];
            span.style.animationDelay = (startDelay + letterIndex * letterStagger) + 's';
            line.appendChild(span);
            letterIndex++;
        }
    }

    /* Animate description letter-by-letter */
    if (description && descriptionText) {
        description.textContent = '';

        for (var di = 0; di < descriptionText.length; di++) {
            var dSpan = document.createElement('span');
            dSpan.style.display = 'inline-block';
            dSpan.style.opacity = '0';
            dSpan.style.filter = 'blur(20px)';
            dSpan.textContent = descriptionText[di];
            dSpan.style.animation =
                'sb-letterFocusIn 0.9s cubic-bezier(0.165, 0.84, 0.44, 1) ' +
                (startDelay + di * letterStagger) + 's forwards';
            description.appendChild(dSpan);
        }
    }

    /* Button appears after ~40% of letters */
    if (button) {
        var maxLetters = Math.max(totalTitleLetters, totalDescLetters);
        var buttonStartAfter = Math.floor(maxLetters * 0.4);
        var buttonDelay = startDelay + buttonStartAfter * letterStagger;
        button.style.animationDelay = buttonDelay + 's';
    }

    /* Start CSS animations */
    slide3.classList.add('sb-first-time-active');

    /* After all animations finish, lock visible state */
    var maxL = Math.max(totalTitleLetters, totalDescLetters);
    var totalAnimationTime = (startDelay + maxL * letterStagger + 0.9) * 1000;

    setTimeout(function () {
        slide3.classList.remove('sb-first-time-active');
        slide3.classList.add('sb-animation-completed');
    }, totalAnimationTime);
};
