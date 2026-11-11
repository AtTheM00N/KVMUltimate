<?php
/**
 * Plugin Name: Konnect Site
 * Description: Portfolio content, enquiries, native blocks and consent-aware integrations for Konnect Vision Media.
 * Version: 1.0.0
 * Requires PHP: 8.1
 */
if (!defined('ABSPATH')) exit;
define('KVM_SITE_DIR', __DIR__);
require_once __DIR__ . '/includes/content.php';
require_once __DIR__ . '/includes/forms.php';
require_once __DIR__ . '/includes/integrations.php';
require_once __DIR__ . '/includes/blocks.php';
require_once __DIR__ . '/includes/seed.php';
add_action('init', 'kvm_register_content');
add_action('init', 'kvm_register_blocks');
add_action('enqueue_block_editor_assets', function () {
    wp_enqueue_script('kvm-editor', plugins_url('editor.js', __FILE__), ['wp-blocks', 'wp-element', 'wp-components', 'wp-block-editor', 'wp-server-side-render', 'wp-plugins', 'wp-edit-post', 'wp-data', 'wp-core-data'], '1.0.0', true);
});
register_activation_hook(__FILE__, function () { kvm_register_content(); flush_rewrite_rules(); });
register_deactivation_hook(__FILE__, 'flush_rewrite_rules');
