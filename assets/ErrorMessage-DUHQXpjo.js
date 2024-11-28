import{n as R,D as U,m as B,p as G,E as X,o as l,i as I,q as w,e as C,a as g,b as J,t as h,F as Y,h as y,s as F,j as D,f as P,k as q,w as M}from"./index-server-BWXoUGKu.js";import{a as Z,b as S,s as K,F as W}from"./fa-layers-text.svelte_svelte_type_style_lang-Dv0PbGLR.js";import{b as H,t as d}from"./class-CpYO3Q9S.js";import{h as A}from"./index-CjazBG91.js";const m=[];function $(i,e=R){let s=null;const t=new Set;function p(o){if(U(i,o)&&(i=o,s)){const f=!m.length;for(const a of t)a[1](),m.push(a,i);if(f){for(let a=0;a<m.length;a+=2)m[a][0](m[a+1]);m.length=0}}}function c(o){p(o(i))}function b(o,f=R){const a=[o,f];return t.add(a),t.size===1&&(s=e(p,c)||R),o(i),()=>{t.delete(a),t.size===0&&s&&(s(),s=null)}}return{set:p,update:c,subscribe:b}}const T=ee();function ee(){const i=$(!1);return window.addEventListener("tooltip-show",()=>{T.set(!1)}),window.addEventListener("tooltip-hide",()=>{T.set(!0)}),i}var te=h('<div aria-label="tooltip"> </div>'),ae=h('<div class="inline-block rounded-md bg-[var(--pd-tooltip-bg)] text-[var(--pd-tooltip-text)] border-[1px] border-[var(--pd-tooltip-border)]" aria-label="tooltip"><!></div>'),le=h('<div class="relative inline-block"><span><!></span> <div class="whitespace-nowrap absolute tooltip opacity-0 inline-block transition-opacity duration-150 ease-in-out pointer-events-none text-sm z-[60] svelte-1ln5cwi"><!> <!></div></div>');function N(i,e){const s=Z(e),t=B(e,["children","$$slots","$$events","$$legacy"]);G(e,!1);const p=X(),c=()=>Y(T,"$tooltipHidden",p);let b=l(e,"tip",8,void 0),o=l(e,"top",8,!1),f=l(e,"topLeft",8,!1),a=l(e,"topRight",8,!1),k=l(e,"right",8,!1),n=l(e,"bottom",8,!1),u=l(e,"bottomLeft",8,!1),_=l(e,"bottomRight",8,!1),x=l(e,"left",8,!1);I();var V=le(),z=y(V),O=y(z);S(O,e,"default",{});var r=F(z,2),j=y(r);w(j,()=>b()&&!c(),E=>{var v=te(),L=y(v);C(()=>{H(v,`inline-block py-2 px-4 rounded-md bg-[var(--pd-tooltip-bg)] text-[var(--pd-tooltip-text)] border-[1px] border-[var(--pd-tooltip-border)] ${t.class??""} svelte-1ln5cwi`),K(L,b())}),g(E,v)});var Q=F(j,2);w(Q,()=>s.tip&&!b()&&!c(),E=>{var v=ae(),L=y(v);S(L,e,"tip",{}),g(E,v)}),C(()=>{H(z,`group tooltip-slot ${t.class??""} svelte-1ln5cwi`),d(r,"left",x()),d(r,"right",k()),d(r,"bottom",n()),d(r,"top",o()),d(r,"top-left",f()),d(r,"top-right",a()),d(r,"bottom-left",u()),d(r,"bottom-right",_())}),g(i,V),J()}N.__docgen={keywords:[],data:[{name:"tip",visibility:"public",keywords:[],kind:"let",type:{kind:"type",type:"string",text:"string"},static:!1,readonly:!1},{name:"top",visibility:"public",keywords:[],kind:"let",type:{kind:"type",type:"boolean",text:"boolean"},static:!1,readonly:!1,defaultValue:"false"},{name:"topLeft",visibility:"public",keywords:[],kind:"let",type:{kind:"type",type:"boolean",text:"boolean"},static:!1,readonly:!1,defaultValue:"false"},{name:"topRight",visibility:"public",keywords:[],kind:"let",type:{kind:"type",type:"boolean",text:"boolean"},static:!1,readonly:!1,defaultValue:"false"},{name:"right",visibility:"public",keywords:[],kind:"let",type:{kind:"type",type:"boolean",text:"boolean"},static:!1,readonly:!1,defaultValue:"false"},{name:"bottom",visibility:"public",keywords:[],kind:"let",type:{kind:"type",type:"boolean",text:"boolean"},static:!1,readonly:!1,defaultValue:"false"},{name:"bottomLeft",visibility:"public",keywords:[],kind:"let",type:{kind:"type",type:"boolean",text:"boolean"},static:!1,readonly:!1,defaultValue:"false"},{name:"bottomRight",visibility:"public",keywords:[],kind:"let",type:{kind:"type",type:"boolean",text:"boolean"},static:!1,readonly:!1,defaultValue:"false"},{name:"left",visibility:"public",keywords:[],kind:"let",type:{kind:"type",type:"boolean",text:"boolean"},static:!1,readonly:!1,defaultValue:"false"}],name:"Tooltip.svelte"};var ie=h('<div><!> <div role="alert" aria-label="Error Message Content" class="ml-2"> </div></div>');function oe(i,e){const s=B(e,["children","$$slots","$$events","$$legacy"]);G(e,!1);let t=l(e,"error",8),p=l(e,"icon",8,!1);l(e,"wrapMessage",8,!1);let c=M(""),b=M(!1),o=M(!1);I();var f=D(),a=P(f);w(a,p,k=>{var n=D(),u=P(n);w(u,()=>t()!==void 0&&t()!=="",_=>{N(_,{get left(){return q(b)},get top(){return q(o)},get tip(){return t()},get class(){return q(c)},children:(x,V)=>{W(x,{size:"1.1x",get class(){return`cursor-pointer text-[var(--pd-state-error)] ${s.class??""}`},icon:A})},$$slots:{default:!0}})}),g(k,n)},k=>{var n=ie(),u=y(n);W(u,{size:"1.1x",class:"cursor-pointer text-[var(--pd-state-error)]",icon:A});var _=F(u,2),x=y(_);C(()=>{H(n,`text-[var(--pd-state-error)] p-1 flex flex-row items-center ${s.class??""}`),d(n,"opacity-0",t()===void 0||t()===""),K(x,t())}),g(k,n)}),g(i,f),J()}oe.__docgen={keywords:[],data:[{name:"error",visibility:"public",keywords:[{name:"required",description:""}],kind:"let",type:{kind:"type",type:"string",text:"string"},static:!1,readonly:!1},{name:"icon",visibility:"public",keywords:[],kind:"let",type:{kind:"type",type:"boolean",text:"boolean"},static:!1,readonly:!1,defaultValue:"false"},{name:"wrapMessage",visibility:"public",keywords:[],kind:"let",type:{kind:"type",type:"boolean",text:"boolean"},static:!1,readonly:!1,defaultValue:"false"}],name:"ErrorMessage.svelte"};export{oe as E,N as T};
