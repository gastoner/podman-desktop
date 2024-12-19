"use strict";(self.webpackChunkdocs=self.webpackChunkdocs||[]).push([[72456],{18784:(e,o,s)=>{s.r(o),s.d(o,{assets:()=>d,contentTitle:()=>c,default:()=>u,frontMatter:()=>r,metadata:()=>n,toc:()=>l});const n=JSON.parse('{"id":"compose/troubleshooting","title":"Troubleshooting Compose","description":"Troubleshooting compose issues","source":"@site/docs/compose/troubleshooting.md","sourceDirName":"compose","slug":"/compose/troubleshooting","permalink":"/docs/compose/troubleshooting","draft":false,"unlisted":false,"editUrl":"https://github.com/podman-desktop/podman-desktop/tree/main/website/docs/compose/troubleshooting.md","tags":[{"inline":true,"label":"compose","permalink":"/docs/tags/compose"}],"version":"current","sidebarPosition":3,"frontMatter":{"title":"Troubleshooting Compose","description":"Troubleshooting compose issues","sidebar_position":3,"keywords":["compose"],"tags":["compose"]},"sidebar":"mySidebar","previous":{"title":"Running Compose files","permalink":"/docs/compose/running-compose"},"next":{"title":"Kubernetes","permalink":"/docs/kubernetes/"}}');var t=s(62540),i=s(43023);const r={title:"Troubleshooting Compose",description:"Troubleshooting compose issues",sidebar_position:3,keywords:["compose"],tags:["compose"]},c="Troubleshooting Compose",d={},l=[{value:"Registry authentication issues",id:"registry-authentication-issues",level:2},{value:"Issues encountered",id:"issues-encountered",level:3},{value:"Solution",id:"solution",level:3}];function a(e){const o={code:"code",h1:"h1",h2:"h2",h3:"h3",header:"header",p:"p",pre:"pre",...(0,i.R)(),...e.components};return(0,t.jsxs)(t.Fragment,{children:[(0,t.jsx)(o.header,{children:(0,t.jsx)(o.h1,{id:"troubleshooting-compose",children:"Troubleshooting Compose"})}),"\n",(0,t.jsx)(o.h2,{id:"registry-authentication-issues",children:"Registry authentication issues"}),"\n",(0,t.jsxs)(o.p,{children:["The Compose binary will prioritize the configuration file ",(0,t.jsx)(o.code,{children:"~/.docker/config"})," over Podman credentials."]}),"\n",(0,t.jsx)(o.h3,{id:"issues-encountered",children:"Issues encountered"}),"\n",(0,t.jsxs)(o.p,{children:[(0,t.jsx)(o.code,{children:"docker-credential-desktop"})," missing:"]}),"\n",(0,t.jsx)(o.pre,{children:(0,t.jsx)(o.code,{className:"language-console",children:"docker.credentials.errors.InitializationError: docker-credential-desktop not installed or not available in PATH\n"})}),"\n",(0,t.jsx)(o.p,{children:"Authentication access:"}),"\n",(0,t.jsx)(o.pre,{children:(0,t.jsx)(o.code,{className:"language-console",children:'Error response from daemon: {"message":"denied: requested access to the resource is denied"}\nError: executing /usr/local/bin/docker-compose up: exit status 18\n'})}),"\n",(0,t.jsx)(o.h3,{id:"solution",children:"Solution"}),"\n",(0,t.jsxs)(o.p,{children:["Delete the ",(0,t.jsx)(o.code,{children:"~/.docker/config"})," to clear any errors."]})]})}function u(e={}){const{wrapper:o}={...(0,i.R)(),...e.components};return o?(0,t.jsx)(o,{...e,children:(0,t.jsx)(a,{...e})}):a(e)}},43023:(e,o,s)=>{s.d(o,{R:()=>r,x:()=>c});var n=s(63696);const t={},i=n.createContext(t);function r(e){const o=n.useContext(i);return n.useMemo((function(){return"function"==typeof e?e(o):{...o,...e}}),[o,e])}function c(e){let o;return o=e.disableParentContext?"function"==typeof e.components?e.components(t):e.components||t:r(e.components),n.createElement(i.Provider,{value:o},e.children)}}}]);