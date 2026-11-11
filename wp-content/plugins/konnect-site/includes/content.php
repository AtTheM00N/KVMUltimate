<?php
if (!defined('ABSPATH')) exit;
function kvm_is_local() { return in_array(wp_get_environment_type(), ['local', 'development'], true); }
function kvm_register_content() {
    register_post_type('kvm_project', [
        'labels' => ['name' => 'Projects', 'singular_name' => 'Project', 'add_new_item' => 'Add project'],
        'public' => true, 'show_in_rest' => true, 'menu_icon' => 'dashicons-portfolio',
        'has_archive' => false, 'rewrite' => ['slug' => 'project'],
        'supports' => ['title', 'editor', 'thumbnail', 'excerpt', 'page-attributes', 'custom-fields'],
    ]);
    register_taxonomy('kvm_service', 'kvm_project', ['label' => 'Services', 'public' => true, 'show_in_rest' => true, 'hierarchical' => true, 'rewrite' => false]);
    register_post_type('kvm_enquiry', [
        'labels' => ['name' => 'Enquiries', 'singular_name' => 'Enquiry'],
        'public' => false, 'publicly_queryable' => false, 'exclude_from_search' => true,
        'show_ui' => true, 'show_in_rest' => false, 'menu_icon' => 'dashicons-email-alt',
        'supports' => ['title'], 'capabilities' => ['create_posts' => 'do_not_allow', 'edit_posts' => 'manage_options', 'edit_others_posts' => 'manage_options', 'read_private_posts' => 'manage_options', 'publish_posts' => 'do_not_allow', 'delete_posts' => 'manage_options', 'delete_others_posts' => 'manage_options', 'edit_post' => 'manage_options', 'read_post' => 'manage_options', 'delete_post' => 'manage_options'], 'map_meta_cap' => false,
    ]);
    $fields = ['brief' => 'string', 'scope' => 'string', 'approach' => 'string', 'results' => 'string', 'results_verified' => 'boolean', 'placeholder' => 'boolean', 'gallery' => 'string', 'art' => 'string'];
    foreach ($fields as $name => $type) register_post_meta('kvm_project', '_kvm_' . $name, [
        'single' => true, 'type' => $type, 'show_in_rest' => true,
        'sanitize_callback' => $type === 'boolean' ? 'rest_sanitize_boolean' : 'sanitize_textarea_field',
        'auth_callback' => function ($allowed, $key, $id) { return current_user_can('edit_post', $id); },
    ]);
}
// Demo projects cannot be published outside local/development environments.
add_filter('wp_insert_post_data', function ($data, $postarr) {
    if ($data['post_type'] !== 'kvm_project' || kvm_is_local()) return $data;
    $demo = !empty($postarr['meta_input']['_kvm_placeholder']) || (!empty($postarr['ID']) && get_post_meta($postarr['ID'], '_kvm_placeholder', true));
    if ($demo && $data['post_status'] === 'publish') $data['post_status'] = 'draft';
    return $data;
}, 10, 2);
add_action('pre_get_posts', function ($query) {
    if (is_admin() || kvm_is_local()) return;
    $meta = (array) $query->get('meta_query');
    $meta[] = ['relation' => 'OR', ['key' => '_kvm_placeholder', 'compare' => 'NOT EXISTS'], ['key' => '_kvm_placeholder', 'value' => '1', 'compare' => '!=']];
    $query->set('meta_query', $meta);
});
add_filter('manage_kvm_enquiry_posts_columns', function ($columns) { $columns['notification'] = 'Email notification'; return $columns; });
add_action('manage_kvm_enquiry_posts_custom_column', function ($column, $id) {
    if ($column === 'notification') echo esc_html(get_post_meta($id, '_kvm_notification', true) ?: 'Pending');
}, 10, 2);
add_action('add_meta_boxes_kvm_enquiry', function () {
    add_meta_box('kvm-enquiry-details', 'Enquiry details', function ($post) {
        foreach (['name', 'email', 'phone', 'service', 'brief', 'attribution', 'notification'] as $field) {
            echo '<p><strong>' . esc_html(ucfirst($field)) . '</strong><br>' . nl2br(esc_html(get_post_meta($post->ID, '_kvm_' . $field, true))) . '</p>';
        }
    });
});
