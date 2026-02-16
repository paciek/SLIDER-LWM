<?php
/**
 * Slide 03 — Video: Marka osobista
 *
 * @var bool $is_active
 * @package SB_Slider
 */

defined( 'ABSPATH' ) || exit;
?>
<div class="sb-slide sb-slide-3<?php echo $is_active ? ' sb-active' : ''; ?>">
    <div class="sb-hero-bg" aria-hidden="true">
        <video autoplay muted loop playsinline preload="auto">
            <source src="<?php echo esc_url( 'https://lekcjewartemiliony.pl/wp-content/uploads/2025/05/slider-lwm.mp4' ); ?>" type="video/mp4">
        </video>
    </div>
    <div class="sb-hero-overlay" aria-hidden="true"></div>
    <div class="sb-hero-content">
        <h1 class="sb-video-title">
            <span class="sb-line">Twoja historia,</span>
            <span class="sb-line">Twoje wartości,</span>
            <span class="sb-line">Twój wpływ</span>
        </h1>
        <p class="sb-video-description">Stwórz markę osobistą, która przyciąga klientów<br>i otwiera drzwi do nowych możliwości</p>
        <a href="#" class="sb-cta-button sb-video-cta">Jak zacząć?</a>
    </div>
</div>
