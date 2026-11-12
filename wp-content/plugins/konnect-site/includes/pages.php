<?php
if (!defined('ABSPATH')) exit;
function kvm_studio_image_block($name, $alt, $class = '') {
    // Theme-owned images remain portable between maintenance and preview ports.
    $url = wp_parse_url(kvm_studio_asset($name . '.webp'), PHP_URL_PATH);
    return '<!-- wp:image ' . wp_json_encode(['sizeSlug' => 'full', 'linkDestination' => 'none', 'className' => 'studio-still ' . $class]) . ' --><figure class="wp-block-image size-full studio-still ' . esc_attr($class) . '"><img src="' . esc_url($url) . '" alt="' . esc_attr($alt) . '" width="1440" height="900" loading="lazy"/></figure><!-- /wp:image -->';
}
function kvm_page_content($slug) {
    if ($slug === 'home') return kvm_studio_pattern();
    if ($slug === 'work') return kvm_intro('Selected work', 'Selected work', '') . '<!-- wp:konnect/projects {"filters":true} /-->' . kvm_cta();
    if ($slug === 'services') return kvm_intro('Four connected disciplines', 'What we do', '') . '<!-- wp:konnect/services /-->' . kvm_cta();
    if ($slug === 'about') return kvm_intro('Konnect Vision Media', 'One connected studio', 'A creative partner for Indian businesses and teams with something to put into the world.') .
        kvm_studio_image_block('studio', 'One studio: original Konnect typography artwork', 'about-studio') .
        kvm_paragraph('Good work happens when the right ideas come together. We connect social media marketing, graphic design, SEO and lead generation around the people you want to reach.', 'about-intro') .
        kvm_html('<div class="about-principles"><section><h2>Understand first.</h2><p>Your audience, business and brief give the work its direction. We start with questions.</p></section><section><h2>Make it count.</h2><p>Every word, image and interaction should help the idea communicate.</p></section><section><h2>Think together.</h2><p>Brand, content and campaigns become stronger when they share a clear point of view.</p></section><section><h2>Keep learning.</h2><p>Feedback is part of the process. We use it to shape the next step.</p></section></div>') . kvm_cta();
    if ($slug === 'contact') return kvm_intro('Bring us your brief', 'Make contact', 'Tell us what you have in mind.') .
        kvm_group(kvm_group(kvm_studio_image_block('contact', 'Hello: original Konnect typography artwork') . kvm_heading('Let’s make<br>a connection.') . kvm_paragraph('Share the essentials and we’ll use them to start a conversation about your project.') . '<!-- wp:konnect/business-contact /-->', 'contact-copy') . '<!-- wp:konnect/enquiry /-->', 'contact-layout');
    if ($slug === 'campaign') return kvm_intro('Creative campaigns. Clear next steps.', 'Give your next<br>campaign direction.', 'Connect the message, the creative and the landing page around one clear goal: a conversation with the right people.') .
        kvm_studio_image_block('lead', 'Let’s talk: original Konnect campaign artwork', 'campaign-still') .
        kvm_html('<div class="campaign-benefits"><section><h2>Know your audience.</h2><p>Define who you want to reach and what matters to them.</p></section><section><h2>Connect the message.</h2><p>Bring campaign copy and creative into a shared direction.</p></section><section><h2>Make the next step clear.</h2><p>Give interested visitors a focused way to enquire.</p></section></div>') . kvm_heading('Explore the creative direction.') . '<!-- wp:konnect/projects {"limit":2} /-->' . kvm_heading('Tell us what you have in mind.') . '<!-- wp:konnect/enquiry /-->';
    return kvm_legacy_page_content($slug);
}
