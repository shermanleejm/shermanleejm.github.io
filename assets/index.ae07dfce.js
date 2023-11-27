import{l as nt,aF as at,r as q,C as Ce,R}from"./index.b370e4f5.js";import{p as Ne}from"./index.4b380921.js";import{P as _e,T as ot}from"./Typography.0e0b3e82.js";var ae={exports:{}},Re={};const it=nt(at);var S={},W={};Object.defineProperty(W,"__esModule",{value:!0});W.dontSetMe=ct;W.findInArray=st;W.int=ft;W.isFunction=lt;W.isNum=ut;function st(e,t){for(var n=0,r=e.length;n<r;n++)if(t.apply(t,[e[n],n,e]))return e[n]}function lt(e){return typeof e=="function"||Object.prototype.toString.call(e)==="[object Function]"}function ut(e){return typeof e=="number"&&!isNaN(e)}function ft(e){return parseInt(e,10)}function ct(e,t,n){if(e[t])return new Error("Invalid prop ".concat(t," passed to ").concat(n," - do not set this, set it on the child."))}var B={};Object.defineProperty(B,"__esModule",{value:!0});B.browserPrefixToKey=Ae;B.browserPrefixToStyle=dt;B.default=void 0;B.getPrefix=ke;var ce=["Moz","Webkit","O","ms"];function ke(){var e,t,n=arguments.length>0&&arguments[0]!==void 0?arguments[0]:"transform";if(typeof window>"u")return"";var r=(e=window.document)===null||e===void 0||(t=e.documentElement)===null||t===void 0?void 0:t.style;if(!r||n in r)return"";for(var i=0;i<ce.length;i++)if(Ae(n,ce[i])in r)return ce[i];return""}function Ae(e,t){return t?"".concat(t).concat(pt(e)):e}function dt(e,t){return t?"-".concat(t.toLowerCase(),"-").concat(e):e}function pt(e){for(var t="",n=!0,r=0;r<e.length;r++)n?(t+=e[r].toUpperCase(),n=!1):e[r]==="-"?n=!0:t+=e[r];return t}var gt=ke();B.default=gt;function ge(e){return ge=typeof Symbol=="function"&&typeof Symbol.iterator=="symbol"?function(t){return typeof t}:function(t){return t&&typeof Symbol=="function"&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t},ge(e)}Object.defineProperty(S,"__esModule",{value:!0});S.addClassName=Le;S.addEvent=mt;S.addUserSelectStyles=Mt;S.createCSSTransform=_t;S.createSVGTransform=Pt;S.getTouch=xt;S.getTouchIdentifier=Tt;S.getTranslation=ye;S.innerHeight=St;S.innerWidth=Dt;S.matchesSelector=$e;S.matchesSelectorAndParentsTo=yt;S.offsetXYFromParent=Ot;S.outerHeight=bt;S.outerWidth=wt;S.removeClassName=Ye;S.removeEvent=vt;S.removeUserSelectStyles=Et;var N=W,Pe=ht(B);function Ie(e){if(typeof WeakMap!="function")return null;var t=new WeakMap,n=new WeakMap;return(Ie=function(i){return i?n:t})(e)}function ht(e,t){if(!t&&e&&e.__esModule)return e;if(e===null||ge(e)!=="object"&&typeof e!="function")return{default:e};var n=Ie(t);if(n&&n.has(e))return n.get(e);var r={},i=Object.defineProperty&&Object.getOwnPropertyDescriptor;for(var f in e)if(f!=="default"&&Object.prototype.hasOwnProperty.call(e,f)){var p=i?Object.getOwnPropertyDescriptor(e,f):null;p&&(p.get||p.set)?Object.defineProperty(r,f,p):r[f]=e[f]}return r.default=e,n&&n.set(e,r),r}function xe(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);t&&(r=r.filter(function(i){return Object.getOwnPropertyDescriptor(e,i).enumerable})),n.push.apply(n,r)}return n}function We(e){for(var t=1;t<arguments.length;t++){var n=arguments[t]!=null?arguments[t]:{};t%2?xe(Object(n),!0).forEach(function(r){je(e,r,n[r])}):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):xe(Object(n)).forEach(function(r){Object.defineProperty(e,r,Object.getOwnPropertyDescriptor(n,r))})}return e}function je(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}var te="";function $e(e,t){return te||(te=(0,N.findInArray)(["matches","webkitMatchesSelector","mozMatchesSelector","msMatchesSelector","oMatchesSelector"],function(n){return(0,N.isFunction)(e[n])})),(0,N.isFunction)(e[te])?e[te](t):!1}function yt(e,t,n){var r=e;do{if($e(r,t))return!0;if(r===n)return!1;r=r.parentNode}while(r);return!1}function mt(e,t,n,r){if(!!e){var i=We({capture:!0},r);e.addEventListener?e.addEventListener(t,n,i):e.attachEvent?e.attachEvent("on"+t,n):e["on"+t]=n}}function vt(e,t,n,r){if(!!e){var i=We({capture:!0},r);e.removeEventListener?e.removeEventListener(t,n,i):e.detachEvent?e.detachEvent("on"+t,n):e["on"+t]=null}}function bt(e){var t=e.clientHeight,n=e.ownerDocument.defaultView.getComputedStyle(e);return t+=(0,N.int)(n.borderTopWidth),t+=(0,N.int)(n.borderBottomWidth),t}function wt(e){var t=e.clientWidth,n=e.ownerDocument.defaultView.getComputedStyle(e);return t+=(0,N.int)(n.borderLeftWidth),t+=(0,N.int)(n.borderRightWidth),t}function St(e){var t=e.clientHeight,n=e.ownerDocument.defaultView.getComputedStyle(e);return t-=(0,N.int)(n.paddingTop),t-=(0,N.int)(n.paddingBottom),t}function Dt(e){var t=e.clientWidth,n=e.ownerDocument.defaultView.getComputedStyle(e);return t-=(0,N.int)(n.paddingLeft),t-=(0,N.int)(n.paddingRight),t}function Ot(e,t,n){var r=t===t.ownerDocument.body,i=r?{left:0,top:0}:t.getBoundingClientRect(),f=(e.clientX+t.scrollLeft-i.left)/n,p=(e.clientY+t.scrollTop-i.top)/n;return{x:f,y:p}}function _t(e,t){var n=ye(e,t,"px");return je({},(0,Pe.browserPrefixToKey)("transform",Pe.default),n)}function Pt(e,t){var n=ye(e,t,"");return n}function ye(e,t,n){var r=e.x,i=e.y,f="translate(".concat(r).concat(n,",").concat(i).concat(n,")");if(t){var p="".concat(typeof t.x=="string"?t.x:t.x+n),c="".concat(typeof t.y=="string"?t.y:t.y+n);f="translate(".concat(p,", ").concat(c,")")+f}return f}function xt(e,t){return e.targetTouches&&(0,N.findInArray)(e.targetTouches,function(n){return t===n.identifier})||e.changedTouches&&(0,N.findInArray)(e.changedTouches,function(n){return t===n.identifier})}function Tt(e){if(e.targetTouches&&e.targetTouches[0])return e.targetTouches[0].identifier;if(e.changedTouches&&e.changedTouches[0])return e.changedTouches[0].identifier}function Mt(e){if(!!e){var t=e.getElementById("react-draggable-style-el");t||(t=e.createElement("style"),t.type="text/css",t.id="react-draggable-style-el",t.innerHTML=`.react-draggable-transparent-selection *::-moz-selection {all: inherit;}
`,t.innerHTML+=`.react-draggable-transparent-selection *::selection {all: inherit;}
`,e.getElementsByTagName("head")[0].appendChild(t)),e.body&&Le(e.body,"react-draggable-transparent-selection")}}function Et(e){if(!!e)try{if(e.body&&Ye(e.body,"react-draggable-transparent-selection"),e.selection)e.selection.empty();else{var t=(e.defaultView||window).getSelection();t&&t.type!=="Caret"&&t.removeAllRanges()}}catch{}}function Le(e,t){e.classList?e.classList.add(t):e.className.match(new RegExp("(?:^|\\s)".concat(t,"(?!\\S)")))||(e.className+=" ".concat(t))}function Ye(e,t){e.classList?e.classList.remove(t):e.className=e.className.replace(new RegExp("(?:^|\\s)".concat(t,"(?!\\S)"),"g"),"")}var j={};Object.defineProperty(j,"__esModule",{value:!0});j.canDragX=Rt;j.canDragY=kt;j.createCoreData=It;j.createDraggableData=Wt;j.getBoundPosition=Ct;j.getControlPosition=At;j.snapToGrid=Nt;var C=W,G=S;function Ct(e,t,n){if(!e.props.bounds)return[t,n];var r=e.props.bounds;r=typeof r=="string"?r:jt(r);var i=me(e);if(typeof r=="string"){var f=i.ownerDocument,p=f.defaultView,c;if(r==="parent"?c=i.parentNode:c=f.querySelector(r),!(c instanceof p.HTMLElement))throw new Error('Bounds selector "'+r+'" could not find an element.');var h=c,y=p.getComputedStyle(i),b=p.getComputedStyle(h);r={left:-i.offsetLeft+(0,C.int)(b.paddingLeft)+(0,C.int)(y.marginLeft),top:-i.offsetTop+(0,C.int)(b.paddingTop)+(0,C.int)(y.marginTop),right:(0,G.innerWidth)(h)-(0,G.outerWidth)(i)-i.offsetLeft+(0,C.int)(b.paddingRight)-(0,C.int)(y.marginRight),bottom:(0,G.innerHeight)(h)-(0,G.outerHeight)(i)-i.offsetTop+(0,C.int)(b.paddingBottom)-(0,C.int)(y.marginBottom)}}return(0,C.isNum)(r.right)&&(t=Math.min(t,r.right)),(0,C.isNum)(r.bottom)&&(n=Math.min(n,r.bottom)),(0,C.isNum)(r.left)&&(t=Math.max(t,r.left)),(0,C.isNum)(r.top)&&(n=Math.max(n,r.top)),[t,n]}function Nt(e,t,n){var r=Math.round(t/e[0])*e[0],i=Math.round(n/e[1])*e[1];return[r,i]}function Rt(e){return e.props.axis==="both"||e.props.axis==="x"}function kt(e){return e.props.axis==="both"||e.props.axis==="y"}function At(e,t,n){var r=typeof t=="number"?(0,G.getTouch)(e,t):null;if(typeof t=="number"&&!r)return null;var i=me(n),f=n.props.offsetParent||i.offsetParent||i.ownerDocument.body;return(0,G.offsetXYFromParent)(r||e,f,n.props.scale)}function It(e,t,n){var r=e.state,i=!(0,C.isNum)(r.lastX),f=me(e);return i?{node:f,deltaX:0,deltaY:0,lastX:t,lastY:n,x:t,y:n}:{node:f,deltaX:t-r.lastX,deltaY:n-r.lastY,lastX:r.lastX,lastY:r.lastY,x:t,y:n}}function Wt(e,t){var n=e.props.scale;return{node:t.node,x:e.state.x+t.deltaX/n,y:e.state.y+t.deltaY/n,deltaX:t.deltaX/n,deltaY:t.deltaY/n,lastX:e.state.x,lastY:e.state.y}}function jt(e){return{left:e.left,top:e.top,right:e.right,bottom:e.bottom}}function me(e){var t=e.findDOMNode();if(!t)throw new Error("<DraggableCore>: Unmounted during event!");return t}var oe={},ie={};Object.defineProperty(ie,"__esModule",{value:!0});ie.default=$t;function $t(){}function re(e){return re=typeof Symbol=="function"&&typeof Symbol.iterator=="symbol"?function(t){return typeof t}:function(t){return t&&typeof Symbol=="function"&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t},re(e)}Object.defineProperty(oe,"__esModule",{value:!0});oe.default=void 0;var de=Yt(q.exports),E=ve(Ne.exports),Lt=ve(Ce.exports),P=S,U=j,pe=W,K=ve(ie);function ve(e){return e&&e.__esModule?e:{default:e}}function Ue(e){if(typeof WeakMap!="function")return null;var t=new WeakMap,n=new WeakMap;return(Ue=function(i){return i?n:t})(e)}function Yt(e,t){if(!t&&e&&e.__esModule)return e;if(e===null||re(e)!=="object"&&typeof e!="function")return{default:e};var n=Ue(t);if(n&&n.has(e))return n.get(e);var r={},i=Object.defineProperty&&Object.getOwnPropertyDescriptor;for(var f in e)if(f!=="default"&&Object.prototype.hasOwnProperty.call(e,f)){var p=i?Object.getOwnPropertyDescriptor(e,f):null;p&&(p.get||p.set)?Object.defineProperty(r,f,p):r[f]=e[f]}return r.default=e,n&&n.set(e,r),r}function Te(e,t){return Bt(e)||Ht(e,t)||Xt(e,t)||Ut()}function Ut(){throw new TypeError(`Invalid attempt to destructure non-iterable instance.
In order to be iterable, non-array objects must have a [Symbol.iterator]() method.`)}function Xt(e,t){if(!!e){if(typeof e=="string")return Me(e,t);var n=Object.prototype.toString.call(e).slice(8,-1);if(n==="Object"&&e.constructor&&(n=e.constructor.name),n==="Map"||n==="Set")return Array.from(e);if(n==="Arguments"||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n))return Me(e,t)}}function Me(e,t){(t==null||t>e.length)&&(t=e.length);for(var n=0,r=new Array(t);n<t;n++)r[n]=e[n];return r}function Ht(e,t){var n=e==null?null:typeof Symbol<"u"&&e[Symbol.iterator]||e["@@iterator"];if(n!=null){var r=[],i=!0,f=!1,p,c;try{for(n=n.call(e);!(i=(p=n.next()).done)&&(r.push(p.value),!(t&&r.length===t));i=!0);}catch(h){f=!0,c=h}finally{try{!i&&n.return!=null&&n.return()}finally{if(f)throw c}}return r}}function Bt(e){if(Array.isArray(e))return e}function Ft(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function Ee(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}function Vt(e,t,n){return t&&Ee(e.prototype,t),n&&Ee(e,n),Object.defineProperty(e,"prototype",{writable:!1}),e}function qt(e,t){if(typeof t!="function"&&t!==null)throw new TypeError("Super expression must either be null or a function");e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,writable:!0,configurable:!0}}),Object.defineProperty(e,"prototype",{writable:!1}),t&&he(e,t)}function he(e,t){return he=Object.setPrototypeOf||function(r,i){return r.__proto__=i,r},he(e,t)}function Gt(e){var t=Kt();return function(){var r=ne(e),i;if(t){var f=ne(this).constructor;i=Reflect.construct(r,arguments,f)}else i=r.apply(this,arguments);return zt(this,i)}}function zt(e,t){if(t&&(re(t)==="object"||typeof t=="function"))return t;if(t!==void 0)throw new TypeError("Derived constructors may only return object or undefined");return x(e)}function x(e){if(e===void 0)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return e}function Kt(){if(typeof Reflect>"u"||!Reflect.construct||Reflect.construct.sham)return!1;if(typeof Proxy=="function")return!0;try{return Boolean.prototype.valueOf.call(Reflect.construct(Boolean,[],function(){})),!0}catch{return!1}}function ne(e){return ne=Object.setPrototypeOf?Object.getPrototypeOf:function(n){return n.__proto__||Object.getPrototypeOf(n)},ne(e)}function k(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}var I={touch:{start:"touchstart",move:"touchmove",stop:"touchend"},mouse:{start:"mousedown",move:"mousemove",stop:"mouseup"}},X=I.mouse,se=function(e){qt(n,e);var t=Gt(n);function n(){var r;Ft(this,n);for(var i=arguments.length,f=new Array(i),p=0;p<i;p++)f[p]=arguments[p];return r=t.call.apply(t,[this].concat(f)),k(x(r),"state",{dragging:!1,lastX:NaN,lastY:NaN,touchIdentifier:null}),k(x(r),"mounted",!1),k(x(r),"handleDragStart",function(c){if(r.props.onMouseDown(c),!r.props.allowAnyClick&&typeof c.button=="number"&&c.button!==0)return!1;var h=r.findDOMNode();if(!h||!h.ownerDocument||!h.ownerDocument.body)throw new Error("<DraggableCore> not mounted on DragStart!");var y=h.ownerDocument;if(!(r.props.disabled||!(c.target instanceof y.defaultView.Node)||r.props.handle&&!(0,P.matchesSelectorAndParentsTo)(c.target,r.props.handle,h)||r.props.cancel&&(0,P.matchesSelectorAndParentsTo)(c.target,r.props.cancel,h))){c.type==="touchstart"&&c.preventDefault();var b=(0,P.getTouchIdentifier)(c);r.setState({touchIdentifier:b});var _=(0,U.getControlPosition)(c,b,x(r));if(_!=null){var O=_.x,A=_.y,w=(0,U.createCoreData)(x(r),O,A);(0,K.default)("DraggableCore: handleDragStart: %j",w),(0,K.default)("calling",r.props.onStart);var v=r.props.onStart(c,w);v===!1||r.mounted===!1||(r.props.enableUserSelectHack&&(0,P.addUserSelectStyles)(y),r.setState({dragging:!0,lastX:O,lastY:A}),(0,P.addEvent)(y,X.move,r.handleDrag),(0,P.addEvent)(y,X.stop,r.handleDragStop))}}}),k(x(r),"handleDrag",function(c){var h=(0,U.getControlPosition)(c,r.state.touchIdentifier,x(r));if(h!=null){var y=h.x,b=h.y;if(Array.isArray(r.props.grid)){var _=y-r.state.lastX,O=b-r.state.lastY,A=(0,U.snapToGrid)(r.props.grid,_,O),w=Te(A,2);if(_=w[0],O=w[1],!_&&!O)return;y=r.state.lastX+_,b=r.state.lastY+O}var v=(0,U.createCoreData)(x(r),y,b);(0,K.default)("DraggableCore: handleDrag: %j",v);var T=r.props.onDrag(c,v);if(T===!1||r.mounted===!1){try{r.handleDragStop(new MouseEvent("mouseup"))}catch{var M=document.createEvent("MouseEvents");M.initMouseEvent("mouseup",!0,!0,window,0,0,0,0,0,!1,!1,!1,!1,0,null),r.handleDragStop(M)}return}r.setState({lastX:y,lastY:b})}}),k(x(r),"handleDragStop",function(c){if(!!r.state.dragging){var h=(0,U.getControlPosition)(c,r.state.touchIdentifier,x(r));if(h!=null){var y=h.x,b=h.y;if(Array.isArray(r.props.grid)){var _=y-r.state.lastX||0,O=b-r.state.lastY||0,A=(0,U.snapToGrid)(r.props.grid,_,O),w=Te(A,2);_=w[0],O=w[1],y=r.state.lastX+_,b=r.state.lastY+O}var v=(0,U.createCoreData)(x(r),y,b),T=r.props.onStop(c,v);if(T===!1||r.mounted===!1)return!1;var M=r.findDOMNode();M&&r.props.enableUserSelectHack&&(0,P.removeUserSelectStyles)(M.ownerDocument),(0,K.default)("DraggableCore: handleDragStop: %j",v),r.setState({dragging:!1,lastX:NaN,lastY:NaN}),M&&((0,K.default)("DraggableCore: Removing handlers"),(0,P.removeEvent)(M.ownerDocument,X.move,r.handleDrag),(0,P.removeEvent)(M.ownerDocument,X.stop,r.handleDragStop))}}}),k(x(r),"onMouseDown",function(c){return X=I.mouse,r.handleDragStart(c)}),k(x(r),"onMouseUp",function(c){return X=I.mouse,r.handleDragStop(c)}),k(x(r),"onTouchStart",function(c){return X=I.touch,r.handleDragStart(c)}),k(x(r),"onTouchEnd",function(c){return X=I.touch,r.handleDragStop(c)}),r}return Vt(n,[{key:"componentDidMount",value:function(){this.mounted=!0;var i=this.findDOMNode();i&&(0,P.addEvent)(i,I.touch.start,this.onTouchStart,{passive:!1})}},{key:"componentWillUnmount",value:function(){this.mounted=!1;var i=this.findDOMNode();if(i){var f=i.ownerDocument;(0,P.removeEvent)(f,I.mouse.move,this.handleDrag),(0,P.removeEvent)(f,I.touch.move,this.handleDrag),(0,P.removeEvent)(f,I.mouse.stop,this.handleDragStop),(0,P.removeEvent)(f,I.touch.stop,this.handleDragStop),(0,P.removeEvent)(i,I.touch.start,this.onTouchStart,{passive:!1}),this.props.enableUserSelectHack&&(0,P.removeUserSelectStyles)(f)}}},{key:"findDOMNode",value:function(){var i,f,p;return(i=this.props)!==null&&i!==void 0&&i.nodeRef?(f=this.props)===null||f===void 0||(p=f.nodeRef)===null||p===void 0?void 0:p.current:Lt.default.findDOMNode(this)}},{key:"render",value:function(){return de.cloneElement(de.Children.only(this.props.children),{onMouseDown:this.onMouseDown,onMouseUp:this.onMouseUp,onTouchEnd:this.onTouchEnd})}}]),n}(de.Component);oe.default=se;k(se,"displayName","DraggableCore");k(se,"propTypes",{allowAnyClick:E.default.bool,disabled:E.default.bool,enableUserSelectHack:E.default.bool,offsetParent:function(t,n){if(t[n]&&t[n].nodeType!==1)throw new Error("Draggable's offsetParent must be a DOM Node.")},grid:E.default.arrayOf(E.default.number),handle:E.default.string,cancel:E.default.string,nodeRef:E.default.object,onStart:E.default.func,onDrag:E.default.func,onStop:E.default.func,onMouseDown:E.default.func,scale:E.default.number,className:pe.dontSetMe,style:pe.dontSetMe,transform:pe.dontSetMe});k(se,"defaultProps",{allowAnyClick:!1,disabled:!1,enableUserSelectHack:!0,onStart:function(){},onDrag:function(){},onStop:function(){},onMouseDown:function(){},scale:1});(function(e){function t(a){return t=typeof Symbol=="function"&&typeof Symbol.iterator=="symbol"?function(o){return typeof o}:function(o){return o&&typeof Symbol=="function"&&o.constructor===Symbol&&o!==Symbol.prototype?"symbol":typeof o},t(a)}Object.defineProperty(e,"__esModule",{value:!0}),Object.defineProperty(e,"DraggableCore",{enumerable:!0,get:function(){return y.default}}),e.default=void 0;var n=w(q.exports),r=O(Ne.exports),i=O(Ce.exports),f=O(it),p=S,c=j,h=W,y=O(oe),b=O(ie),_=["axis","bounds","children","defaultPosition","defaultClassName","defaultClassNameDragging","defaultClassNameDragged","position","positionOffset","scale"];function O(a){return a&&a.__esModule?a:{default:a}}function A(a){if(typeof WeakMap!="function")return null;var o=new WeakMap,s=new WeakMap;return(A=function(u){return u?s:o})(a)}function w(a,o){if(!o&&a&&a.__esModule)return a;if(a===null||t(a)!=="object"&&typeof a!="function")return{default:a};var s=A(o);if(s&&s.has(a))return s.get(a);var l={},u=Object.defineProperty&&Object.getOwnPropertyDescriptor;for(var d in a)if(d!=="default"&&Object.prototype.hasOwnProperty.call(a,d)){var g=u?Object.getOwnPropertyDescriptor(a,d):null;g&&(g.get||g.set)?Object.defineProperty(l,d,g):l[d]=a[d]}return l.default=a,s&&s.set(a,l),l}function v(){return v=Object.assign||function(a){for(var o=1;o<arguments.length;o++){var s=arguments[o];for(var l in s)Object.prototype.hasOwnProperty.call(s,l)&&(a[l]=s[l])}return a},v.apply(this,arguments)}function T(a,o){if(a==null)return{};var s=M(a,o),l,u;if(Object.getOwnPropertySymbols){var d=Object.getOwnPropertySymbols(a);for(u=0;u<d.length;u++)l=d[u],!(o.indexOf(l)>=0)&&(!Object.prototype.propertyIsEnumerable.call(a,l)||(s[l]=a[l]))}return s}function M(a,o){if(a==null)return{};var s={},l=Object.keys(a),u,d;for(d=0;d<l.length;d++)u=l[d],!(o.indexOf(u)>=0)&&(s[u]=a[u]);return s}function le(a,o){var s=Object.keys(a);if(Object.getOwnPropertySymbols){var l=Object.getOwnPropertySymbols(a);o&&(l=l.filter(function(u){return Object.getOwnPropertyDescriptor(a,u).enumerable})),s.push.apply(s,l)}return s}function L(a){for(var o=1;o<arguments.length;o++){var s=arguments[o]!=null?arguments[o]:{};o%2?le(Object(s),!0).forEach(function(l){$(a,l,s[l])}):Object.getOwnPropertyDescriptors?Object.defineProperties(a,Object.getOwnPropertyDescriptors(s)):le(Object(s)).forEach(function(l){Object.defineProperty(a,l,Object.getOwnPropertyDescriptor(s,l))})}return a}function Be(a,o){return Ge(a)||qe(a,o)||Ve(a,o)||Fe()}function Fe(){throw new TypeError(`Invalid attempt to destructure non-iterable instance.
In order to be iterable, non-array objects must have a [Symbol.iterator]() method.`)}function Ve(a,o){if(!!a){if(typeof a=="string")return be(a,o);var s=Object.prototype.toString.call(a).slice(8,-1);if(s==="Object"&&a.constructor&&(s=a.constructor.name),s==="Map"||s==="Set")return Array.from(a);if(s==="Arguments"||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(s))return be(a,o)}}function be(a,o){(o==null||o>a.length)&&(o=a.length);for(var s=0,l=new Array(o);s<o;s++)l[s]=a[s];return l}function qe(a,o){var s=a==null?null:typeof Symbol<"u"&&a[Symbol.iterator]||a["@@iterator"];if(s!=null){var l=[],u=!0,d=!1,g,D;try{for(s=s.call(a);!(u=(g=s.next()).done)&&(l.push(g.value),!(o&&l.length===o));u=!0);}catch(m){d=!0,D=m}finally{try{!u&&s.return!=null&&s.return()}finally{if(d)throw D}}return l}}function Ge(a){if(Array.isArray(a))return a}function ze(a,o){if(!(a instanceof o))throw new TypeError("Cannot call a class as a function")}function we(a,o){for(var s=0;s<o.length;s++){var l=o[s];l.enumerable=l.enumerable||!1,l.configurable=!0,"value"in l&&(l.writable=!0),Object.defineProperty(a,l.key,l)}}function Ke(a,o,s){return o&&we(a.prototype,o),s&&we(a,s),Object.defineProperty(a,"prototype",{writable:!1}),a}function Je(a,o){if(typeof o!="function"&&o!==null)throw new TypeError("Super expression must either be null or a function");a.prototype=Object.create(o&&o.prototype,{constructor:{value:a,writable:!0,configurable:!0}}),Object.defineProperty(a,"prototype",{writable:!1}),o&&ue(a,o)}function ue(a,o){return ue=Object.setPrototypeOf||function(l,u){return l.__proto__=u,l},ue(a,o)}function Qe(a){var o=et();return function(){var l=J(a),u;if(o){var d=J(this).constructor;u=Reflect.construct(l,arguments,d)}else u=l.apply(this,arguments);return Ze(this,u)}}function Ze(a,o){if(o&&(t(o)==="object"||typeof o=="function"))return o;if(o!==void 0)throw new TypeError("Derived constructors may only return object or undefined");return Y(a)}function Y(a){if(a===void 0)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return a}function et(){if(typeof Reflect>"u"||!Reflect.construct||Reflect.construct.sham)return!1;if(typeof Proxy=="function")return!0;try{return Boolean.prototype.valueOf.call(Reflect.construct(Boolean,[],function(){})),!0}catch{return!1}}function J(a){return J=Object.setPrototypeOf?Object.getPrototypeOf:function(s){return s.__proto__||Object.getPrototypeOf(s)},J(a)}function $(a,o,s){return o in a?Object.defineProperty(a,o,{value:s,enumerable:!0,configurable:!0,writable:!0}):a[o]=s,a}var Q=function(a){Je(s,a);var o=Qe(s);function s(l){var u;return ze(this,s),u=o.call(this,l),$(Y(u),"onDragStart",function(d,g){(0,b.default)("Draggable: onDragStart: %j",g);var D=u.props.onStart(d,(0,c.createDraggableData)(Y(u),g));if(D===!1)return!1;u.setState({dragging:!0,dragged:!0})}),$(Y(u),"onDrag",function(d,g){if(!u.state.dragging)return!1;(0,b.default)("Draggable: onDrag: %j",g);var D=(0,c.createDraggableData)(Y(u),g),m={x:D.x,y:D.y};if(u.props.bounds){var z=m.x,F=m.y;m.x+=u.state.slackX,m.y+=u.state.slackY;var V=(0,c.getBoundPosition)(Y(u),m.x,m.y),H=Be(V,2),fe=H[0],Z=H[1];m.x=fe,m.y=Z,m.slackX=u.state.slackX+(z-m.x),m.slackY=u.state.slackY+(F-m.y),D.x=m.x,D.y=m.y,D.deltaX=m.x-u.state.x,D.deltaY=m.y-u.state.y}var ee=u.props.onDrag(d,D);if(ee===!1)return!1;u.setState(m)}),$(Y(u),"onDragStop",function(d,g){if(!u.state.dragging)return!1;var D=u.props.onStop(d,(0,c.createDraggableData)(Y(u),g));if(D===!1)return!1;(0,b.default)("Draggable: onDragStop: %j",g);var m={dragging:!1,slackX:0,slackY:0},z=Boolean(u.props.position);if(z){var F=u.props.position,V=F.x,H=F.y;m.x=V,m.y=H}u.setState(m)}),u.state={dragging:!1,dragged:!1,x:l.position?l.position.x:l.defaultPosition.x,y:l.position?l.position.y:l.defaultPosition.y,prevPropsPosition:L({},l.position),slackX:0,slackY:0,isElementSVG:!1},l.position&&!(l.onDrag||l.onStop)&&console.warn("A `position` was applied to this <Draggable>, without drag handlers. This will make this component effectively undraggable. Please attach `onDrag` or `onStop` handlers so you can adjust the `position` of this element."),u}return Ke(s,[{key:"componentDidMount",value:function(){typeof window.SVGElement<"u"&&this.findDOMNode()instanceof window.SVGElement&&this.setState({isElementSVG:!0})}},{key:"componentWillUnmount",value:function(){this.setState({dragging:!1})}},{key:"findDOMNode",value:function(){var u,d,g;return(u=(d=this.props)===null||d===void 0||(g=d.nodeRef)===null||g===void 0?void 0:g.current)!==null&&u!==void 0?u:i.default.findDOMNode(this)}},{key:"render",value:function(){var u,d=this.props;d.axis,d.bounds;var g=d.children,D=d.defaultPosition,m=d.defaultClassName,z=d.defaultClassNameDragging,F=d.defaultClassNameDragged,V=d.position,H=d.positionOffset;d.scale;var fe=T(d,_),Z={},ee=null,tt=Boolean(V),Se=!tt||this.state.dragging,De=V||D,Oe={x:(0,c.canDragX)(this)&&Se?this.state.x:De.x,y:(0,c.canDragY)(this)&&Se?this.state.y:De.y};this.state.isElementSVG?ee=(0,p.createSVGTransform)(Oe,H):Z=(0,p.createCSSTransform)(Oe,H);var rt=(0,f.default)(g.props.className||"",m,(u={},$(u,z,this.state.dragging),$(u,F,this.state.dragged),u));return n.createElement(y.default,v({},fe,{onStart:this.onDragStart,onDrag:this.onDrag,onStop:this.onDragStop}),n.cloneElement(n.Children.only(g),{className:rt,style:L(L({},g.props.style),Z),transform:ee}))}}],[{key:"getDerivedStateFromProps",value:function(u,d){var g=u.position,D=d.prevPropsPosition;return g&&(!D||g.x!==D.x||g.y!==D.y)?((0,b.default)("Draggable: getDerivedStateFromProps %j",{position:g,prevPropsPosition:D}),{x:g.x,y:g.y,prevPropsPosition:L({},g)}):null}}]),s}(n.Component);e.default=Q,$(Q,"displayName","Draggable"),$(Q,"propTypes",L(L({},y.default.propTypes),{},{axis:r.default.oneOf(["both","x","y","none"]),bounds:r.default.oneOfType([r.default.shape({left:r.default.number,right:r.default.number,top:r.default.number,bottom:r.default.number}),r.default.string,r.default.oneOf([!1])]),defaultClassName:r.default.string,defaultClassNameDragging:r.default.string,defaultClassNameDragged:r.default.string,defaultPosition:r.default.shape({x:r.default.number,y:r.default.number}),positionOffset:r.default.shape({x:r.default.oneOfType([r.default.number,r.default.string]),y:r.default.oneOfType([r.default.number,r.default.string])}),position:r.default.shape({x:r.default.number,y:r.default.number}),className:h.dontSetMe,style:h.dontSetMe,transform:h.dontSetMe})),$(Q,"defaultProps",L(L({},y.default.defaultProps),{},{axis:"both",bounds:!1,defaultClassName:"react-draggable",defaultClassNameDragging:"react-draggable-dragging",defaultClassNameDragged:"react-draggable-dragged",defaultPosition:{x:0,y:0},scale:1}))})(Re);var Xe=Re,He=Xe.default,Jt=Xe.DraggableCore;ae.exports=He;ae.exports.default=He;ae.exports.DraggableCore=Jt;const tr=()=>{const e=`Try moving the terminal around by clicking and dragging

          joke - I will tell you a random joke

          linkedin - brings you to my linkedin page

          github - brings you to my github page

          clear - clears the stuff
`,[t,n]=q.exports.useState(!1),[r,i]=q.exports.useState(e.split(`
`)),[f,p]=q.exports.useState(""),[c,h]=q.exports.useState({isDragging:!1,origin:{x:0,y:0},translation:{x:window.innerWidth/3,y:window.innerHeight/2.5},lastTranslation:{x:window.innerWidth/3,y:window.innerHeight/2.5}}),{isDragging:y}=c,b=({clientX:w,clientY:v})=>{y||h({...c,isDragging:!0,origin:{x:w,y:v}})},_=({clientX:w,clientY:v})=>{if(y){const{origin:T,lastTranslation:M}=c;h({...c,translation:{x:Math.abs(w-(T.x+M.x)),y:Math.abs(v-(T.y+M.y))}})}},O=()=>{if(y){const{translation:w}=c;h({...c,isDragging:!1,lastTranslation:{x:w.x,y:w.y}})}},A=w=>{if(w.key==="Enter"){let v="";switch(f){case"linkedin":window.open("https://www.linkedin.com/in/shrmnl/","_blank"),v="sending you to linkedin now...";break;case"github":window.open("https://github.com/shermanleejm","_blank"),v="sending you to github now...";break;case"joke":let T=["I'm afraid for the calendar. Its days are numbered.","My wife said I should do lunges to stay in shape. That would be a big step forward.","Singing in the shower is fun until you get soap in your mouth. Then it's a soap opera.","What do a tick and the Eiffel Tower have in common? They're both Paris sites.","What do you call a fish wearing a bowtie? Sofishticated.","How do you follow Will Smith in the snow? You follow the fresh prints.","If April showers bring May flowers, what do May flowers bring? Pilgrims.","I thought the dryer was shrinking my clothes. Turns out it was the refrigerator all along.","You. TROLOLOLOL"];v=T[Math.floor(Math.random()*T.length)];break;case"clear":i(e.split(`
`));break;case"help":v=e;break;default:v=`${f} is not a valid command, type help for options.`}if(f!=="clear"){let T=r;T.push(">  "+f),v.split(`
`).map(M=>T.push(M)),i(T)}p("")}};return R.createElement("div",{id:"scrolling",style:{display:"flex",justifyContent:"center",alignItems:"center"}},t?R.createElement(_e,{onClick:()=>{n(!1)},style:{padding:"10px",width:"20vw",textAlign:"center",backgroundColor:"black",color:"white",position:"fixed",bottom:0,cursor:"pointer"}},"TERMINAL"):R.createElement(ae.exports,null,R.createElement(_e,{elevation:3,onMouseDown:b,onMouseMove:_,onMouseLeave:_,onMouseUp:O,style:{right:`${c.translation.x}px`,bottom:`${c.translation.y}px`,position:"absolute",borderRadius:"10px",padding:"0 0 20px 0",width:"50vw",backgroundColor:"black",color:"#39ff14"}},R.createElement("div",{style:{marginBottom:"30px",backgroundColor:"grey",width:"100%",height:"100%",borderRadius:"10px 10px 0 0"}},R.createElement("button",{style:{backgroundColor:"red",borderRadius:"50%",width:"20px",height:"20px",margin:"5px 0 5px 10px",border:"1 solid white"},onClick:()=>{alert("Now why would you want to close my lovely creation?"),i(e.split(`
`)),n(!0)}}),R.createElement("button",{style:{backgroundColor:"yellow",borderRadius:"50%",width:"20px",height:"20px",margin:"5px 0 5px 10px",border:"1 solid white"},onClick:()=>n(!0)}),R.createElement("button",{style:{backgroundColor:"green",borderRadius:"50%",width:"20px",height:"20px",margin:"5px 0 5px 10px",border:"1 solid white"},onClick:()=>alert("ARE YOU TRYING TO KILL ME WITH CSS?????????")})),R.createElement("div",{style:{padding:"10px"}},r.map((w,v)=>R.createElement(ot,{key:v},w))),R.createElement("div",{style:{display:"flex",flexDirection:"row",padding:"0 0 0 10px"}},">",R.createElement("input",{style:{background:"transparent",border:"none",color:"#39ff14",marginLeft:"10px",width:"90%"},onChange:w=>{p(w.target.value)},value:f,onKeyDown:A,autoCapitalize:"none",placeholder:"type here"})))))};export{tr as default};