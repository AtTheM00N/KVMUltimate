export function PocketWorld(){
  const projects=window.konnectContent?.work?.projects||[];
  return hs('section',{id:'pocket-world',className:'_guilds_194d4_3 pq-world pq-world-compact','aria-labelledby':'pq-world-title',children:[
    hs('div',{className:'pq-world-heading',children:[
      h('div',{'data-guild-title':true,children:hs('h2',{id:'pq-world-title',children:[window.konnectContent?.work?.heading||'Made to connect',h('br',{}),hs('span',{children:['Big ',h('em',{children:"connections."})]})]})})
    ]}),
    projects.length?h('div',{className:'konnect-selected-work',children:projects.map(p=>h('a',{href:p.url,children:[h('img',{src:p.image,alt:'',loading:'lazy'}),h('h3',{children:p.title}),p.study?h('p',{children:'Konnect design study · Not client work'}):null]},p.url))}):null
  ]});
}
