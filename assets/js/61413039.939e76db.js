"use strict";(self.webpackChunkdocs=self.webpackChunkdocs||[]).push([[49524],{44031:(e,n,i)=>{i.r(n),i.d(n,{assets:()=>r,contentTitle:()=>o,default:()=>l,frontMatter:()=>c,metadata:()=>s,toc:()=>d});const s=JSON.parse('{"id":"@podman-desktop/namespaces/containerEngine/functions/pushImage","title":"Function: pushImage()","description":"pushImage(engineId, imageId, callback, authInfo?): Promise\\\\","source":"@site/api/@podman-desktop/namespaces/containerEngine/functions/pushImage.md","sourceDirName":"@podman-desktop/namespaces/containerEngine/functions","slug":"/@podman-desktop/namespaces/containerEngine/functions/pushImage","permalink":"/api/@podman-desktop/namespaces/containerEngine/functions/pushImage","draft":false,"unlisted":false,"tags":[],"version":"current","frontMatter":{},"sidebar":"typedocSidebar","previous":{"title":"pullImage","permalink":"/api/@podman-desktop/namespaces/containerEngine/functions/pullImage"},"next":{"title":"pushManifest","permalink":"/api/@podman-desktop/namespaces/containerEngine/functions/pushManifest"}}');var a=i(62540),t=i(43023);const c={},o="Function: pushImage()",r={},d=[{value:"Parameters",id:"parameters",level:2},{value:"engineId",id:"engineid",level:3},{value:"imageId",id:"imageid",level:3},{value:"callback",id:"callback",level:3},{value:"authInfo?",id:"authinfo",level:3},{value:"Returns",id:"returns",level:2}];function h(e){const n={a:"a",blockquote:"blockquote",code:"code",h1:"h1",h2:"h2",h3:"h3",header:"header",p:"p",strong:"strong",...(0,t.R)(),...e.components};return(0,a.jsxs)(a.Fragment,{children:[(0,a.jsx)(n.header,{children:(0,a.jsx)(n.h1,{id:"function-pushimage",children:"Function: pushImage()"})}),"\n",(0,a.jsxs)(n.blockquote,{children:["\n",(0,a.jsxs)(n.p,{children:[(0,a.jsx)(n.strong,{children:"pushImage"}),"(",(0,a.jsx)(n.code,{children:"engineId"}),", ",(0,a.jsx)(n.code,{children:"imageId"}),", ",(0,a.jsx)(n.code,{children:"callback"}),", ",(0,a.jsx)(n.code,{children:"authInfo"}),"?): ",(0,a.jsx)(n.code,{children:"Promise"}),"<",(0,a.jsx)(n.code,{children:"void"}),">"]}),"\n"]}),"\n",(0,a.jsxs)(n.p,{children:["Defined in: ",(0,a.jsx)(n.a,{href:"https://github.com/gastoner/podman-desktop/blob/1c782e1d98f5e3704da8b96d6180bf735100ac50/packages/extension-api/src/extension-api.d.ts#L3873",children:"packages/extension-api/src/extension-api.d.ts:3873"})]}),"\n",(0,a.jsx)(n.p,{children:"Push an image to a registry."}),"\n",(0,a.jsxs)(n.p,{children:["If you wish to push an image on to a private registry, that image must already have a tag which references the registry. For example, ",(0,a.jsx)(n.code,{children:"registry.example.com/myimage:latest"}),"."]}),"\n",(0,a.jsx)(n.h2,{id:"parameters",children:"Parameters"}),"\n",(0,a.jsx)(n.h3,{id:"engineid",children:"engineId"}),"\n",(0,a.jsx)(n.p,{children:(0,a.jsx)(n.code,{children:"string"})}),"\n",(0,a.jsxs)(n.p,{children:["the id of the engine managing the image, obtained from the result of ",(0,a.jsx)(n.a,{href:"/api/@podman-desktop/namespaces/containerEngine/functions/listImages",children:"containerEngine.listImages"})]}),"\n",(0,a.jsx)(n.h3,{id:"imageid",children:"imageId"}),"\n",(0,a.jsx)(n.p,{children:(0,a.jsx)(n.code,{children:"string"})}),"\n",(0,a.jsxs)(n.p,{children:["the id of the image on this engine, obtained from the result of ",(0,a.jsx)(n.a,{href:"/api/@podman-desktop/namespaces/containerEngine/functions/listImages",children:"containerEngine.listImages"})]}),"\n",(0,a.jsx)(n.h3,{id:"callback",children:"callback"}),"\n",(0,a.jsxs)(n.p,{children:["(",(0,a.jsx)(n.code,{children:"name"}),", ",(0,a.jsx)(n.code,{children:"data"}),") => ",(0,a.jsx)(n.code,{children:"void"})]}),"\n",(0,a.jsxs)(n.p,{children:["the function called when new logs are emitted or new events happen on the stream. The value of ",(0,a.jsx)(n.code,{children:"name"})," can be either ",(0,a.jsx)(n.code,{children:"data"}),"(and ",(0,a.jsx)(n.code,{children:"data"})," contains the logs), or ",(0,a.jsx)(n.code,{children:"end"})," indicating the end of the stream, or ",(0,a.jsx)(n.code,{children:"first-message"})," indicating no data has been emitted yet on the stream."]}),"\n",(0,a.jsx)(n.h3,{id:"authinfo",children:"authInfo?"}),"\n",(0,a.jsx)(n.p,{children:(0,a.jsx)(n.a,{href:"/api/interfaces/ContainerAuthInfo",children:(0,a.jsx)(n.code,{children:"ContainerAuthInfo"})})}),"\n",(0,a.jsx)(n.p,{children:"Authentication credentials"}),"\n",(0,a.jsx)(n.h2,{id:"returns",children:"Returns"}),"\n",(0,a.jsxs)(n.p,{children:[(0,a.jsx)(n.code,{children:"Promise"}),"<",(0,a.jsx)(n.code,{children:"void"}),">"]})]})}function l(e={}){const{wrapper:n}={...(0,t.R)(),...e.components};return n?(0,a.jsx)(n,{...e,children:(0,a.jsx)(h,{...e})}):h(e)}},43023:(e,n,i)=>{i.d(n,{R:()=>c,x:()=>o});var s=i(63696);const a={},t=s.createContext(a);function c(e){const n=s.useContext(t);return s.useMemo((function(){return"function"==typeof e?e(n):{...n,...e}}),[n,e])}function o(e){let n;return n=e.disableParentContext?"function"==typeof e.components?e.components(a):e.components||a:c(e.components),s.createElement(t.Provider,{value:n},e.children)}}}]);