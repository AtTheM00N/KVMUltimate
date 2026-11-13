export function PocketWorld(){
  const projects=window.konnectContent?.work?.projects||[];
  return hs('section',{id:'pocket-world',className:'_guilds_194d4_3 pq-world pq-world-compact','aria-labelledby':'pq-world-title',children:[
    hs('div',{className:'pq-world-top',children:[hs('span',{children:[h('img',{src:asset('/grail-mark.svg'),alt:''}),"A WORLD BUILT AROUND YOUR BRAND"]}),h('span',{children:''})]}),
    hs('div',{className:'pq-world-heading',children:[
      h('div',{'data-guild-title':true,children:hs('h2',{id:'pq-world-title',children:[window.konnectContent?.work?.heading||'Made to connect',h('br',{}),hs('span',{children:['Big ',h('em',{children:"connections."})]})]})}),
      hs('div',{className:'pq-world-intro',children:[h('span',{className:'pq-world-kicker',children:"ORIGINAL KONNECT DESIGN STUDIES."}),h('p',{children:"Creative direction for brands ready to make a connection."})]})
    ]}),
    hs('div',{className:'pq-world-cta',children:[
      h(RoundButton,{className:'pq-world-launch',label:'Start a project'}),
      h('span',{children:"Social · Design · Search · Campaigns"})
    ]}),
    projects.length?h('div',{className:'konnect-selected-work',children:projects.map(p=>h('a',{href:p.url,children:[h('img',{src:p.image,alt:'',loading:'lazy'}),h('h3',{children:p.title}),p.study?h('p',{children:'Konnect design study · Not client work'}):null]},p.url))}):null
  ]});
}
