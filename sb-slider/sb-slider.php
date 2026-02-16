<?php
/**
 * Plugin Name: SB Slider
 * Plugin URI:  https://lekcjewartemiliony.pl
 * Description: Slider "Sposób na Milion" — w pełni izolowany, osadzany shortcodem [sb_slider].
 * Version:     1.0.0
 * Author:      Lekcje Warte Miliony
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
