import{n as q,O as X,o as D,p as G,P as Y,q as a,i as I,r as k,e as T,g as J,a as x,b as K,t as z,Q as Z,j as u,s as F,v as R,k as Q,f as S,l as C,x as H}from"./props-il5t6E-v.js";import{b as P,t as d}from"./class-BSk1nPQK.js";import{o as $}from"./index-client-TXN-KZvd.js";import{h as W}from"./index-D45Brjt-.js";import{s as tt,a as A,F as B}from"./fa-layers-text.svelte_svelte_type_style_lang-B2XT_i-H.js";const _=[];function et(r,t=q){let i=null;const e=new Set;function p(s){if(X(r,s)&&(r=s,i)){const f=!_.length;for(const o of e)o[1](),_.push(o,r);if(f){for(let o=0;o<_.length;o+=2)_[o][0](_[o+1]);_.length=0}}}function v(s){p(s(r))}function c(s,f=q){const o=[s,f];return e.add(o),e.size===1&&(i=t(p,v)||q),s(r),()=>{e.delete(o),e.size===0&&i&&(i(),i=null)}}return{set:p,update:v,subscribe:c}}const j=ot();function ot(){const r=et(!1);return window.addEventListener("tooltip-show",()=>{j.set(!1)}),window.addEventListener("tooltip-hide",()=>{j.set(!0)}),r}var st=z('<div aria-label="tooltip"> </div>'),at=z('<div class="inline-block rounded-md bg-[var(--pd-tooltip-bg)] text-[var(--pd-tooltip-text)] border-[1px] border-[var(--pd-tooltip-border)]" aria-label="tooltip"><!></div>'),rt=z('<div class="relative inline-block"><span><!></span> <div class="whitespace-nowrap absolute tooltip opacity-0 inline-block transition-opacity duration-150 ease-in-out pointer-events-none text-sm z-[10] svelte-1ln5cwi"><!> <!></div></div>');function N(r,t){const i=tt(t),e=D(t,["children","$$slots","$$events","$$legacy"]);G(t,!1);const p=Y(),v=()=>Z(j,"$tooltipHidden",p);let c=a(t,"tip",8,void 0),s=a(t,"top",8,!1),f=a(t,"topLeft",8,!1),o=a(t,"topRight",8,!1),E=a(t,"right",8,!1),h=a(t,"bottom",8,!1),l=a(t,"bottomLeft",8,!1),b=a(t,"bottomRight",8,!1),w=a(t,"left",8,!1);I();var g=rt(),y=u(g),U=u(y);A(U,t,"default",{});var n=F(y,2),O=u(n);k(O,()=>c()&&!v(),L=>{var m=st(),M=u(m);T(()=>{P(m,`inline-block py-2 px-4 rounded-md bg-[var(--pd-tooltip-bg)] text-[var(--pd-tooltip-text)] border-[1px] border-[var(--pd-tooltip-border)] ${e.class??""} svelte-1ln5cwi`),J(M,c())}),x(L,m)});var V=F(O,2);k(V,()=>i.tip&&!c()&&!v(),L=>{var m=at(),M=u(m);A(M,t,"tip",{}),x(L,m)}),T(()=>{P(y,`group tooltip-slot ${e.class??""} svelte-1ln5cwi`),d(n,"left",w()),d(n,"right",E()),d(n,"bottom",h()),d(n,"top",s()),d(n,"top-left",f()),d(n,"top-right",o()),d(n,"bottom-left",l()),d(n,"bottom-right",b())}),x(r,g),K()}N.__docgen={keywords:[],data:[],name:"Tooltip.svelte"};var it=z('<div><!> <div role="alert" aria-label="Error Message Content" class="ml-2"> </div></div>');function lt(r,t){const i=D(t,["children","$$slots","$$events","$$legacy"]);G(t,!1);let e=a(t,"error",8),p=a(t,"icon",8,!1),v=a(t,"wrapMessage",8,!1),c=H(""),s=H(!1),f=H(!1);$(()=>{v()?(R(c,"w-max max-w-[650px] overflow-hidden text-ellipsis text-wrap"),R(s,!0)):R(f,!0)}),I();var o=Q(),E=S(o);k(E,p,h=>{var l=Q(),b=S(l);k(b,()=>e()!==void 0&&e()!=="",w=>{N(w,{get left(){return C(s)},get top(){return C(f)},get tip(){return e()},get class(){return C(c)},children:(g,y)=>{B(g,{size:"1.1x",get class(){return`cursor-pointer text-[var(--pd-state-error)] ${i.class??""}`},icon:W})},$$slots:{default:!0}})}),x(h,l)},h=>{var l=it(),b=u(l);B(b,{size:"1.1x",class:"cursor-pointer text-[var(--pd-state-error)]",icon:W});var w=F(b,2),g=u(w);T(()=>{P(l,`text-[var(--pd-state-error)] p-1 flex flex-row items-center ${i.class??""}`),d(l,"opacity-0",e()===void 0||e()===""),J(g,e())}),x(h,l)}),x(r,o),K()}lt.__docgen={keywords:[],data:[],name:"ErrorMessage.svelte"};export{lt as E,N as T};
