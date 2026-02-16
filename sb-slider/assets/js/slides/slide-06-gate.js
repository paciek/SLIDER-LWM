/**
 * Slide 06 — Gate / Decision
 * Programmatic money-rain (30 falling '$' symbols) + asset preload.
 */
LWMHeroSlider.registerSlideInit(function (root) {
    var moneyRain = root.querySelector('.lwm-hero-money-rain');
    var gateImg   = root.querySelector('.lwm-hero-gate-image');

    if (!moneyRain) return;

    /* Claim slide 5 — we handle readiness */
    LWMHeroSlider.claimSlide(root, 5);

    /* Generate 30 falling $ symbols */
    for (var i = 0; i < 30; i++) {
        var bill = document.createElement('div');
        bill.className   = 'lwm-hero-money-bill';
        bill.textContent = '$';

        bill.style.left = (Math.random() * 100) + '%';
        bill.style.setProperty('--drift',    ((Math.random() - 0.5) * 200) + 'px');
        bill.style.setProperty('--rotate',   ((Math.random() - 0.5) * 720) + 'deg');
        bill.style.setProperty('--duration', (8 + Math.random() * 7) + 's');
        bill.style.setProperty('--delay',    (Math.random() * 5) + 's');

        moneyRain.appendChild(bill);
    }

    /* Mark ready once the gate image has loaded */
    function onReady() {
        LWMHeroSlider.markSlideReady(root, 5);
    }

    if (gateImg && gateImg.complete && gateImg.naturalWidth > 0) {
        onReady();
    } else if (gateImg) {
        gateImg.onload  = onReady;
        gateImg.onerror = onReady;
    } else {
        onReady();
    }
});
