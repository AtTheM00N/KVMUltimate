<?php
if (!defined('ABSPATH')) exit;
$chapters = kvm_studio_defaults();
$collect = function ($blocks) use (&$collect, &$chapters) {
    foreach ($blocks as $block) {
        if ($block['blockName'] === 'konnect/story-chapter') {
            $key = $block['attrs']['chapter'] ?? '';
            if (isset($chapters[$key])) $chapters[$key] = array_merge($chapters[$key], $block['attrs']);
        }
        if (!empty($block['innerBlocks'])) $collect($block['innerBlocks']);
    }
};
$collect(parse_blocks(get_post_field('post_content', get_queried_object_id())));
foreach ($chapters as &$chapter) { $chapter['posterUrl'] = !empty($chapter['posterId']) ? wp_get_attachment_image_url(absint($chapter['posterId']), 'full') : ''; $chapter['mobilePosterUrl'] = !empty($chapter['mobilePosterId']) ? wp_get_attachment_image_url(absint($chapter['mobilePosterId']), 'full') : ''; } unset($chapter);
$chapters['work']['projects'] = [];
foreach (kvm_studio_projects($chapters['work']['projectIds'] ?? []) as $project) {
 $chapters['work']['projects'][] = ['title'=>html_entity_decode(get_the_title($project), ENT_QUOTES, get_bloginfo('charset')),'url'=>get_permalink($project),'image'=>get_the_post_thumbnail_url($project,'large') ?: kvm_studio_asset((get_post_meta($project->ID,'_kvm_art',true) ?: 'social').'.webp'),'study'=>(bool)get_post_meta($project->ID,'_kvm_placeholder',true)];
}
ob_start(); wp_head();
$head = ob_get_clean() . '<script>window.konnectContent=' . wp_json_encode($chapters, JSON_HEX_TAG | JSON_HEX_AMP | JSON_HEX_APOS | JSON_HEX_QUOT) . ';</script>';
$contact = '<dialog id="konnect-contact" aria-labelledby="konnect-contact-title"><button type="button" class="konnect-close" aria-label="Close enquiry">Close</button><h2 id="konnect-contact-title">' . esc_html($chapters['contact']['heading']) . '</h2>' . do_blocks('<!-- wp:konnect/enquiry /--><!-- wp:konnect/business-contact /-->') . '</dialog>';
$fallback = '<main id="konnect-fallback"><a href="#konnect-content">Skip to content</a><nav aria-label="Main navigation"><a href="/work/">Work</a><a href="/services/">Services</a><a href="/about/">Studio</a><a href="/contact/">Contact</a></nav><div id="konnect-content">' . do_blocks(get_post_field('post_content', get_queried_object_id())) . '</div></main>';
ob_start(); wp_footer(); $foot = ob_get_clean();
$document = file_get_contents(__DIR__ . '/assets/pocket/document.html');
$document = preg_replace('~<title>.*?</title>~s', '<title>Konnect Vision Media — Creative direction. Digital presence.</title>', $document);
$document = preg_replace('~<meta name="description"[^>]+>~', '', $document);
echo str_replace(['<!-- KONNECT_HEAD -->', '<!-- KONNECT_CONTACT -->', '<!-- KONNECT_FALLBACK -->', '<!-- KONNECT_FOOT -->'], [$head, $contact, $fallback, $foot], $document);
