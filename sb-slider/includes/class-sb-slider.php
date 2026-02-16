<?php
/**
 * Main plugin orchestrator (singleton).
 *
 * @package SB_Slider
 */

defined( 'ABSPATH' ) || exit;

final class SB_Slider {

    /** @var self|null */
    private static $instance = null;

    /**
     * Return the single instance of the plugin.
     */
    public static function instance(): self {
        if ( null === self::$instance ) {
            self::$instance = new self();
        }
        return self::$instance;
    }

    private function __construct() {
        new SB_Slider_Assets();
        new SB_Slider_Shortcode();
    }
}
