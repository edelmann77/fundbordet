import{j as e}from"./jsx-runtime-D_zvdyIk.js";import{C as z}from"./Card-o-2xfrTC.js";import{B as c}from"./Button-Bkrj4sUt.js";import"./cn-2dOUpm6k.js";const L={title:"Components/Card",component:z,tags:["autodocs"],parameters:{docs:{description:{component:"A flexible card component for displaying grouped content. Supports images, titles, footers, and four visual variants."}},layout:"padded"},argTypes:{variant:{control:"select",options:["default","elevated","outlined","filled"]},title:{control:"text"},subtitle:{control:"text"}},decorators:[t=>e.jsx("div",{style:{maxWidth:"380px"},children:e.jsx(t,{})})]},a={args:{variant:"default",title:"Pacific Crest Trail",subtitle:"California · 2,650 miles",children:"One of the longest hiking trails in the world, stretching from the Mexican border all the way to Canada through diverse terrain."}},r={args:{variant:"elevated",title:"Gear Checklist",subtitle:"Essential equipment for your next trip",children:"Tent, sleeping bag, trekking poles, first-aid kit, water filter, and emergency shelter."}},i={args:{variant:"outlined",title:"Weather Advisory",subtitle:"Updated 2 hours ago",children:"Afternoon thunderstorms expected above 10,000 ft. Plan to be below tree line by noon."}},s={args:{variant:"filled",title:"Trail Conditions",subtitle:"Last reported: this morning",children:"Snow patches remain near the summit. Microspikes recommended. Trail is otherwise clear."}},n={args:{title:"Mount Rainier",subtitle:"Cascade Range, Washington",image:"https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=600&q=80",imageAlt:"Snow-capped Mount Rainier reflecting in a mountain lake",children:"Standing at 14,411 feet, Mount Rainier is the highest peak in the Cascades and a challenging multi-day mountaineering objective."}},o={args:{title:"Yosemite Valley Loop",subtitle:"7.2 miles · Moderate",children:"A classic valley floor hike passing Bridalveil Fall, El Capitan Meadow, and Sentinel Beach. Perfect for first-time visitors.",footer:e.jsxs("div",{style:{display:"flex",gap:"0.5rem",width:"100%"},children:[e.jsx(c,{variant:"primary",size:"sm",children:"Start Planning"}),e.jsx(c,{variant:"ghost",size:"sm",children:"Save Trail"})]})}},l={args:{title:"Torres del Paine",subtitle:"Patagonia, Chile · 5-day circuit",image:"https://images.unsplash.com/photo-1501854140801-50d01698950b?w=600&q=80",imageAlt:"The iconic towers of Torres del Paine at sunrise",children:"The W Trek through this UNESCO Biosphere Reserve offers dramatic views of granite spires, glaciers, and turquoise lakes.",footer:e.jsxs("div",{style:{display:"flex",gap:"0.5rem",width:"100%",justifyContent:"space-between",alignItems:"center"},children:[e.jsx("span",{style:{fontSize:"0.875rem",color:"#5C4A3A"},children:"⭐ 4.9 · 2,340 reviews"}),e.jsx(c,{variant:"primary",size:"sm",children:"Explore"})]})}},d={render:()=>e.jsx("div",{style:{display:"grid",gridTemplateColumns:"repeat(2, 1fr)",gap:"1rem",maxWidth:"800px"},children:["default","elevated","outlined","filled"].map(t=>e.jsx(z,{variant:t,title:`${t.charAt(0).toUpperCase()+t.slice(1)} Card`,subtitle:"Trail summary",children:"Each variant has its own border and shadow treatment, all using outdoor theme tokens."},t))})};var m,p,h;a.parameters={...a.parameters,docs:{...(m=a.parameters)==null?void 0:m.docs,source:{originalSource:`{
  args: {
    variant: 'default',
    title: 'Pacific Crest Trail',
    subtitle: 'California · 2,650 miles',
    children: 'One of the longest hiking trails in the world, stretching from the Mexican border all the way to Canada through diverse terrain.'
  }
}`,...(h=(p=a.parameters)==null?void 0:p.docs)==null?void 0:h.source}}};var u,g,f;r.parameters={...r.parameters,docs:{...(u=r.parameters)==null?void 0:u.docs,source:{originalSource:`{
  args: {
    variant: 'elevated',
    title: 'Gear Checklist',
    subtitle: 'Essential equipment for your next trip',
    children: 'Tent, sleeping bag, trekking poles, first-aid kit, water filter, and emergency shelter.'
  }
}`,...(f=(g=r.parameters)==null?void 0:g.docs)==null?void 0:f.source}}};var v,y,b;i.parameters={...i.parameters,docs:{...(v=i.parameters)==null?void 0:v.docs,source:{originalSource:`{
  args: {
    variant: 'outlined',
    title: 'Weather Advisory',
    subtitle: 'Updated 2 hours ago',
    children: 'Afternoon thunderstorms expected above 10,000 ft. Plan to be below tree line by noon.'
  }
}`,...(b=(y=i.parameters)==null?void 0:y.docs)==null?void 0:b.source}}};var w,C,x;s.parameters={...s.parameters,docs:{...(w=s.parameters)==null?void 0:w.docs,source:{originalSource:`{
  args: {
    variant: 'filled',
    title: 'Trail Conditions',
    subtitle: 'Last reported: this morning',
    children: 'Snow patches remain near the summit. Microspikes recommended. Trail is otherwise clear.'
  }
}`,...(x=(C=s.parameters)==null?void 0:C.docs)==null?void 0:x.source}}};var k,S,T;n.parameters={...n.parameters,docs:{...(k=n.parameters)==null?void 0:k.docs,source:{originalSource:`{
  args: {
    title: 'Mount Rainier',
    subtitle: 'Cascade Range, Washington',
    image: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=600&q=80',
    imageAlt: 'Snow-capped Mount Rainier reflecting in a mountain lake',
    children: 'Standing at 14,411 feet, Mount Rainier is the highest peak in the Cascades and a challenging multi-day mountaineering objective.'
  }
}`,...(T=(S=n.parameters)==null?void 0:S.docs)==null?void 0:T.source}}};var A,j,W;o.parameters={...o.parameters,docs:{...(A=o.parameters)==null?void 0:A.docs,source:{originalSource:`{
  args: {
    title: 'Yosemite Valley Loop',
    subtitle: '7.2 miles · Moderate',
    children: 'A classic valley floor hike passing Bridalveil Fall, El Capitan Meadow, and Sentinel Beach. Perfect for first-time visitors.',
    footer: <div style={{
      display: 'flex',
      gap: '0.5rem',
      width: '100%'
    }}>
        <Button variant="primary" size="sm">
          Start Planning
        </Button>
        <Button variant="ghost" size="sm">
          Save Trail
        </Button>
      </div>
  }
}`,...(W=(j=o.parameters)==null?void 0:j.docs)==null?void 0:W.source}}};var B,E,M;l.parameters={...l.parameters,docs:{...(B=l.parameters)==null?void 0:B.docs,source:{originalSource:`{
  args: {
    title: 'Torres del Paine',
    subtitle: 'Patagonia, Chile · 5-day circuit',
    image: 'https://images.unsplash.com/photo-1501854140801-50d01698950b?w=600&q=80',
    imageAlt: 'The iconic towers of Torres del Paine at sunrise',
    children: 'The W Trek through this UNESCO Biosphere Reserve offers dramatic views of granite spires, glaciers, and turquoise lakes.',
    footer: <div style={{
      display: 'flex',
      gap: '0.5rem',
      width: '100%',
      justifyContent: 'space-between',
      alignItems: 'center'
    }}>
        <span style={{
        fontSize: '0.875rem',
        color: '#5C4A3A'
      }}>⭐ 4.9 · 2,340 reviews</span>
        <Button variant="primary" size="sm">Explore</Button>
      </div>
  }
}`,...(M=(E=l.parameters)==null?void 0:E.docs)==null?void 0:M.source}}};var P,R,q;d.parameters={...d.parameters,docs:{...(P=d.parameters)==null?void 0:P.docs,source:{originalSource:`{
  render: () => <div style={{
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: '1rem',
    maxWidth: '800px'
  }}>
      {(['default', 'elevated', 'outlined', 'filled'] as const).map(variant => <Card key={variant} variant={variant} title={\`\${variant.charAt(0).toUpperCase() + variant.slice(1)} Card\`} subtitle="Trail summary">
          Each variant has its own border and shadow treatment, all using outdoor theme tokens.
        </Card>)}
    </div>
}`,...(q=(R=d.parameters)==null?void 0:R.docs)==null?void 0:q.source}}};const V=["Default","Elevated","Outlined","Filled","WithImage","WithFooter","WithImageAndFooter","AllVariants"];export{d as AllVariants,a as Default,r as Elevated,s as Filled,i as Outlined,o as WithFooter,n as WithImage,l as WithImageAndFooter,V as __namedExportsOrder,L as default};
