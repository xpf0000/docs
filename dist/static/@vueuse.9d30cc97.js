import{r as b,G as f,am as y,an as h,s as m}from"./@vue.01ea2b94.js";const c=typeof window!="undefined",E=e=>typeof e=="string",d=()=>{};function T(e,r){function n(...t){e(()=>r.apply(this,t),{fn:r,thisArg:this,args:t})}return n}function g(e,r=!0){let n=0,t;const o=()=>{t&&(clearTimeout(t),t=void 0)};return u=>{const s=f(e),l=Date.now()-n;if(o(),s<=0)return n=Date.now(),u();l>s?(n=Date.now(),u()):r&&(t=setTimeout(()=>{n=Date.now(),o(),u()},s))}}function p(e){return y()?(h(e),!0):!1}function W(e,r=200,n=!0){return T(g(r,n),e)}function j(e,r,n={}){const{immediate:t=!0}=n,o=b(!1);let i=null;function u(){i&&(clearTimeout(i),i=null)}function s(){o.value=!1,u()}function l(...a){u(),o.value=!0,i=setTimeout(()=>{o.value=!1,i=null,e(...a)},f(r))}return t&&(o.value=!0,c&&l()),p(s),{isPending:o,start:l,stop:s}}function F(e){var r,n;const t=f(e);return(n=(r=t)===null||r===void 0?void 0:r.$el)!==null&&n!==void 0?n:t}const w=c?window:void 0;c&&window.document;c&&window.navigator;function D(...e){let r,n,t,o;if(E(e[0])?([n,t,o]=e,r=w):[r,n,t,o]=e,!r)return d;let i=d;const u=m(()=>f(r),l=>{i(),!!l&&(l.addEventListener(n,t,o),i=()=>{l.removeEventListener(n,t,o),i=d})},{immediate:!0,flush:"post"}),s=()=>{u(),i()};return p(s),s}/*! *****************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */function N(e,r){var n={};for(var t in e)Object.prototype.hasOwnProperty.call(e,t)&&r.indexOf(t)<0&&(n[t]=e[t]);if(e!=null&&typeof Object.getOwnPropertySymbols=="function")for(var o=0,t=Object.getOwnPropertySymbols(e);o<t.length;o++)r.indexOf(t[o])<0&&Object.prototype.propertyIsEnumerable.call(e,t[o])&&(n[t[o]]=e[t[o]]);return n}function L(e,r,n={}){const{window:t=w}=n,o=N(n,["window"]);let i;const u=t&&"ResizeObserver"in t,s=()=>{i&&(i.disconnect(),i=void 0)},l=m(()=>F(e),v=>{s(),u&&t&&v&&(i=new t.ResizeObserver(r),i.observe(v,o))},{immediate:!0,flush:"post"}),a=()=>{s(),l()};return p(a),{isSupported:u,stop:a}}var O;(function(e){e.UP="UP",e.RIGHT="RIGHT",e.DOWN="DOWN",e.LEFT="LEFT",e.NONE="NONE"})(O||(O={}));export{j as a,L as b,W as c,D as u};
