<?php
if (!defined('ABSPATH')) exit;

function kvm_studio_defaults() {
    return [
        'intro' => ['label' => 'Enter the studio', 'heading' => 'Ideas become connections.', 'copy' => 'Strategy, design and digital marketing. Connected from the first brief to the moment your brand meets the world.', 'linkText' => 'Start a project', 'linkUrl' => '/#studio-contact', 'length' => 1.5],
        'work' => ['label' => 'Open the work', 'heading' => 'A closer look.', 'copy' => 'Creative thinking, made tangible. Explore the work and the ideas behind it.', 'linkText' => 'Explore all work', 'linkUrl' => '/work/', 'length' => 2.5],
        'services' => ['label' => 'Connect the disciplines', 'heading' => 'Different disciplines. Shared direction.', 'copy' => 'Four ways to bring your brand into focus.', 'linkText' => 'Explore our services', 'linkUrl' => '/services/', 'length' => 3],
        'process' => ['label' => 'From brief to launch', 'heading' => 'Good work starts with good questions.', 'copy' => 'Understand the challenge. Give the idea a clear expression. Put it into the right places, then learn from what happens.', 'linkText' => 'Our approach', 'linkUrl' => '/about/', 'length' => 1.5],
        'studio' => ['label' => 'Meet Konnect', 'heading' => 'One connected studio.', 'copy' => 'We bring social media, design, SEO and lead generation into one conversation. For Indian businesses and creative teams ready to take their next step.', 'linkText' => 'Get to know us', 'linkUrl' => '/about/', 'length' => 1],
        'contact' => ['label' => 'Your next chapter', 'heading' => 'What could we make together?', 'copy' => 'A new identity. A better presence. A campaign with a clear purpose. Bring us your brief.', 'linkText' => 'Start a conversation', 'linkUrl' => '/contact/', 'length' => 1.5],
    ];
}
function kvm_studio_services() {
    return [
        ['title' => 'Social media marketing', 'copy' => 'A presence with a point of view. Content strategy, social creative and campaign planning.', 'slug' => 'social-media-marketing', 'image' => 'social'],
        ['title' => 'Graphic design', 'copy' => 'Shape, colour and character. Visual identity, digital design and marketing materials.', 'slug' => 'graphic-design', 'image' => 'identity'],
        ['title' => 'SEO', 'copy' => 'A clearer digital foundation. Search audits, on-page SEO and considered content.', 'slug' => 'seo', 'image' => 'search'],
        ['title' => 'Lead generation', 'copy' => 'Turn interest into a conversation. Campaign strategy, paid creative and focused landing pages.', 'slug' => 'lead-generation', 'image' => 'lead'],
    ];
}
function kvm_studio_asset($file) { return get_theme_file_uri('/assets/studio/' . $file); }
function kvm_studio_picture($name, $id = 0, $mobile = 0, $priority = false, $class = '') {
    if ($id && wp_attachment_is_image($id)) {
        $source = $mobile && wp_attachment_is_image($mobile) ? '<source media="(max-width:767px)" srcset="' . esc_url(wp_get_attachment_image_url($mobile, 'large')) . '">' : '';
        return '<picture class="' . esc_attr($class) . '">' . $source . wp_get_attachment_image($id, 'full', false, ['alt' => '', 'loading' => $priority ? 'eager' : 'lazy', 'fetchpriority' => $priority ? 'high' : 'auto']) . '</picture>';
    }
    $has_mobile = in_array($name, ['intro', 'work', 'process', 'studio', 'contact'], true);
    $src = kvm_studio_asset($name . '.webp');
    $mobile_src = $mobile && wp_attachment_is_image($mobile) ? wp_get_attachment_image_url($mobile, 'large') : ($has_mobile ? kvm_studio_asset($name . '-mobile.webp') : $src);
    return '<picture class="' . esc_attr($class) . '"><source media="(max-width: 767px)" srcset="' . esc_url($mobile_src) . '"><img src="' . esc_url($src) . '" width="1440" height="900" alt="" ' . ($priority ? 'fetchpriority="high" loading="eager"' : 'loading="lazy"') . ' decoding="async"></picture>';
}
function kvm_studio_projects($ids = []) {
    $ids = array_slice(array_filter(array_map('absint', (array) $ids)), 0, 2);
    $args = ['post_type' => 'kvm_project', 'post_status' => 'publish', 'posts_per_page' => 2, 'orderby' => $ids ? 'post__in' : ['menu_order' => 'ASC', 'date' => 'DESC']];
    if ($ids) $args['post__in'] = $ids;
    if (!kvm_is_local()) $args['meta_query'] = [['relation' => 'OR', ['key' => '_kvm_placeholder', 'compare' => 'NOT EXISTS'], ['key' => '_kvm_placeholder', 'value' => '1', 'compare' => '!=']]];
    return get_posts($args);
}
function kvm_studio_pattern() {
    $content = '<!-- wp:konnect/studio-story -->';
    foreach (kvm_studio_defaults() as $chapter => $defaults) {
        unset($defaults['length']);
        $content .= '<!-- wp:konnect/story-chapter ' . wp_json_encode(array_merge(['chapter' => $chapter], $defaults)) . ' /-->';
    }
    return $content . '<!-- /wp:konnect/studio-story -->';
}
add_action('init', function () {
    register_block_type('konnect/studio-story', ['api_version' => 3, 'supports' => ['html' => false, 'multiple' => false], 'render_callback' => 'kvm_render_studio']);
    register_block_type('konnect/story-chapter', ['api_version' => 3, 'parent' => ['konnect/studio-story'], 'supports' => ['html' => false, 'reusable' => false], 'attributes' => [
        'chapter' => ['type' => 'string', 'default' => 'intro'],
        'label' => ['type' => 'string'], 'heading' => ['type' => 'string'], 'copy' => ['type' => 'string'],
        'linkText' => ['type' => 'string'], 'linkUrl' => ['type' => 'string'],
        'posterId' => ['type' => 'number', 'default' => 0], 'mobilePosterId' => ['type' => 'number', 'default' => 0],
        'projectIds' => ['type' => 'array', 'default' => [], 'items' => ['type' => 'number']],
        'serviceCopy' => ['type' => 'object', 'default' => (object) []],
    ], 'render_callback' => 'kvm_render_story_chapter']);
});
function kvm_render_studio($attributes, $content) {
    $nav = '';
    foreach (kvm_studio_defaults() as $key => $item) $nav .= '<a href="#studio-' . $key . '" data-chapter-link="' . $key . '"><span>' . esc_html($item['label']) . '</span></a>';
    $interactive = is_front_page();
    return '<div class="studio-story' . ($interactive ? '' : ' is-static') . '" ' . ($interactive ? 'data-studio' : 'data-studio-static') . ' data-assets="' . esc_url(kvm_studio_asset('')) . '"><div class="studio-stage" aria-hidden="true"><canvas class="studio-canvas" tabindex="-1"></canvas></div><nav class="chapter-nav" aria-label="Studio chapters">' . $nav . '</nav>' . $content . '</div>';
}
function kvm_render_story_chapter($attributes) {
    $defaults = kvm_studio_defaults(); $key = $attributes['chapter'] ?? 'intro';
    if (!isset($defaults[$key])) return '';
    $a = array_merge($defaults[$key], $attributes); $index = array_search($key, array_keys($defaults), true) + 1;
    if (is_front_page() && $key === 'intro' && $a['linkUrl'] === '/contact/') $a['linkUrl'] = '/#studio-contact';
    foreach (['label','heading','copy','linkText','linkUrl'] as $field) if (!is_string($a[$field])) $a[$field] = $defaults[$key][$field];
    $projects = $key === 'work' ? kvm_studio_projects($a['projectIds'] ?? []) : [];
    $length = $key === 'work' ? max(1, count($projects) * 1.25) : $a['length'];
    $data = [];
    foreach ($projects as $project) $data[] = ['image' => get_the_post_thumbnail_url($project, 'large') ?: '', 'title' => get_the_title($project), 'url' => get_permalink($project)];
    ob_start(); ?>
    <section id="studio-<?php echo esc_attr($key); ?>" class="story-chapter chapter-<?php echo esc_attr($key); ?>" data-chapter="<?php echo esc_attr($key); ?>" data-length="<?php echo esc_attr($length); ?>" <?php if ($key === 'work') echo 'data-projects="' . esc_attr(wp_json_encode($data)) . '"'; ?> aria-labelledby="title-<?php echo esc_attr($key); ?>" style="--chapter-length:<?php echo esc_attr($length); ?>">
      <?php echo kvm_studio_picture($key === 'services' ? 'social' : $key, absint($a['posterId'] ?? 0), absint($a['mobilePosterId'] ?? 0), $key === 'intro', 'chapter-poster'); ?>
      <div class="chapter-body">
        <div class="chapter-lead">
        <p class="chapter-kicker"><span>0<?php echo $index; ?></span> <?php echo esc_html($a['label']); ?></p>
        <?php if ($key === 'intro') : ?><p class="studio-wordmark" aria-hidden="true">KONNECT</p><?php endif; ?>
        <<?php echo $key === 'intro' ? 'h1' : 'h2'; ?> id="title-<?php echo esc_attr($key); ?>" class="chapter-title"><?php echo esc_html($a['heading']); ?></<?php echo $key === 'intro' ? 'h1' : 'h2'; ?>>
        <p class="chapter-copy"><?php echo nl2br(esc_html($a['copy'])); ?></p>
        </div>
        <?php if ($key === 'work') : ?><div class="story-projects">
          <?php foreach ($projects as $project) : $demo = get_post_meta($project->ID, '_kvm_placeholder', true); ?>
            <a class="story-project" href="<?php echo esc_url(get_permalink($project)); ?>"><div class="story-project-image"><?php echo has_post_thumbnail($project) ? get_the_post_thumbnail($project, 'large', ['loading' => 'lazy']) : kvm_studio_picture(get_post_meta($project->ID, '_kvm_art', true) === 'identity' ? 'identity' : 'social'); ?></div><div><h3><?php echo esc_html(get_the_title($project)); ?></h3><p><?php echo $demo ? 'Design study · Not client work' : esc_html(wp_strip_all_tags(get_the_term_list($project->ID, 'kvm_service', '', ' / '))); ?></p></div><span class="project-arrow" aria-hidden="true">↗</span></a>
          <?php endforeach; if (!$projects) : ?><p class="empty-state">Our portfolio is being prepared. Let’s talk about what we could create for your business.</p><?php endif; ?>
        </div><?php endif; ?>
        <?php if ($key === 'services') : ?><div class="studio-services">
          <?php foreach (kvm_studio_services() as $i => $service) : $overrides = (array) ($a['serviceCopy'] ?? []); ?>
            <article data-service-beat="<?php echo esc_attr($service['image']); ?>"><?php echo kvm_studio_picture($service['image'], 0, 0, false, 'service-poster'); ?><p class="eyebrow">0<?php echo $i + 1; ?> / <?php echo esc_html($service['title']); ?></p><h3><?php echo esc_html($overrides[$i . '_heading'] ?? $service['title']); ?></h3><p><?php echo esc_html($overrides[$i . '_copy'] ?? $service['copy']); ?></p><a class="text-link" href="<?php echo esc_url(home_url('/services/#' . $service['slug'])); ?>">Explore the service <span aria-hidden="true">↗</span></a></article>
          <?php endforeach; ?>
        </div><?php endif; ?>
        <?php if ($key === 'process') : ?><ol class="story-process"><li>Understand</li><li>Create</li><li>Connect</li></ol><?php endif; ?>
        <?php if ($key !== 'contact') : ?><a class="<?php echo $key === 'intro' ? 'button button-red' : 'text-link'; ?>" href="<?php echo esc_url(str_starts_with($a['linkUrl'], '/') ? home_url($a['linkUrl']) : $a['linkUrl']); ?>"><?php echo esc_html($a['linkText']); ?> <span aria-hidden="true">↗</span></a><?php endif; ?>
        <?php if ($key === 'intro') : ?><a class="studio-skip" href="#studio-work">View work <span aria-hidden="true">↓</span></a><?php endif; ?>
        <?php if ($key === 'contact') : ?><div class="chapter-enquiry"><p class="eyebrow">A few details to begin</p><?php echo do_blocks('<!-- wp:konnect/enquiry /-->'); ?><?php echo do_blocks('<!-- wp:konnect/business-contact /-->'); ?></div><?php endif; ?>
      </div>
    </section>
    <?php return ob_get_clean();
}

// Explicit migration only. Never called on init or ordinary page requests.
function kvm_normalize_studio_urls() {
    $updated = [];
    foreach (get_posts(['post_type' => 'page', 'post_status' => 'any', 'posts_per_page' => -1]) as $page) {
        $content = preg_replace('~https?://[^/\s"<>]+(/wp-content/themes/konnect/assets/studio/[a-z-]+\.webp)~', '$1', $page->post_content);
        if ($content !== $page->post_content) { wp_save_post_revision($page->ID); wp_update_post(['ID' => $page->ID, 'post_content' => wp_slash($content)]); $updated[] = $page->ID; }
    }
    return $updated;
}
function kvm_migrate_studio($replace = false) {
    if (!$replace && get_option('kvm_studio_version') === '2') return ['status' => 'already-current'];
    $updated = []; $preserved = [];
    foreach (['home','work','services','about','contact','campaign'] as $slug) {
        $page = get_page_by_path($slug);
        if (!$page) continue;
        if (trim($page->post_content) === trim(kvm_page_content($slug))) continue;
        $old = kvm_legacy_page_content($slug);
        if (!$replace && trim($page->post_content) !== trim($old)) { $preserved[] = $slug; continue; }
        wp_save_post_revision($page->ID);
        $result = wp_update_post(['ID' => $page->ID, 'post_content' => wp_slash(kvm_page_content($slug))], true);
        if (is_wp_error($result)) return $result;
        $updated[] = $slug;
    }
    if (!$preserved) update_option('kvm_studio_version', '2');
    return ['status' => $preserved ? 'custom-content-preserved' : 'migrated', 'updated' => $updated, 'preserved' => $preserved];
}
