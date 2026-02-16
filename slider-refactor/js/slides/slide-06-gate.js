/* ============================================
   SLIDE 06 - GATE / DECISION
   Programmatic money rain generation
   ============================================ */

SBSlider.registerSlideInit(function () {
    var moneyRain = document.getElementById('sb-money-rain');
    if (!moneyRain) return;

    /* Generate 30 falling $ symbols */
    for (var i = 0; i < 30; i++) {
        var bill = document.createElement('div');
        bill.className = 'sb-money-bill';
        bill.textContent = '$';

        /* Random horizontal start position */
        var startX = Math.random() * 100;
        bill.style.left = startX + '%';

        /* Random lateral drift while falling */
        var drift = (Math.random() - 0.5) * 200;
        bill.style.setProperty('--drift', drift + 'px');

        /* Random rotation */
        var rotate = (Math.random() - 0.5) * 720;
        bill.style.setProperty('--rotate', rotate + 'deg');

        /* Random duration (8–15 s) */
        var duration = 8 + Math.random() * 7;
        bill.style.setProperty('--duration', duration + 's');

        /* Random delay (0–5 s) */
        var delay = Math.random() * 5;
        bill.style.setProperty('--delay', delay + 's');

        moneyRain.appendChild(bill);
    }
});
