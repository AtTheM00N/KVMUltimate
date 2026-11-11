<?php
if (!defined('ABSPATH')) exit;
add_action('admin_menu', function () {
    add_options_page('Konnect settings', 'Konnect', 'manage_options', 'konnect', function () {
        if (!current_user_can('manage_options')) return;
        echo '<div class="wrap"><h1>Konnect settings</h1><p>Tracking and publisher ads are disabled in local/development environments. Configure authenticated email through your host or an SMTP plugin before launch.</p><form method="post" action="options.php">';
        settings_fields('kvm_settings');
        foreach (['notification_email' => 'Enquiry notification email', 'public_email' => 'Public business email', 'gtm_id' => 'Google Tag Manager ID (GTM-XXXX)', 'ads_client' => 'AdSense publisher ID (ca-pub-...)', 'ads_services' => 'Services ad slot ID', 'ads_project' => 'Project ad slot ID'] as $key => $label) {
            echo '<p><label>' . esc_html($label) . '<br><input class="regular-text" name="kvm_' . esc_attr($key) . '" value="' . esc_attr(get_option('kvm_' . $key, '')) . '"></label></p>';
        }
        echo '<p><label><input type="checkbox" name="kvm_integrations_ready" value="1" ' . checked(get_option('kvm_integrations_ready'), '1', false) . '> Final privacy notice, consent configuration and account setup have been reviewed for launch</label></p>';
        submit_button(); echo '</form></div>';
    });
});
add_action('admin_init', function () {
    foreach (['notification_email', 'public_email', 'gtm_id', 'ads_client', 'ads_services', 'ads_project', 'integrations_ready'] as $key) {
        register_setting('kvm_settings', 'kvm_' . $key, ['type' => 'string', 'sanitize_callback' => str_contains($key, 'email') ? 'sanitize_email' : 'sanitize_text_field']);
    }
});
function kvm_integration_config() {
    $ready = !kvm_is_local() && get_option('kvm_integrations_ready') === '1';
    $gtm = get_option('kvm_gtm_id', '');
    $client = get_option('kvm_ads_client', '');
    return [
        'endpoint' => rest_url('konnect/v1/enquiries'),
        'restNonce' => is_user_logged_in() ? wp_create_nonce('wp_rest') : '',
        'gtm' => $ready && preg_match('/^GTM-[A-Z0-9]+$/', $gtm) ? $gtm : '',
        'adsClient' => $ready && preg_match('/^ca-pub-\d{16}$/', $client) ? $client : '',
    ];
}
function kvm_ad_slot($placement) {
    if (is_page_template('campaign') || is_page('campaign')) return '';
    $config = kvm_integration_config();
    $slot = get_option('kvm_ads_' . $placement, '');
    if (!$config['adsClient'] || !preg_match('/^\d+$/', $slot)) return '';
    return '<aside class="publisher-ad" aria-label="Advertisement" data-ad-slot="' . esc_attr($slot) . '"><small>Advertisement</small><div class="ad-consent-note">Advertising space · <a href="' . esc_url(home_url('/cookie-preferences/')) . '">Cookie preferences</a></div><ins class="adsbygoogle" style="display:block" data-ad-client="' . esc_attr($config['adsClient']) . '" data-ad-slot="' . esc_attr($slot) . '" data-ad-format="auto" data-full-width-responsive="true"></ins></aside>';
}
add_action('admin_notices', function () {
    if (!current_user_can('manage_options')) return;
    $failed = new WP_Query(['post_type' => 'kvm_enquiry', 'post_status' => 'private', 'posts_per_page' => 1, 'meta_key' => '_kvm_notification', 'meta_value' => 'Needs attention: notification not sent']);
    if ($failed->have_posts()) echo '<div class="notice notice-warning"><p>An enquiry is saved but its email notification was not sent. Review <a href="' . esc_url(admin_url('edit.php?post_type=kvm_enquiry')) . '">Enquiries</a> and mail settings.</p></div>';
});
