<?php
if (!defined('ABSPATH')) exit;
function kvm_services() { return ['Social media marketing', 'Graphic design', 'SEO', 'Lead generation']; }
function kvm_form($values = [], $errors = [], $success = false) {
    if (!$values && isset($_GET['enquiry_state'])) {
        $key = sanitize_key(wp_unslash($_GET['enquiry_state']));
        $state = get_transient('kvm_form_' . $key);
        if ($state) { $values = $state['values']; $errors = $state['errors']; delete_transient('kvm_form_' . $key); }
    }
    $success = $success || isset($_GET['enquiry_sent']);
    $id = wp_unique_id('enquiry-');
    ob_start(); ?>
    <form class="enquiry-form" action="<?php echo esc_url(admin_url('admin-post.php')); ?>" method="post" data-enquiry>
      <input type="hidden" name="action" value="kvm_enquiry">
      <?php wp_nonce_field('kvm_enquiry', 'kvm_nonce'); ?>
      <input type="hidden" name="return_url" value="<?php echo esc_url(get_permalink() ?: home_url('/contact/')); ?>">
      <input type="hidden" name="attribution" value="" data-attribution>
      <div class="form-trap" aria-hidden="true"><label>Leave this field empty<input name="website" tabindex="-1" autocomplete="off"></label></div>
      <div class="form-status" role="status" tabindex="-1"><?php echo $success ? 'Thank you. Your enquiry has been received.' : ''; ?></div>
      <?php if ($errors) : ?><div class="form-errors" role="alert">Please check the highlighted fields. <?php echo esc_html($errors['general'] ?? ''); ?></div><?php endif; ?>
      <?php foreach (['name' => 'Your name', 'email' => 'Email address', 'phone' => 'Phone number (optional)'] as $field => $label) : ?>
      <div class="form-field"><label for="<?php echo esc_attr($id . $field); ?>"><?php echo esc_html($label); ?></label>
      <input id="<?php echo esc_attr($id . $field); ?>" name="<?php echo esc_attr($field); ?>" type="<?php echo $field === 'email' ? 'email' : ($field === 'phone' ? 'tel' : 'text'); ?>" autocomplete="<?php echo $field === 'name' ? 'name' : ($field === 'phone' ? 'tel' : 'email'); ?>" maxlength="<?php echo $field === 'phone' ? 40 : 150; ?>" <?php echo $field !== 'phone' ? 'required' : ''; ?> value="<?php echo esc_attr($values[$field] ?? ''); ?>" aria-describedby="<?php echo esc_attr($id . $field . '-error'); ?>" <?php echo isset($errors[$field]) ? 'aria-invalid="true"' : ''; ?>>
      <span class="field-error" id="<?php echo esc_attr($id . $field . '-error'); ?>"><?php echo esc_html($errors[$field] ?? ''); ?></span></div>
      <?php endforeach; ?>
      <div class="form-field"><label for="<?php echo esc_attr($id); ?>service">What can we help with?</label><select name="service" id="<?php echo esc_attr($id); ?>service" required aria-describedby="<?php echo esc_attr($id); ?>service-error" <?php echo isset($errors['service']) ? 'aria-invalid="true"' : ''; ?>><option value="">Choose a service</option><?php foreach (kvm_services() as $service) : ?><option <?php selected($values['service'] ?? '', $service); ?>><?php echo esc_html($service); ?></option><?php endforeach; ?></select><span class="field-error" id="<?php echo esc_attr($id); ?>service-error"><?php echo esc_html($errors['service'] ?? ''); ?></span></div>
      <div class="form-field field-wide"><label for="<?php echo esc_attr($id); ?>brief">Tell us about your project</label><textarea id="<?php echo esc_attr($id); ?>brief" name="brief" rows="4" minlength="20" maxlength="5000" required aria-describedby="<?php echo esc_attr($id); ?>brief-error" <?php echo isset($errors['brief']) ? 'aria-invalid="true"' : ''; ?>><?php echo esc_textarea($values['brief'] ?? ''); ?></textarea><span class="field-error" id="<?php echo esc_attr($id); ?>brief-error"><?php echo esc_html($errors['brief'] ?? ''); ?></span></div>
      <p class="form-note field-wide">We’ll use these details to respond to your enquiry. <a href="<?php echo esc_url(home_url('/privacy/')); ?>">Read our privacy notice</a>.</p>
      <button class="button button-red field-wide" type="submit">Send your enquiry <span aria-hidden="true"></span></button>
    </form>
    <?php return ob_get_clean();
}
function kvm_process_enquiry($raw) {
    foreach (['website', 'kvm_nonce', 'name', 'email', 'phone', 'service', 'brief', 'attribution'] as $field) {
        if (isset($raw[$field]) && !is_scalar($raw[$field])) return new WP_Error('invalid_input', 'Please use plain text in the form fields.', ['status' => 400]);
    }
    if (!empty($raw['website'])) return new WP_Error('spam', 'Unable to submit this enquiry. Please try again.', ['status' => 400]);
    if (!wp_verify_nonce(sanitize_text_field($raw['kvm_nonce'] ?? ''), 'kvm_enquiry')) return new WP_Error('expired', 'Please reload the page and try again.', ['status' => 403]);
    $values = [];
    foreach (['name', 'email', 'phone', 'service', 'brief'] as $field) $values[$field] = sanitize_textarea_field($raw[$field] ?? '');
    $errors = [];
    if (strlen($values['name']) < 2 || strlen($values['name']) > 150) $errors['name'] = 'Enter your name (2–150 characters).';
    if (!is_email($values['email']) || strlen($values['email']) > 150) $errors['email'] = 'Enter a valid email address.';
    if (strlen($values['phone']) > 40) $errors['phone'] = 'Use 40 characters or fewer.';
    if (!in_array($values['service'], kvm_services(), true)) $errors['service'] = 'Choose a service from the list.';
    if (strlen($values['brief']) < 20 || strlen($values['brief']) > 5000) $errors['brief'] = 'Describe the project in 20–5,000 characters.';
    if ($errors) return new WP_Error('validation', 'Please check the highlighted fields.', ['status' => 422, 'fields' => $errors]);
    // REMOTE_ADDR is authoritative; untrusted forwarded headers are deliberately ignored.
    $rate_key = 'kvm_rate_' . hash_hmac('sha256', $_SERVER['REMOTE_ADDR'] ?? 'unknown', wp_salt('nonce'));
    $count = (int) get_transient($rate_key);
    if ($count >= 5) return new WP_Error('rate_limit', 'Too many enquiries. Please try again in an hour.', ['status' => 429]);
    $fingerprint = 'kvm_duplicate_' . hash_hmac('sha256', strtolower($values['email']) . $values['brief'], wp_salt('nonce'));
    if (get_transient($fingerprint)) return new WP_Error('duplicate', 'This enquiry was already received. Please allow us time to respond.', ['status' => 409]);
    $post_id = wp_insert_post(['post_type' => 'kvm_enquiry', 'post_status' => 'private', 'post_title' => $values['name'] . ' — ' . $values['service']], true);
    if (is_wp_error($post_id) || !$post_id) return new WP_Error('storage', 'We couldn’t save the enquiry. Please try again.', ['status' => 503]);
    foreach ($values as $field => $value) update_post_meta($post_id, '_kvm_' . $field, $value);
    $attr = json_decode($raw['attribution'] ?? '', true);
    if (is_array($attr)) {
        $safe = [];
        foreach (['utm_source', 'utm_medium', 'utm_campaign'] as $key) if (isset($attr[$key])) $safe[$key] = substr(sanitize_text_field($attr[$key]), 0, 100);
        update_post_meta($post_id, '_kvm_attribution', wp_json_encode($safe));
    }
    set_transient($rate_key, $count + 1, HOUR_IN_SECONDS);
    set_transient($fingerprint, true, 10 * MINUTE_IN_SECONDS);
    $recipient = get_option('kvm_notification_email', '');
    $sent = false;
    if (is_email($recipient)) {
        $sent = wp_mail($recipient, 'New website enquiry: ' . $values['service'], implode("\n\n", array_map(function ($key) use ($values) { return ucfirst($key) . ': ' . $values[$key]; }, array_keys($values))), ['Reply-To: ' . sanitize_email($values['email'])]);
    }
    update_post_meta($post_id, '_kvm_notification', $sent ? 'Accepted by mail transport' : 'Needs attention: notification not sent');
    return ['success' => true, 'message' => 'Thank you. Your enquiry has been received.'];
}
add_action('rest_api_init', function () {
    register_rest_route('konnect/v1', '/enquiries', ['methods' => 'POST', 'permission_callback' => '__return_true', 'callback' => function ($request) { return kvm_process_enquiry($request->get_params()); }]);
});
function kvm_handle_form() {
    $raw = wp_unslash($_POST);
    $result = kvm_process_enquiry($raw);
    $return = wp_validate_redirect(esc_url_raw($raw['return_url'] ?? ''), home_url('/contact/'));
    $return = remove_query_arg(['enquiry_state', 'enquiry_sent'], $return);
    if (is_wp_error($result)) {
        $key = strtolower(wp_generate_password(32, false));
        $values = [];
        foreach (['name', 'email', 'phone', 'service', 'brief'] as $field) $values[$field] = sanitize_textarea_field($raw[$field] ?? '');
        $data = $result->get_error_data();
        set_transient('kvm_form_' . $key, ['values' => $values, 'errors' => array_merge($data['fields'] ?? [], ['general' => $result->get_error_message()])], 5 * MINUTE_IN_SECONDS);
        $return = add_query_arg('enquiry_state', $key, $return);
    } else $return = add_query_arg('enquiry_sent', '1', $return);
    nocache_headers(); wp_safe_redirect($return . '#enquiry'); exit;
}
add_action('admin_post_nopriv_kvm_enquiry', 'kvm_handle_form');
add_action('admin_post_kvm_enquiry', 'kvm_handle_form');
