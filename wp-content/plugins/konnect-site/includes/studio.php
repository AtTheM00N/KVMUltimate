<?php
if (!defined('ABSPATH')) exit;

function kvm_studio_defaults() {
    return [
        'intro' => ['label' => 'Konnect', 'heading' => 'KONNECT', 'copy' => 'Creative direction. Digital presence.', 'linkText' => 'Start a project', 'linkUrl' => '/#studio-contact', 'length' => 1.5],
        'work' => ['label' => 'Work', 'heading' => 'Made to connect', 'copy' => '', 'linkText' => 'All work', 'linkUrl' => '/work/', 'length' => 2.5],
        'services' => ['label' => 'Services', 'heading' => 'What we do', 'copy' => '', 'linkText' => '', 'linkUrl' => '/services/', 'length' => 4],
        'process' => ['label' => 'Process', 'heading' => 'Understand. Create. Connect.', 'copy' => '', 'linkText' => '', 'linkUrl' => '/about/', 'length' => 1.5],
        'studio' => ['label' => 'Studio', 'heading' => 'Different skills. One studio.', 'copy' => 'A creative and digital marketing partner for Indian businesses.', 'linkText' => 'Meet Konnect', 'linkUrl' => '/about/', 'length' => 1.5],
        'contact' => ['label' => 'Contact', 'heading' => 'Make contact', 'copy' => '', 'linkText' => '', 'linkUrl' => '/contact/', 'length' => 1.5],
    ];
}
function kvm_studio_services() {
    return [
        ['title' => 'Social', 'copy' => 'Social strategy and content with a point of view.', 'slug' => 'social-media-marketing', 'image' => 'social'],
        ['title' => 'Design', 'copy' => 'Identities and visual worlds built around your brand.', 'slug' => 'graphic-design', 'image' => 'identity'],
        ['title' => 'Search', 'copy' => 'Search strategy that helps the right people find you.', 'slug' => 'seo', 'image' => 'search'],
        ['title' => 'Campaigns', 'copy' => 'Paid creative and landing pages that invite a conversation.', 'slug' => 'lead-generation', 'image' => 'lead'],
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
    $interactive = is_front_page();
    return '<div class="studio-story' . ($interactive ? '' : ' is-static') . '" ' . ($interactive ? 'data-studio' : 'data-studio-static') . '><div class="scroll-stage" aria-hidden="true"><div class="scroll-field"></div><img class="scroll-mark" src="' . esc_url(kvm_studio_asset('mark.svg')) . '" alt="" width="900" height="1100"></div>' . $content . '</div>';
}
function kvm_render_story_chapter($attributes) {
    $defaults=kvm_studio_defaults(); $key=$attributes['chapter']??'intro';
    if(!isset($defaults[$key]))return '';
    $a=array_merge($defaults[$key],$attributes);
    foreach(['heading','copy','linkText','linkUrl'] as $field)if(!is_string($a[$field]))$a[$field]=$defaults[$key][$field];
    $projects=$key==='work'?kvm_studio_projects($a['projectIds']??[]):[];
    $data=[]; foreach($projects as $project)$data[]=['image'=>get_the_post_thumbnail_url($project,'large')?:'','title'=>get_the_title($project),'url'=>get_permalink($project)];
    $length=$key==='work'?max(1,count($projects)*1.25):$a['length'];
    ob_start(); ?>
    <section id="studio-<?php echo esc_attr($key); ?>" class="story-chapter chapter-<?php echo esc_attr($key); ?>" data-chapter="<?php echo esc_attr($key); ?>" data-length="<?php echo esc_attr($length); ?>" <?php if($key==='work')echo 'data-projects="'.esc_attr(wp_json_encode($data)).'"'; ?> aria-labelledby="title-<?php echo esc_attr($key); ?>" style="--chapter-length:<?php echo esc_attr($length); ?>">
    <?php echo kvm_studio_picture($key==='services'?'social':$key,absint($a['posterId']??0),absint($a['mobilePosterId']??0),$key==='intro','chapter-poster'); ?>
    <div class="chapter-body">
      <div class="chapter-lead<?php echo in_array($key,['services','process'])?' screen-reader-text':''; ?>">
      <<?php echo $key==='intro'?'h1':'h2'; ?> id="title-<?php echo esc_attr($key); ?>" class="chapter-title"><?php echo esc_html($a['heading']); ?></<?php echo $key==='intro'?'h1':'h2'; ?>>
      <?php if(trim($a['copy'])): ?><p class="chapter-copy"><?php echo nl2br(esc_html($a['copy'])); ?></p><?php endif; ?>
      </div>
      <?php if($key==='intro'): ?><div class="hero-actions"><a href="#studio-work">Work</a><a class="button button-red" href="<?php echo esc_url($a['linkUrl']); ?>"><?php echo esc_html($a['linkText']); ?></a></div><?php endif; ?>
      <?php if($key==='work'): ?><div class="story-projects">
        <?php foreach($projects as $i=>$project): ?><a class="story-project" data-project-beat="<?php echo $i; ?>" href="<?php echo esc_url(get_permalink($project)); ?>"><div class="story-project-image"><?php echo has_post_thumbnail($project)?get_the_post_thumbnail($project,'large',['loading'=>'lazy']):kvm_studio_picture($i?'identity':'social'); ?></div><div class="project-caption"><h3><?php echo esc_html(get_the_title($project)); ?></h3><?php if(get_post_meta($project->ID,'_kvm_placeholder',true)): ?><p>Konnect design study · Not client work</p><?php endif; ?></div></a><?php endforeach; ?>
        <?php if(!$projects): ?><div class="work-art"><?php echo kvm_studio_picture('work'); ?></div><p class="empty-state">Konnect visual studies. Client portfolio coming soon.</p><?php endif; ?>
      </div><?php if($a['linkText']): ?><a class="work-index-link" href="<?php echo esc_url($a['linkUrl']); ?>"><?php echo esc_html($a['linkText']); ?></a><?php endif; ?><?php endif; ?>
      <?php if($key==='services'): ?><div class="studio-services">
        <?php foreach(kvm_studio_services() as $i=>$service): $overrides=(array)($a['serviceCopy']??[]); foreach(['heading'=>'title','copy'=>'copy'] as $field=>$fallback) if(!isset($overrides[$i.'_'.$field]) || !is_string($overrides[$i.'_'.$field])) $overrides[$i.'_'.$field]=$service[$fallback]; ?><article data-service-beat="<?php echo esc_attr($service['image']); ?>"><?php echo kvm_studio_picture($service['image'],0,0,false,'service-poster'); ?><div class="service-words"><h3><a href="<?php echo esc_url(home_url('/services/#'.$service['slug'])); ?>"><?php echo esc_html($overrides[$i.'_heading']??$service['title']); ?></a></h3><p><?php echo esc_html($overrides[$i.'_copy']??$service['copy']); ?></p></div></article><?php endforeach; ?>
      </div><?php endif; ?>
      <?php if($key==='process'): ?><div class="story-process" aria-hidden="true"><?php foreach(preg_split('/(?<=[.!?])\s+/u',trim($a['heading'])) as $word) echo '<span>'.esc_html($word).'</span>'; ?></div><?php endif; ?>
      <?php if($key==='studio' && $a['linkText']): ?><a class="button" href="<?php echo esc_url($a['linkUrl']); ?>"><?php echo esc_html($a['linkText']); ?></a><?php endif; ?>
      <?php if($key==='contact'): ?><div class="chapter-enquiry"><?php echo do_blocks('<!-- wp:konnect/enquiry /--><!-- wp:konnect/business-contact /-->'); ?></div><?php endif; ?>
    </div></section>
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
function kvm_remove_legacy_arrows() {
    $updated = [];
    foreach (get_posts(['post_type'=>'page','post_status'=>'any','posts_per_page'=>-1]) as $page) {
        $content = str_replace(['↗','↓','→','↑','←','↘'], '', $page->post_content);
        if ($content !== $page->post_content) {
            wp_save_post_revision($page->ID);
            wp_update_post(['ID'=>$page->ID,'post_content'=>wp_slash($content)]);
            $updated[]=$page->post_name;
        }
    }
    return $updated;
}
function kvm_migrate_studio($replace = false) {
    if (!$replace && get_option('kvm_studio_version') === '3') return ['status' => 'already-current', 'cleaned' => kvm_remove_legacy_arrows()];
    $updated = []; $preserved = [];
    $previous = json_decode(file_get_contents(__DIR__ . '/studio-defaults-v2.json'), true) ?: [];
    foreach (['home','work','services','about','contact','campaign'] as $slug) {
        $page = get_page_by_path($slug);
        if (!$page) continue;
        if (trim($page->post_content) === trim(kvm_page_content($slug))) continue;
        $old = kvm_legacy_page_content($slug);
        if (!$replace && trim($page->post_content) !== trim($old) && !in_array(trim($page->post_content), array_map('trim', $previous[$slug] ?? []), true)) { $preserved[] = $slug; continue; }
        wp_save_post_revision($page->ID);
        $result = wp_update_post(['ID' => $page->ID, 'post_content' => wp_slash(kvm_page_content($slug))], true);
        if (is_wp_error($result)) return $result;
        $updated[] = $slug;
    }
    if (!$preserved) update_option('kvm_studio_version', '3');
    return ['cleaned' => kvm_remove_legacy_arrows(), 'status' => $preserved ? 'custom-content-preserved' : 'migrated', 'updated' => $updated, 'preserved' => $preserved];
}
