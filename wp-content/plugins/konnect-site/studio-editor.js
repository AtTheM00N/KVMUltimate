(function (wp) {
  const e = wp.element.createElement;
  const { useBlockProps, InnerBlocks, InspectorControls, MediaUpload, MediaUploadCheck } = wp.blockEditor;
  const { PanelBody, TextControl, TextareaControl, Button, SelectControl } = wp.components;
  const config = window.kvmStudioEditor;
  const attributes = {
    chapter: { type: 'string', default: 'intro' },
    label: { type: 'string' }, heading: { type: 'string' }, copy: { type: 'string' },
    linkText: { type: 'string' }, linkUrl: { type: 'string' },
    posterId: { type: 'number', default: 0 }, mobilePosterId: { type: 'number', default: 0 },
    projectIds: { type: 'array', default: [], items: { type: 'number' } }, serviceCopy: { type: 'object', default: {} }
  };
  wp.blocks.registerBlockType('konnect/studio-story', {
    apiVersion: 3, title: 'Konnect studio journey', category: 'design', icon: 'format-video',
    supports: { html: false, multiple: false },
    edit: () => e('div', useBlockProps({ className: 'kvm-editor-story' }),
      e('p', { className: 'kvm-editor-note' }, 'Six connected chapters. Edit the content here; the camera and scene are managed by the theme.'),
      e(InnerBlocks, { allowedBlocks: ['konnect/story-chapter'], templateLock: 'all',
        template: Object.entries(config.defaults).map(([chapter, defaults]) => ['konnect/story-chapter', { ...defaults, chapter }]) })),
    save: () => e(InnerBlocks.Content)
  });
  function ChapterEditor({ attributes: a, setAttributes }) {
    const defaults = config.defaults[a.chapter] || config.defaults.intro;
    const projects = wp.data.useSelect(select => a.chapter === 'work' ? select('core').getEntityRecords('postType', 'kvm_project', { per_page: 100, status: 'publish' }) : null, [a.chapter]);
    const poster = wp.data.useSelect(select => a.posterId ? select('core').getMedia(a.posterId) : null, [a.posterId]);
    const mediaControl = (key, label) => e(MediaUploadCheck, { key }, e(MediaUpload, {
      allowedTypes: ['image'], value: a[key], onSelect: image => setAttributes({ [key]: image.id }),
      render: ({ open }) => e('div', { className: 'kvm-editor-media' }, e(Button, { variant: 'secondary', onClick: open }, label),
        !!a[key] && e(Button, { variant: 'tertiary', onClick: () => setAttributes({ [key]: 0 }) }, 'Use studio render'))
    }));
    return e('section', useBlockProps({ className: 'kvm-editor-chapter' }),
      e(InspectorControls, {},
        e(PanelBody, { title: 'Chapter content' },
          ...['label', 'heading', 'copy', 'linkText', 'linkUrl'].map(key => e(key === 'copy' ? TextareaControl : TextControl, {
            key, label: ({ label: 'Chapter label', heading: 'Heading', copy: 'Description', linkText: 'Link text', linkUrl: 'Link URL' })[key],
            value: a[key] ?? defaults[key], onChange: value => setAttributes({ [key]: value })
          }))),
        e(PanelBody, { title: 'Fallback images', initialOpen: false }, mediaControl('posterId', 'Choose desktop poster'), mediaControl('mobilePosterId', 'Choose mobile poster')),
        a.chapter === 'work' && e(PanelBody, { title: 'Featured projects' },
          e('p', {}, 'Select up to two projects. Leave both on automatic to use portfolio order. Public visibility rules still apply.'),
          [0, 1].map(index => e(SelectControl, { key: index, label: `Project ${index + 1}`, value: a.projectIds[index] || 0,
            options: [{ label: 'Automatic', value: 0 }, ...(projects || []).map(p => ({ label: p.title.raw || p.title.rendered, value: p.id }))],
            onChange: value => { const ids = [...a.projectIds]; ids[index] = Number(value); setAttributes({ projectIds: ids }); }
          }))),
        a.chapter === 'services' && ['Social media marketing', 'Graphic design', 'SEO', 'Lead generation'].map((title, i) => e(PanelBody, { key: title, title, initialOpen: false },
          ...['heading', 'copy'].map(key => e(TextareaControl, { key, label: key, value: a.serviceCopy[`${i}_${key}`] || '', help: 'Blank uses the original studio copy.',
            onChange: value => { const serviceCopy = { ...a.serviceCopy }; if (value.trim()) serviceCopy[`${i}_${key}`] = value; else delete serviceCopy[`${i}_${key}`]; setAttributes({ serviceCopy }); }
          })) ))),
      e('img', { src: poster?.source_url || `${config.assetBase}${a.chapter === 'services' ? 'social' : a.chapter}.webp`, alt: '' }),
      e('div', {}, e('small', {}, a.label ?? defaults.label), e('h2', {}, a.heading ?? defaults.heading), e('p', {}, a.copy ?? defaults.copy), e('span', {}, `${a.linkText ?? defaults.linkText} ↗`))
    );
  }
  wp.blocks.registerBlockType('konnect/story-chapter', {
    apiVersion: 3, title: 'Studio chapter', category: 'design', icon: 'slides', parent: ['konnect/studio-story'],
    supports: { html: false, reusable: false, lock: false }, attributes, edit: ChapterEditor, save: () => null
  });
})(window.wp);
