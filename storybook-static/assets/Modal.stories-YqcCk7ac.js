import{j as e}from"./jsx-runtime-D_zvdyIk.js";import{r as n}from"./index-JhL3uwfD.js";import{r as W}from"./index-BPftEo5x.js";import{c as j}from"./cn-2dOUpm6k.js";import{B as s}from"./Button-Bkrj4sUt.js";import"./index-hLVmTiZX.js";const Y=()=>e.jsx("svg",{viewBox:"0 0 24 24",width:"1em",height:"1em",fill:"currentColor","aria-hidden":"true",children:e.jsx("path",{d:"M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"})}),h=({open:r,onClose:o,title:t,footer:g,size:A="md",hideCloseButton:f=!1,disableBackdropClose:H=!1,className:O,children:G})=>{const x=n.useRef(null);if(n.useEffect(()=>{if(!r)return;const a=Q=>{Q.key==="Escape"&&o()};return document.addEventListener("keydown",a),()=>document.removeEventListener("keydown",a)},[r,o]),n.useEffect(()=>{if(!r)return;const a=document.body.style.overflow;return document.body.style.overflow="hidden",()=>{document.body.style.overflow=a}},[r]),n.useEffect(()=>{var a;r&&((a=x.current)==null||a.focus())},[r]),!r)return null;const I=a=>{!H&&a.target===a.currentTarget&&o()};return W.createPortal(e.jsxs("div",{role:"presentation",className:j("modal",r&&"modal--open"),onClick:I,children:[e.jsx("div",{className:"modal__backdrop","aria-hidden":"true"}),e.jsxs("div",{ref:x,role:"dialog","aria-modal":"true","aria-labelledby":t?"tf-modal-title":void 0,tabIndex:-1,className:j("modal__panel",`modal__panel--${A}`,O),children:[(t||!f)&&e.jsxs("div",{className:"modal__header",children:[t&&e.jsx("h2",{id:"tf-modal-title",className:"modal__title",children:t}),!f&&e.jsx("button",{type:"button",onClick:o,"aria-label":"Close modal",className:"modal__close",children:e.jsx(Y,{})})]}),e.jsx("div",{className:"modal__body",children:G}),g&&e.jsx("div",{className:"modal__footer",children:g})]})]}),document.body)};h.displayName="Modal";const V={title:"Components/Modal",component:h,tags:["autodocs"],parameters:{docs:{description:{component:"A dialog modal rendered via a portal. Supports multiple sizes, optional header and footer, Escape-to-close, and backdrop-click-to-close."}}},argTypes:{size:{control:"select",options:["sm","md","lg","xl","full"]},open:{control:"boolean"},hideCloseButton:{control:"boolean"},disableBackdropClose:{control:"boolean"},title:{control:"text"}}},l=r=>{const[o,t]=n.useState(!1);return e.jsxs(e.Fragment,{children:[e.jsx(s,{onClick:()=>t(!0),children:"Open Modal"}),e.jsx(h,{...r,open:o,onClose:()=>t(!1)})]})},i={render:r=>e.jsx(l,{...r}),args:{title:"Trail Conditions",children:e.jsx("p",{children:"Current trail conditions are excellent. The forest canopy provides natural shade throughout the route. Bring at least 2 L of water and wear appropriate footwear."}),footer:e.jsxs(e.Fragment,{children:[e.jsx(s,{variant:"outline",onClick:()=>{},children:"Cancel"}),e.jsx(s,{variant:"primary",children:"Confirm Hike"})]})}},d={render:r=>e.jsx(l,{...r}),args:{children:e.jsx("p",{children:"A modal without a title — only the close button appears in the header area."})}},c={render:r=>e.jsx(l,{...r}),args:{title:"Gear Checklist",children:e.jsxs("ul",{style:{margin:0,paddingLeft:"1.25rem"},children:[e.jsx("li",{children:"Headlamp & spare batteries"}),e.jsx("li",{children:"First aid kit"}),e.jsx("li",{children:"Emergency whistle"}),e.jsx("li",{children:"Water purification tablets"}),e.jsx("li",{children:"Trail map & compass"})]})}},m={render:r=>e.jsx(l,{...r}),args:{size:"sm",title:"Quick Note",children:e.jsx("p",{children:"Small modal for brief messages."})}},p={render:r=>e.jsx(l,{...r}),args:{size:"lg",title:"Route Details",children:e.jsx("p",{children:"Large modal for displaying detailed content such as maps, itineraries, or lengthy descriptions of your trail route."}),footer:e.jsx(s,{variant:"primary",children:"Save Route"})}},u={render:r=>e.jsx(l,{...r}),args:{title:"Confirm Departure",disableBackdropClose:!0,children:e.jsx("p",{children:"You must use the buttons below — clicking outside will not close this modal."}),footer:e.jsxs(e.Fragment,{children:[e.jsx(s,{variant:"outline",children:"Cancel"}),e.jsx(s,{variant:"danger",children:"Abandon Trek"})]})}};var b,y,k;i.parameters={...i.parameters,docs:{...(b=i.parameters)==null?void 0:b.docs,source:{originalSource:`{
  render: args => <ModalDemo {...args} />,
  args: {
    title: 'Trail Conditions',
    children: <p>
        Current trail conditions are excellent. The forest canopy provides natural shade
        throughout the route. Bring at least 2 L of water and wear appropriate footwear.
      </p>,
    footer: <>
        <Button variant="outline" onClick={() => {}}>Cancel</Button>
        <Button variant="primary">Confirm Hike</Button>
      </>
  }
}`,...(k=(y=i.parameters)==null?void 0:y.docs)==null?void 0:k.source}}};var v,C,w;d.parameters={...d.parameters,docs:{...(v=d.parameters)==null?void 0:v.docs,source:{originalSource:`{
  render: args => <ModalDemo {...args} />,
  args: {
    children: <p>
        A modal without a title — only the close button appears in the header area.
      </p>
  }
}`,...(w=(C=d.parameters)==null?void 0:C.docs)==null?void 0:w.source}}};var B,_,D;c.parameters={...c.parameters,docs:{...(B=c.parameters)==null?void 0:B.docs,source:{originalSource:`{
  render: args => <ModalDemo {...args} />,
  args: {
    title: 'Gear Checklist',
    children: <ul style={{
      margin: 0,
      paddingLeft: '1.25rem'
    }}>
        <li>Headlamp &amp; spare batteries</li>
        <li>First aid kit</li>
        <li>Emergency whistle</li>
        <li>Water purification tablets</li>
        <li>Trail map &amp; compass</li>
      </ul>
  }
}`,...(D=(_=c.parameters)==null?void 0:_.docs)==null?void 0:D.source}}};var N,S,E;m.parameters={...m.parameters,docs:{...(N=m.parameters)==null?void 0:N.docs,source:{originalSource:`{
  render: args => <ModalDemo {...args} />,
  args: {
    size: 'sm',
    title: 'Quick Note',
    children: <p>Small modal for brief messages.</p>
  }
}`,...(E=(S=m.parameters)==null?void 0:S.docs)==null?void 0:E.source}}};var M,T,L;p.parameters={...p.parameters,docs:{...(M=p.parameters)==null?void 0:M.docs,source:{originalSource:`{
  render: args => <ModalDemo {...args} />,
  args: {
    size: 'lg',
    title: 'Route Details',
    children: <p>
        Large modal for displaying detailed content such as maps, itineraries, or lengthy
        descriptions of your trail route.
      </p>,
    footer: <Button variant="primary">Save Route</Button>
  }
}`,...(L=(T=p.parameters)==null?void 0:T.docs)==null?void 0:L.source}}};var z,F,R;u.parameters={...u.parameters,docs:{...(z=u.parameters)==null?void 0:z.docs,source:{originalSource:`{
  render: args => <ModalDemo {...args} />,
  args: {
    title: 'Confirm Departure',
    disableBackdropClose: true,
    children: <p>You must use the buttons below — clicking outside will not close this modal.</p>,
    footer: <>
        <Button variant="outline">Cancel</Button>
        <Button variant="danger">Abandon Trek</Button>
      </>
  }
}`,...(R=(F=u.parameters)==null?void 0:F.docs)==null?void 0:R.source}}};const X=["Default","NoTitle","NoFooter","Small","Large","DisabledBackdropClose"];export{i as Default,u as DisabledBackdropClose,p as Large,c as NoFooter,d as NoTitle,m as Small,X as __namedExportsOrder,V as default};
