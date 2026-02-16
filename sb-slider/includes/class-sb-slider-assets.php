<?php
/**
 * Conditional asset registration and enqueue.
 *
 * Assets are registered early but only enqueued when the [lwm_hero_slider]
 * shortcode is present — either detected via has_shortcode() in the
 * main post, or flagged at render-time (fallback for page builders).
 *
 * @package SB_Slider
 */

defined( 'ABSPATH' ) || exit;

class SB_Slider_Assets {

    /** @var bool Whether assets have already been enqueued. */
    private static $enqueued = false;

    public function __construct() {
        add_action( 'wp_enqueue_scripts', [ $this, 'register' ], 5 );
        add_action( 'wp_enqueue_scripts', [ $this, 'maybe_enqueue' ], 20 );
    }

    /* ─── Register (never enqueue yet) ─────────────────────── */

    public function register(): void {
        $css_url  = SB_SLIDER_URL  . 'assets/css/';
        $js_url   = SB_SLIDER_URL  . 'assets/js/';
        $css_path = SB_SLIDER_PATH . 'assets/css/';
        $js_path  = SB_SLIDER_PATH . 'assets/js/';

        /* Core */
        wp_register_style(
            'sb-slider-core',
            $css_url . 'slider-core.css',
            [],
            self::ver( $css_path . 'slider-core.css' )
        );

        wp_register_script(
            'sb-slider-core',
            $js_url . 'slider-core.js',
            [],
            self::ver( $js_path . 'slider-core.js' ),
            true                       // ← footer
        );

        /* Per-slide CSS */
        $slide_css = [
            'slide-01-product',
            'slide-02-congress',
            'slide-03-video',
            'slide-04-book',
            'slide-05-social',
            'slide-06-gate',
        ];

        foreach ( $slide_css as $slug ) {
            wp_register_style(
                "sb-slider-{$slug}",
                "{$css_url}slides/{$slug}.css",
                [ 'sb-slider-core' ],
                self::ver( "{$css_path}slides/{$slug}.css" )
            );
        }

        /* Per-slide JS (no file for slide 04 & 05) */
        $slide_js = [
            'slide-01-product',
            'slide-02-congress',
            'slide-03-video',
            'slide-06-gate',
        ];

        foreach ( $slide_js as $slug ) {
            wp_register_script(
                "sb-slider-{$slug}",
                "{$js_url}slides/{$slug}.js",
                [ 'sb-slider-core' ],
                self::ver( "{$js_path}slides/{$slug}.js" ),
                true
            );
        }
    }

    /* ─── Detect shortcode in main post content ────────────── */

    public function maybe_enqueue(): void {
        global $post;

        if (
            is_a( $post, 'WP_Post' ) &&
            has_shortcode( $post->post_content, 'lwm_hero_slider' )
        ) {
            self::enqueue_all();
        }
    }

    /* ─── Enqueue everything (called from shortcode fallback) ─ */

    public static function enqueue_all(): void {
        if ( self::$enqueued ) {
            return;
        }
        self::$enqueued = true;

        /* CSS */
        wp_enqueue_style( 'sb-slider-core' );
        wp_enqueue_style( 'sb-slider-slide-01-product' );
        wp_enqueue_style( 'sb-slider-slide-02-congress' );
        wp_enqueue_style( 'sb-slider-slide-03-video' );
        wp_enqueue_style( 'sb-slider-slide-04-book' );
        wp_enqueue_style( 'sb-slider-slide-05-social' );
        wp_enqueue_style( 'sb-slider-slide-06-gate' );

        /* JS */
        wp_enqueue_script( 'sb-slider-core' );
        wp_enqueue_script( 'sb-slider-slide-01-product' );
        wp_enqueue_script( 'sb-slider-slide-02-congress' );
        wp_enqueue_script( 'sb-slider-slide-03-video' );
        wp_enqueue_script( 'sb-slider-slide-06-gate' );
    }

    /* ─── Helpers ──────────────────────────────────────────── */

    /**
     * Cache-busting version based on file mtime.
     */
    private static function ver( string $path ): string {
        return file_exists( $path )
            ? (string) filemtime( $path )
            : SB_SLIDER_VERSION;
    }
}
