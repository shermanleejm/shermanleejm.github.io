(this["webpackJsonpshermnaleejm.github.io"]=this["webpackJsonpshermnaleejm.github.io"]||[]).push([[0],{124:function(e,t,n){},154:function(e,t,n){"use strict";n.r(t);var a=n(0),c=n.n(a),i=n(12),r=n.n(i),s=(n(124),n(42)),o=n(13),l=n(94),j=n(95),u=n(111),b=n(110),h=n(55),d=n(193),O=n(194),p=n(211),m=n(2),x=function(e){Object(u.a)(n,e);var t=Object(b.a)(n);function n(){var e;return Object(l.a)(this,n),(e=t.call(this)).state={formSubmitted:!1,name:"",email:"",contactNumber:"",message:""},e}return Object(j.a)(n,[{key:"handleSubmit",value:function(){fetch("https://docs.google.com/forms/d/e/1FAIpQLSeRk58rRnbE1XDd_6RZ6i9RIPTDPZT9YgsQ_4B7-Ff0mqQE3w/formResponse?usp=pp_url&entry.963742205="+this.state.name+"&entry.1053435119="+this.state.email+"&entry.1110637641="+this.state.contactNumber+"&entry.63678808="+this.state.message),this.setState({formSubmitted:!0})}},{key:"render",value:function(){var e=this;return this.state.formSubmitted?Object(m.jsx)("div",{style:{width:"80vw",padding:20,margin:"auto",height:"100vh"},children:Object(m.jsx)(h.a,{variant:"h4",children:"Thank you for your submission I will get back to you as soon as possible!"})}):Object(m.jsxs)("div",{style:{height:"100vh",width:"90vw",padding:20,margin:"auto"},children:[Object(m.jsx)("form",{name:"gform",id:"gform",encType:"text/plain",action:"https://docs.google.com/forms/d/e/1FAIpQLSeRk58rRnbE1XDd_6RZ6i9RIPTDPZT9YgsQ_4B7-Ff0mqQE3w/formResponse?",target:"hidden_iframe",onSubmit:"submitted=true;",children:Object(m.jsxs)(d.a,{container:!0,direction:"column",spacing:2,children:[Object(m.jsx)(d.a,{item:!0,children:Object(m.jsxs)(h.a,{variant:"h5",children:["You may contact me at +65 86601996 and at"," ",Object(m.jsx)(O.a,{href:"mailto:leesherman@live.com.sg",color:"secondary",children:"leesherman@live.com.sg"})]})}),Object(m.jsx)(d.a,{item:!0,children:Object(m.jsx)(h.a,{variant:"h6",children:"Alternatively, you may fill in the form below and I shall get back to you as soon as possible."})}),Object(m.jsx)(d.a,{item:!0,children:Object(m.jsx)(p.a,{color:"secondary",type:"text",name:"entry.963742205",id:"entry.963742205",label:"Name",onChange:function(t){e.setState({name:t.target.value})},fullWidth:!0})}),Object(m.jsx)(d.a,{item:!0,children:Object(m.jsx)(p.a,{color:"secondary",type:"text",name:"entry.1053435119",id:"entry.1053435119",label:"Email",onChange:function(t){e.setState({email:t.target.value})},fullWidth:!0})}),Object(m.jsx)(d.a,{item:!0,children:Object(m.jsx)(p.a,{color:"secondary",type:"text",name:"entry.1110637641",id:"entry.1110637641",label:"Contact Number",onChange:function(t){e.setState({contactNumber:t.target.value})},fullWidth:!0})}),Object(m.jsx)(d.a,{item:!0,children:Object(m.jsx)(p.a,{color:"secondary",type:"text",name:"entry.63678808",id:"entry.63678808",label:"Message",onChange:function(t){e.setState({message:t.target.value})},fullWidth:!0,multiline:!0,rows:4})}),Object(m.jsx)(d.a,{item:!0,children:Object(m.jsx)("input",{id:"popUp",type:"submit",value:"submit",onClick:function(){return e.handleSubmit()},style:{border:"none",backgroundColor:"#ffffff",fontSize:"15px",textTransform:"uppercase",cursor:"pointer"}})})]})}),Object(m.jsx)("iframe",{name:"hidden_iframe",id:"hidden_iframe",style:{display:"none"},onLoad:"if(submitted) {}"})]})}}]),n}(a.Component),g=n(198),f=n(199),y=n.p+"static/media/pp.d83a0ba8.png",v=n(100),w=n.n(v),k=n(101),S=n.n(k),C=n(102),N=n.n(C),I=n.p+"static/media/Resume.5f132bec.pdf",D=Object(g.a)((function(e){return{header:{textAlign:"center",marginBottom:e.spacing(4)},item:{width:"100%",textAlign:"center",borderRadius:"5px",marginTop:"10px"},image:{width:"300px"},imagecontainer:{textAlign:"center",justifyContent:"center",marginBottom:e.spacing(3)},iconcontainer:{display:"flex",marginBottom:e.spacing(2),justifyContent:"center"},icons:{transform:"scale(2)"},maintext:{width:"50%",margin:"5% auto 0 auto",textAlign:"center"},root:{marginBottom:"20%",width:"100vw"}}})),T=function(){var e=D();return Object(m.jsxs)("div",{className:e.root,children:[Object(m.jsx)(f.a,{href:"https://www.google.com",target:"_blank",rel:"noopener",children:"Google"}),Object(m.jsx)(h.a,{variant:"h3",className:e.header,children:"Welcome to my developer profile."}),Object(m.jsx)("div",{className:e.imagecontainer,children:Object(m.jsx)("img",{src:y,className:e.image})}),Object(m.jsxs)("div",{className:e.iconcontainer,children:[Object(m.jsx)(f.a,{href:"https://github.com/shermanleejm",target:"_blank",rel:"noopener",children:Object(m.jsx)(w.a,{className:e.icons})}),Object(m.jsx)(f.a,{href:"https://www.linkedin.com/in/shrmnl/",target:"_blank",rel:"noopener",children:Object(m.jsx)(S.a,{className:e.icons})}),Object(m.jsx)(f.a,{href:I,target:"_blank",rel:"noopener",children:Object(m.jsx)(N.a,{className:e.icons})})]}),Object(m.jsxs)("div",{className:e.maintext,children:[Object(m.jsxs)(h.a,{children:["I make stuff. I have an asset tracker that you can play with"," ",Object(m.jsx)(s.b,{to:"/tracker",component:O.a,children:"here"}),"."]}),Object(m.jsx)("br",{}),Object(m.jsxs)(h.a,{children:["You can visit my github profile by clicking the icon above."," "]}),Object(m.jsx)("br",{}),Object(m.jsxs)(h.a,{children:["I am currently working on a blockchain network that focuses on tamper-proof",Object(m.jsx)("br",{}),"contracts and distributed programming, feel free to hit me up using the"," ",Object(m.jsx)(s.b,{to:"/contact-me",component:O.a,children:"contact me page"}),"."]})]})]})},_=n(11),M=n(155),R=n(213),F=n(197),E=n(200),q=n(201),A=n(202),B=n(203),L=n(103),Y=n.n(L),P=Object(g.a)((function(e){return{root:{display:"flex",justifyContent:"space-between"}}})),J=function(){var e=Object(a.useState)(!1),t=Object(_.a)(e,2),n=t[0],c=t[1],i=Object(a.useState)(!1),r=Object(_.a)(i,2),o=r[0],l=r[1],j=P();return Object(a.useEffect)((function(){localStorage.getItem("homepage")}),[o]),Object(m.jsxs)("div",{className:j.root,children:[Object(m.jsx)(M.a,{onClick:function(){return c(!0)},children:Object(m.jsx)(Y.a,{})}),Object(m.jsx)(R.a,{anchor:"left",open:n,onClose:function(){return c(!1)},onOpen:function(){c(!0)},children:Object(m.jsx)(F.a,{children:Fe.map((function(e){if(void 0!==e.name)return Object(m.jsxs)(E.a,{button:!0,component:s.b,to:e.link,onClick:function(){return c(!1)},children:[Object(m.jsx)(q.a,{children:e.icon}),Object(m.jsx)(A.a,{primary:e.name})]},e.name)}))})}),Object(m.jsxs)("span",{children:["set as homepage"," ",Object(m.jsx)(B.a,{checked:localStorage.getItem("homepage")===window.location.href.split("#")[1],onChange:function(){localStorage.getItem("homepage")===window.location.href.split("#")[1]?localStorage.setItem("homepage",""):localStorage.setItem("homepage",window.location.href.split("#")[1]),l(!o)}})]})]})},W=n(54),V=n(18),H=n.n(V),Q=n(37),z=n(204),U=n(205),X=n(206),Z=n(207),G=n(208),K=n(209),$=n(196),ee=n(48),te=n.n(ee),ne=n(67),ae=n.n(ne),ce=n(104),ie=n.n(ce),re=Object(g.a)((function(e){return{header:{margin:"3% 0 3% 0"},root:{margin:"0 4% 10% 4%"},apiinput:{width:"60%",margin:"0 0 3% 0"},table:{margin:"0 0 3% 0"},searchresult:{padding:"4%",marginBottom:"4%"}}})),se=function(){var e=re(),t=Object(a.useState)(!0),n=Object(_.a)(t,2),c=n[0],i=n[1],r=Object(a.useState)(),s=Object(_.a)(r,2),o=s[0],l=s[1],j=Object(a.useState)(""),u=Object(_.a)(j,2),b=u[0],O=u[1],x=Object(a.useState)(!1),g=Object(_.a)(x,2),y=g[0],v=g[1],w=Object(a.useState)([]),k=Object(_.a)(w,2),S=k[0],C=k[1],N=Object(a.useState)(!1),I=Object(_.a)(N,2),D=I[0],T=I[1],R=Object(a.useState)(),F=Object(_.a)(R,2),E=F[0],q=F[1],A=Object(a.useState)(),B=Object(_.a)(A,2),L=B[0],Y=B[1],P=Object(a.useState)(""),J=Object(_.a)(P,2),W=J[0],V=J[1],ee=Object(a.useState)([]),ne=Object(_.a)(ee,2),ce=ne[0],se=ne[1],oe=Object(a.useState)(),le=Object(_.a)(oe,2),je=le[0],ue=(le[1],Object(a.useState)(!1)),be=Object(_.a)(ue,2),he=be[0],de=be[1];function Oe(e){for(var t,n,a=e.length;0!==a;)n=Math.floor(Math.random()*a),t=e[a-=1],e[a]=e[n],e[n]=t;return e}function pe(){return(pe=Object(Q.a)(H.a.mark((function e(t){return H.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,te.a.get("https://www.alphavantage.co/query?function=SYMBOL_SEARCH&keywords=".concat(t,"&apikey=").concat(o)).then((function(e){C(e.data.bestMatches)}));case 2:case"end":return e.stop()}}),e)})))).apply(this,arguments)}function me(){for(var e=0,t=0,n=0;n<ce.length;n++){var a=ce[n];e+=a.quantity*a.price,t+=a.quantity*a.open}return parseFloat(((t-e)/e*100).toFixed(2))}return Object(a.useEffect)((function(){}),[he]),Object(m.jsxs)("div",{className:e.root,children:[Object(m.jsx)(h.a,{style:{color:"red"},children:void 0!==je&&je}),Object(m.jsxs)(h.a,{variant:"h4",className:e.header,children:["Boring"," ",Object(m.jsxs)("span",{style:{color:me()>0?"green":"red"},children:[me()>0&&"+",me(),"%"]})]}),Object(m.jsx)(p.a,{label:"Alpha Vantage API key",size:"small",value:o,onChange:function(e){return l(e.target.value)},className:e.apiinput}),Object(m.jsx)(f.a,{onClick:function(){localStorage.setItem("apikey",JSON.stringify(o))},children:"save api key"}),Object(m.jsx)(p.a,{label:"Add new boring equity",size:"small",value:b,onChange:function(e){return O(e.target.value)},className:e.apiinput}),Object(m.jsx)(f.a,{disabled:!b,onClick:function(){!function(e){pe.apply(this,arguments)}(b),v(!0)},children:"search"}),y&&""!==b&&Object(m.jsx)(z.a,{className:e.table,children:Object(m.jsxs)(U.a,{children:[Object(m.jsx)(X.a,{children:Object(m.jsxs)(Z.a,{children:[Object(m.jsx)(G.a,{children:"Symbol"}),Object(m.jsx)(G.a,{children:"Name"}),Object(m.jsx)(G.a,{children:"Type"}),Object(m.jsx)(G.a,{children:"Region"}),Object(m.jsx)(G.a,{children:"Correct?"})]})}),Object(m.jsx)(K.a,{children:S.map((function(e,t){return Object(m.jsxs)(Z.a,{children:[Object(m.jsx)(G.a,{children:e["1. symbol"]}),Object(m.jsx)(G.a,{children:e["2. name"]}),Object(m.jsx)(G.a,{children:e["3. type"]}),Object(m.jsx)(G.a,{children:e["4. region"]}),Object(m.jsx)(G.a,{children:Object(m.jsx)(M.a,{onClick:function(){q({symbol:e["1. symbol"],name:e["2. name"],type:e["3. type"],region:e["4. region"]}),T(!0),v(!1)},children:Object(m.jsx)(ie.a,{})})})]},t)}))})]})}),D&&Object(m.jsx)($.a,{className:e.searchresult,elevation:3,children:Object(m.jsxs)(d.a,{container:!0,spacing:3,children:[Object(m.jsxs)(d.a,{item:!0,xs:4,children:["Symbol: ",E.symbol]}),Object(m.jsxs)(d.a,{item:!0,xs:8,children:["Name: ",E.name]}),Object(m.jsxs)(d.a,{item:!0,xs:4,children:["Type: ",E.type]}),Object(m.jsxs)(d.a,{item:!0,xs:8,children:["Region: ",E.region]}),Object(m.jsx)(d.a,{item:!0,xs:6,children:Object(m.jsx)(p.a,{label:"Quantity",type:"number",value:L,onChange:function(e){Y(e.target.value)}})}),Object(m.jsx)(d.a,{item:!0,xs:6,children:Object(m.jsx)(p.a,{label:"Price",type:"number",value:W,onChange:function(e){V(e.target.value)}})}),Object(m.jsx)(d.a,{item:!0,xs:12,children:Object(m.jsx)(f.a,{fullWidth:!0,onClick:function(){var e={ticker:E.symbol,quantity:L,price:W};ce.push(e),localStorage.setItem("boring",JSON.stringify(Oe(ce))),T(!1)},children:"submit"})})]})}),!c&&Object(m.jsx)(z.a,{className:e.table,children:Object(m.jsxs)(U.a,{children:[Object(m.jsx)(X.a,{children:Object(m.jsxs)(Z.a,{children:[Object(m.jsx)(G.a,{children:"Ticker"}),Object(m.jsx)(G.a,{children:"Quantity"}),Object(m.jsx)(G.a,{children:"Cost"}),Object(m.jsx)(G.a,{children:"Open"}),Object(m.jsx)(G.a,{children:"High"}),Object(m.jsx)(G.a,{children:"Low"}),Object(m.jsx)(G.a,{children:"P/L (%)"}),Object(m.jsx)(G.a,{children:"Delete"})]})}),Object(m.jsx)(K.a,{children:ce.map((function(e,t){return Object(m.jsxs)(Z.a,{children:[Object(m.jsx)(G.a,{children:e.ticker}),Object(m.jsx)(G.a,{children:e.quantity}),Object(m.jsx)(G.a,{children:e.price}),Object(m.jsx)(G.a,{children:e.open}),Object(m.jsx)(G.a,{children:e.high}),Object(m.jsx)(G.a,{children:e.low}),Object(m.jsxs)(G.a,{style:{color:e.pl>0?"green":"red"},children:[e.pl>0&&"+",e.pl]}),Object(m.jsx)(G.a,{children:Object(m.jsx)(M.a,{onClick:function(){ce.splice(t,1),localStorage.setItem("boring",JSON.stringify(Oe(ce))),i(!0)},children:Object(m.jsx)(ae.a,{})})})]},t)}))})]})}),Object(m.jsx)(f.a,{onClick:function(){de(!he),se(Oe(ce))},children:"refresh"})]})},oe=n(35),le=n(212),je=n(58),ue=n(78),be=n.n(ue),he=n(77),de=n.n(he),Oe=Object(g.a)((function(e){return{root:{margin:"0 4% 0 4%"},combobox:{padding:"3% 0 3% 0"},header:{margin:"0 0 1% 0"},table:{overflowY:"scroll"},arrangeHorizontally:{display:"inline-block",textAlign:"center"}}})),pe=function(){var e=Oe(),t=Object(a.useState)([]),n=Object(_.a)(t,2),c=(n[0],n[1]),i=Object(a.useState)([]),r=Object(_.a)(i,2),s=r[0],o=r[1],l=Object(a.useState)(!0),j=Object(_.a)(l,2),u=j[0],b=j[1],d=Object(a.useState)("SGD"),O=Object(_.a)(d,2),x=O[0],g=(O[1],Object(a.useState)([])),y=Object(_.a)(g,2),v=y[0],w=y[1],k=Object(a.useState)(!1),S=Object(_.a)(k,2),C=S[0],N=S[1],I=Object(a.useState)(),D=Object(_.a)(I,2),T=D[0],R=D[1],F=Object(a.useState)(),E=Object(_.a)(F,2),q=E[0],A=E[1],B=Object(a.useState)(),L=Object(_.a)(B,2),Y=L[0],P=L[1],J=Object(a.useState)({crypto:-1,quantity:-1,principal:-1}),V=Object(_.a)(J,2),$=V[0],ee=V[1];function ne(){var e,t=0,n=0,a=Object(W.a)(v);try{for(a.s();!(e=a.n()).done;){var c=e.value;n+=c.principal*c.pl/100,t+=c.principal}}catch(i){a.e(i)}finally{a.f()}return parseFloat((n/t*100).toFixed(2))}function ce(e){return e=e.toLocaleString(void 0,{maximumFractionDigits:2})}Object(a.useEffect)((function(){function e(e,n){return t.apply(this,arguments)}function t(){return(t=Object(Q.a)(H.a.mark((function e(t,n){var a;return H.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return a=0,e.next=3,te.a.get("https://api.coinbase.com/v2/prices/".concat(t,"-").concat(n,"/sell")).then((function(e){a=parseFloat(e.data.data.amount)}));case 3:return e.abrupt("return",a);case 4:case"end":return e.stop()}}),e)})))).apply(this,arguments)}function n(){return a.apply(this,arguments)}function a(){return(a=Object(Q.a)(H.a.mark((function e(){var t;return H.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return t=[],e.next=3,te.a.get("https://api.coinbase.com/v2/currencies").then((function(e){var n,a=[],i=Object(W.a)(e.data.data);try{for(i.s();!(n=i.n()).done;){var r=n.value;a.push(r.id)}}catch(s){i.e(s)}finally{i.f()}t=a,c(a)}));case 3:return e.abrupt("return",t);case 4:case"end":return e.stop()}}),e)})))).apply(this,arguments)}function i(e){return r.apply(this,arguments)}function r(){return(r=Object(Q.a)(H.a.mark((function e(t){var n;return H.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return n=[],e.next=3,te.a.get("https://api.coinbase.com/v2/exchange-rates?currency=BTC").then((function(e){Object.keys(e.data.data.rates).map((function(e){t.includes(e)||n.push(e)})),o(n)}));case 3:case"end":return e.stop()}}),e)})))).apply(this,arguments)}function s(){return l.apply(this,arguments)}function l(){return(l=Object(Q.a)(H.a.mark((function t(){var a,c,r,s,o;return H.a.wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return t.next=2,n();case 2:if(i(t.sent),""===(a=JSON.parse(localStorage.getItem("crypto")||""))){t.next=28;break}c=Object(W.a)(a),t.prev=7,c.s();case 9:if((r=c.n()).done){t.next=18;break}return s=r.value,t.next=13,e(s.name,x);case 13:o=t.sent,s.pl=parseFloat(((o*s.value-s.principal)/s.principal*100).toFixed(2)),s.currentPrice=o;case 16:t.next=9;break;case 18:t.next=23;break;case 20:t.prev=20,t.t0=t.catch(7),c.e(t.t0);case 23:return t.prev=23,c.f(),t.finish(23);case 26:t.next=29;break;case 28:a=[];case 29:w(a),localStorage.setItem("crypto",JSON.stringify(a)),b(!1);case 32:case"end":return t.stop()}}),t,null,[[7,20,23,26]])})))).apply(this,arguments)}setTimeout((function(){s()}),6e4),s()}),[u]);var ie=function(){return Object(m.jsxs)("div",{className:e.arrangeHorizontally,children:[Object(m.jsx)(M.a,{onClick:function(){ee({crypto:-1,quantity:-1,principal:-1}),localStorage.setItem("crypto",JSON.stringify(v)),b(!0)},children:Object(m.jsx)(de.a,{})}),Object(m.jsx)(M.a,{onClick:function(){ee({crypto:-1,quantity:-1,principal:-1})},children:Object(m.jsx)(be.a,{})})]})};return Object(m.jsxs)("div",{className:e.root,children:[Object(m.jsxs)(h.a,{variant:"h4",className:e.header,children:["Crypto ","  ",Object(m.jsxs)("span",{style:{color:ne()>0?"green":"red"},children:[ne()>0?"+":"",ne(),"%"]})]}),Object(m.jsx)(z.a,{children:Object(m.jsxs)(U.a,{children:[Object(m.jsx)(X.a,{children:Object(m.jsxs)(Z.a,{children:[Object(m.jsx)(G.a,{children:Object(m.jsx)(h.a,{children:"Currency (Current Price)"})}),Object(m.jsx)(G.a,{colSpan:-1!==$.quantity?3:1,children:Object(m.jsx)(h.a,{children:"Quantity"})}),Object(m.jsx)(G.a,{colSpan:-1!==$.principal?3:1,children:Object(m.jsx)(h.a,{children:"Principal"})}),Object(m.jsx)(G.a,{children:Object(m.jsx)(h.a,{children:"Current"})}),Object(m.jsx)(G.a,{children:Object(m.jsx)(h.a,{children:"Profit/Loss (%)"})}),Object(m.jsx)(G.a,{children:Object(m.jsx)(h.a,{children:"Delete"})})]})}),Object(m.jsxs)(K.a,{children:[!u&&v.map((function(t,n){return Object(m.jsxs)(Z.a,{children:[Object(m.jsx)(G.a,{children:"".concat(t.name," (").concat(x).concat(ce(t.currentPrice),")")}),Object(m.jsx)(G.a,{colSpan:-1!==$.quantity?3:1,children:$.quantity===n?Object(m.jsxs)("div",{style:{width:"30vw"},children:[Object(m.jsx)(je.a,{customInput:p.a,value:t.value,onValueChange:function(e){var t=e.floatValue,a=v;a[n].value=t,w(a)}}),Object(m.jsx)(ie,{})]}):Object(m.jsx)(h.a,{onClick:function(){A(t.value),ee({crypto:-1,quantity:n,principal:-1})},children:t.value})}),Object(m.jsx)(G.a,{colSpan:-1!==$.principal?3:1,children:$.principal===n?Object(m.jsxs)("div",{style:{width:"30vw"},children:[Object(m.jsx)(je.a,{customInput:p.a,prefix:x,value:t.principal,onValueChange:function(e){var t=e.floatValue,a=v;a[n].principal=t,w(a)}}),Object(m.jsxs)("span",{className:e.arrangeHorizontally,children:[Object(m.jsx)(M.a,{onClick:function(){ee({crypto:-1,quantity:-1,principal:-1}),localStorage.setItem("crypto",JSON.stringify(v)),b(!0)},children:Object(m.jsx)(de.a,{})}),Object(m.jsx)(M.a,{onClick:function(){ee({crypto:-1,quantity:-1,principal:-1})},children:Object(m.jsx)(be.a,{})})]})]}):Object(m.jsxs)(h.a,{onClick:function(){ee({crypto:-1,principal:n,quantity:-1}),P(t.principal)},children:[x,ce(t.principal)]})}),Object(m.jsx)(G.a,{children:Object(m.jsxs)(h.a,{children:[x,(parseFloat(t.currentPrice)*parseFloat(t.value)).toLocaleString(void 0,{maximumFractionDigits:2})]})}),Object(m.jsx)(G.a,{style:{color:t.pl>0?"green":"red"},children:Object(m.jsxs)(h.a,{children:[t.pl>0&&"+",t.pl||""]})}),Object(m.jsx)(G.a,{children:Object(m.jsx)(M.a,{onClick:function(){v.splice(n,1),localStorage.setItem("crypto",JSON.stringify(v)),b(!0)},children:Object(m.jsx)(ae.a,{})})})]})})),C&&Object(m.jsxs)(Z.a,{children:[Object(m.jsx)(G.a,{style:{paddingRight:"5%"},children:Object(m.jsx)(le.a,{className:e.combobox,options:s,renderInput:function(e){return Object(m.jsx)(p.a,Object(oe.a)(Object(oe.a)({},e),{},{variant:"outlined",label:"Crypto",size:"small"}))},onChange:function(e,t){return R(t)}})}),Object(m.jsx)(G.a,{children:Object(m.jsx)(je.a,{style:{width:"25vw"},customInput:p.a,value:q,onValueChange:function(e){var t=e.floatValue;A(t||"")}})}),Object(m.jsx)(G.a,{children:Object(m.jsx)(je.a,{style:{width:"25vw"},customInput:p.a,prefix:x,value:Y,onValueChange:function(e){var t=e.floatValue;P(t)}})})]})]})]})}),C?Object(m.jsxs)("div",{children:[Object(m.jsx)(f.a,{onClick:function(){void 0!==T&&void 0!==Y&&void 0!==q&&(v.push({name:T,value:q,principal:Y}),localStorage.setItem("crypto",JSON.stringify(v)),b(!0)),N(!1)},children:"submit"}),Object(m.jsx)(f.a,{onClick:function(){N(!1)},children:"cancel"})]}):Object(m.jsx)(f.a,{onClick:function(){return N(!0)},children:"+ add item"}),Object(m.jsx)(f.a,{onClick:function(){return b(!0)},children:"Refresh"}),Object(m.jsx)("hr",{})]})},me=n(216),xe=n(210),ge=n(215),fe=function(){var e={lse_close:Date.UTC((new Date).getFullYear(),(new Date).getMonth(),(new Date).getDate(),15,30,0),lse_open:Date.UTC((new Date).getFullYear(),(new Date).getMonth(),(new Date).getDate(),7,0,0),nyse_open:Date.UTC((new Date).getFullYear(),(new Date).getMonth(),(new Date).getDate(),13,30,0),nyse_close:Date.UTC((new Date).getFullYear(),(new Date).getMonth(),(new Date).getDate(),20,0,0)};function t(e){var t=(e=new Date(e))-+new Date,n={};return t>0&&(n={days:Math.floor(t/864e5),hours:Math.floor(t/36e5%24),minutes:Math.floor(t/1e3/60%60),seconds:Math.floor(t/1e3%60)}),n}var n=Object(a.useState)("lse_open"),c=Object(_.a)(n,2),i=c[0],r=c[1],s=Object(a.useState)(t(e[i])),o=Object(_.a)(s,2),l=o[0],j=o[1];return Object(a.useEffect)((function(){setTimeout((function(){j(t(e[i]))}),1e3)})),Object(m.jsxs)("div",{style:{textAlign:"center",margin:"2% 0"},children:[Object(m.jsx)(me.a,{value:i,onChange:function(e){return r(e.target.value)},defaultValue:"lse_open",children:Object(m.jsx)(d.a,{container:!0,direction:"row",justify:"center",children:[{value:"lse_open",name:"LSE Opening"},{value:"lse_close",name:"LSE Closing"},{value:"nyse_open",name:"NYSE Opening"},{value:"nyse_close",name:"NYSE Closing"}].map((function(e){return Object(m.jsx)(d.a,{item:!0,xs:6,sm:3,children:Object(m.jsx)(xe.a,{value:e.value,label:e.name,control:Object(m.jsx)(ge.a,{})})})}))})}),Object(m.jsx)("div",{style:{margin:"auto"},children:0===Object.keys(l).length?Object(m.jsxs)(h.a,{children:["The market is ",i.split("_")[1],"."]}):Object(m.jsxs)(d.a,{container:!0,direction:"row",alignItems:"center",justify:"center",spacing:1,children:[Object(m.jsx)(d.a,{item:!0,children:Object(m.jsxs)(h.a,{children:[l.hours,"H"]})}),Object(m.jsx)(d.a,{item:!0,children:Object(m.jsxs)(h.a,{children:[l.minutes,"M"]})}),Object(m.jsx)(d.a,{item:!0,children:Object(m.jsxs)(h.a,{children:[l.seconds,"S"]})})]})})]})},ye=Object(g.a)((function(e){return{root:{margin:"0 0% 0 0%"}}})),ve=function(){var e=ye();return Object(m.jsxs)("div",{className:e.root,children:[Object(m.jsx)(pe,{}),Object(m.jsx)(fe,{}),Object(m.jsx)(se,{})]})},we=n(107),ke=n.n(we),Se=n(108),Ce=n.n(Se),Ne=n(106),Ie=n.n(Ne),De=n(156),Te=Object(De.a)((function(e){return{root:{display:"flex",justifyContent:"center",alignItems:"center"},main:{position:"absolute",borderRadius:"10px",padding:"0 0 20px 0",width:"50vw",backgroundColor:"black",color:"#39ff14"},headerButtons:{borderRadius:"50%",width:"20px",height:"20px",margin:"5px 0 5px 10px",border:"1 solid white"},inputField:{background:"transparent",border:"none",color:"#39ff14",marginLeft:"10px",width:"90%"},minimise:{padding:"10px",width:"20vw",textAlign:"center",backgroundColor:"black",color:"white",position:"fixed",bottom:0,cursor:"pointer"},header:{marginBottom:"30px",backgroundColor:"grey",width:"100%",height:"100%",borderRadius:"10px 10px 0 0"}}})),_e=function(){var e=c.a.useState(!1),t=Object(_.a)(e,2),n=t[0],a=t[1],i=c.a.useState([]),r=Object(_.a)(i,2),s=r[0],l=r[1],j=c.a.useState(""),u=Object(_.a)(j,2),b=u[0],d=u[1],O=c.a.useState({isDragging:!1,origin:{x:0,y:0},translation:{x:window.innerWidth/3,y:window.innerHeight/1.3},lastTranslation:{x:window.innerWidth/3,y:window.innerHeight/1.3}}),p=Object(_.a)(O,2),x=p[0],g=p[1],f=(Object(o.g)(),x.isDragging),y=function(e){var t=e.clientX,n=e.clientY;if(f){var a=x.origin,c=x.lastTranslation;g(Object(oe.a)(Object(oe.a)({},x),{},{translation:{x:Math.abs(t-(a.x+c.x)),y:Math.abs(n-(a.y+c.y))}}))}},v=Te();return Object(m.jsx)("div",{className:v.root,children:n?Object(m.jsx)($.a,{className:v.minimise,onClick:function(){a(!1)},children:"TERMINAL"}):Object(m.jsxs)($.a,{className:v.main,elevation:3,onMouseDown:function(e){var t=e.clientX,n=e.clientY;f||g(Object(oe.a)(Object(oe.a)({},x),{},{isDragging:!0,origin:{x:t,y:n}}))},onMouseMove:y,onMouseLeave:y,onMouseUp:function(){if(f){var e=x.translation;g(Object(oe.a)(Object(oe.a)({},x),{},{isDragging:!1,lastTranslation:{x:e.x,y:e.y}}))}console.log(x)},style:{right:"".concat(x.translation.x,"px"),bottom:"".concat(x.translation.y,"px")},children:[Object(m.jsxs)("div",{className:v.header,children:[Object(m.jsx)("button",{className:v.headerButtons,style:{backgroundColor:"red"},onClick:function(){alert("Now why would you want to close my lovely creation?"),l([]),a(!0)}}),Object(m.jsx)("button",{className:v.headerButtons,style:{backgroundColor:"yellow"},onClick:function(){return a(!0)}}),Object(m.jsx)("button",{className:v.headerButtons,style:{backgroundColor:"green"},onClick:function(){return alert("ARE YOU TRYING TO KILL ME WITH CSS?????????")}})]}),Object(m.jsx)("div",{children:s.map((function(e){return Object(m.jsx)(h.a,{children:e})}))}),Object(m.jsx)("input",{className:v.inputField,onChange:function(e){d(e.target.value)},value:b,onKeyDown:function(e){if("Enter"===e.key){var t="";switch(b){case"linkedin":window.open("https://www.linkedin.com/in/shrmnl/","_blank"),t="sending you to linkedin now...";break;case"github":window.open("https://github.com/shermanleejm","_blank"),t="sending you to github now...";break;default:t="".concat(b," is not a valid command, type help for options.")}var n=s;n.push("> "+b),n.push(t),l(n),d("")}}})]})})},Me=n(109),Re=n.n(Me),Fe=[{name:"About Me",link:"/about-me",component:T,icon:Object(m.jsx)(Ie.a,{})},{name:"Contact Me",link:"/contact-me",component:x,icon:Object(m.jsx)(ke.a,{})},{name:"Asset Tracker",link:"/tracker",component:ve,icon:Object(m.jsx)(Ce.a,{})},{name:"Terminal",link:"/terminal",component:_e,icon:Object(m.jsx)(Re.a,{})},{link:"/linkedin",href:"https://www.linkedin.com/in/shrmnl/"},{link:"/github",href:"https://github.com/shermanleejm"}],Ee=function(){return Object(m.jsx)("div",{children:Object(m.jsxs)(s.a,{basename:"/",children:[Object(m.jsx)(J,{}),Object(m.jsxs)(o.d,{children:[Object(m.jsx)(o.b,{exact:!0,path:"/",render:function(){return null===localStorage.getItem("homepage")||""===localStorage.getItem("homepage")?Object(m.jsx)(o.a,{to:"/about-me"}):Object(m.jsx)(o.a,{to:localStorage.getItem("homepage")})}}),Fe.map((function(e){return void 0!==e.component?Object(m.jsx)(o.b,{exact:!0,path:e.link,component:e.component}):Object(m.jsx)(o.b,{exact:!0,path:e.href,render:function(){return window.location=e.href}})}))]})]})})};Boolean("localhost"===window.location.hostname||"[::1]"===window.location.hostname||window.location.hostname.match(/^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/));r.a.render(Object(m.jsx)(Ee,{}),document.getElementById("root")),"serviceWorker"in navigator&&navigator.serviceWorker.ready.then((function(e){e.unregister()})).catch((function(e){console.error(e.message)}))}},[[154,1,2]]]);
//# sourceMappingURL=main.8254dff6.chunk.js.map