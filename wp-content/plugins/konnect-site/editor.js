(function (wp) {
  const e = wp.element.createElement;
  const labels = { projects: 'Project grid', enquiry: 'Enquiry form', services: 'Service sections', 'project-detail': 'Project details', 'cookie-preferences': 'Cookie preferences', 'business-contact': 'Business email' };
  Object.entries(labels).forEach(([name, title]) => wp.blocks.registerBlockType(`konnect/${name}`, {
    apiVersion: 3, title, icon: name === 'enquiry' ? 'email' : 'layout', category: 'widgets',
    attributes: { limit: { type: 'number', default: 0 }, filters: { type: 'boolean', default: false }, serviceCopy: { type: 'object', default: {} } },
    edit: ({ attributes, setAttributes }) => e('div', wp.blockEditor.useBlockProps(),
      name === 'projects' && e(wp.blockEditor.InspectorControls, {}, e(wp.components.PanelBody, { title: 'Project display' },
        e(wp.components.RangeControl, { label: 'Maximum projects (0 = all)', value: attributes.limit, min: 0, max: 12, onChange: limit => setAttributes({ limit }) }),
        e(wp.components.ToggleControl, { label: 'Show service filters', checked: attributes.filters, onChange: filters => setAttributes({ filters }) }))),
      name === 'services' && e(wp.blockEditor.InspectorControls, {}, ['Social media marketing', 'Graphic design', 'SEO', 'Lead generation'].map((title, index) => e(wp.components.PanelBody, { title, key: title, initialOpen: false }, ['heading', 'description', 'deliverables'].map(key => e(wp.components.TextareaControl, { key, label: key, help: 'Leave blank to use the default copy.', value: attributes.serviceCopy[`${index}_${key}`] || '', onChange: value => setAttributes({ serviceCopy: { ...attributes.serviceCopy, [`${index}_${key}`]: value } }) }))))),
      e(wp.serverSideRender, { block: `konnect/${name}`, attributes })), save: () => null
  }));
  function ProjectFields() {
    const [meta, setMeta] = wp.coreData.useEntityProp('postType', 'kvm_project', 'meta');
    if (!meta) return null;
    const update = (key, value) => setMeta({ ...meta, [`_kvm_${key}`]: value });
    return e(wp.editPost.PluginDocumentSettingPanel, { name: 'konnect-details', title: 'Project details' },
      ['brief', 'scope', 'approach', 'results'].map(key => e(wp.components.TextareaControl, { key, label: key.charAt(0).toUpperCase() + key.slice(1), value: meta[`_kvm_${key}`] || '', onChange: value => update(key, value) })),
      e(wp.components.ToggleControl, { label: 'Results verified and approved', checked: !!meta._kvm_results_verified, onChange: value => update('results_verified', value) }),
      e(wp.components.ToggleControl, { label: 'Preview placeholder (local only)', checked: !!meta._kvm_placeholder, onChange: value => update('placeholder', value) }),
      e(wp.blockEditor.MediaUploadCheck, {}, e(wp.blockEditor.MediaUpload, { multiple: true, gallery: true, allowedTypes: ['image'], value: (meta._kvm_gallery || '').split(',').map(Number).filter(Boolean), onSelect: images => update('gallery', images.map(image => image.id).join(',')), render: ({ open }) => e(wp.components.Button, { variant: 'secondary', onClick: open }, 'Choose project gallery') })),
      e('p', {}, 'Use Featured image for the cover, Services for classification, and Order for display priority. Empty optional sections are hidden.')
    );
  }
  function ProjectPanel() {
    const type = wp.data.useSelect(select => select('core/editor').getCurrentPostType(), []);
    return type === 'kvm_project' ? e(ProjectFields) : null;
  }
  wp.plugins.registerPlugin('konnect-project-fields', { render: ProjectPanel });
})(window.wp);
