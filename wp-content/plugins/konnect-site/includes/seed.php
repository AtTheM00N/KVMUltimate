<?php
if (!defined('ABSPATH')) exit;
function kvm_html($html) { return '<!-- wp:html -->' . $html . '<!-- /wp:html -->'; }
function kvm_heading($text, $level = 2, $class = '') {
    return '<!-- wp:heading ' . wp_json_encode(['level' => $level, 'className' => $class]) . ' --><h' . $level . ' class="wp-block-heading ' . esc_attr($class) . '">' . $text . '</h' . $level . '><!-- /wp:heading -->';
}
function kvm_paragraph($text, $class = '') {
    return '<!-- wp:paragraph ' . wp_json_encode(['className' => $class]) . ' --><p class="' . esc_attr($class) . '">' . $text . '</p><!-- /wp:paragraph -->';
}
function kvm_group($content, $class) {
    return '<!-- wp:group ' . wp_json_encode(['className' => $class]) . ' --><div class="wp-block-group ' . esc_attr($class) . '">' . $content . '</div><!-- /wp:group -->';
}
function kvm_cta() {
 return kvm_html('<section class="cta-section"><h2>Have something<br>in mind?</h2><a class="button button-red" href="/#studio-contact">Let’s talk</a></section>');
}
function kvm_intro($eyebrow, $title, $copy) {
 return kvm_group(kvm_heading($title,1).($copy?kvm_paragraph($copy):''),'page-intro');
}
function kvm_legacy_page_content($slug) {
    if ($slug === 'home') return
        kvm_html('<section class="hero"><div class="hero-topline"><p class="eyebrow">Independent thinking. Connected creativity.</p><span>STRATEGY / DESIGN / GROWTH</span></div><div class="hero-layout"><h1>BRANDS WITH<br>SOMETHING<br>TO <em>SAY.</em></h1><div class="hero-sculpture" aria-hidden="true"><div class="sculpture-orbit"></div><div class="sculpture-disc"></div><span class="sculpture-label">CREATE A CONNECTION</span></div></div><div class="hero-bottom"><a class="scroll-cue" href="#selected-work"><span aria-hidden="true">↓</span>Scroll to connect</a><div class="hero-copy"><p>We bring strategy, design and digital marketing together to give your brand a voice that connects.</p><a class="button button-red" href="/contact/">Let’s build your next chapter <span aria-hidden="true">↗</span></a></div><span class="hero-index">KONNECT / 01</span></div></section><div class="service-ribbon"><span>Social media marketing</span><span>Graphic design</span><span>SEO</span><span>Lead generation</span></div>') .
        kvm_group(kvm_html('<div class="section-heading" id="selected-work"><div><p class="eyebrow">A look at the possibilities / 01</p><h2>Work that<br>makes a mark.</h2></div><a class="text-link" href="/work/">Explore the work ↗</a></div>') . '<!-- wp:konnect/projects {"limit":2} /-->', 'section-shell') .
        kvm_group(kvm_group(kvm_paragraph('What we bring / 02', 'eyebrow') . kvm_heading('A clear idea.<br>A bold expression.<br><em>A stronger connection.</em>'), 'intro-statement') . kvm_html('<div class="services-summary"><a class="service-summary-link" href="/services/#social-media-marketing"><div><span>01</span>Social media marketing</div><b aria-hidden="true">↗</b></a><a class="service-summary-link" href="/services/#graphic-design"><div><span>02</span>Graphic design</div><b aria-hidden="true">↗</b></a><a class="service-summary-link" href="/services/#seo"><div><span>03</span>SEO</div><b aria-hidden="true">↗</b></a><a class="service-summary-link" href="/services/#lead-generation"><div><span>04</span>Lead generation</div><b aria-hidden="true">↗</b></a></div>'), 'section-shell') .
        kvm_group(kvm_html('<div class="section-heading"><div><p class="eyebrow">How we get there / 03</p><h2>Good work starts<br>with good questions.</h2></div></div><div class="process-grid"><article class="process-step"><span>01 / UNDERSTAND</span><h3>Find the real story.</h3><p>We start with your business, your audience and the challenge you want to solve.</p></article><article class="process-step"><span>02 / CREATE</span><h3>Give it a clear voice.</h3><p>Strategy becomes a creative direction, with design and messaging working together.</p></article><article class="process-step"><span>03 / CONNECT</span><h3>Put it into the world.</h3><p>We bring the work to the right channels, then use feedback to shape what comes next.</p></article></div>'), 'section-shell process-section') .
        kvm_group(kvm_heading('Creative minds.<br>Shared ambition.') . kvm_group(kvm_paragraph('Konnect Vision Media brings social media marketing, graphic design, SEO and lead generation into one conversation. We work with businesses and creative teams looking for a thoughtful way forward.') . kvm_html('<a class="text-link" href="/about/">Get to know Konnect ↗</a>'), 'about-strip-copy'), 'section-shell about-strip') . kvm_cta();
    if ($slug === 'work') return kvm_intro('Selected work / Konnect Vision Media', 'Ideas made<br>visible.', 'Explore creative directions across brand, content and digital. The studies below are clearly marked preview placeholders while our portfolio is being prepared.') . '<!-- wp:konnect/projects {"filters":true} /-->';
    if ($slug === 'services') return kvm_intro('What we do', 'Every connection<br>starts with intent.', 'Four connected disciplines. One considered approach to how your brand looks, sounds and reaches people.') . '<!-- wp:konnect/services /-->' . kvm_cta();
    if ($slug === 'about') return kvm_intro('Meet Konnect', 'Different skills.<br>Shared direction.', 'Strategy, design and digital marketing, working together.') .
        kvm_paragraph('We’re Konnect Vision Media. We bring creative thinking and clear intent to the way businesses present themselves, reach their audiences and start new conversations.', 'about-intro') .
        kvm_html('<div class="about-principles"><section><h2>Start with understanding.</h2><p>The audience and the business challenge shape the direction. We ask questions before we make things.</p></section><section><h2>Make every element count.</h2><p>Design, words and motion each have a role. We aim for work that is clear, coherent and recognisable.</p></section><section><h2>Think across channels.</h2><p>Your website, social content and campaigns should feel like parts of the same brand.</p></section><section><h2>Keep the conversation open.</h2><p>Thoughtful collaboration helps connect the initial brief to the work that goes into the world.</p></section></div><p class="team-pending">Team profiles will be added once approved biographies and portraits are available.</p>') . kvm_cta();
    if ($slug === 'contact') return kvm_intro('Start a conversation', 'What are you<br>working on?', 'Tell us a little about your business, your idea and where you want to go.') .
        kvm_group(kvm_group(kvm_heading('Let’s find the<br>right direction.') . kvm_paragraph('Share the essentials and we’ll use them to start a conversation about your project.') . '<!-- wp:konnect/business-contact /-->', 'contact-copy') . '<!-- wp:konnect/enquiry /-->', 'contact-layout');
    if ($slug === 'campaign') return kvm_intro('Creative campaigns. Clear next steps.', 'Give your next<br>campaign direction.', 'Connect the message, the creative and the landing page around one clear goal: a conversation with the right people.') .
        kvm_html('<div class="campaign-benefits"><section><h2>Start with the audience.</h2><p>Define who you want to reach and what matters to them.</p></section><section><h2>Connect the message.</h2><p>Bring campaign copy and creative into a shared direction.</p></section><section><h2>Make the next step clear.</h2><p>Give interested visitors a focused way to enquire.</p></section></div>') . kvm_heading('Explore the creative direction.') . '<!-- wp:konnect/projects {"limit":2} /-->' . kvm_heading('Tell us what you have in mind.') . '<!-- wp:konnect/enquiry /-->';
    if ($slug === 'privacy') return kvm_intro('Privacy', 'Your details.<br>Handled with care.', 'Preview notice — business details, retention periods and service providers must be confirmed before launch.') .
        kvm_group(kvm_heading('When you contact us') . kvm_paragraph('The enquiry form collects your name, email, optional phone number, service interest and project brief so the business can respond. Submissions are stored privately in WordPress and a notification is sent to the configured business inbox.') . kvm_heading('Optional measurement and advertising') . kvm_paragraph('Optional analytics and publisher advertising are disabled in this local preview. When configured for launch, they load only after the corresponding cookie preference is enabled. You can change your choice on the cookie preferences page.') . kvm_heading('Before this site goes live') . kvm_paragraph('The business must publish its legal identity and privacy contact, the applicable retention schedule, the actual hosting, email, analytics and advertising providers, and information about requests concerning personal data.') . kvm_html('<a class="text-link" href="/cookie-preferences/">Manage cookie preferences</a>'), 'legal-copy');
    if ($slug === 'cookie-preferences') return kvm_intro('Your choice', 'A clear view<br>of your cookies.', 'Choose which optional functions you want to allow.') . '<!-- wp:konnect/cookie-preferences /-->';
    return '';
}
add_action('init', function () {
    register_block_pattern_category('konnect', ['label' => 'Konnect layouts']);
    foreach (['home', 'work', 'services', 'about', 'contact', 'campaign'] as $slug) register_block_pattern('konnect/' . $slug, ['title' => 'Konnect: ' . ucfirst($slug), 'categories' => ['konnect'], 'content' => kvm_page_content($slug)]);
});
function kvm_seed_site() {
    if (!get_option('kvm_starter_cleaned')) {
        foreach (['sample-page' => 'page', 'hello-world' => 'post'] as $slug => $type) {
            $starter = get_page_by_path($slug, OBJECT, $type);
            if ($starter && in_array($starter->post_title, ['Sample Page', 'Hello world!'], true)) wp_trash_post($starter->ID);
        }
        update_option('kvm_starter_cleaned', '1');
    }
    if (get_option('kvm_seeded')) return;
    update_option('blogname', 'Konnect Vision Media'); update_option('blogdescription', 'Strategy. Design. Connection.');
    update_option('permalink_structure', '/%postname%/'); update_option('blog_public', '0');
    foreach (['home' => 'Home', 'work' => 'Work', 'services' => 'Services', 'about' => 'About', 'contact' => 'Contact', 'campaign' => 'Campaign', 'privacy' => 'Privacy', 'cookie-preferences' => 'Cookie preferences'] as $slug => $title) {
        $id = wp_insert_post(['post_type' => 'page', 'post_status' => 'publish', 'post_title' => $title, 'post_name' => $slug, 'post_content' => wp_slash(kvm_page_content($slug))]);
        if ($slug === 'home') { update_option('show_on_front', 'page'); update_option('page_on_front', $id); }
        if ($slug === 'privacy') update_option('wp_page_for_privacy_policy', $id);
        if ($slug === 'campaign') update_post_meta($id, '_wp_page_template', 'campaign');
    }
    foreach (kvm_services() as $name) if (!term_exists($name, 'kvm_service')) wp_insert_term($name, 'kvm_service');
    foreach ([['The social canvas', 'social', 'Social media marketing'], ['Form & feeling', 'identity', 'Graphic design'], ['A clearer search', 'search', 'SEO']] as $index => $demo) {
        $id = wp_insert_post(['post_type' => 'kvm_project', 'post_status' => 'draft', 'post_title' => $demo[0], 'menu_order' => $index, 'meta_input' => ['_kvm_placeholder' => true, '_kvm_art' => $demo[1], '_kvm_brief' => 'Illustrative preview only. Replace this section with an approved project brief.', '_kvm_scope' => 'Project scope and deliverables will be added with the approved portfolio material.', '_kvm_approach' => 'Use this space to explain the thinking behind the project once the actual work is supplied.']]);
        wp_set_object_terms($id, $demo[2], 'kvm_service');
        if (kvm_is_local()) wp_update_post(['ID' => $id, 'post_status' => 'publish']);
    }
    update_option('kvm_seeded', '1'); flush_rewrite_rules();
}
