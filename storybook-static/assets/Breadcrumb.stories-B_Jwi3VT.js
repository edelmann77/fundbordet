import{j as a}from"./jsx-runtime-D_zvdyIk.js";import{c as u}from"./cn-2dOUpm6k.js";const c=({items:d,ariaLabel:C="Breadcrumb",separator:D="/",size:T="md",className:q})=>{const i=d.length-1;return a.jsx("nav",{"aria-label":C,className:u("breadcrumb",`breadcrumb--${T}`,q),children:a.jsx("ul",{className:"breadcrumb__list",children:d.map((e,m)=>{const w=e.current||m===i;return a.jsxs("li",{className:"breadcrumb__item",children:[w?a.jsx("span",{className:"breadcrumb__current","aria-current":"page",children:e.label}):a.jsx("a",{className:u("breadcrumb__link",e.disabled&&"breadcrumb__link--disabled"),href:e.disabled?void 0:e.href,onClick:e.disabled?void 0:e.onClick,"aria-disabled":e.disabled||void 0,tabIndex:e.disabled?-1:void 0,children:e.label}),m<i&&a.jsx("span",{className:"breadcrumb__separator","aria-hidden":"true",children:D})]},m)})})})};c.displayName="Breadcrumb";c.__docgenInfo={description:"",methods:[],displayName:"Breadcrumb",props:{items:{required:!0,tsType:{name:"Array",elements:[{name:"BreadcrumbItem"}],raw:"BreadcrumbItem[]"},description:"Ordered breadcrumb items from root to current page"},ariaLabel:{required:!1,tsType:{name:"string"},description:"Accessible label for the breadcrumb nav",defaultValue:{value:'"Breadcrumb"',computed:!1}},separator:{required:!1,tsType:{name:"ReactNode"},description:"Separator rendered between items",defaultValue:{value:'"/"',computed:!1}},size:{required:!1,tsType:{name:"union",raw:'"sm" | "md" | "lg"',elements:[{name:"literal",value:'"sm"'},{name:"literal",value:'"md"'},{name:"literal",value:'"lg"'}]},description:"Visual size variant",defaultValue:{value:'"md"',computed:!1}},className:{required:!1,tsType:{name:"string"},description:"Additional class names for the root nav"}}};const V={title:"Components/Breadcrumb",component:c,tags:["autodocs"],parameters:{docs:{description:{component:"A lightweight breadcrumb navigation component with accessible semantics, size variants, custom separators, and support for disabled items."}}},argTypes:{size:{control:"select",options:["sm","md","lg"]}}},o=[{label:"Home",href:"#"},{label:"Components",href:"#"},{label:"Navigation",href:"#"},{label:"Breadcrumb"}],r={args:{items:o}},s={args:{items:o,size:"sm"}},t={args:{items:o,size:"lg"}},n={args:{items:o,separator:"›"}},l={args:{items:[{label:"Home",href:"#"},{label:"Projects",href:"#",disabled:!0},{label:"Design System",href:"#"},{label:"Breadcrumb"}]}};var b,p,g;r.parameters={...r.parameters,docs:{...(b=r.parameters)==null?void 0:b.docs,source:{originalSource:`{
  args: {
    items: baseItems
  }
}`,...(g=(p=r.parameters)==null?void 0:p.docs)==null?void 0:g.source}}};var f,h,v;s.parameters={...s.parameters,docs:{...(f=s.parameters)==null?void 0:f.docs,source:{originalSource:`{
  args: {
    items: baseItems,
    size: "sm"
  }
}`,...(v=(h=s.parameters)==null?void 0:h.docs)==null?void 0:v.source}}};var _,I,S;t.parameters={...t.parameters,docs:{...(_=t.parameters)==null?void 0:_.docs,source:{originalSource:`{
  args: {
    items: baseItems,
    size: "lg"
  }
}`,...(S=(I=t.parameters)==null?void 0:I.docs)==null?void 0:S.source}}};var y,B,N;n.parameters={...n.parameters,docs:{...(y=n.parameters)==null?void 0:y.docs,source:{originalSource:`{
  args: {
    items: baseItems,
    separator: "›"
  }
}`,...(N=(B=n.parameters)==null?void 0:B.docs)==null?void 0:N.source}}};var j,x,z;l.parameters={...l.parameters,docs:{...(j=l.parameters)==null?void 0:j.docs,source:{originalSource:`{
  args: {
    items: [{
      label: "Home",
      href: "#"
    }, {
      label: "Projects",
      href: "#",
      disabled: true
    }, {
      label: "Design System",
      href: "#"
    }, {
      label: "Breadcrumb"
    }]
  }
}`,...(z=(x=l.parameters)==null?void 0:x.docs)==null?void 0:z.source}}};const H=["Default","Small","Large","ChevronSeparator","WithDisabledItem"];export{n as ChevronSeparator,r as Default,t as Large,s as Small,l as WithDisabledItem,H as __namedExportsOrder,V as default};
