import{r as l,aB as n,R as a}from"./index.3263a826.js";import{_ as d}from"./lodash.0fdb88bd.js";const k=""+new URL("imageTrack1.585fe5aa.jpg",import.meta.url).href,w=""+new URL("imageTrack2.54efd198.jpg",import.meta.url).href,R=""+new URL("imageTrack3.20baacff.jpg",import.meta.url).href,j=""+new URL("imageTrack4.0641256a.jpg",import.meta.url).href,T=""+new URL("imageTrack5.74f10ec5.jpg",import.meta.url).href,L=""+new URL("imageTrack6.0726f589.jpg",import.meta.url).href,_=""+new URL("imageTrack7.72ef998d.jpg",import.meta.url).href,U=""+new URL("imageTrack8.337dd3ab.jpg",import.meta.url).href,v=""+new URL("imageTrack9.35f03663.jpg",import.meta.url).href,b=""+new URL("imageTrack10.c302ad84.jpg",import.meta.url).href,y=[k,w,R,j,T,L,_,U,v,b],x=y;function S(){const e=l.exports.useRef(null),c=l.exports.useRef([]);function f(){var i,m,s;const o=(((i=e.current)==null?void 0:i.scrollWidth)||0)-(((m=e.current)==null?void 0:m.offsetWidth)||0),t=((s=e.current)==null?void 0:s.scrollLeft)||0,r=Math.round(t/o*100);c.current.map(h=>h.style.objectPosition=`${100-Math.min(r,100)}% center`)}const p=n.div`
    height: 95%;
    width: 100vw;
    margin: 0rem;
    position: absolute;
  `,g=n.div`
    display: flex;
    gap: 4vmin;
    position: sticky;
    padding: 0% 50%;
    // left: 100%;
    top: 50%;
    transform: translate(0%, -50%);
    animation: transform 1200 forwards;
    overflow-x: scroll;
    user-select: none;
  `,u=n.img`
    width: 40vmin;
    height: 56vmin;
    object-fit: cover;
    object-position: 100% center;
    animation: object-position 1200 forwards;
  `;return a.createElement(p,null,a.createElement(g,{ref:e,onScroll:d.throttle(f,5)},x.map((o,t)=>a.createElement(u,{src:o,key:t,ref:r=>r&&(c.current[t]=r)}))))}function I(){return a.createElement(S,null)}export{I as default};
