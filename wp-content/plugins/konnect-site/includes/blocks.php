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
function kvm_featured_seo_case_study() {
    $projects = get_posts([
        'post_type' => 'kvm_project',
        'post_status' => 'publish',
        'posts_per_page' => 1,
        'has_password' => false,
        'orderby' => ['menu_order' => 'ASC', 'date' => 'DESC'],
        'tax_query' => [['taxonomy' => 'kvm_service', 'field' => 'slug', 'terms' => 'seo']],
        'meta_query' => [
            ['key' => '_kvm_results_verified', 'value' => '1'],
            ['key' => '_kvm_results', 'value' => '', 'compare' => '!='],
            ['relation' => 'OR', ['key' => '_kvm_placeholder', 'compare' => 'NOT EXISTS'], ['key' => '_kvm_placeholder', 'value' => '1', 'compare' => '!=']],
        ],
    ]);
    return $projects[0] ?? null;
}

function kvm_render_seo_case_feature($project) {
    $results = trim(get_post_meta($project->ID, '_kvm_results', true));
    $summary = preg_split('/\R\s*\R/', $results, 2)[0];
    ob_start(); ?>
    <article class="seo-case-feature">
      <div>
        <p class="work-label">Featured SEO case study</p>
        <h2><?php echo esc_html(get_the_title($project)); ?></h2>
      </div>
      <div class="seo-case-feature-copy">
        <p class="work-feature-result"><?php echo esc_html(wp_trim_words($summary, 24)); ?></p>
        <?php if ($project->post_excerpt) : ?><p><?php echo esc_html(wp_strip_all_tags($project->post_excerpt)); ?></p><?php endif; ?>
        <a class="text-link" href="<?php echo esc_url(get_permalink($project)); ?>">Read the SEO case study</a>
      </div>
    </article>
    <?php return ob_get_clean();
}

function kvm_work_index($limit = 0) {
    $requested_service = $_GET['service'] ?? '';
    $filter = is_string($requested_service) ? sanitize_title(wp_unslash($requested_service)) : '';
    $work_url = home_url('/work/');
    $projects = (new WP_Query([
        'post_type' => 'kvm_project',
        'post_status' => 'publish',
        'has_password' => false,
        'posts_per_page' => -1,
        'no_found_rows' => true,
        'orderby' => ['menu_order' => 'ASC', 'date' => 'DESC'],
        'meta_query' => [['relation' => 'OR',
            ['key' => '_kvm_placeholder', 'compare' => 'NOT EXISTS'],
            ['key' => '_kvm_placeholder', 'value' => '1', 'compare' => '!='],
        ]],
    ]))->posts;
    $services = [];
    $visible_projects = [];
    foreach ($projects as $project) {
        $terms = get_the_terms($project, 'kvm_service');
        $terms = is_array($terms) ? $terms : [];
        foreach ($terms as $term) $services[$term->slug] = $term->name;
        if (!$filter || in_array($filter, wp_list_pluck($terms, 'slug'), true)) {
            $visible_projects[] = ['post' => $project, 'services' => wp_list_pluck($terms, 'name')];
        }
    }
    natcasesort($services);
    $case_study = !$limit && (!$filter || $filter === 'seo') ? kvm_featured_seo_case_study() : null;
    ob_start();
    if (count($services) > 1 || $filter) : ?>
        <nav class="work-filters" aria-label="Filter projects by service">
          <a href="<?php echo esc_url($work_url); ?>" <?php if (!$filter) echo 'aria-current="page"'; ?>>All work</a>
          <?php foreach ($services as $slug => $label) : ?>
            <a href="<?php echo esc_url(add_query_arg('service', $slug, $work_url)); ?>" <?php if ($filter === $slug) echo 'aria-current="page"'; ?>><?php echo esc_html($label); ?></a>
          <?php endforeach; ?>
        </nav>
    <?php endif;
    if ($case_study) echo kvm_render_seo_case_feature($case_study);
    $rows = array_filter($visible_projects, function ($entry) use ($case_study) {
        return !$case_study || $entry['post']->ID !== $case_study->ID;
    });
    if ($limit) $rows = array_slice($rows, 0, $limit);
    if ($rows) : ?>
        <section class="work-projects">
          <h2><?php echo $case_study ? 'More work' : 'Projects'; ?></h2>
          <ul class="work-project-list">
            <?php foreach ($rows as $entry) :
                $project = $entry['post'];
                $excerpt = wp_strip_all_tags($project->post_excerpt);
            ?>
              <li>
                <a class="work-project-row" href="<?php echo esc_url(get_permalink($project)); ?>">
                  <?php if (has_post_thumbnail($project)) echo get_the_post_thumbnail($project, 'medium', ['class' => 'work-project-thumb', 'alt' => '', 'loading' => 'lazy']); ?>
                  <div class="work-project-title">
                    <?php if ($entry['services']) : ?><p class="work-label"><?php echo esc_html(implode(' · ', $entry['services'])); ?></p><?php endif; ?>
                    <h3><?php echo esc_html(get_the_title($project)); ?></h3>
                  </div>
                  <?php if ($excerpt) : ?><p class="work-project-excerpt"><?php echo esc_html($excerpt); ?></p><?php endif; ?>
                </a>
              </li>
            <?php endforeach; ?>
          </ul>
        </section>
    <?php elseif (!$case_study) : ?>
        <p class="empty-state"><?php echo $filter ? 'No work has been published for this service yet.' : 'New work is being prepared.'; ?>
          <?php if ($filter) : ?><a href="<?php echo esc_url($work_url); ?>">See all work</a>.<?php endif; ?>
        </p>
    <?php endif;
    return ob_get_clean();
}

function kvm_projects($attributes = []) {
    $limit = max(0, intval($attributes['limit'] ?? 0));
    if (!empty($attributes['filters'])) return kvm_work_index($limit);
    $query = new WP_Query(['post_type' => 'kvm_project', 'post_status' => 'publish', 'posts_per_page' => $limit ?: -1, 'orderby' => ['menu_order' => 'ASC', 'date' => 'DESC']]);
    ob_start();
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
    if (post_password_required($id)) return ob_get_clean();
    $is_demo = (bool) get_post_meta($id, '_kvm_placeholder', true);
    $is_seo = !$is_demo && has_term('seo', 'kvm_service', $id);
    if ($is_demo) echo '<p class="preview-notice">Original Konnect design study. Illustrative work, not a client commission.</p>';
    if ($is_seo && has_excerpt($id)) echo '<p class="seo-case-summary">' . esc_html(get_post_field('post_excerpt', $id)) . '</p>';
    if (has_post_thumbnail($id) || !$is_seo) {
        echo '<div class="project-cover">';
        if (has_post_thumbnail($id)) echo get_the_post_thumbnail($id, 'full'); else echo kvm_art(get_post_meta($id, '_kvm_art', true), true);
        echo '</div>';
    }
    echo '<div class="project-story">';
    foreach (['brief' => 'The brief', 'scope' => 'What we worked on', 'approach' => 'The approach'] as $key => $label) {
        $value = get_post_meta($id, '_kvm_' . $key, true);
        if ($value) echo '<section><h2>' . esc_html($label) . '</h2><p>' . nl2br(esc_html($value)) . '</p></section>';
    }
    $results = get_post_meta($id, '_kvm_results', true);
    $verified = (bool) get_post_meta($id, '_kvm_results_verified', true);
    $editor_preview = $is_seo && is_preview() && current_user_can('edit_post', $id);
    if (!$is_seo && $verified && $results) echo '<section><h2>Verified results</h2><p>' . nl2br(esc_html($results)) . '</p></section>';
    echo '</div>';
    if ($is_seo && $results && ($verified || $editor_preview)) {
        echo '<section class="seo-case-results"><h2>' . ($verified ? 'Verified results' : 'Draft results') . '</h2>';
        foreach (preg_split('/\R\s*\R/', trim($results)) as $paragraph) echo '<p>' . nl2br(esc_html($paragraph)) . '</p>';
        echo '</section>';
    }
    echo '<div class="project-gallery">';
    foreach (array_filter(array_map('absint', explode(',', get_post_meta($id, '_kvm_gallery', true)))) as $image) echo wp_get_attachment_image($image, 'large', false, ['loading' => 'lazy']);
    echo '</div>';
    if (!$is_demo) echo kvm_ad_slot('project');
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
    $case_study = kvm_featured_seo_case_study();
    $menu_id = wp_unique_id('services-menu-');
    ob_start(); ?>
    <div class="services-menu">
      <nav aria-label="Services">
        <div class="services-menu-list">
          <?php foreach ($items as [$name]) : $slug = sanitize_title($name); ?>
            <a class="services-menu-choice" id="<?php echo esc_attr($menu_id . '-choice-' . $slug); ?>" href="#<?php echo esc_attr($slug); ?>"><?php echo esc_html($name); ?></a>
          <?php endforeach; ?>
        </div>
      </nav>
      <div class="services-menu-panels">
        <?php foreach ($items as [$name, $heading, $description, $deliverables]) :
            $slug = sanitize_title($name);
            $heading_id = $menu_id . '-title-' . $slug;
            $included = preg_split('/(?:\h+\/\h+|\R)+/u', $deliverables, -1, PREG_SPLIT_NO_EMPTY);
            $enquiry_url = add_query_arg('interest', $name, home_url('/contact/'));
        ?>
          <section class="services-menu-panel" id="<?php echo esc_attr($slug); ?>" aria-labelledby="<?php echo esc_attr($heading_id); ?>">
            <p class="services-menu-label"><?php echo esc_html($name); ?></p>
            <h2 id="<?php echo esc_attr($heading_id); ?>"><?php echo esc_html($heading); ?></h2>
            <p class="services-menu-description"><?php echo esc_html($description); ?></p>
            <?php if ($included) : ?>
              <div class="services-menu-includes">
                <h3>What’s included</h3>
                <ul>
                  <?php foreach ($included as $deliverable) : ?><li><?php echo esc_html(trim($deliverable)); ?></li><?php endforeach; ?>
                </ul>
              </div>
            <?php endif; ?>
            <div class="services-menu-links">
              <a class="services-menu-enquiry" href="<?php echo esc_url($enquiry_url); ?>">Enquire about <?php echo esc_html($name === 'SEO' ? $name : strtolower($name)); ?></a>
              <?php if ($slug === 'seo' && $case_study) : ?>
                <a class="text-link" href="<?php echo esc_url(get_permalink($case_study)); ?>">Read the SEO case study</a>
              <?php endif; ?>
            </div>
          </section>
        <?php endforeach; ?>
      </div>
    </div>
    <?php
    echo kvm_ad_slot('services');
    return ob_get_clean();
}
