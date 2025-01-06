"use strict";(self.webpackChunkdocs=self.webpackChunkdocs||[]).push([[23767],{83037:(e,n,o)=>{o.r(n),o.d(n,{assets:()=>a,contentTitle:()=>d,default:()=>p,frontMatter:()=>s,metadata:()=>r,toc:()=>c});const r=JSON.parse('{"id":"interfaces/TelemetryLoggerOptions","title":"Interface: TelemetryLoggerOptions","description":"Defined in4501","source":"@site/api/interfaces/TelemetryLoggerOptions.md","sourceDirName":"interfaces","slug":"/interfaces/TelemetryLoggerOptions","permalink":"/api/interfaces/TelemetryLoggerOptions","draft":false,"unlisted":false,"tags":[],"version":"current","frontMatter":{},"sidebar":"typedocSidebar","previous":{"title":"TelemetryLogger","permalink":"/api/interfaces/TelemetryLogger"},"next":{"title":"TelemetrySender","permalink":"/api/interfaces/TelemetrySender"}}');var t=o(62540),i=o(43023);const s={},d="Interface: TelemetryLoggerOptions",a={},c=[{value:"Properties",id:"properties",level:2},{value:"additionalCommonProperties?",id:"additionalcommonproperties",level:3},{value:"ignoreBuiltInCommonProperties?",id:"ignorebuiltincommonproperties",level:3},{value:"ignoreUnhandledErrors?",id:"ignoreunhandlederrors",level:3}];function l(e){const n={a:"a",blockquote:"blockquote",code:"code",h1:"h1",h2:"h2",h3:"h3",header:"header",hr:"hr",p:"p",strong:"strong",...(0,i.R)(),...e.components};return(0,t.jsxs)(t.Fragment,{children:[(0,t.jsx)(n.header,{children:(0,t.jsx)(n.h1,{id:"interface-telemetryloggeroptions",children:"Interface: TelemetryLoggerOptions"})}),"\n",(0,t.jsxs)(n.p,{children:["Defined in: ",(0,t.jsx)(n.a,{href:"https://github.com/gastoner/podman-desktop/blob/e37ef8fb5e895a0c841723d90997022636a91498/packages/extension-api/src/extension-api.d.ts#L4501",children:"packages/extension-api/src/extension-api.d.ts:4501"})]}),"\n",(0,t.jsxs)(n.p,{children:["Options for creating a ",(0,t.jsx)(n.a,{href:"/api/interfaces/TelemetryLogger",children:"TelemetryLogger"})]}),"\n",(0,t.jsx)(n.h2,{id:"properties",children:"Properties"}),"\n",(0,t.jsx)(n.h3,{id:"additionalcommonproperties",children:"additionalCommonProperties?"}),"\n",(0,t.jsxs)(n.blockquote,{children:["\n",(0,t.jsxs)(n.p,{children:[(0,t.jsx)(n.code,{children:"readonly"})," ",(0,t.jsx)(n.code,{children:"optional"})," ",(0,t.jsx)(n.strong,{children:"additionalCommonProperties"}),": ",(0,t.jsx)(n.code,{children:"Record"}),"<",(0,t.jsx)(n.code,{children:"string"}),", ",(0,t.jsx)(n.code,{children:"any"}),">"]}),"\n"]}),"\n",(0,t.jsxs)(n.p,{children:["Defined in: ",(0,t.jsx)(n.a,{href:"https://github.com/gastoner/podman-desktop/blob/e37ef8fb5e895a0c841723d90997022636a91498/packages/extension-api/src/extension-api.d.ts#L4518",children:"packages/extension-api/src/extension-api.d.ts:4518"})]}),"\n",(0,t.jsx)(n.p,{children:"Any additional common properties which should be injected into the data object."}),"\n",(0,t.jsx)(n.hr,{}),"\n",(0,t.jsx)(n.h3,{id:"ignorebuiltincommonproperties",children:"ignoreBuiltInCommonProperties?"}),"\n",(0,t.jsxs)(n.blockquote,{children:["\n",(0,t.jsxs)(n.p,{children:[(0,t.jsx)(n.code,{children:"readonly"})," ",(0,t.jsx)(n.code,{children:"optional"})," ",(0,t.jsx)(n.strong,{children:"ignoreBuiltInCommonProperties"}),": ",(0,t.jsx)(n.code,{children:"boolean"})]}),"\n"]}),"\n",(0,t.jsxs)(n.p,{children:["Defined in: ",(0,t.jsx)(n.a,{href:"https://github.com/gastoner/podman-desktop/blob/e37ef8fb5e895a0c841723d90997022636a91498/packages/extension-api/src/extension-api.d.ts#L4506",children:"packages/extension-api/src/extension-api.d.ts:4506"})]}),"\n",(0,t.jsxs)(n.p,{children:["Whether or not you want to avoid having the built-in common properties such as os, extension name, etc injected into the data object.\nDefaults to ",(0,t.jsx)(n.code,{children:"false"})," if not defined."]}),"\n",(0,t.jsx)(n.hr,{}),"\n",(0,t.jsx)(n.h3,{id:"ignoreunhandlederrors",children:"ignoreUnhandledErrors?"}),"\n",(0,t.jsxs)(n.blockquote,{children:["\n",(0,t.jsxs)(n.p,{children:[(0,t.jsx)(n.code,{children:"readonly"})," ",(0,t.jsx)(n.code,{children:"optional"})," ",(0,t.jsx)(n.strong,{children:"ignoreUnhandledErrors"}),": ",(0,t.jsx)(n.code,{children:"boolean"})]}),"\n"]}),"\n",(0,t.jsxs)(n.p,{children:["Defined in: ",(0,t.jsx)(n.a,{href:"https://github.com/gastoner/podman-desktop/blob/e37ef8fb5e895a0c841723d90997022636a91498/packages/extension-api/src/extension-api.d.ts#L4512",children:"packages/extension-api/src/extension-api.d.ts:4512"})]}),"\n",(0,t.jsxs)(n.p,{children:["Whether or not unhandled errors on the extension host caused by your extension should be logged to your sender.\nDefaults to ",(0,t.jsx)(n.code,{children:"false"})," if not defined."]})]})}function p(e={}){const{wrapper:n}={...(0,i.R)(),...e.components};return n?(0,t.jsx)(n,{...e,children:(0,t.jsx)(l,{...e})}):l(e)}},43023:(e,n,o)=>{o.d(n,{R:()=>s,x:()=>d});var r=o(63696);const t={},i=r.createContext(t);function s(e){const n=r.useContext(i);return r.useMemo((function(){return"function"==typeof e?e(n):{...n,...e}}),[n,e])}function d(e){let n;return n=e.disableParentContext?"function"==typeof e.components?e.components(t):e.components||t:s(e.components),r.createElement(i.Provider,{value:n},e.children)}}}]);