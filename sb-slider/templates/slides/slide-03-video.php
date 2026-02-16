<?php
/**
 * Slide 03 — Video: Marka osobista
 *
 * @var bool $is_active
 * @package LWM_Hero_Slider
 */

defined( 'ABSPATH' ) || exit;
?>
<div class="lwm-hero-slide lwm-hero-slide-3<?php echo $is_active ? ' lwm-hero-active' : ''; ?>">
    <div class="lwm-hero-hero-bg" aria-hidden="true">
        <video autoplay muted loop playsinline preload="auto">
            <source src="<?php echo esc_url( 'https://lekcjewartemiliony.pl/wp-content/uploads/2025/05/slider-lwm.mp4' ); ?>" type="video/mp4">
        </video>
    </div>
    <div class="lwm-hero-hero-overlay" aria-hidden="true"></div>
    <div class="lwm-hero-hero-content">
        <h1 class="lwm-hero-video-title">
            <span class="lwm-hero-line">Twoja historia,</span>
            <span class="lwm-hero-line">Twoje wartości,</span>
            <span class="lwm-hero-line">Twój wpływ</span>
        </h1>
        <p class="lwm-hero-video-description">Stwórz markę osobistą, która przyciąga klientów<br>i otwiera drzwi do nowych możliwości</p>
        <a href="<?php echo esc_url( 'https://lekcjewartemiliony.pl/zostan-wspolautorem-ksiazki/' ); ?>" class="lwm-hero-cta-button lwm-hero-video-cta">Jak zacząć?</a>
    </div>
</div>
