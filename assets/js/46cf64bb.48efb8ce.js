(self.webpackChunkdocs=self.webpackChunkdocs||[]).push([[43320,69983],{44656:(e,t,n)=>{"use strict";n.d(t,{A:()=>F});var a=n(63696),s=n(92575),o=n(11750),i=n(27412),l=n(20699),r=n(6590),c=n(33699);const d={collapseSidebarButton:"collapseSidebarButton_oTwn",collapseSidebarButtonIcon:"collapseSidebarButtonIcon_pMEX"};var u=n(62540);function m(e){let{onClick:t}=e;return(0,u.jsx)("button",{type:"button",title:(0,r.T)({id:"theme.docs.sidebar.collapseButtonTitle",message:"Collapse sidebar",description:"The title attribute for collapse button of doc sidebar"}),"aria-label":(0,r.T)({id:"theme.docs.sidebar.collapseButtonAriaLabel",message:"Collapse sidebar",description:"The title attribute for collapse button of doc sidebar"}),className:(0,o.A)("button button--secondary button--outline",d.collapseSidebarButton),onClick:t,children:(0,u.jsx)(c.A,{className:d.collapseSidebarButtonIcon})})}var b=n(53237),p=n(43043),h=n(90766),f=n(22454),x=n(15198);const y=Symbol("EmptyContext"),v=a.createContext(y);function k(e){let{children:t}=e;const[n,s]=(0,a.useState)(null),o=(0,a.useMemo)((()=>({expandedItem:n,setExpandedItem:s})),[n]);return(0,u.jsx)(v.Provider,{value:o,children:t})}var j=n(32432),_=n(34379),A=n(45968),g=n(86681);function C(e){let{collapsed:t,categoryLabel:n,onClick:a}=e;return(0,u.jsx)("button",{"aria-label":t?(0,r.T)({id:"theme.DocSidebarItem.expandCategoryAriaLabel",message:"Expand sidebar category '{label}'",description:"The ARIA label to expand the sidebar category"},{label:n}):(0,r.T)({id:"theme.DocSidebarItem.collapseCategoryAriaLabel",message:"Collapse sidebar category '{label}'",description:"The ARIA label to collapse the sidebar category"},{label:n}),"aria-expanded":!t,type:"button",className:"clean-btn menu__caret",onClick:a})}function S(e){let{item:t,onItemClick:n,activePath:s,level:l,index:r,...c}=e;const{items:d,label:m,collapsible:p,className:h,href:k}=t,{docs:{sidebar:{autoCollapseCategories:S}}}=(0,i.p)(),I=function(e){const t=(0,g.A)();return(0,a.useMemo)((()=>e.href&&!e.linkUnlisted?e.href:!t&&e.collapsible?(0,f.Nr)(e):void 0),[e,t])}(t),N=(0,f.w8)(t,s),w=(0,_.ys)(k,s),{collapsed:L,setCollapsed:E}=(0,j.u)({initialState:()=>!!p&&(!N&&t.collapsed)}),{expandedItem:B,setExpandedItem:T}=function(){const e=(0,a.useContext)(v);if(e===y)throw new x.dV("DocSidebarItemsExpandedStateProvider");return e}(),D=function(e){void 0===e&&(e=!L),T(e?null:r),E(e)};return function(e){let{isActive:t,collapsed:n,updateCollapsed:s}=e;const o=(0,x.ZC)(t);(0,a.useEffect)((()=>{t&&!o&&n&&s(!1)}),[t,o,n,s])}({isActive:N,collapsed:L,updateCollapsed:D}),(0,a.useEffect)((()=>{p&&null!=B&&B!==r&&S&&E(!0)}),[p,B,r,E,S]),(0,u.jsxs)("li",{className:(0,o.A)(b.G.docs.docSidebarItemCategory,b.G.docs.docSidebarItemCategoryLevel(l),"menu__list-item",{"menu__list-item--collapsed":L},h),children:[(0,u.jsxs)("div",{className:(0,o.A)("menu__list-item-collapsible",{"menu__list-item-collapsible--active":w}),children:[(0,u.jsx)(A.A,{className:(0,o.A)("menu__link",{"menu__link--sublist":p,"menu__link--sublist-caret":!k&&p,"menu__link--active":N}),onClick:p?e=>{n?.(t),k?D(!1):(e.preventDefault(),D())}:()=>{n?.(t)},"aria-current":w?"page":void 0,role:p&&!k?"button":void 0,"aria-expanded":p&&!k?!L:void 0,href:p?I??"#":I,...c,children:m}),k&&p&&(0,u.jsx)(C,{collapsed:L,categoryLabel:m,onClick:e=>{e.preventDefault(),D()}})]}),(0,u.jsx)(j.N,{lazy:!0,as:"ul",className:"menu__list",collapsed:L,children:(0,u.jsx)(M,{items:d,tabIndex:L?-1:0,onItemClick:n,activePath:s,level:l+1})})]})}var I=n(52616),N=n(79016);const w={menuExternalLink:"menuExternalLink_BiEj"};function L(e){let{item:t,onItemClick:n,activePath:a,level:s,index:i,...l}=e;const{href:r,label:c,className:d,autoAddBaseUrl:m}=t,p=(0,f.w8)(t,a),h=(0,I.A)(r);return(0,u.jsx)("li",{className:(0,o.A)(b.G.docs.docSidebarItemLink,b.G.docs.docSidebarItemLinkLevel(s),"menu__list-item",d),children:(0,u.jsxs)(A.A,{className:(0,o.A)("menu__link",!h&&w.menuExternalLink,{"menu__link--active":p}),autoAddBaseUrl:m,"aria-current":p?"page":void 0,to:r,...h&&{onClick:n?()=>n(t):void 0},...l,children:[c,!h&&(0,u.jsx)(N.A,{})]})},c)}const E={menuHtmlItem:"menuHtmlItem_OniL"};function B(e){let{item:t,level:n,index:a}=e;const{value:s,defaultStyle:i,className:l}=t;return(0,u.jsx)("li",{className:(0,o.A)(b.G.docs.docSidebarItemLink,b.G.docs.docSidebarItemLinkLevel(n),i&&[E.menuHtmlItem,"menu__list-item"],l),dangerouslySetInnerHTML:{__html:s}},a)}function T(e){let{item:t,...n}=e;switch(t.type){case"category":return(0,u.jsx)(S,{item:t,...n});case"html":return(0,u.jsx)(B,{item:t,...n});default:return(0,u.jsx)(L,{item:t,...n})}}function D(e){let{items:t,...n}=e;const a=(0,f.Y)(t,n.activePath);return(0,u.jsx)(k,{children:a.map(((e,t)=>(0,u.jsx)(T,{item:e,index:t,...n},t)))})}const M=(0,a.memo)(D),H={menu:"menu_jmj1",menuWithAnnouncementBar:"menuWithAnnouncementBar_YufC"};function G(e){let{path:t,sidebar:n,className:s}=e;const i=function(){const{isActive:e}=(0,p.M)(),[t,n]=(0,a.useState)(e);return(0,h.Mq)((t=>{let{scrollY:a}=t;e&&n(0===a)}),[e]),e&&t}();return(0,u.jsx)("nav",{"aria-label":(0,r.T)({id:"theme.docs.sidebar.navAriaLabel",message:"Docs sidebar",description:"The ARIA label for the sidebar navigation"}),className:(0,o.A)("menu thin-scrollbar",H.menu,i&&H.menuWithAnnouncementBar,s),children:(0,u.jsx)("ul",{className:(0,o.A)(b.G.docs.docSidebarMenu,"menu__list"),children:(0,u.jsx)(M,{items:n,activePath:t,level:1})})})}const P="sidebar_CUen",R="sidebarWithHideableNavbar_w4KB",W="sidebarHidden_k6VE",O="sidebarLogo_CYvI";function z(e){let{path:t,sidebar:n,onCollapse:a,isHidden:s}=e;const{navbar:{hideOnScroll:r},docs:{sidebar:{hideable:c}}}=(0,i.p)();return(0,u.jsxs)("div",{className:(0,o.A)(P,r&&R,s&&W),children:[r&&(0,u.jsx)(l.A,{tabIndex:-1,className:O}),(0,u.jsx)(G,{path:t,sidebar:n}),c&&(0,u.jsx)(m,{onClick:a})]})}const U=a.memo(z);var V=n(65454),Y=n(59539);const J=e=>{let{sidebar:t,path:n}=e;const a=(0,Y.M)();return(0,u.jsx)("ul",{className:(0,o.A)(b.G.docs.docSidebarMenu,"menu__list"),children:(0,u.jsx)(M,{items:t,activePath:n,onItemClick:e=>{"category"===e.type&&e.href&&a.toggle(),"link"===e.type&&a.toggle()},level:1})})};function K(e){return(0,u.jsx)(V.GX,{component:J,props:e})}const q=a.memo(K);function F(e){const t=(0,s.l)(),n="desktop"===t||"ssr"===t,a="mobile"===t;return(0,u.jsxs)(u.Fragment,{children:[n&&(0,u.jsx)(U,{...e}),a&&(0,u.jsx)(q,{...e})]})}},33699:(e,t,n)=>{"use strict";n.d(t,{A:()=>s});n(63696);var a=n(62540);function s(e){return(0,a.jsx)("svg",{width:"20",height:"20","aria-hidden":"true",...e,children:(0,a.jsxs)("g",{fill:"#7a7a7a",children:[(0,a.jsx)("path",{d:"M9.992 10.023c0 .2-.062.399-.172.547l-4.996 7.492a.982.982 0 01-.828.454H1c-.55 0-1-.453-1-1 0-.2.059-.403.168-.551l4.629-6.942L.168 3.078A.939.939 0 010 2.528c0-.548.45-.997 1-.997h2.996c.352 0 .649.18.828.45L9.82 9.472c.11.148.172.347.172.55zm0 0"}),(0,a.jsx)("path",{d:"M19.98 10.023c0 .2-.058.399-.168.547l-4.996 7.492a.987.987 0 01-.828.454h-3c-.547 0-.996-.453-.996-1 0-.2.059-.403.168-.551l4.625-6.942-4.625-6.945a.939.939 0 01-.168-.55 1 1 0 01.996-.997h3c.348 0 .649.18.828.45l4.996 7.492c.11.148.168.347.168.55zm0 0"})]})})}},55938:(e,t,n)=>{"use strict";n.r(t),n.d(t,{default:()=>s});n(63696);var a=n(62540);function s(){return(0,a.jsx)("div",{className:"justify-center items-center grow flex w-full",children:(0,a.jsx)("span",{children:"No component selected"})})}},91673:(e,t,n)=>{"use strict";n.r(t),n.d(t,{default:()=>f});var a=n(49519),s=n(72363),o=n(53237),i=n(55938),l=n(44656),r=n(6072),c=n(11750),d=n(63696),u=n(84224),m=n.n(u);const b={docSidebarContainer:"docSidebarContainer_JCC2",docSidebarContainerHidden:"docSidebarContainerHidden_PAws",sidebarViewport:"sidebarViewport_KdtS",storybookRoot:"storybookRoot_nsIy"};var p=n(62540);function h(){const e=(0,d.useRef)(null),{isDarkTheme:t}=(0,s.G)(),{search:n}=(0,a.zy)(),[r,u]=d.useState(void 0);(0,d.useEffect)((()=>{const e=new URLSearchParams(n).get("id");e&&u(e)}),[n]);const h=()=>{e?.current?.contentWindow?.postMessage(JSON.stringify({key:"storybook-channel",event:{type:"DARK_MODE",args:[t]}}))};return(0,d.useEffect)((()=>{h()}),[t]),(0,p.jsxs)("div",{className:(0,c.A)(b.storybookRoot),children:[(0,p.jsx)("aside",{className:(0,c.A)(o.G.docs.docSidebarContainer,b.docSidebarContainer),children:(0,p.jsx)(l.A,{isHidden:!1,onCollapse:()=>{},sidebar:m(),path:"/storybook"})}),r?(0,p.jsx)("iframe",{ref:e,onLoad:t=>{!function(e){const t=e.contentDocument?.body;if(!t)return;new ResizeObserver((n=>{window.requestAnimationFrame((()=>{Array.isArray(n)&&n.length&&(e.style.height=`${t.scrollHeight}px`)}))})).observe(t)}(t.currentTarget),window.addEventListener("message",(t=>{if(t.source!==e?.current?.contentWindow)return;const n=JSON.parse(t.data);"key"in n&&"storybook-channel"===n.key&&"event"in n&&"object"==typeof n.event&&"docsRendered"===n.event.type&&h()}))},src:`/storybook-iframe?id=${r}`,style:{width:"100%",height:"100%"}}):(0,p.jsx)(i.default,{})]})}function f(){return(0,p.jsx)(r.A,{title:"Storybook",children:(0,p.jsx)(h,{})})}},84224:e=>{e.exports=[{type:"category",label:"Button",items:[{type:"link",label:"Docs",href:"/storybook?id=button--docs"},{type:"link",label:"Primary",href:"/storybook?id=button--primary"},{type:"link",label:"Secondary",href:"/storybook?id=button--secondary"},{type:"link",label:"Danger",href:"/storybook?id=button--danger"},{type:"link",label:"With icon",href:"/storybook?id=button--with-icon"},{type:"link",label:"Disabled",href:"/storybook?id=button--disabled"},{type:"link",label:"Loading",href:"/storybook?id=button--loading"}],collapsed:!1,collapsible:!0}]}}]);