"use strict";(self.webpackChunkdocs=self.webpackChunkdocs||[]).push([[68833],{55353:(e,n,s)=>{s.r(n),s.d(n,{assets:()=>l,contentTitle:()=>d,default:()=>h,frontMatter:()=>r,metadata:()=>c,toc:()=>o});var t=s(62540),i=s(43023);const r={},d="Class: EventEmitter<T>",c={id:"classes/EventEmitter",title:"Class: EventEmitter\\<T\\>",description:"A class to create and manage an Event for clients to subscribe to.",source:"@site/api/classes/EventEmitter.md",sourceDirName:"classes",slug:"/classes/EventEmitter",permalink:"/api/classes/EventEmitter",draft:!1,unlisted:!1,tags:[],version:"current",frontMatter:{},sidebar:"typedocSidebar",previous:{title:"Disposable",permalink:"/api/classes/Disposable"},next:{title:"TelemetryTrustedValue",permalink:"/api/classes/TelemetryTrustedValue"}},l={},o=[{value:"Type Parameters",id:"type-parameters",level:2},{value:"Constructors",id:"constructors",level:2},{value:"new EventEmitter()",id:"new-eventemitter",level:3},{value:"Returns",id:"returns",level:4},{value:"Properties",id:"properties",level:2},{value:"event",id:"event",level:3},{value:"Defined in",id:"defined-in",level:4},{value:"Methods",id:"methods",level:2},{value:"dispose()",id:"dispose",level:3},{value:"Returns",id:"returns-1",level:4},{value:"Defined in",id:"defined-in-1",level:4},{value:"fire()",id:"fire",level:3},{value:"Parameters",id:"parameters",level:4},{value:"Returns",id:"returns-2",level:4},{value:"Defined in",id:"defined-in-2",level:4}];function a(e){const n={a:"a",blockquote:"blockquote",code:"code",h1:"h1",h2:"h2",h3:"h3",h4:"h4",header:"header",hr:"hr",p:"p",strong:"strong",...(0,i.R)(),...e.components};return(0,t.jsxs)(t.Fragment,{children:[(0,t.jsx)(n.header,{children:(0,t.jsx)(n.h1,{id:"class-eventemittert",children:"Class: EventEmitter<T>"})}),"\n",(0,t.jsxs)(n.p,{children:["A class to create and manage an ",(0,t.jsx)(n.a,{href:"/api/interfaces/Event",children:"Event"})," for clients to subscribe to.\nThe emitter can only send one kind of event."]}),"\n",(0,t.jsx)(n.p,{children:"Use this class to send events inside extension or provide API to the other\nextensions."}),"\n",(0,t.jsx)(n.h2,{id:"type-parameters",children:"Type Parameters"}),"\n",(0,t.jsxs)(n.p,{children:["\u2022 ",(0,t.jsx)(n.strong,{children:"T"})]}),"\n",(0,t.jsx)(n.h2,{id:"constructors",children:"Constructors"}),"\n",(0,t.jsx)(n.h3,{id:"new-eventemitter",children:"new EventEmitter()"}),"\n",(0,t.jsxs)(n.blockquote,{children:["\n",(0,t.jsxs)(n.p,{children:[(0,t.jsx)(n.strong,{children:"new EventEmitter"}),"<",(0,t.jsx)(n.code,{children:"T"}),">(): ",(0,t.jsx)(n.a,{href:"/api/classes/EventEmitter",children:(0,t.jsx)(n.code,{children:"EventEmitter"})}),"<",(0,t.jsx)(n.code,{children:"T"}),">"]}),"\n"]}),"\n",(0,t.jsx)(n.h4,{id:"returns",children:"Returns"}),"\n",(0,t.jsxs)(n.p,{children:[(0,t.jsx)(n.a,{href:"/api/classes/EventEmitter",children:(0,t.jsx)(n.code,{children:"EventEmitter"})}),"<",(0,t.jsx)(n.code,{children:"T"}),">"]}),"\n",(0,t.jsx)(n.h2,{id:"properties",children:"Properties"}),"\n",(0,t.jsx)(n.h3,{id:"event",children:"event"}),"\n",(0,t.jsxs)(n.blockquote,{children:["\n",(0,t.jsxs)(n.p,{children:[(0,t.jsx)(n.strong,{children:"event"}),": ",(0,t.jsx)(n.a,{href:"/api/interfaces/Event",children:(0,t.jsx)(n.code,{children:"Event"})}),"<",(0,t.jsx)(n.code,{children:"T"}),">"]}),"\n"]}),"\n",(0,t.jsx)(n.p,{children:"For the public to allow to subscribe to events from this Emitter"}),"\n",(0,t.jsx)(n.h4,{id:"defined-in",children:"Defined in"}),"\n",(0,t.jsx)(n.p,{children:(0,t.jsx)(n.a,{href:"https://github.com/gastoner/podman-desktop/blob/3e586a5673074fd98352d41d9200f83f8dc8c285/packages/extension-api/src/extension-api.d.ts#L139",children:"packages/extension-api/src/extension-api.d.ts:139"})}),"\n",(0,t.jsx)(n.h2,{id:"methods",children:"Methods"}),"\n",(0,t.jsx)(n.h3,{id:"dispose",children:"dispose()"}),"\n",(0,t.jsxs)(n.blockquote,{children:["\n",(0,t.jsxs)(n.p,{children:[(0,t.jsx)(n.strong,{children:"dispose"}),"(): ",(0,t.jsx)(n.code,{children:"void"})]}),"\n"]}),"\n",(0,t.jsx)(n.p,{children:"Dispose by removing registered listeners"}),"\n",(0,t.jsx)(n.h4,{id:"returns-1",children:"Returns"}),"\n",(0,t.jsx)(n.p,{children:(0,t.jsx)(n.code,{children:"void"})}),"\n",(0,t.jsx)(n.h4,{id:"defined-in-1",children:"Defined in"}),"\n",(0,t.jsx)(n.p,{children:(0,t.jsx)(n.a,{href:"https://github.com/gastoner/podman-desktop/blob/3e586a5673074fd98352d41d9200f83f8dc8c285/packages/extension-api/src/extension-api.d.ts#L148",children:"packages/extension-api/src/extension-api.d.ts:148"})}),"\n",(0,t.jsx)(n.hr,{}),"\n",(0,t.jsx)(n.h3,{id:"fire",children:"fire()"}),"\n",(0,t.jsxs)(n.blockquote,{children:["\n",(0,t.jsxs)(n.p,{children:[(0,t.jsx)(n.strong,{children:"fire"}),"(",(0,t.jsx)(n.code,{children:"data"}),"): ",(0,t.jsx)(n.code,{children:"void"})]}),"\n"]}),"\n",(0,t.jsx)(n.p,{children:"To fire an event to the subscribers"}),"\n",(0,t.jsx)(n.h4,{id:"parameters",children:"Parameters"}),"\n",(0,t.jsxs)(n.p,{children:["\u2022 ",(0,t.jsx)(n.strong,{children:"data"}),": ",(0,t.jsx)(n.code,{children:"T"})]}),"\n",(0,t.jsx)(n.p,{children:"The event to send to the registered listeners"}),"\n",(0,t.jsx)(n.h4,{id:"returns-2",children:"Returns"}),"\n",(0,t.jsx)(n.p,{children:(0,t.jsx)(n.code,{children:"void"})}),"\n",(0,t.jsx)(n.h4,{id:"defined-in-2",children:"Defined in"}),"\n",(0,t.jsx)(n.p,{children:(0,t.jsx)(n.a,{href:"https://github.com/gastoner/podman-desktop/blob/3e586a5673074fd98352d41d9200f83f8dc8c285/packages/extension-api/src/extension-api.d.ts#L144",children:"packages/extension-api/src/extension-api.d.ts:144"})})]})}function h(e={}){const{wrapper:n}={...(0,i.R)(),...e.components};return n?(0,t.jsx)(n,{...e,children:(0,t.jsx)(a,{...e})}):a(e)}},43023:(e,n,s)=>{s.d(n,{R:()=>d,x:()=>c});var t=s(63696);const i={},r=t.createContext(i);function d(e){const n=t.useContext(r);return t.useMemo((function(){return"function"==typeof e?e(n):{...n,...e}}),[n,e])}function c(e){let n;return n=e.disableParentContext?"function"==typeof e.components?e.components(i):e.components||i:d(e.components),t.createElement(r.Provider,{value:n},e.children)}}}]);