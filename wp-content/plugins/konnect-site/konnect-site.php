<?php
/**
 * Plugin Name: Konnect Site
 * Description: Portfolio content, enquiries, native blocks and consent-aware integrations for Konnect Vision Media.
 * Version: 4.1.0
 * Requires PHP: 8.1
 */
if (!defined('ABSPATH')) exit;
define('KVM_SITE_DIR', __DIR__);
require_once __DIR__ . '/includes/content.php';
require_once __DIR__ . '/includes/forms.php';
require_once __DIR__ . '/includes/integrations.php';
require_once __DIR__ . '/includes/blocks.php';
require_once __DIR__ . '/includes/studio.php';
require_once __DIR__ . '/includes/pages.php';
require_once __DIR__ . '/includes/seed.php';
add_action('init', 'kvm_register_content');
add_action('init', 'kvm_register_blocks');
add_action('enqueue_block_editor_assets', function () {
    wp_enqueue_script('kvm-editor', plugins_url('editor.js', __FILE__), ['wp-blocks', 'wp-element', 'wp-components', 'wp-block-editor', 'wp-server-side-render', 'wp-plugins', 'wp-edit-post', 'wp-data', 'wp-core-data'], filemtime(__DIR__ . '/editor.js'), true);
    wp_enqueue_script('kvm-studio-editor', plugins_url('studio-editor.js', __FILE__), ['kvm-editor'], filemtime(__DIR__ . '/studio-editor.js'), true);
    wp_add_inline_script('kvm-studio-editor', 'window.kvmStudioEditor=' . wp_json_encode(['defaults' => kvm_studio_defaults(), 'assetBase' => kvm_studio_asset('')]) . ';', 'before');
    wp_enqueue_style('kvm-studio-editor', plugins_url('studio-editor.css', __FILE__), [], filemtime(__DIR__ . '/studio-editor.css'));
});
register_activation_hook(__FILE__, function () { kvm_register_content(); flush_rewrite_rules(); });
register_deactivation_hook(__FILE__, 'flush_rewrite_rules');
