<?php
require '/wordpress/wp-load.php';
function check($condition, $label) { if (!$condition) throw new Exception('FAIL ' . $label); echo 'PASS ' . $label . "\n"; }
check(!kvm_is_local(), 'Production environment');
check(count(get_posts(['post_type' => 'post', 'name' => 'hello-world'])) === 0, 'Starter blog content removed');
check(count(get_posts(['post_type' => 'kvm_project'])) === 0, 'Demo projects absent publicly');
check(count(kvm_studio_projects()) === 0, 'Production scene excludes placeholder projects');
$empty_story = kvm_render_story_chapter(['chapter' => 'work']);
check(str_contains($empty_story, 'Our portfolio is being prepared.') && str_contains($empty_story, 'data-length="1"'), 'Empty production portfolio collapses unused camera beats');
check(!str_contains(kvm_render_studio([], do_blocks(kvm_studio_pattern())), 'publisher-ad'), 'Immersive homepage excludes publisher placements');
$demo = get_posts(['post_type' => 'kvm_project', 'post_status' => 'draft', 'meta_query' => [], 'suppress_filters' => true]);
// Query via SQL because the public placeholder guard also protects ordinary WP_Query calls.
global $wpdb;
$id = (int) $wpdb->get_var("SELECT ID FROM {$wpdb->posts} WHERE post_type='kvm_project' LIMIT 1");
wp_update_post(['ID' => $id, 'post_status' => 'publish']);
check(get_post_status($id) === 'draft', 'Publishing placeholder blocked');
update_option('kvm_gtm_id', 'GTM-TEST123');
update_option('kvm_ads_client', 'ca-pub-1234567890123456');
update_option('kvm_ads_services', '1234567890');
update_option('kvm_integrations_ready', '1');
check(kvm_integration_config()['gtm'] === 'GTM-TEST123', 'Reviewed production integration configured');
check(str_contains(kvm_ad_slot('services'), 'Advertisement'), 'Configured publisher slot reserves space');
query_posts(['pagename' => 'campaign']);
check(kvm_ad_slot('services') === '', 'Campaign excludes publisher ads');
wp_reset_query();
update_option('kvm_integrations_ready', '0');
check(kvm_ad_slot('services') === '' && kvm_integration_config()['gtm'] === '', 'Unreviewed integrations disabled');
echo "ALL PRODUCTION CHECKS PASSED\n";
