<?php
/**
 * [lwm_hero_slider] shortcode — renders the complete slider markup.
 *
 * Usage:
 *   [lwm_hero_slider]
 *   [lwm_hero_slider id="home" autoplay="1" interval="5000" start="0"]
 *   [lwm_hero_slider header_offset="120"]
 *
 * @package LWM_Hero_Slider
 */

defined( 'ABSPATH' ) || exit;

class LWM_Hero_Slider_Shortcode {

    /** @var int Auto-incremented instance counter (unique per page-load). */
    private static $instance_count = 0;

    /** @var bool Whether critical inline CSS has already been printed. */
    private static $critical_css_printed = false;

    /** @var string[] Slide template filenames, in order. */
    private const SLIDE_FILES = [
        'slide-01-product.php',
        'slide-02-congress.php',
        'slide-03-video.php',
        'slide-04-book.php',
        'slide-05-social.php',
        'slide-06-gate.php',
    ];

    /**
     * Key images to preload for slide 1 (first instance only).
     * Ensures the hero image appears without pop-in.
     */
    private const PRELOAD_IMAGES = [
        'https://lekcjewartemiliony.pl/wp-content/uploads/2026/02/snm-kurs-jak-stworzyc-firme-bez-kapitalu-slider-background.jpg',
        'https://lekcjewartemiliony.pl/wp-content/uploads/2026/02/snm-kurs-jak-stworzyc-firme-bez-kapitalu-slider-produkt.png',
    ];

    public function __construct() {
        add_shortcode( 'lwm_hero_slider', [ $this, 'render' ] );
    }

    /* ─── Critical inline CSS (once per page, before first slider) ─ */

    private static function print_critical_css(): void {
        if ( self::$critical_css_printed ) {
            return;
        }
        self::$critical_css_printed = true;

        /*
         * !important on the two FOUC rules is REQUIRED because the
         * external slider-core.css sets .lwm-hero-slide.lwm-hero-active { opacity:1 }
         * which would otherwise override the loading-state hide.
         * This is the ONLY place !important is used.
         */
        ?>
<style id="lwm-hero-slider-critical">
.lwm-hero-slider-root{position:relative;width:100%;height:calc(100vh - var(--lwm-hero-header-offset,0px));height:calc(100dvh - var(--lwm-hero-header-offset,0px) - env(safe-area-inset-bottom,0px));overflow:hidden;background:#000;--lwm-hero-header-offset:0px}
.lwm-hero-slider-root:not(.lwm-hero-ready) .lwm-hero-slide,
.lwm-hero-slider-root:not(.lwm-hero-ready) .lwm-hero-slider-arrow,
.lwm-hero-slider-root:not(.lwm-hero-ready) .lwm-hero-slider-nav{opacity:0!important;pointer-events:none!important}
.lwm-hero-slider-root .lwm-hero-loader{position:absolute;inset:0;z-index:200;display:flex;align-items:center;justify-content:center;background:#000;transition:opacity .5s ease}
.lwm-hero-slider-root.lwm-hero-ready .lwm-hero-loader{opacity:0;pointer-events:none}
.lwm-hero-loader__spinner{width:48px;height:48px;border:3px solid rgba(202,156,87,.2);border-top-color:#ca9c57;border-radius:50%;animation:lwm-hero-spin .8s linear infinite;box-sizing:border-box}
@keyframes lwm-hero-spin{to{transform:rotate(360deg)}}
</style>
        <?php
    }

    /* ─── Preload hints (first instance only) ──────────────────── */

    private static function print_preload_hints(): void {
        foreach ( self::PRELOAD_IMAGES as $url ) {
            printf(
                '<link rel="preload" as="image" href="%s">' . "\n",
                esc_url( $url )
            );
        }
    }

    /* ─── Shortcode render ─────────────────────────────────────── */

    /**
     * @param array|string $atts Shortcode attributes.
     * @return string            Slider HTML.
     */
    public function render( $atts ): string {

        /* Fallback enqueue (for page builders that bypass has_shortcode) */
        LWM_Hero_Slider_Assets::enqueue_all();

        /* Parse attributes */
        $atts = shortcode_atts(
            [
                'id'            => '',
                'autoplay'      => '0',
                'interval'      => '5000',
                'start'         => '0',
                'header_offset' => '',   // empty = auto-detect; number = forced px value
            ],
            $atts,
            'lwm_hero_slider'
        );

        $instance_id = ++ self::$instance_count;
        $start_index = absint( $atts['start'] );
        $slide_count = count( self::SLIDE_FILES );

        /* JSON options passed to JS via data-attribute */
        $js_options = [
            'autoplay' => (bool) absint( $atts['autoplay'] ),
            'interval' => absint( $atts['interval'] ),
            'start'    => $start_index,
        ];

        $has_forced_offset = ( $atts['header_offset'] !== '' );
        if ( $has_forced_offset ) {
            $js_options['headerOffset'] = absint( $atts['header_offset'] );
        }

        /* Inline style (forced header offset only) */
        $inline_style = $has_forced_offset
            ? sprintf( '--lwm-hero-header-offset:%dpx', absint( $atts['header_offset'] ) )
            : '';

        /* Wrapper ID */
        $wrapper_id = $atts['id'] ? sanitize_html_class( $atts['id'] ) : '';

        /* ── Build HTML ──────────────────────────────── */
        ob_start();

        self::print_critical_css();

        if ( $instance_id === 1 ) {
            self::print_preload_hints();
        }
        ?>

        <div class="lwm-hero-slider-root"
             data-lwm-hero-slider="<?php echo (int) $instance_id; ?>"
             data-lwm-hero-options="<?php echo esc_attr( wp_json_encode( $js_options ) ); ?>"
             <?php if ( $wrapper_id ) : ?>id="<?php echo esc_attr( $wrapper_id ); ?>"<?php endif; ?>
             <?php if ( $inline_style ) : ?>style="<?php echo esc_attr( $inline_style ); ?>"<?php endif; ?>
        >

            <!-- Loader: visible until JS adds .lwm-hero-ready -->
            <div class="lwm-hero-loader" aria-hidden="true">
                <div class="lwm-hero-loader__spinner"></div>
            </div>

            <?php
            foreach ( self::SLIDE_FILES as $index => $file ) {
                $is_active = ( $index === $start_index );
                $template  = LWM_HERO_SLIDER_PATH . 'templates/slides/' . $file;

                if ( file_exists( $template ) ) {
                    include $template;
                }
            }
            ?>

            <!-- Navigation: arrows -->
            <div class="lwm-hero-slider-arrow lwm-hero-prev"></div>
            <div class="lwm-hero-slider-arrow lwm-hero-next"></div>

            <!-- Navigation: dots -->
            <div class="lwm-hero-slider-nav">
                <?php for ( $i = 0; $i < $slide_count; $i ++ ) : ?>
                    <button<?php echo $i === $start_index ? ' class="lwm-hero-active"' : ''; ?> data-slide="<?php echo (int) $i; ?>"></button>
                <?php endfor; ?>
            </div>

        </div>
        <?php

        return ob_get_clean();
    }
}
