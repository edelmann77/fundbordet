import{j as e}from"./jsx-runtime-D_zvdyIk.js";import{C as S}from"./Card-o-2xfrTC.js";import{c as i}from"./cn-2dOUpm6k.js";const r=({size:_="md",tone:v="forest",label:o="Scanning the trail…",showLabel:j=!1,className:k,...w})=>e.jsxs("span",{className:i("progress-spinner",`progress-spinner--${_}`,`progress-spinner--${v}`,k),role:"status","aria-label":o,...w,children:[e.jsxs("span",{className:"progress-spinner__visual","aria-hidden":"true",children:[e.jsx("span",{className:"progress-spinner__ring"}),e.jsx("span",{className:"progress-spinner__ring progress-spinner__ring--inner"}),e.jsx("span",{className:"progress-spinner__orbit progress-spinner__orbit--outer",children:e.jsx("span",{className:"progress-spinner__marker progress-spinner__marker--lead"})}),e.jsx("span",{className:"progress-spinner__orbit progress-spinner__orbit--inner",children:e.jsx("span",{className:"progress-spinner__marker progress-spinner__marker--tail"})}),e.jsx("span",{className:"progress-spinner__core"})]}),e.jsx("span",{className:i("progress-spinner__label",!j&&"progress-spinner__label--sr-only"),children:o})]});r.displayName="ProgressSpinner";r.__docgenInfo={description:"",methods:[],displayName:"ProgressSpinner",props:{size:{required:!1,tsType:{name:"union",raw:'"sm" | "md" | "lg"',elements:[{name:"literal",value:'"sm"'},{name:"literal",value:'"md"'},{name:"literal",value:'"lg"'}]},description:"",defaultValue:{value:'"md"',computed:!1}},tone:{required:!1,tsType:{name:"union",raw:'"forest" | "earth" | "sky"',elements:[{name:"literal",value:'"forest"'},{name:"literal",value:'"earth"'},{name:"literal",value:'"sky"'}]},description:"",defaultValue:{value:'"forest"',computed:!1}},label:{required:!1,tsType:{name:"string"},description:"",defaultValue:{value:'"Scanning the trail…"',computed:!1}},showLabel:{required:!1,tsType:{name:"boolean"},description:"",defaultValue:{value:"false",computed:!1}}},composes:["Omit"]};const C={title:"Components/ProgressSpinner",component:r,tags:["autodocs"],parameters:{docs:{description:{component:"An outdoor-inspired loading indicator that feels like a trail beacon: a rotating path, orbiting markers, and a pulsing core for discovery and scanning states."}}},argTypes:{size:{control:"select",options:["sm","md","lg"]},tone:{control:"select",options:["forest","earth","sky"]},label:{control:"text"},showLabel:{control:"boolean"}},args:{size:"md",tone:"forest",label:"Scanning the trail…",showLabel:!1}},s={},n={args:{label:"Searching nearby findings…",showLabel:!0,tone:"sky"}},a={render:()=>e.jsxs("div",{style:{display:"flex",gap:"1.5rem",flexWrap:"wrap",alignItems:"center"},children:[e.jsx(r,{tone:"forest",showLabel:!0,label:"Trail scan"}),e.jsx(r,{tone:"earth",showLabel:!0,label:"Ground check"}),e.jsx(r,{tone:"sky",showLabel:!0,label:"Range sweep"})]})},t={render:()=>e.jsx(S,{title:"Preparing findings",subtitle:"We are triangulating likely outdoor matches around your route.",style:{maxWidth:"28rem"},children:e.jsxs("div",{style:{display:"flex",alignItems:"center",gap:"1rem"},children:[e.jsx(r,{tone:"forest",size:"lg"}),e.jsxs("div",{children:[e.jsx("div",{style:{fontWeight:700,marginBottom:"0.25rem"},children:"Sweeping terrain signals"}),e.jsx("div",{style:{color:"var(--tf-text-secondary)"},children:"Comparing trail markers, shelter points, and nearby features."})]})]})})};var l,p,d;s.parameters={...s.parameters,docs:{...(l=s.parameters)==null?void 0:l.docs,source:{originalSource:"{}",...(d=(p=s.parameters)==null?void 0:p.docs)==null?void 0:d.source}}};var c,m,g;n.parameters={...n.parameters,docs:{...(c=n.parameters)==null?void 0:c.docs,source:{originalSource:`{
  args: {
    label: "Searching nearby findings…",
    showLabel: true,
    tone: "sky"
  }
}`,...(g=(m=n.parameters)==null?void 0:m.docs)==null?void 0:g.source}}};var u,f,h;a.parameters={...a.parameters,docs:{...(u=a.parameters)==null?void 0:u.docs,source:{originalSource:`{
  render: () => <div style={{
    display: "flex",
    gap: "1.5rem",
    flexWrap: "wrap",
    alignItems: "center"
  }}>
      <ProgressSpinner tone="forest" showLabel label="Trail scan" />
      <ProgressSpinner tone="earth" showLabel label="Ground check" />
      <ProgressSpinner tone="sky" showLabel label="Range sweep" />
    </div>
}`,...(h=(f=a.parameters)==null?void 0:f.docs)==null?void 0:h.source}}};var b,y,x;t.parameters={...t.parameters,docs:{...(b=t.parameters)==null?void 0:b.docs,source:{originalSource:`{
  render: () => <Card title="Preparing findings" subtitle="We are triangulating likely outdoor matches around your route." style={{
    maxWidth: "28rem"
  }}>
      <div style={{
      display: "flex",
      alignItems: "center",
      gap: "1rem"
    }}>
        <ProgressSpinner tone="forest" size="lg" />
        <div>
          <div style={{
          fontWeight: 700,
          marginBottom: "0.25rem"
        }}>
            Sweeping terrain signals
          </div>
          <div style={{
          color: "var(--tf-text-secondary)"
        }}>
            Comparing trail markers, shelter points, and nearby features.
          </div>
        </div>
      </div>
    </Card>
}`,...(x=(y=t.parameters)==null?void 0:y.docs)==null?void 0:x.source}}};const T=["Default","Labeled","Tones","InContext"];export{s as Default,t as InContext,n as Labeled,a as Tones,T as __namedExportsOrder,C as default};
