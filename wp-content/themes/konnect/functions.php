<?php
if (!defined('ABSPATH')) exit;
add_action('after_setup_theme', function () {
    add_theme_support('post-thumbnails');
    add_theme_support('editor-styles');
    add_editor_style('assets/site.css');
});
add_action('wp_enqueue_scripts', function () {
    $url = get_template_directory_uri();
    wp_enqueue_style('konnect-site', $url . '/assets/site.css', [], filemtime(__DIR__ . '/assets/site.css'));
    wp_enqueue_script('konnect-site', $url . '/assets/site.js', [], filemtime(__DIR__ . '/assets/site.js'), true);
    wp_add_inline_script('konnect-site', 'window.kvmConfig=' . wp_json_encode(function_exists('kvm_integration_config') ? kvm_integration_config() : []) . ';', 'before');
    if (is_front_page()) {
        wp_enqueue_script('gsap', $url . '/assets/vendor/gsap.min.js', [], '3.14.2', true);
        wp_enqueue_script('gsap-scrolltrigger', $url . '/assets/vendor/ScrollTrigger.min.js', ['gsap'], '3.14.2', true);
        wp_enqueue_script('konnect-motion', $url . '/assets/motion.js', ['gsap-scrolltrigger'], '1.0.0', true);
    }
});
add_action('wp_head', function () {
    echo '<meta name="theme-color" content="#10090c">';
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
