var i=Object.defineProperty;var m=(e,t,o)=>t in e?i(e,t,{enumerable:!0,configurable:!0,writable:!0,value:o}):e[t]=o;var a=(e,t,o)=>m(e,typeof t!="symbol"?t+"":t,o);import{p,i as c,b as l,c as d,n as u,h as f}from"./props-Cs2uAp0A.js";import"./ErrorMessage-CE8zFPQw.js";import"./Button-Cp4RWTV1.js";import{c as n,d as _,f as T}from"./Table-DJIRPY6H.js";import"./fa-layers-text.svelte_svelte_type_style_lang-CH_T1__O.js";import"./LinearProgress-DV3DZBQd.js";import"./Spinner-DjXb7jVR.js";import"./EmptyScreen-17m1aiVy.js";import{d as b,c as w,s as h}from"./create-runtime-stories-DT8kh34L.js";import"./class-CD-5jZDV.js";import"./index-client-D6NG2u5k.js";import"./index-A764_bBz.js";import"./attributes-Jce5emvo.js";import"./StarIcon-dCrvQwAk.js";import"./_commonjsHelpers-CqkleIqs.js";import"./index-DtmeDzJ6.js";import"./index-7SSfYZ8z.js";class s{constructor(t,o){a(this,"title");a(this,"info");this.title=t,this.info=o}}class g{constructor(t){a(this,"info");this.info=t}}const C=(e,t,o=u)=>{n(e,d(()=>f(t==null?void 0:t(),["_children"])))},{Story:D,meta:x}=b({component:n,title:"Table",tags:["autodocs"],args:{},parameters:{docs:{description:{component:"These are the stories for the `Table` component.\nAllow to display a table."}}}}),y=[{name:"John",duration:new Date().getTime()-6e5},{name:"Henry",duration:new Date().getTime()},{name:"Charlie",duration:new Date().getTime()-36e5}],B=new s("Name",{renderMapping:e=>e.name,renderer:_}),M=new s("Duration",{renderMapping:e=>e.duration?new Date(e.duration):void 0,renderer:T}),S=[B,M],v=e=>!0,R=new g({selectable:v,disabledText:"cannot be selected"});function r(e,t){p(t,!1),h(C),c(),D(e,{name:"Basic",args:{data:y,columns:S,row:R},parameters:{__svelteCsf:{rawCode:"<Table {...args}></Table>"}}}),l()}r.__docgen={keywords:[],data:[],name:"Table.stories.svelte"};const k=w(r,x),X=["Basic"],Y=k.Basic;export{Y as Basic,X as __namedExportsOrder,x as default};
