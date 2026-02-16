/**
 * Slide 06 — Gate / Decision
 * Programmatic money-rain: 30 falling '$' symbols.
 */
SBSlider.registerSlideInit(function (root) {
    var moneyRain = root.querySelector('.sb-money-rain');
    if (!moneyRain) return;

    for (var i = 0; i < 30; i++) {
        var bill = document.createElement('div');
        bill.className   = 'sb-money-bill';
        bill.textContent = '$';

        bill.style.left = (Math.random() * 100) + '%';
        bill.style.setProperty('--drift',    ((Math.random() - 0.5) * 200) + 'px');
        bill.style.setProperty('--rotate',   ((Math.random() - 0.5) * 720) + 'deg');
        bill.style.setProperty('--duration', (8 + Math.random() * 7) + 's');
        bill.style.setProperty('--delay',    (Math.random() * 5) + 's');

        moneyRain.appendChild(bill);
    }
});
