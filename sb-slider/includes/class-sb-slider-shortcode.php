<?php
/**
 * [sb_slider] shortcode — renders the complete slider markup.
 *
 * Usage:
 *   [sb_slider]
 *   [sb_slider id="home" autoplay="1" interval="5000" start="0"]
 *
 * @package SB_Slider
 */

defined( 'ABSPATH' ) || exit;

class SB_Slider_Shortcode {

    /** @var int Auto-incremented instance counter (unique per page-load). */
    private static $instance_count = 0;

    /** @var string[] Slide template filenames, in order. */
    private const SLIDE_FILES = [
        'slide-01-product.php',
        'slide-02-congress.php',
        'slide-03-video.php',
        'slide-04-book.php',
        'slide-05-social.php',
        'slide-06-gate.php',
    ];

    public function __construct() {
        add_shortcode( 'sb_slider', [ $this, 'render' ] );
    }

    /**
     * Shortcode callback.
     *
     * @param array|string $atts Shortcode attributes.
     * @return string            Slider HTML.
     */
    public function render( $atts ): string {

        /* ── Fallback enqueue (for page builders that bypass has_shortcode) ── */
        SB_Slider_Assets::enqueue_all();

        /* ── Parse attributes ─────────────────────────────────────────────── */
        $atts = shortcode_atts(
            [
                'id'       => '',
                'autoplay' => '0',
                'interval' => '5000',
                'start'    => '0',
            ],
            $atts,
            'sb_slider'
        );

        $instance_id = ++ self::$instance_count;
        $start_index = absint( $atts['start'] );
        $slide_count = count( self::SLIDE_FILES );

        /* JSON options passed to JS via data-attribute */
        $js_options = wp_json_encode( [
            'autoplay' => (bool) absint( $atts['autoplay'] ),
            'interval' => absint( $atts['interval'] ),
            'start'    => $start_index,
        ] );

        /* Wrapper id / class */
        $wrapper_id    = $atts['id'] ? sanitize_html_class( $atts['id'] ) : '';
        $wrapper_attrs = sprintf(
            'class="sb-slider-root" data-sb-slider="%d" data-sb-options="%s"',
            $instance_id,
            esc_attr( $js_options )
        );

        if ( $wrapper_id ) {
            $wrapper_attrs .= sprintf( ' id="%s"', esc_attr( $wrapper_id ) );
        }

        /* ── Build HTML via output buffer ─────────────────────────────────── */
        ob_start();
        ?>
        <div <?php echo $wrapper_attrs; // phpcs:ignore WordPress.Security.EscapeOutput ?>>

            <?php
            foreach ( self::SLIDE_FILES as $index => $file ) {
                /* $is_active is consumed by the slide template */
                $is_active = ( $index === $start_index );
                $template  = SB_SLIDER_PATH . 'templates/slides/' . $file;

                if ( file_exists( $template ) ) {
                    include $template;
                }
            }
            ?>

            <!-- Navigation: arrows -->
            <div class="sb-slider-arrow sb-prev"></div>
            <div class="sb-slider-arrow sb-next"></div>

            <!-- Navigation: dots -->
            <div class="sb-slider-nav">
                <?php for ( $i = 0; $i < $slide_count; $i ++ ) : ?>
                    <button<?php echo $i === $start_index ? ' class="sb-active"' : ''; ?> data-slide="<?php echo (int) $i; ?>"></button>
                <?php endfor; ?>
            </div>

        </div>
        <?php

        return ob_get_clean();
    }
}
