import{j as a}from"./jsx-runtime-D_zvdyIk.js";import{r as h}from"./index-JhL3uwfD.js";import{c as w}from"./cn-2dOUpm6k.js";const d=({tabs:s,value:c,defaultValue:G,onChange:x,variant:T="line",size:J="md",className:B})=>{const u=h.useId(),j=c!==void 0,[M,Q]=h.useState(()=>{var e;return G??((e=s.find(l=>!l.disabled))==null?void 0:e.value)??""}),V=j?c:M,S=h.useRef([]),_=e=>{j||Q(e),x==null||x(e)},U=(e,l)=>{var o;const t=s.map((y,X)=>y.disabled?null:X).filter(y=>y!==null),i=t.indexOf(l);let r;switch(e.key){case"ArrowRight":e.preventDefault(),r=t[(i+1)%t.length];break;case"ArrowLeft":e.preventDefault(),r=t[(i-1+t.length)%t.length];break;case"Home":e.preventDefault(),r=t[0];break;case"End":e.preventDefault(),r=t[t.length-1];break}r!==void 0&&((o=S.current[r])==null||o.focus(),_(s[r].value))};return a.jsxs("div",{className:w("tabs",B),children:[a.jsx("div",{role:"tablist","aria-orientation":"horizontal",className:w("tabs__list",T==="pill"&&"tabs__list--pill"),children:s.map((e,l)=>{const t=e.value===V,i=`${u}-tab-${e.value}`,r=`${u}-panel-${e.value}`;return a.jsx("button",{ref:o=>{S.current[l]=o},id:i,role:"tab",type:"button","aria-selected":t,"aria-controls":r,"aria-disabled":e.disabled,disabled:e.disabled,tabIndex:t?0:-1,onClick:()=>!e.disabled&&_(e.value),onKeyDown:o=>U(o,l),className:w("tabs__trigger",`tabs__trigger--${J}`,`tabs__trigger--${T}`,t&&"tabs__trigger--active"),children:e.label},e.value)})}),s.map(e=>{const l=`${u}-tab-${e.value}`,t=`${u}-panel-${e.value}`,i=e.value===V;return a.jsx("div",{id:t,role:"tabpanel","aria-labelledby":l,hidden:!i,tabIndex:0,className:"tabs__panel",children:i&&e.children},e.value)})]})};d.displayName="Tabs";d.__docgenInfo={description:"",methods:[],displayName:"Tabs",props:{tabs:{required:!0,tsType:{name:"Array",elements:[{name:"TabItem"}],raw:"TabItem[]"},description:"Array of tab definitions"},value:{required:!1,tsType:{name:"string"},description:"Controlled active tab value"},defaultValue:{required:!1,tsType:{name:"string"},description:"Default active tab value (uncontrolled)"},onChange:{required:!1,tsType:{name:"signature",type:"function",raw:"(value: string) => void",signature:{arguments:[{type:{name:"string"},name:"value"}],return:{name:"void"}}},description:"Called when the active tab changes"},variant:{required:!1,tsType:{name:"union",raw:'"line" | "pill"',elements:[{name:"literal",value:'"line"'},{name:"literal",value:'"pill"'}]},description:"Visual style of the tab list",defaultValue:{value:'"line"',computed:!1}},size:{required:!1,tsType:{name:"union",raw:'"sm" | "md" | "lg"',elements:[{name:"literal",value:'"sm"'},{name:"literal",value:'"md"'},{name:"literal",value:'"lg"'}]},description:"Size of the tab triggers",defaultValue:{value:'"md"',computed:!1}},className:{required:!1,tsType:{name:"string"},description:"Additional class names for the root element"}}};const ae={title:"Components/Tabs",component:d,tags:["autodocs"],parameters:{docs:{description:{component:"A tab component for organising content into labelled sections. Supports line and pill variants, keyboard navigation (←/→/Home/End), disabled tabs, and both controlled and uncontrolled usage."}}},argTypes:{variant:{control:"select",options:["line","pill"]},size:{control:"select",options:["sm","md","lg"]}}},n=[{value:"overview",label:"Overview",children:a.jsx("p",{className:"text-[var(--tf-text-secondary)]",children:"A scenic 12 km loop through old-growth forest with 450 m of elevation gain. Suitable for intermediate hikers. Dogs allowed on-leash."})},{value:"conditions",label:"Conditions",children:a.jsx("p",{className:"text-[var(--tf-text-secondary)]",children:"Trail is currently dry and well-maintained. Snow patches possible above 1 200 m until late June. Trekking poles recommended."})},{value:"gear",label:"Gear",children:a.jsxs("ul",{style:{margin:0,paddingLeft:"1.25rem"},className:"text-[var(--tf-text-secondary)]",children:[a.jsx("li",{children:"2 L water minimum"}),a.jsx("li",{children:"Layered clothing"}),a.jsx("li",{children:"First aid kit"}),a.jsx("li",{children:"Headlamp & spare batteries"})]})},{value:"closed",label:"Closed Section",disabled:!0,children:null}],m={args:{tabs:n,variant:"line",defaultValue:"overview"}},p={args:{tabs:n,variant:"pill",defaultValue:"overview"}},v={args:{tabs:n,variant:"line",size:"sm",defaultValue:"overview"}},g={args:{tabs:n,variant:"pill",size:"lg",defaultValue:"overview"}},b={render:()=>{const[s,c]=h.useState("conditions");return a.jsxs("div",{style:{display:"flex",flexDirection:"column",gap:"1rem"},children:[a.jsxs("p",{style:{margin:0,fontSize:"0.875rem",color:"var(--tf-text-secondary)"},children:["Active tab: ",a.jsx("strong",{children:s})]}),a.jsx(d,{tabs:n,variant:"line",value:s,onChange:c})]})}},f={render:()=>a.jsxs("div",{style:{display:"flex",flexDirection:"column",gap:"2.5rem"},children:[a.jsxs("div",{children:[a.jsx("p",{style:{margin:"0 0 0.75rem",fontWeight:600},children:"Line"}),a.jsx(d,{tabs:n,variant:"line",defaultValue:"overview"})]}),a.jsxs("div",{children:[a.jsx("p",{style:{margin:"0 0 0.75rem",fontWeight:600},children:"Pill"}),a.jsx(d,{tabs:n,variant:"pill",defaultValue:"gear"})]})]})};var A,I,k;m.parameters={...m.parameters,docs:{...(A=m.parameters)==null?void 0:A.docs,source:{originalSource:`{
  args: {
    tabs: trailTabs,
    variant: 'line',
    defaultValue: 'overview'
  }
}`,...(k=(I=m.parameters)==null?void 0:I.docs)==null?void 0:k.source}}};var D,z,L;p.parameters={...p.parameters,docs:{...(D=p.parameters)==null?void 0:D.docs,source:{originalSource:`{
  args: {
    tabs: trailTabs,
    variant: 'pill',
    defaultValue: 'overview'
  }
}`,...(L=(z=p.parameters)==null?void 0:z.docs)==null?void 0:L.source}}};var N,$,C;v.parameters={...v.parameters,docs:{...(N=v.parameters)==null?void 0:N.docs,source:{originalSource:`{
  args: {
    tabs: trailTabs,
    variant: 'line',
    size: 'sm',
    defaultValue: 'overview'
  }
}`,...(C=($=v.parameters)==null?void 0:$.docs)==null?void 0:C.source}}};var q,E,P;g.parameters={...g.parameters,docs:{...(q=g.parameters)==null?void 0:q.docs,source:{originalSource:`{
  args: {
    tabs: trailTabs,
    variant: 'pill',
    size: 'lg',
    defaultValue: 'overview'
  }
}`,...(P=(E=g.parameters)==null?void 0:E.docs)==null?void 0:P.source}}};var R,W,H;b.parameters={...b.parameters,docs:{...(R=b.parameters)==null?void 0:R.docs,source:{originalSource:`{
  render: () => {
    const [active, setActive] = useState('conditions');
    return <div style={{
      display: 'flex',
      flexDirection: 'column',
      gap: '1rem'
    }}>
        <p style={{
        margin: 0,
        fontSize: '0.875rem',
        color: 'var(--tf-text-secondary)'
      }}>
          Active tab: <strong>{active}</strong>
        </p>
        <Tabs tabs={trailTabs} variant="line" value={active} onChange={setActive} />
      </div>;
  }
}`,...(H=(W=b.parameters)==null?void 0:W.docs)==null?void 0:H.source}}};var O,K,F;f.parameters={...f.parameters,docs:{...(O=f.parameters)==null?void 0:O.docs,source:{originalSource:`{
  render: () => <div style={{
    display: 'flex',
    flexDirection: 'column',
    gap: '2.5rem'
  }}>
      <div>
        <p style={{
        margin: '0 0 0.75rem',
        fontWeight: 600
      }}>Line</p>
        <Tabs tabs={trailTabs} variant="line" defaultValue="overview" />
      </div>
      <div>
        <p style={{
        margin: '0 0 0.75rem',
        fontWeight: 600
      }}>Pill</p>
        <Tabs tabs={trailTabs} variant="pill" defaultValue="gear" />
      </div>
    </div>
}`,...(F=(K=f.parameters)==null?void 0:K.docs)==null?void 0:F.source}}};const te=["Line","Pill","Small","Large","Controlled","AllVariants"];export{f as AllVariants,b as Controlled,g as Large,m as Line,p as Pill,v as Small,te as __namedExportsOrder,ae as default};
