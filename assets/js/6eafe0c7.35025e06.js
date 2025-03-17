"use strict";(self.webpackChunkdocs=self.webpackChunkdocs||[]).push([[16256],{10974:(e,n,s)=>{s.r(n),s.d(n,{assets:()=>o,contentTitle:()=>a,default:()=>p,frontMatter:()=>r,metadata:()=>i,toc:()=>c});const i=JSON.parse('{"id":"interfaces/EndpointSettings","title":"Interface: EndpointSettings","description":"Defined in3026","source":"@site/api/interfaces/EndpointSettings.md","sourceDirName":"interfaces","slug":"/interfaces/EndpointSettings","permalink":"/api/interfaces/EndpointSettings","draft":false,"unlisted":false,"tags":[],"version":"current","frontMatter":{},"sidebar":"typedocSidebar","previous":{"title":"EndpointIPAMConfig","permalink":"/api/interfaces/EndpointIPAMConfig"},"next":{"title":"Event","permalink":"/api/interfaces/Event"}}');var d=s(62540),t=s(43023);const r={},a="Interface: EndpointSettings",o={},c=[{value:"Properties",id:"properties",level:2},{value:"Aliases?",id:"aliases",level:3},{value:"DNSNames?",id:"dnsnames",level:3},{value:"DriverOpts?",id:"driveropts",level:3},{value:"Index Signature",id:"index-signature",level:4},{value:"EndpointID?",id:"endpointid",level:3},{value:"Gateway?",id:"gateway",level:3},{value:"GlobalIPv6Address?",id:"globalipv6address",level:3},{value:"GlobalIPv6PrefixLen?",id:"globalipv6prefixlen",level:3},{value:"IPAddress?",id:"ipaddress",level:3},{value:"IPAMConfig?",id:"ipamconfig",level:3},{value:"IPPrefixLen?",id:"ipprefixlen",level:3},{value:"IPv6Gateway?",id:"ipv6gateway",level:3},{value:"Links?",id:"links",level:3},{value:"MacAddress?",id:"macaddress",level:3},{value:"NetworkID?",id:"networkid",level:3}];function l(e){const n={a:"a",blockquote:"blockquote",code:"code",h1:"h1",h2:"h2",h3:"h3",h4:"h4",header:"header",hr:"hr",p:"p",strong:"strong",...(0,t.R)(),...e.components};return(0,d.jsxs)(d.Fragment,{children:[(0,d.jsx)(n.header,{children:(0,d.jsx)(n.h1,{id:"interface-endpointsettings",children:"Interface: EndpointSettings"})}),"\n",(0,d.jsxs)(n.p,{children:["Defined in: ",(0,d.jsx)(n.a,{href:"https://github.com/gastoner/podman-desktop/blob/1c782e1d98f5e3704da8b96d6180bf735100ac50/packages/extension-api/src/extension-api.d.ts#L3026",children:"packages/extension-api/src/extension-api.d.ts:3026"})]}),"\n",(0,d.jsx)(n.h2,{id:"properties",children:"Properties"}),"\n",(0,d.jsx)(n.h3,{id:"aliases",children:"Aliases?"}),"\n",(0,d.jsxs)(n.blockquote,{children:["\n",(0,d.jsxs)(n.p,{children:[(0,d.jsx)(n.code,{children:"optional"})," ",(0,d.jsx)(n.strong,{children:"Aliases"}),": ",(0,d.jsx)(n.code,{children:"string"}),"[]"]}),"\n"]}),"\n",(0,d.jsxs)(n.p,{children:["Defined in: ",(0,d.jsx)(n.a,{href:"https://github.com/gastoner/podman-desktop/blob/1c782e1d98f5e3704da8b96d6180bf735100ac50/packages/extension-api/src/extension-api.d.ts#L3039",children:"packages/extension-api/src/extension-api.d.ts:3039"})]}),"\n",(0,d.jsx)(n.hr,{}),"\n",(0,d.jsx)(n.h3,{id:"dnsnames",children:"DNSNames?"}),"\n",(0,d.jsxs)(n.blockquote,{children:["\n",(0,d.jsxs)(n.p,{children:[(0,d.jsx)(n.code,{children:"optional"})," ",(0,d.jsx)(n.strong,{children:"DNSNames"}),": ",(0,d.jsx)(n.code,{children:"string"}),"[]"]}),"\n"]}),"\n",(0,d.jsxs)(n.p,{children:["Defined in: ",(0,d.jsx)(n.a,{href:"https://github.com/gastoner/podman-desktop/blob/1c782e1d98f5e3704da8b96d6180bf735100ac50/packages/extension-api/src/extension-api.d.ts#L3094",children:"packages/extension-api/src/extension-api.d.ts:3094"})]}),"\n",(0,d.jsx)(n.p,{children:"List of all DNS names an endpoint has on a specific network. This list is based on the container name, network\naliases, container short ID, and hostname."}),"\n",(0,d.jsxs)(n.p,{children:["These DNS names are non-fully qualified but can contain several dots. You can get fully qualified DNS names by\nappending ",(0,d.jsx)(n.code,{children:".<network-name>"}),". For instance, if container name is ",(0,d.jsx)(n.code,{children:"my.ctr"})," and the network is named\n",(0,d.jsx)(n.code,{children:"testnet"}),", ",(0,d.jsx)(n.code,{children:"DNSNames"})," will contain ",(0,d.jsx)(n.code,{children:"my.ctr"})," and the FQDN will be ",(0,d.jsx)(n.code,{children:"my.ctr.testnet"}),"."]}),"\n",(0,d.jsx)(n.hr,{}),"\n",(0,d.jsx)(n.h3,{id:"driveropts",children:"DriverOpts?"}),"\n",(0,d.jsxs)(n.blockquote,{children:["\n",(0,d.jsxs)(n.p,{children:[(0,d.jsx)(n.code,{children:"optional"})," ",(0,d.jsx)(n.strong,{children:"DriverOpts"}),": ",(0,d.jsx)(n.code,{children:"object"})]}),"\n"]}),"\n",(0,d.jsxs)(n.p,{children:["Defined in: ",(0,d.jsx)(n.a,{href:"https://github.com/gastoner/podman-desktop/blob/1c782e1d98f5e3704da8b96d6180bf735100ac50/packages/extension-api/src/extension-api.d.ts#L3084",children:"packages/extension-api/src/extension-api.d.ts:3084"})]}),"\n",(0,d.jsx)(n.p,{children:"DriverOpts is a mapping of driver options and values. These options are passed directly to the driver and are driver specific."}),"\n",(0,d.jsx)(n.h4,{id:"index-signature",children:"Index Signature"}),"\n",(0,d.jsxs)(n.p,{children:["[",(0,d.jsx)(n.code,{children:"key"}),": ",(0,d.jsx)(n.code,{children:"string"}),"]: ",(0,d.jsx)(n.code,{children:"string"})]}),"\n",(0,d.jsx)(n.hr,{}),"\n",(0,d.jsx)(n.h3,{id:"endpointid",children:"EndpointID?"}),"\n",(0,d.jsxs)(n.blockquote,{children:["\n",(0,d.jsxs)(n.p,{children:[(0,d.jsx)(n.code,{children:"optional"})," ",(0,d.jsx)(n.strong,{children:"EndpointID"}),": ",(0,d.jsx)(n.code,{children:"string"})]}),"\n"]}),"\n",(0,d.jsxs)(n.p,{children:["Defined in: ",(0,d.jsx)(n.a,{href:"https://github.com/gastoner/podman-desktop/blob/1c782e1d98f5e3704da8b96d6180bf735100ac50/packages/extension-api/src/extension-api.d.ts#L3049",children:"packages/extension-api/src/extension-api.d.ts:3049"})]}),"\n",(0,d.jsx)(n.p,{children:"Unique ID for the service endpoint in a Sandbox."}),"\n",(0,d.jsx)(n.hr,{}),"\n",(0,d.jsx)(n.h3,{id:"gateway",children:"Gateway?"}),"\n",(0,d.jsxs)(n.blockquote,{children:["\n",(0,d.jsxs)(n.p,{children:[(0,d.jsx)(n.code,{children:"optional"})," ",(0,d.jsx)(n.strong,{children:"Gateway"}),": ",(0,d.jsx)(n.code,{children:"string"})]}),"\n"]}),"\n",(0,d.jsxs)(n.p,{children:["Defined in: ",(0,d.jsx)(n.a,{href:"https://github.com/gastoner/podman-desktop/blob/1c782e1d98f5e3704da8b96d6180bf735100ac50/packages/extension-api/src/extension-api.d.ts#L3054",children:"packages/extension-api/src/extension-api.d.ts:3054"})]}),"\n",(0,d.jsx)(n.p,{children:"Gateway address for this network."}),"\n",(0,d.jsx)(n.hr,{}),"\n",(0,d.jsx)(n.h3,{id:"globalipv6address",children:"GlobalIPv6Address?"}),"\n",(0,d.jsxs)(n.blockquote,{children:["\n",(0,d.jsxs)(n.p,{children:[(0,d.jsx)(n.code,{children:"optional"})," ",(0,d.jsx)(n.strong,{children:"GlobalIPv6Address"}),": ",(0,d.jsx)(n.code,{children:"string"})]}),"\n"]}),"\n",(0,d.jsxs)(n.p,{children:["Defined in: ",(0,d.jsx)(n.a,{href:"https://github.com/gastoner/podman-desktop/blob/1c782e1d98f5e3704da8b96d6180bf735100ac50/packages/extension-api/src/extension-api.d.ts#L3074",children:"packages/extension-api/src/extension-api.d.ts:3074"})]}),"\n",(0,d.jsx)(n.p,{children:"Global IPv6 address."}),"\n",(0,d.jsx)(n.hr,{}),"\n",(0,d.jsx)(n.h3,{id:"globalipv6prefixlen",children:"GlobalIPv6PrefixLen?"}),"\n",(0,d.jsxs)(n.blockquote,{children:["\n",(0,d.jsxs)(n.p,{children:[(0,d.jsx)(n.code,{children:"optional"})," ",(0,d.jsx)(n.strong,{children:"GlobalIPv6PrefixLen"}),": ",(0,d.jsx)(n.code,{children:"number"})]}),"\n"]}),"\n",(0,d.jsxs)(n.p,{children:["Defined in: ",(0,d.jsx)(n.a,{href:"https://github.com/gastoner/podman-desktop/blob/1c782e1d98f5e3704da8b96d6180bf735100ac50/packages/extension-api/src/extension-api.d.ts#L3079",children:"packages/extension-api/src/extension-api.d.ts:3079"})]}),"\n",(0,d.jsx)(n.p,{children:"Mask length of the global IPv6 address."}),"\n",(0,d.jsx)(n.hr,{}),"\n",(0,d.jsx)(n.h3,{id:"ipaddress",children:"IPAddress?"}),"\n",(0,d.jsxs)(n.blockquote,{children:["\n",(0,d.jsxs)(n.p,{children:[(0,d.jsx)(n.code,{children:"optional"})," ",(0,d.jsx)(n.strong,{children:"IPAddress"}),": ",(0,d.jsx)(n.code,{children:"string"})]}),"\n"]}),"\n",(0,d.jsxs)(n.p,{children:["Defined in: ",(0,d.jsx)(n.a,{href:"https://github.com/gastoner/podman-desktop/blob/1c782e1d98f5e3704da8b96d6180bf735100ac50/packages/extension-api/src/extension-api.d.ts#L3059",children:"packages/extension-api/src/extension-api.d.ts:3059"})]}),"\n",(0,d.jsx)(n.p,{children:"IPv4 address."}),"\n",(0,d.jsx)(n.hr,{}),"\n",(0,d.jsx)(n.h3,{id:"ipamconfig",children:"IPAMConfig?"}),"\n",(0,d.jsxs)(n.blockquote,{children:["\n",(0,d.jsxs)(n.p,{children:[(0,d.jsx)(n.code,{children:"optional"})," ",(0,d.jsx)(n.strong,{children:"IPAMConfig"}),": ",(0,d.jsx)(n.a,{href:"/api/interfaces/EndpointIPAMConfig",children:(0,d.jsx)(n.code,{children:"EndpointIPAMConfig"})})]}),"\n"]}),"\n",(0,d.jsxs)(n.p,{children:["Defined in: ",(0,d.jsx)(n.a,{href:"https://github.com/gastoner/podman-desktop/blob/1c782e1d98f5e3704da8b96d6180bf735100ac50/packages/extension-api/src/extension-api.d.ts#L3030",children:"packages/extension-api/src/extension-api.d.ts:3030"})]}),"\n",(0,d.jsx)(n.p,{children:"EndpointIPAMConfig represents an endpoint's IPAM configuration."}),"\n",(0,d.jsx)(n.hr,{}),"\n",(0,d.jsx)(n.h3,{id:"ipprefixlen",children:"IPPrefixLen?"}),"\n",(0,d.jsxs)(n.blockquote,{children:["\n",(0,d.jsxs)(n.p,{children:[(0,d.jsx)(n.code,{children:"optional"})," ",(0,d.jsx)(n.strong,{children:"IPPrefixLen"}),": ",(0,d.jsx)(n.code,{children:"number"})]}),"\n"]}),"\n",(0,d.jsxs)(n.p,{children:["Defined in: ",(0,d.jsx)(n.a,{href:"https://github.com/gastoner/podman-desktop/blob/1c782e1d98f5e3704da8b96d6180bf735100ac50/packages/extension-api/src/extension-api.d.ts#L3064",children:"packages/extension-api/src/extension-api.d.ts:3064"})]}),"\n",(0,d.jsx)(n.p,{children:"Mask length of the IPv4 address."}),"\n",(0,d.jsx)(n.hr,{}),"\n",(0,d.jsx)(n.h3,{id:"ipv6gateway",children:"IPv6Gateway?"}),"\n",(0,d.jsxs)(n.blockquote,{children:["\n",(0,d.jsxs)(n.p,{children:[(0,d.jsx)(n.code,{children:"optional"})," ",(0,d.jsx)(n.strong,{children:"IPv6Gateway"}),": ",(0,d.jsx)(n.code,{children:"string"})]}),"\n"]}),"\n",(0,d.jsxs)(n.p,{children:["Defined in: ",(0,d.jsx)(n.a,{href:"https://github.com/gastoner/podman-desktop/blob/1c782e1d98f5e3704da8b96d6180bf735100ac50/packages/extension-api/src/extension-api.d.ts#L3069",children:"packages/extension-api/src/extension-api.d.ts:3069"})]}),"\n",(0,d.jsx)(n.p,{children:"IPv6 gateway address."}),"\n",(0,d.jsx)(n.hr,{}),"\n",(0,d.jsx)(n.h3,{id:"links",children:"Links?"}),"\n",(0,d.jsxs)(n.blockquote,{children:["\n",(0,d.jsxs)(n.p,{children:[(0,d.jsx)(n.code,{children:"optional"})," ",(0,d.jsx)(n.strong,{children:"Links"}),": ",(0,d.jsx)(n.code,{children:"string"}),"[]"]}),"\n"]}),"\n",(0,d.jsxs)(n.p,{children:["Defined in: ",(0,d.jsx)(n.a,{href:"https://github.com/gastoner/podman-desktop/blob/1c782e1d98f5e3704da8b96d6180bf735100ac50/packages/extension-api/src/extension-api.d.ts#L3032",children:"packages/extension-api/src/extension-api.d.ts:3032"})]}),"\n",(0,d.jsx)(n.hr,{}),"\n",(0,d.jsx)(n.h3,{id:"macaddress",children:"MacAddress?"}),"\n",(0,d.jsxs)(n.blockquote,{children:["\n",(0,d.jsxs)(n.p,{children:[(0,d.jsx)(n.code,{children:"optional"})," ",(0,d.jsx)(n.strong,{children:"MacAddress"}),": ",(0,d.jsx)(n.code,{children:"string"})]}),"\n"]}),"\n",(0,d.jsxs)(n.p,{children:["Defined in: ",(0,d.jsx)(n.a,{href:"https://github.com/gastoner/podman-desktop/blob/1c782e1d98f5e3704da8b96d6180bf735100ac50/packages/extension-api/src/extension-api.d.ts#L3037",children:"packages/extension-api/src/extension-api.d.ts:3037"})]}),"\n",(0,d.jsx)(n.p,{children:"MAC address for the endpoint on this network. The network driver might ignore this parameter."}),"\n",(0,d.jsx)(n.hr,{}),"\n",(0,d.jsx)(n.h3,{id:"networkid",children:"NetworkID?"}),"\n",(0,d.jsxs)(n.blockquote,{children:["\n",(0,d.jsxs)(n.p,{children:[(0,d.jsx)(n.code,{children:"optional"})," ",(0,d.jsx)(n.strong,{children:"NetworkID"}),": ",(0,d.jsx)(n.code,{children:"string"})]}),"\n"]}),"\n",(0,d.jsxs)(n.p,{children:["Defined in: ",(0,d.jsx)(n.a,{href:"https://github.com/gastoner/podman-desktop/blob/1c782e1d98f5e3704da8b96d6180bf735100ac50/packages/extension-api/src/extension-api.d.ts#L3044",children:"packages/extension-api/src/extension-api.d.ts:3044"})]}),"\n",(0,d.jsx)(n.p,{children:"Unique ID of the network."})]})}function p(e={}){const{wrapper:n}={...(0,t.R)(),...e.components};return n?(0,d.jsx)(n,{...e,children:(0,d.jsx)(l,{...e})}):l(e)}},43023:(e,n,s)=>{s.d(n,{R:()=>r,x:()=>a});var i=s(63696);const d={},t=i.createContext(d);function r(e){const n=i.useContext(t);return i.useMemo((function(){return"function"==typeof e?e(n):{...n,...e}}),[n,e])}function a(e){let n;return n=e.disableParentContext?"function"==typeof e.components?e.components(d):e.components||d:r(e.components),i.createElement(t.Provider,{value:n},e.children)}}}]);