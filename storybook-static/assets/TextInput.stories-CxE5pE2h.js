import{j as e}from"./jsx-runtime-D_zvdyIk.js";import{r as N}from"./index-JhL3uwfD.js";import{c as o}from"./cn-2dOUpm6k.js";const Ee=()=>e.jsx("svg",{viewBox:"0 0 24 24",width:"1.1em",height:"1.1em",fill:"currentColor",children:e.jsx("path",{d:"M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"})}),qe=()=>e.jsx("svg",{viewBox:"0 0 24 24",width:"1.1em",height:"1.1em",fill:"currentColor",children:e.jsx("path",{d:"M12 7c2.76 0 5 2.24 5 5 0 .65-.13 1.26-.36 1.83l2.92 2.92c1.51-1.26 2.7-2.89 3.43-4.75-1.73-4.39-6-7.5-11-7.5-1.4 0-2.74.25-3.98.7l2.16 2.16C10.74 7.13 11.35 7 12 7zM2 4.27l2.28 2.28.46.46C3.08 8.3 1.78 10.02 1 12c1.73 4.39 6 7.5 11 7.5 1.55 0 3.03-.3 4.38-.84l.42.42L19.73 22 21 20.73 3.27 3 2 4.27zM7.53 9.8l1.55 1.55c-.05.21-.08.43-.08.65 0 1.66 1.34 3 3 3 .22 0 .44-.03.65-.08l1.55 1.55c-.67.33-1.41.53-2.2.53-2.76 0-5-2.24-5-5 0-.79.2-1.53.53-2.2zm4.31-.78l3.15 3.15.02-.16c0-1.66-1.34-3-3-3l-.17.01z"})}),a=({label:l,helperText:_,error:r,size:_e="md",leftIcon:v,rightIcon:T,required:z,type:E="text",disabled:y=!1,id:ve,className:Te,onFocus:S,onBlur:I,...ye})=>{const Se=N.useId(),t=ve??Se,[j,q]=N.useState(!1),[C,Ie]=N.useState(!1),P=E==="password",je=P?C?"text":"password":E,Ce=!!v,Pe=!!(P||T),Ne=r?"text-input__wrapper--border-error":j?"text-input__wrapper--border-focus":"text-input__wrapper--border-default",ze=j&&r?"text-input__wrapper--ring-error":j?"text-input__wrapper--ring-focus":"";return e.jsxs("div",{className:o("text-input",Te),children:[l&&e.jsxs("label",{htmlFor:t,className:o("text-input__label",y?"text-input__label--disabled":r?"text-input__label--error":"text-input__label--default"),children:[l,z&&e.jsx("span",{className:"text-input__required","aria-hidden":"true",children:"*"})]}),e.jsxs("div",{className:o("text-input__wrapper",y?"text-input__wrapper--disabled":"text-input__wrapper--enabled",Ne,ze),children:[v&&e.jsx("span",{className:"text-input__icon--left","aria-hidden":"true",children:v}),e.jsx("input",{id:t,type:je,disabled:y,required:z,"aria-invalid":!!r,"aria-describedby":r?`${t}-error`:_?`${t}-hint`:void 0,className:o("text-input__input",`text-input__input--${_e}`,Ce&&"text-input__input--has-left",Pe&&"text-input__input--has-right"),onFocus:s=>{q(!0),S==null||S(s)},onBlur:s=>{q(!1),I==null||I(s)},...ye}),P?e.jsx("button",{type:"button",onClick:()=>Ie(s=>!s),"aria-label":C?"Hide password":"Show password",tabIndex:-1,className:"text-input__password-toggle",children:C?e.jsx(qe,{}):e.jsx(Ee,{})}):T&&e.jsx("span",{className:"text-input__icon--right","aria-hidden":"true",children:T})]}),r&&e.jsx("p",{id:`${t}-error`,role:"alert",className:"text-input__message text-input__message--error",children:r}),!r&&_&&e.jsx("p",{id:`${t}-hint`,className:"text-input__message text-input__message--helper",children:_})]})};a.displayName="TextInput";a.__docgenInfo={description:"",methods:[],displayName:"TextInput",props:{label:{required:!1,tsType:{name:"string"},description:"Label displayed above the input"},helperText:{required:!1,tsType:{name:"string"},description:"Helper text shown below the input"},error:{required:!1,tsType:{name:"string"},description:"Error message; switches the input to error state"},size:{required:!1,tsType:{name:"union",raw:'"sm" | "md" | "lg"',elements:[{name:"literal",value:'"sm"'},{name:"literal",value:'"md"'},{name:"literal",value:'"lg"'}]},description:"Size of the input field",defaultValue:{value:'"md"',computed:!1}},leftIcon:{required:!1,tsType:{name:"ReactNode"},description:"Icon/element placed inside the left of the input"},rightIcon:{required:!1,tsType:{name:"ReactNode"},description:'Icon/element placed inside the right of the input (replaced by eye toggle when type="password")'},required:{required:!1,tsType:{name:"boolean"},description:"Mark the field as required"},type:{defaultValue:{value:'"text"',computed:!1},required:!1},disabled:{defaultValue:{value:"false",computed:!1},required:!1}},composes:["Omit"]};const ke={title:"Components/TextInput",component:a,tags:["autodocs"],parameters:{docs:{description:{component:"A fully accessible text input with label, helper text, error handling, password toggle, and icon support."}}},argTypes:{size:{control:"select",options:["sm","md","lg"]},type:{control:"select",options:["text","email","password","number","search","tel","url"]},disabled:{control:"boolean"},required:{control:"boolean"},label:{control:"text"},placeholder:{control:"text"},helperText:{control:"text"},error:{control:"text"}},decorators:[l=>e.jsx("div",{style:{maxWidth:"380px"},children:e.jsx(l,{})})]},n={args:{label:"Trail Name",placeholder:"e.g. Pacific Crest Trail"}},i={args:{label:"Campsite Location",placeholder:"40.7128° N, 74.0060° W",helperText:"Enter GPS coordinates or a recognisable landmark name."}},c={args:{label:"Emergency Contact",placeholder:"Phone number",value:"not-a-number",error:"Please enter a valid phone number."}},d={args:{label:"Hiker Name",placeholder:"Your full name",required:!0,helperText:"Required for the trail register."}},p={args:{label:"Permit Number",value:"PCT-2024-00847",helperText:"Permit numbers cannot be changed after booking.",disabled:!0}},m={args:{label:"Search",placeholder:"Find a trail…",size:"sm"}},u={args:{label:"Search",placeholder:"Find a trail…",size:"lg"}},h={args:{label:"Account Password",placeholder:"Enter password",type:"password",helperText:"Minimum 8 characters."}},x={args:{label:"Email Address",placeholder:"trailblazer@wilderness.com",type:"email"}},fe=()=>e.jsx("svg",{viewBox:"0 0 24 24",width:"1em",height:"1em",fill:"currentColor",children:e.jsx("path",{d:"M15.5 14h-.79l-.28-.27A6.471 6.471 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"})}),we=()=>e.jsx("svg",{viewBox:"0 0 24 24",width:"1em",height:"1em",fill:"currentColor",children:e.jsx("path",{d:"M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"})}),g={args:{label:"Search Trails",placeholder:"Mountain, forest, coastal…",leftIcon:e.jsx(fe,{})}},b={args:{label:"Meetup Point",placeholder:"Drop a pin or type an address",rightIcon:e.jsx(we,{})}},f={args:{label:"Trail Search",placeholder:"Search by name or region",leftIcon:e.jsx(fe,{}),rightIcon:e.jsx(we,{})}},w={render:()=>e.jsxs("div",{style:{display:"flex",flexDirection:"column",gap:"1.25rem",maxWidth:"400px"},children:[e.jsx(a,{label:"Hiker Name",placeholder:"Your full name",required:!0}),e.jsx(a,{label:"Email",type:"email",placeholder:"you@trailhead.com"}),e.jsx(a,{label:"Password",type:"password",placeholder:"Create a password",helperText:"At least 8 characters."}),e.jsx(a,{label:"Starting Elevation (ft)",type:"number",placeholder:"e.g. 5,280",leftIcon:e.jsx("svg",{viewBox:"0 0 24 24",width:"1em",height:"1em",fill:"currentColor",children:e.jsx("path",{d:"M14 6l-1-2H5v17h2v-7h5l1 2h7V6h-6zm4 8h-4l-1-2H7V6h5l1 2h5v6z"})})}),e.jsx(a,{label:"Permit Number",value:"PCT-2024-00847",helperText:"Cannot be changed after booking.",disabled:!0})]})};var M,W,L;n.parameters={...n.parameters,docs:{...(M=n.parameters)==null?void 0:M.docs,source:{originalSource:`{
  args: {
    label: 'Trail Name',
    placeholder: 'e.g. Pacific Crest Trail'
  }
}`,...(L=(W=n.parameters)==null?void 0:W.docs)==null?void 0:L.source}}};var k,H,R;i.parameters={...i.parameters,docs:{...(k=i.parameters)==null?void 0:k.docs,source:{originalSource:`{
  args: {
    label: 'Campsite Location',
    placeholder: '40.7128° N, 74.0060° W',
    helperText: 'Enter GPS coordinates or a recognisable landmark name.'
  }
}`,...(R=(H=i.parameters)==null?void 0:H.docs)==null?void 0:R.source}}};var A,B,D;c.parameters={...c.parameters,docs:{...(A=c.parameters)==null?void 0:A.docs,source:{originalSource:`{
  args: {
    label: 'Emergency Contact',
    placeholder: 'Phone number',
    value: 'not-a-number',
    error: 'Please enter a valid phone number.'
  }
}`,...(D=(B=c.parameters)==null?void 0:B.docs)==null?void 0:D.source}}};var V,F,$;d.parameters={...d.parameters,docs:{...(V=d.parameters)==null?void 0:V.docs,source:{originalSource:`{
  args: {
    label: 'Hiker Name',
    placeholder: 'Your full name',
    required: true,
    helperText: 'Required for the trail register.'
  }
}`,...($=(F=d.parameters)==null?void 0:F.docs)==null?void 0:$.source}}};var Y,O,G;p.parameters={...p.parameters,docs:{...(Y=p.parameters)==null?void 0:Y.docs,source:{originalSource:`{
  args: {
    label: 'Permit Number',
    value: 'PCT-2024-00847',
    helperText: 'Permit numbers cannot be changed after booking.',
    disabled: true
  }
}`,...(G=(O=p.parameters)==null?void 0:O.docs)==null?void 0:G.source}}};var J,K,Q;m.parameters={...m.parameters,docs:{...(J=m.parameters)==null?void 0:J.docs,source:{originalSource:`{
  args: {
    label: 'Search',
    placeholder: 'Find a trail…',
    size: 'sm'
  }
}`,...(Q=(K=m.parameters)==null?void 0:K.docs)==null?void 0:Q.source}}};var U,X,Z;u.parameters={...u.parameters,docs:{...(U=u.parameters)==null?void 0:U.docs,source:{originalSource:`{
  args: {
    label: 'Search',
    placeholder: 'Find a trail…',
    size: 'lg'
  }
}`,...(Z=(X=u.parameters)==null?void 0:X.docs)==null?void 0:Z.source}}};var ee,re,ae;h.parameters={...h.parameters,docs:{...(ee=h.parameters)==null?void 0:ee.docs,source:{originalSource:`{
  args: {
    label: 'Account Password',
    placeholder: 'Enter password',
    type: 'password',
    helperText: 'Minimum 8 characters.'
  }
}`,...(ae=(re=h.parameters)==null?void 0:re.docs)==null?void 0:ae.source}}};var te,se,le;x.parameters={...x.parameters,docs:{...(te=x.parameters)==null?void 0:te.docs,source:{originalSource:`{
  args: {
    label: 'Email Address',
    placeholder: 'trailblazer@wilderness.com',
    type: 'email'
  }
}`,...(le=(se=x.parameters)==null?void 0:se.docs)==null?void 0:le.source}}};var oe,ne,ie;g.parameters={...g.parameters,docs:{...(oe=g.parameters)==null?void 0:oe.docs,source:{originalSource:`{
  args: {
    label: 'Search Trails',
    placeholder: 'Mountain, forest, coastal…',
    leftIcon: <SearchIcon />
  }
}`,...(ie=(ne=g.parameters)==null?void 0:ne.docs)==null?void 0:ie.source}}};var ce,de,pe;b.parameters={...b.parameters,docs:{...(ce=b.parameters)==null?void 0:ce.docs,source:{originalSource:`{
  args: {
    label: 'Meetup Point',
    placeholder: 'Drop a pin or type an address',
    rightIcon: <LocationIcon />
  }
}`,...(pe=(de=b.parameters)==null?void 0:de.docs)==null?void 0:pe.source}}};var me,ue,he;f.parameters={...f.parameters,docs:{...(me=f.parameters)==null?void 0:me.docs,source:{originalSource:`{
  args: {
    label: 'Trail Search',
    placeholder: 'Search by name or region',
    leftIcon: <SearchIcon />,
    rightIcon: <LocationIcon />
  }
}`,...(he=(ue=f.parameters)==null?void 0:ue.docs)==null?void 0:he.source}}};var xe,ge,be;w.parameters={...w.parameters,docs:{...(xe=w.parameters)==null?void 0:xe.docs,source:{originalSource:`{
  render: () => <div style={{
    display: 'flex',
    flexDirection: 'column',
    gap: '1.25rem',
    maxWidth: '400px'
  }}>
      <TextInput label="Hiker Name" placeholder="Your full name" required />
      <TextInput label="Email" type="email" placeholder="you@trailhead.com" />
      <TextInput label="Password" type="password" placeholder="Create a password" helperText="At least 8 characters." />
      <TextInput label="Starting Elevation (ft)" type="number" placeholder="e.g. 5,280" leftIcon={<svg viewBox="0 0 24 24" width="1em" height="1em" fill="currentColor">
            <path d="M14 6l-1-2H5v17h2v-7h5l1 2h7V6h-6zm4 8h-4l-1-2H7V6h5l1 2h5v6z" />
          </svg>} />
      <TextInput label="Permit Number" value="PCT-2024-00847" helperText="Cannot be changed after booking." disabled />
    </div>
}`,...(be=(ge=w.parameters)==null?void 0:ge.docs)==null?void 0:be.source}}};const He=["Default","WithHelperText","WithError","Required","Disabled","Small","Large","Password","Email","WithLeftIcon","WithRightIcon","WithBothIcons","TrailForm"];export{n as Default,p as Disabled,x as Email,u as Large,h as Password,d as Required,m as Small,w as TrailForm,f as WithBothIcons,c as WithError,i as WithHelperText,g as WithLeftIcon,b as WithRightIcon,He as __namedExportsOrder,ke as default};
