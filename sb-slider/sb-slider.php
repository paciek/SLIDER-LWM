<?php
/**
 * Plugin Name: LWM Hero Slider
 * Plugin URI:  https://lekcjewartemiliony.pl
 * Description: Autorski, w pełni izolowany slider hero dla marki Lekcje Warte Miliony. Zoptymalizowany pod performance (RAF render pipeline, FOUC prevention, slide readiness). Osadzany shortcodem [lwm_hero_slider].
 * Version:     1.0.0
 * Author:      Kamil Paciepnik
 * License:     GPL-2.0+
 * Text Domain: sb-slider
 */

defined( 'ABSPATH' ) || exit;

/* ── Constants ─────────────────────────────── */
define( 'SB_SLIDER_VERSION', '1.0.0' );
define( 'SB_SLIDER_PATH',    plugin_dir_path( __FILE__ ) );
define( 'SB_SLIDER_URL',     plugin_dir_url( __FILE__ ) );

/* ── Autoload includes ─────────────────────── */
require_once SB_SLIDER_PATH . 'includes/class-sb-slider.php';
require_once SB_SLIDER_PATH . 'includes/class-sb-slider-assets.php';
require_once SB_SLIDER_PATH . 'includes/class-sb-slider-shortcode.php';

/* ── Bootstrap ─────────────────────────────── */
SB_Slider::instance();
