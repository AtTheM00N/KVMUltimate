<?php
if (!defined('ABSPATH')) exit;
function kvm_register_blocks() {
    foreach (['projects', 'enquiry', 'services', 'project-detail', 'cookie-preferences', 'business-contact'] as $name) {
        register_block_type('konnect/' . $name, ['api_version' => 3,
            'attributes' => ['limit' => ['type' => 'number', 'default' => 0], 'filters' => ['type' => 'boolean', 'default' => false], 'serviceCopy' => ['type' => 'object', 'default' => (object) []]],
            'render_callback' => function ($attributes) use ($name) {
                switch ($name) {
                    case 'projects': return kvm_projects($attributes);
                    case 'enquiry': return '<div id="enquiry">' . kvm_form() . '</div>';
                    case 'services': return kvm_service_sections($attributes);
                    case 'project-detail': return kvm_project_detail();
                    case 'business-contact': $email = get_option('kvm_public_email'); return is_email($email) ? '<a class="text-link" href="mailto:' . esc_attr($email) . '">' . esc_html($email) . '</a>' : '';
                    case 'cookie-preferences': return '<div class="consent-panel"><h2>Your cookie preferences</h2><p>Essential functions keep this site and its enquiry form working. Optional analytics and advertising remain off until you choose to enable them.</p><form data-consent-form><label><input type="checkbox" checked disabled> Essential functions (always active)</label><label><input type="checkbox" name="analytics"> Analytics and campaign measurement</label><label><input type="checkbox" name="advertising"> Publisher advertising</label><button class="button button-red" type="submit">Save preferences </button><p role="status" data-consent-status></p></form><noscript>Optional analytics and advertising are disabled because JavaScript is unavailable.</noscript></div>';
                }
            }]);
    }
}
function kvm_art($type, $large = false) {
    $type = in_array($type, ['social', 'identity', 'search'], true) ? $type : 'social';
    return '<div class="project-art art-' . esc_attr($type) . '"><img src="' . esc_url(kvm_studio_asset($type . '.webp')) . '" alt="Original Konnect studio design study" width="1440" height="900" loading="lazy"></div>';
}
function kvm_projects($attributes = []) {
    $limit = intval($attributes['limit'] ?? 0);
    $filter = sanitize_title(wp_unslash($_GET['service'] ?? ''));
    $args = ['post_type' => 'kvm_project', 'posts_per_page' => $limit ?: -1, 'orderby' => ['menu_order' => 'ASC', 'date' => 'DESC']];
    if ($filter && !empty($attributes['filters'])) $args['tax_query'] = [['taxonomy' => 'kvm_service', 'field' => 'slug', 'terms' => $filter]];
    $query = new WP_Query($args);
    ob_start();
    if (!empty($attributes['filters'])) { ?>
      <nav class="work-filters" aria-label="Filter projects by service"><a href="<?php echo esc_url(home_url('/work/')); ?>" <?php echo !$filter ? 'aria-current="true"' : ''; ?>>All work</a>
      <?php foreach (get_terms(['taxonomy' => 'kvm_service', 'hide_empty' => false]) as $term) : ?><a href="<?php echo esc_url(add_query_arg('service', $term->slug, home_url('/work/'))); ?>" <?php echo $filter === $term->slug ? 'aria-current="true"' : ''; ?>><?php echo esc_html($term->name); ?></a><?php endforeach; ?></nav>
    <?php }
    echo '<div class="project-grid' . ($limit ? ' featured-work' : '') . '">';
    while ($query->have_posts()) { $query->the_post(); $id = get_the_ID(); ?>
      <article class="project-card" data-reveal><a href="<?php the_permalink(); ?>" class="project-link">
        <div class="project-media"><?php if (has_post_thumbnail()) the_post_thumbnail('large', ['loading' => 'lazy']); else echo kvm_art(get_post_meta($id, '_kvm_art', true)); ?></div>
        <div class="project-meta"><div><p class="eyebrow"><?php echo esc_html(strip_tags(get_the_term_list($id, 'kvm_service', '', ' · ')) ?: 'Selected project'); ?></p><h3><?php the_title(); ?></h3></div></div>
        <?php if (get_post_meta($id, '_kvm_placeholder', true)) echo '<p class="preview-label">Konnect design study · Not client work</p>'; ?>
      </a></article>
    <?php }
    if (!$query->post_count) echo '<p class="empty-state">New work is being prepared. <a href="' . esc_url(home_url('/contact/')) . '">Tell us about your project</a>.</p>';
    echo '</div>'; wp_reset_postdata(); return ob_get_clean();
}
function kvm_project_detail() {
    $id = get_the_ID(); ob_start();
    if (get_post_meta($id, '_kvm_placeholder', true)) echo '<p class="preview-notice">Original Konnect design study. Illustrative work, not a client commission.</p>';
    echo '<div class="project-cover">';
    if (has_post_thumbnail($id)) echo get_the_post_thumbnail($id, 'full'); else echo kvm_art(get_post_meta($id, '_kvm_art', true), true);
    echo '</div><div class="project-story">';
    foreach (['brief' => 'The brief', 'scope' => 'What we worked on', 'approach' => 'The approach'] as $key => $label) {
        $value = get_post_meta($id, '_kvm_' . $key, true);
        if ($value) echo '<section><h2>' . esc_html($label) . '</h2><p>' . nl2br(esc_html($value)) . '</p></section>';
    }
    if (get_post_meta($id, '_kvm_results_verified', true) && ($results = get_post_meta($id, '_kvm_results', true))) echo '<section><h2>Verified results</h2><p>' . nl2br(esc_html($results)) . '</p></section>';
    echo '</div><div class="project-gallery">';
    foreach (array_filter(array_map('absint', explode(',', get_post_meta($id, '_kvm_gallery', true)))) as $image) echo wp_get_attachment_image($image, 'large', false, ['loading' => 'lazy']);
    echo '</div>';
    if (!get_post_meta($id, '_kvm_placeholder', true)) echo kvm_ad_slot('project');
    echo '<div class="section-heading"><h2>More to explore.</h2><a class="text-link" href="' . esc_url(home_url('/work/')) . '">All work </a></div>';
    // Related projects exclude the current entry and respect public placeholder protection.
    $related = new WP_Query(['post_type' => 'kvm_project', 'post__not_in' => [$id], 'posts_per_page' => 2, 'orderby' => 'menu_order', 'order' => 'ASC']);
    echo '<div class="related-projects">';
    while ($related->have_posts()) { $related->the_post(); echo '<a class="text-link" href="' . esc_url(get_permalink()) . '">' . esc_html(get_the_title()) . ' </a>'; }
    if (!$related->post_count) echo '<p>More projects will be shared here as they are published.</p>';
    echo '</div>'; wp_reset_postdata(); return ob_get_clean();
}
function kvm_service_sections($attributes = []) {
    $items = [
        ['Social media marketing', 'Build a presence with a point of view.', 'Content planning, campaign ideas and social creative built around what your audience cares about.', 'Content strategy / Social creative / Campaign planning'],
        ['Graphic design', 'Make your brand unmistakable.', 'A consistent visual language, from your brand identity to the everyday materials people see and share.', 'Visual identity / Digital design / Marketing collateral'],
        ['SEO', 'Be there when people are looking.', 'Clear content and a considered search foundation that help people discover and understand your business.', 'Search audit / On-page SEO / Content direction'],
        ['Lead generation', 'Turn interest into a conversation.', 'Campaign messaging, creative and landing pages designed around a clear enquiry journey.', 'Campaign strategy / Paid creative / Landing pages'],
    ];
    $copy = (array) ($attributes['serviceCopy'] ?? []);
    foreach ($items as $i => &$item) {
        foreach ([1 => 'heading', 2 => 'description', 3 => 'deliverables'] as $column => $key) {
            $override = $copy[$i . '_' . $key] ?? '';
            if (is_string($override) && trim($override) !== '') $item[$column] = sanitize_textarea_field($override);
        }
    }
    unset($item);
    ob_start(); foreach ($items as $i => $item) : ?>
    <section class="service-row" id="<?php echo esc_attr(sanitize_title($item[0])); ?>" data-reveal><div class="service-visual"><?php echo kvm_studio_picture(['social','identity','search','lead'][$i]); ?></div><div><p class="eyebrow"><?php echo esc_html($item[0]); ?></p><h2><?php echo esc_html($item[1]); ?></h2></div><div><p><?php echo esc_html($item[2]); ?></p><p class="deliverables"><?php echo esc_html($item[3]); ?></p><a class="text-link" href="<?php echo esc_url(add_query_arg('interest', $item[0], home_url('/contact/'))); ?>">Discuss this service </a></div></section>
    <?php endforeach; echo kvm_ad_slot('services'); return ob_get_clean();
}
