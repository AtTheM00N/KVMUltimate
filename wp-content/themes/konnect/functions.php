<?php
if (!defined('ABSPATH')) exit;
add_action('after_setup_theme', function () {
    add_theme_support('post-thumbnails');
    add_theme_support('editor-styles');
    add_editor_style('assets/studio.css');
});
add_action('wp_enqueue_scripts', function () {
    $url = get_template_directory_uri();
    wp_enqueue_style('konnect-site', $url . '/assets/studio.css', [], filemtime(__DIR__ . '/assets/studio.css'));
    wp_enqueue_script('konnect-site', $url . '/assets/site.js', [], filemtime(__DIR__ . '/assets/site.js'), true);
    wp_add_inline_script('konnect-site', 'window.kvmConfig=' . wp_json_encode(function_exists('kvm_integration_config') ? kvm_integration_config() : []) . ';', 'before');
    $manifest_file = __DIR__ . '/assets/dist/.vite/manifest.json';
    if (file_exists($manifest_file)) {
        $manifest = json_decode(file_get_contents($manifest_file), true);
        if (!empty($manifest['src/main.js']['file'])) wp_enqueue_script_module('konnect-motion', $url . '/assets/dist/' . $manifest['src/main.js']['file'], [], null);
    }
});
add_action('wp_head', function () {
    echo '<script>document.documentElement.classList.add("js");</script>';
}, 0);
add_action('wp_head', function () {
    echo '<meta name="theme-color" content="#0b0b0d">';
    if (is_singular('kvm_project') && get_post_meta(get_the_ID(), '_kvm_placeholder', true)) echo '<meta name="robots" content="noindex,nofollow">';
    if (is_front_page()) echo '<meta name="description" content="Konnect Vision Media brings social media, design, SEO and lead generation together to help your brand find its voice. Let’s talk about your next project.">';
});
add_action('template_redirect', function () {
    if (is_page('contact') || is_page_template('campaign') || has_block('konnect/enquiry', get_queried_object_id()) || isset($_GET['enquiry_state']) || isset($_GET['enquiry_sent'])) { nocache_headers(); if (!defined('DONOTCACHEPAGE')) define('DONOTCACHEPAGE', true); }
});
// Unknown campaign/project URLs must show the useful 404 rather than a guessed destination.
add_filter('redirect_canonical', function ($redirect) { return is_404() ? false : $redirect; });
add_action('parse_request', function ($wp) {
    if ($wp->request !== '' && empty($wp->query_vars)) $wp->query_vars['error'] = '404';
}, 99);
