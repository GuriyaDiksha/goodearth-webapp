!function(e){if("object"==typeof exports&&"undefined"!=typeof module)module.exports=e();else if("function"==typeof define&&define.amd)define([],e);else{("undefined"!=typeof window?window:"undefined"!=typeof global?global:"undefined"!=typeof self?self:this).localforage=e()}}(function(){return function e(n,t,r){function o(a,c){if(!t[a]){if(!n[a]){var u="function"==typeof require&&require;if(!c&&u)return u(a,!0);if(i)return i(a,!0);var f=new Error("Cannot find module '"+a+"'");throw f.code="MODULE_NOT_FOUND",f}var s=t[a]={exports:{}};n[a][0].call(s.exports,function(e){return o(n[a][1][e]||e)},s,s.exports,e,n,t,r)}return t[a].exports}for(var i="function"==typeof require&&require,a=0;a<r.length;a++)o(r[a]);return o}({1:[function(e,n,t){(function(e){"use strict";function t(){f=!0;for(var e,n,t=s.length;t;){for(n=s,s=[],e=-1;++e<t;)n[e]();t=s.length}f=!1}var r,o=e.MutationObserver||e.WebKitMutationObserver;if(o){var i=0,a=new o(t),c=e.document.createTextNode("");a.observe(c,{characterData:!0}),r=function(){c.data=i=++i%2}}else if(e.setImmediate||void 0===e.MessageChannel)r="document"in e&&"onreadystatechange"in e.document.createElement("script")?function(){var n=e.document.createElement("script");n.onreadystatechange=function(){t(),n.onreadystatechange=null,n.parentNode.removeChild(n),n=null},e.document.documentElement.appendChild(n)}:function(){setTimeout(t,0)};else{var u=new e.MessageChannel;u.port1.onmessage=t,r=function(){u.port2.postMessage(0)}}var f,s=[];n.exports=function(e){1!==s.push(e)||f||r()}}).call(this,"undefined"!=typeof global?global:"undefined"!=typeof self?self:"undefined"!=typeof window?window:{})},{}],2:[function(e,n,t){"use strict";function r(){}function o(e){if("function"!=typeof e)throw new TypeError("resolver must be a function");this.state=v,this.queue=[],this.outcome=void 0,e!==r&&u(this,e)}function i(e,n,t){this.promise=e,"function"==typeof n&&(this.onFulfilled=n,this.callFulfilled=this.otherCallFulfilled),"function"==typeof t&&(this.onRejected=t,this.callRejected=this.otherCallRejected)}function a(e,n,t){s(function(){var r;try{r=n(t)}catch(n){return d.reject(e,n)}r===e?d.reject(e,new TypeError("Cannot resolve promise with itself")):d.resolve(e,r)})}function c(e){var n=e&&e.then;if(e&&("object"==typeof e||"function"==typeof e)&&"function"==typeof n)return function(){n.apply(e,arguments)}}function u(e,n){function t(n){o||(o=!0,d.reject(e,n))}function r(n){o||(o=!0,d.resolve(e,n))}var o=!1,i=f(function(){n(r,t)});"error"===i.status&&t(i.value)}function f(e,n){var t={};try{t.value=e(n),t.status="success"}catch(e){t.status="error",t.value=e}return t}var s=e(1),d={},l=["REJECTED"],h=["FULFILLED"],v=["PENDING"];n.exports=o,o.prototype.catch=function(e){return this.then(null,e)},o.prototype.then=function(e,n){if("function"!=typeof e&&this.state===h||"function"!=typeof n&&this.state===l)return this;var t=new this.constructor(r);return this.state!==v?a(t,this.state===h?e:n,this.outcome):this.queue.push(new i(t,e,n)),t},i.prototype.callFulfilled=function(e){d.resolve(this.promise,e)},i.prototype.otherCallFulfilled=function(e){a(this.promise,this.onFulfilled,e)},i.prototype.callRejected=function(e){d.reject(this.promise,e)},i.prototype.otherCallRejected=function(e){a(this.promise,this.onRejected,e)},d.resolve=function(e,n){var t=f(c,n);if("error"===t.status)return d.reject(e,t.value);var r=t.value;if(r)u(e,r);else{e.state=h,e.outcome=n;for(var o=-1,i=e.queue.length;++o<i;)e.queue[o].callFulfilled(n)}return e},d.reject=function(e,n){e.state=l,e.outcome=n;for(var t=-1,r=e.queue.length;++t<r;)e.queue[t].callRejected(n);return e},o.resolve=function(e){return e instanceof this?e:d.resolve(new this(r),e)},o.reject=function(e){var n=new this(r);return d.reject(n,e)},o.all=function(e){function n(e,n){t.resolve(e).then(function(e){a[n]=e,++c!==o||i||(i=!0,d.resolve(f,a))},function(e){i||(i=!0,d.reject(f,e))})}var t=this;if("[object Array]"!==Object.prototype.toString.call(e))return this.reject(new TypeError("must be an array"));var o=e.length,i=!1;if(!o)return this.resolve([]);for(var a=new Array(o),c=0,u=-1,f=new this(r);++u<o;)n(e[u],u);return f},o.race=function(e){function n(e){t.resolve(e).then(function(e){i||(i=!0,d.resolve(c,e))},function(e){i||(i=!0,d.reject(c,e))})}var t=this;if("[object Array]"!==Object.prototype.toString.call(e))return this.reject(new TypeError("must be an array"));var o=e.length,i=!1;if(!o)return this.resolve([]);for(var a=-1,c=new this(r);++a<o;)n(e[a]);return c}},{1:1}],3:[function(e,n,t){(function(n){"use strict";"function"!=typeof n.Promise&&(n.Promise=e(2))}).call(this,"undefined"!=typeof global?global:"undefined"!=typeof self?self:"undefined"!=typeof window?window:{})},{2:2}],4:[function(e,n,t){"use strict";function r(e,n){e=e||[],n=n||{};try{return new Blob(e,n)}catch(o){if("TypeError"!==o.name)throw o;for(var t=new("undefined"!=typeof BlobBuilder?BlobBuilder:"undefined"!=typeof MSBlobBuilder?MSBlobBuilder:"undefined"!=typeof MozBlobBuilder?MozBlobBuilder:WebKitBlobBuilder),r=0;r<e.length;r+=1)t.append(e[r]);return t.getBlob(n.type)}}function o(e,n){n&&e.then(function(e){n(null,e)},function(e){n(e)})}function i(e,n,t){"function"==typeof n&&e.then(n),"function"==typeof t&&e.catch(t)}function a(e){return"string"!=typeof e&&(console.warn(e+" used as a key, but it is not a string."),e=String(e)),e}function c(){if(arguments.length&&"function"==typeof arguments[arguments.length-1])return arguments[arguments.length-1]}function u(e){return"boolean"==typeof R?j.resolve(R):function(e){return new j(function(n){var t=e.transaction(C,x),o=r([""]);t.objectStore(C).put(o,"key"),t.onabort=function(e){e.preventDefault(),e.stopPropagation(),n(!1)},t.oncomplete=function(){var e=navigator.userAgent.match(/Chrome\/(\d+)/),t=navigator.userAgent.match(/Edge\//);n(t||!e||parseInt(e[1],10)>=43)}}).catch(function(){return!1})}(e).then(function(e){return R=e})}function f(e){var n=B[e.name],t={};t.promise=new j(function(e,n){t.resolve=e,t.reject=n}),n.deferredOperations.push(t),n.dbReady?n.dbReady=n.dbReady.then(function(){return t.promise}):n.dbReady=t.promise}function s(e){var n=B[e.name].deferredOperations.pop();if(n)return n.resolve(),n.promise}function d(e,n){var t=B[e.name].deferredOperations.pop();if(t)return t.reject(n),t.promise}function l(e,n){return new j(function(t,r){if(B[e.name]=B[e.name]||{forages:[],db:null,dbReady:null,deferredOperations:[]},e.db){if(!n)return t(e.db);f(e),e.db.close()}var o=[e.name];n&&o.push(e.version);var i=A.open.apply(A,o);n&&(i.onupgradeneeded=function(n){var t=i.result;try{t.createObjectStore(e.storeName),n.oldVersion<=1&&t.createObjectStore(C)}catch(t){if("ConstraintError"!==t.name)throw t;console.warn('The database "'+e.name+'" has been upgraded from version '+n.oldVersion+" to version "+n.newVersion+', but the storage "'+e.storeName+'" already exists.')}}),i.onerror=function(e){e.preventDefault(),r(i.error)},i.onsuccess=function(){t(i.result),s(e)}})}function h(e){return l(e,!1)}function v(e){return l(e,!0)}function p(e,n){if(!e.db)return!0;var t=!e.db.objectStoreNames.contains(e.storeName),r=e.version<e.db.version,o=e.version>e.db.version;if(r&&(e.version!==n&&console.warn('The database "'+e.name+"\" can't be downgraded from version "+e.db.version+" to version "+e.version+"."),e.version=e.db.version),o||t){if(t){var i=e.db.version+1;i>e.version&&(e.version=i)}return!0}return!1}function m(e){return r([function(e){for(var n=e.length,t=new ArrayBuffer(n),r=new Uint8Array(t),o=0;o<n;o++)r[o]=e.charCodeAt(o);return t}(atob(e.data))],{type:e.type})}function g(e){return e&&e.__local_forage_encoded_blob}function y(e){var n=this,t=n._initReady().then(function(){var e=B[n._dbInfo.name];if(e&&e.dbReady)return e.dbReady});return i(t,e,e),t}function b(e,n,t,r){void 0===r&&(r=1);try{var o=e.db.transaction(e.storeName,n);t(null,o)}catch(o){if(r>0&&(!e.db||"InvalidStateError"===o.name||"NotFoundError"===o.name))return j.resolve().then(function(){if(!e.db||"NotFoundError"===o.name&&!e.db.objectStoreNames.contains(e.storeName)&&e.version<=e.db.version)return e.db&&(e.version=e.db.version+1),v(e)}).then(function(){return function(e){f(e);for(var n=B[e.name],t=n.forages,r=0;r<t.length;r++){var o=t[r];o._dbInfo.db&&(o._dbInfo.db.close(),o._dbInfo.db=null)}return e.db=null,h(e).then(function(n){return e.db=n,p(e)?v(e):n}).then(function(r){e.db=n.db=r;for(var o=0;o<t.length;o++)t[o]._dbInfo.db=r}).catch(function(n){throw d(e,n),n})}(e).then(function(){b(e,n,t,r-1)})}).catch(t);t(o)}}function _(e){var n,t,r,o,i,a=.75*e.length,c=e.length,u=0;"="===e[e.length-1]&&(a--,"="===e[e.length-2]&&a--);var f=new ArrayBuffer(a),s=new Uint8Array(f);for(n=0;n<c;n+=4)t=L.indexOf(e[n]),r=L.indexOf(e[n+1]),o=L.indexOf(e[n+2]),i=L.indexOf(e[n+3]),s[u++]=t<<2|r>>4,s[u++]=(15&r)<<4|o>>2,s[u++]=(3&o)<<6|63&i;return f}function I(e){var n,t=new Uint8Array(e),r="";for(n=0;n<t.length;n+=3)r+=L[t[n]>>2],r+=L[(3&t[n])<<4|t[n+1]>>4],r+=L[(15&t[n+1])<<2|t[n+2]>>6],r+=L[63&t[n+2]];return t.length%3==2?r=r.substring(0,r.length-1)+"=":t.length%3==1&&(r=r.substring(0,r.length-2)+"=="),r}function w(e,n,t,r){e.executeSql("CREATE TABLE IF NOT EXISTS "+n.storeName+" (id INTEGER PRIMARY KEY, key unique, value)",[],t,r)}function E(e,n,t,r,o,i){e.executeSql(t,r,o,function(e,a){a.code===a.SYNTAX_ERR?e.executeSql("SELECT name FROM sqlite_master WHERE type='table' AND name = ?",[n.storeName],function(e,c){c.rows.length?i(e,a):w(e,n,function(){e.executeSql(t,r,o,i)},i)},i):i(e,a)},i)}function S(e,n){var t=e.name+"/";return e.storeName!==n.storeName&&(t+=e.storeName+"/"),t}function N(){return!function(){var e="_localforage_support_test";try{return localStorage.setItem(e,!0),localStorage.removeItem(e),!1}catch(e){return!0}}()||localStorage.length>0}function O(e,n){e[n]=function(){var t=arguments;return e.ready().then(function(){return e[n].apply(e,t)})}}function D(){for(var e=1;e<arguments.length;e++){var n=arguments[e];if(n)for(var t in n)n.hasOwnProperty(t)&&(ce(n[t])?arguments[0][t]=n[t].slice():arguments[0][t]=n[t])}return arguments[0]}var T="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e},A=function(){try{if("undefined"!=typeof indexedDB)return indexedDB;if("undefined"!=typeof webkitIndexedDB)return webkitIndexedDB;if("undefined"!=typeof mozIndexedDB)return mozIndexedDB;if("undefined"!=typeof OIndexedDB)return OIndexedDB;if("undefined"!=typeof msIndexedDB)return msIndexedDB}catch(e){return}}();"undefined"==typeof Promise&&e(3);var j=Promise,C="local-forage-detect-blob-support",R=void 0,B={},M=Object.prototype.toString,P="readonly",x="readwrite",k={_driver:"asyncStorage",_initStorage:function(e){function n(){return j.resolve()}var t=this,r={db:null};if(e)for(var o in e)r[o]=e[o];var i=B[r.name];i||(i={forages:[],db:null,dbReady:null,deferredOperations:[]},B[r.name]=i),i.forages.push(t),t._initReady||(t._initReady=t.ready,t.ready=y);for(var a=[],c=0;c<i.forages.length;c++){var u=i.forages[c];u!==t&&a.push(u._initReady().catch(n))}var f=i.forages.slice(0);return j.all(a).then(function(){return r.db=i.db,h(r)}).then(function(e){return r.db=e,p(r,t._defaultConfig.version)?v(r):e}).then(function(e){r.db=i.db=e,t._dbInfo=r;for(var n=0;n<f.length;n++){var o=f[n];o!==t&&(o._dbInfo.db=r.db,o._dbInfo.version=r.version)}})},_support:function(){try{if(!A)return!1;var e="undefined"!=typeof openDatabase&&/(Safari|iPhone|iPad|iPod)/.test(navigator.userAgent)&&!/Chrome/.test(navigator.userAgent)&&!/BlackBerry/.test(navigator.platform),n="function"==typeof fetch&&-1!==fetch.toString().indexOf("[native code");return(!e||n)&&"undefined"!=typeof indexedDB&&"undefined"!=typeof IDBKeyRange}catch(e){return!1}}(),iterate:function(e,n){var t=this,r=new j(function(n,r){t.ready().then(function(){b(t._dbInfo,P,function(o,i){if(o)return r(o);try{var a=i.objectStore(t._dbInfo.storeName).openCursor(),c=1;a.onsuccess=function(){var t=a.result;if(t){var r=t.value;g(r)&&(r=m(r));var o=e(r,t.key,c++);void 0!==o?n(o):t.continue()}else n()},a.onerror=function(){r(a.error)}}catch(e){r(e)}})}).catch(r)});return o(r,n),r},getItem:function(e,n){var t=this;e=a(e);var r=new j(function(n,r){t.ready().then(function(){b(t._dbInfo,P,function(o,i){if(o)return r(o);try{var a=i.objectStore(t._dbInfo.storeName).get(e);a.onsuccess=function(){var e=a.result;void 0===e&&(e=null),g(e)&&(e=m(e)),n(e)},a.onerror=function(){r(a.error)}}catch(e){r(e)}})}).catch(r)});return o(r,n),r},setItem:function(e,n,t){var r=this;e=a(e);var i=new j(function(t,o){var i;r.ready().then(function(){return i=r._dbInfo,"[object Blob]"===M.call(n)?u(i.db).then(function(e){return e?n:function(e){return new j(function(n,t){var r=new FileReader;r.onerror=t,r.onloadend=function(t){var r=btoa(t.target.result||"");n({__local_forage_encoded_blob:!0,data:r,type:e.type})},r.readAsBinaryString(e)})}(n)}):n}).then(function(n){b(r._dbInfo,x,function(i,a){if(i)return o(i);try{var c=a.objectStore(r._dbInfo.storeName);null===n&&(n=void 0);var u=c.put(n,e);a.oncomplete=function(){void 0===n&&(n=null),t(n)},a.onabort=a.onerror=function(){var e=u.error?u.error:u.transaction.error;o(e)}}catch(e){o(e)}})}).catch(o)});return o(i,t),i},removeItem:function(e,n){var t=this;e=a(e);var r=new j(function(n,r){t.ready().then(function(){b(t._dbInfo,x,function(o,i){if(o)return r(o);try{var a=i.objectStore(t._dbInfo.storeName).delete(e);i.oncomplete=function(){n()},i.onerror=function(){r(a.error)},i.onabort=function(){var e=a.error?a.error:a.transaction.error;r(e)}}catch(e){r(e)}})}).catch(r)});return o(r,n),r},clear:function(e){var n=this,t=new j(function(e,t){n.ready().then(function(){b(n._dbInfo,x,function(r,o){if(r)return t(r);try{var i=o.objectStore(n._dbInfo.storeName).clear();o.oncomplete=function(){e()},o.onabort=o.onerror=function(){var e=i.error?i.error:i.transaction.error;t(e)}}catch(e){t(e)}})}).catch(t)});return o(t,e),t},length:function(e){var n=this,t=new j(function(e,t){n.ready().then(function(){b(n._dbInfo,P,function(r,o){if(r)return t(r);try{var i=o.objectStore(n._dbInfo.storeName).count();i.onsuccess=function(){e(i.result)},i.onerror=function(){t(i.error)}}catch(e){t(e)}})}).catch(t)});return o(t,e),t},key:function(e,n){var t=this,r=new j(function(n,r){e<0?n(null):t.ready().then(function(){b(t._dbInfo,P,function(o,i){if(o)return r(o);try{var a=i.objectStore(t._dbInfo.storeName),c=!1,u=a.openCursor();u.onsuccess=function(){var t=u.result;t?0===e?n(t.key):c?n(t.key):(c=!0,t.advance(e)):n(null)},u.onerror=function(){r(u.error)}}catch(e){r(e)}})}).catch(r)});return o(r,n),r},keys:function(e){var n=this,t=new j(function(e,t){n.ready().then(function(){b(n._dbInfo,P,function(r,o){if(r)return t(r);try{var i=o.objectStore(n._dbInfo.storeName).openCursor(),a=[];i.onsuccess=function(){var n=i.result;n?(a.push(n.key),n.continue()):e(a)},i.onerror=function(){t(i.error)}}catch(e){t(e)}})}).catch(t)});return o(t,e),t},dropInstance:function(e,n){n=c.apply(this,arguments);var t,r=this.config();if((e="function"!=typeof e&&e||{}).name||(e.name=e.name||r.name,e.storeName=e.storeName||r.storeName),e.name){var i=e.name===r.name&&this._dbInfo.db?j.resolve(this._dbInfo.db):h(e).then(function(n){var t=B[e.name],r=t.forages;t.db=n;for(var o=0;o<r.length;o++)r[o]._dbInfo.db=n;return n});t=e.storeName?i.then(function(n){if(n.objectStoreNames.contains(e.storeName)){var t=n.version+1;f(e);var r=B[e.name],o=r.forages;n.close();for(var i=0;i<o.length;i++){var a=o[i];a._dbInfo.db=null,a._dbInfo.version=t}return new j(function(n,r){var o=A.open(e.name,t);o.onerror=function(e){o.result.close(),r(e)},o.onupgradeneeded=function(){o.result.deleteObjectStore(e.storeName)},o.onsuccess=function(){var e=o.result;e.close(),n(e)}}).then(function(e){r.db=e;for(var n=0;n<o.length;n++){var t=o[n];t._dbInfo.db=e,s(t._dbInfo)}}).catch(function(n){throw(d(e,n)||j.resolve()).catch(function(){}),n})}}):i.then(function(n){f(e);var t=B[e.name],r=t.forages;n.close();for(var o=0;o<r.length;o++)r[o]._dbInfo.db=null;return new j(function(n,t){var r=A.deleteDatabase(e.name);r.onerror=r.onblocked=function(e){var n=r.result;n&&n.close(),t(e)},r.onsuccess=function(){var e=r.result;e&&e.close(),n(e)}}).then(function(e){t.db=e;for(var n=0;n<r.length;n++)s(r[n]._dbInfo)}).catch(function(n){throw(d(e,n)||j.resolve()).catch(function(){}),n})})}else t=j.reject("Invalid arguments");return o(t,n),t}},L="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/",F="~~local_forage_type~",W=/^~~local_forage_type~([^~]+)~/,U="__lfsc__:",q=U.length,z="arbf",V="blob",X="si08",J="ui08",Y="uic8",H="si16",K="si32",Q="ur16",G="ui32",$="fl32",Z="fl64",ee=q+z.length,ne=Object.prototype.toString,te={serialize:function(e,n){var t="";if(e&&(t=ne.call(e)),e&&("[object ArrayBuffer]"===t||e.buffer&&"[object ArrayBuffer]"===ne.call(e.buffer))){var r,o=U;e instanceof ArrayBuffer?(r=e,o+=z):(r=e.buffer,"[object Int8Array]"===t?o+=X:"[object Uint8Array]"===t?o+=J:"[object Uint8ClampedArray]"===t?o+=Y:"[object Int16Array]"===t?o+=H:"[object Uint16Array]"===t?o+=Q:"[object Int32Array]"===t?o+=K:"[object Uint32Array]"===t?o+=G:"[object Float32Array]"===t?o+=$:"[object Float64Array]"===t?o+=Z:n(new Error("Failed to get type for BinaryArray"))),n(o+I(r))}else if("[object Blob]"===t){var i=new FileReader;i.onload=function(){var t=F+e.type+"~"+I(this.result);n(U+V+t)},i.readAsArrayBuffer(e)}else try{n(JSON.stringify(e))}catch(t){console.error("Couldn't convert value into a JSON string: ",e),n(null,t)}},deserialize:function(e){if(e.substring(0,q)!==U)return JSON.parse(e);var n,t=e.substring(ee),o=e.substring(q,ee);if(o===V&&W.test(t)){var i=t.match(W);n=i[1],t=t.substring(i[0].length)}var a=_(t);switch(o){case z:return a;case V:return r([a],{type:n});case X:return new Int8Array(a);case J:return new Uint8Array(a);case Y:return new Uint8ClampedArray(a);case H:return new Int16Array(a);case Q:return new Uint16Array(a);case K:return new Int32Array(a);case G:return new Uint32Array(a);case $:return new Float32Array(a);case Z:return new Float64Array(a);default:throw new Error("Unkown type: "+o)}},stringToBuffer:_,bufferToString:I},re={_driver:"webSQLStorage",_initStorage:function(e){var n=this,t={db:null};if(e)for(var r in e)t[r]="string"!=typeof e[r]?e[r].toString():e[r];var o=new j(function(e,r){try{t.db=openDatabase(t.name,String(t.version),t.description,t.size)}catch(e){return r(e)}t.db.transaction(function(o){w(o,t,function(){n._dbInfo=t,e()},function(e,n){r(n)})},r)});return t.serializer=te,o},_support:"function"==typeof openDatabase,iterate:function(e,n){var t=this,r=new j(function(n,r){t.ready().then(function(){var o=t._dbInfo;o.db.transaction(function(t){E(t,o,"SELECT * FROM "+o.storeName,[],function(t,r){for(var i=r.rows,a=i.length,c=0;c<a;c++){var u=i.item(c),f=u.value;if(f&&(f=o.serializer.deserialize(f)),void 0!==(f=e(f,u.key,c+1)))return void n(f)}n()},function(e,n){r(n)})})}).catch(r)});return o(r,n),r},getItem:function(e,n){var t=this;e=a(e);var r=new j(function(n,r){t.ready().then(function(){var o=t._dbInfo;o.db.transaction(function(t){E(t,o,"SELECT * FROM "+o.storeName+" WHERE key = ? LIMIT 1",[e],function(e,t){var r=t.rows.length?t.rows.item(0).value:null;r&&(r=o.serializer.deserialize(r)),n(r)},function(e,n){r(n)})})}).catch(r)});return o(r,n),r},setItem:function(e,n,t){return function e(n,t,r,i){var c=this;n=a(n);var u=new j(function(o,a){c.ready().then(function(){void 0===t&&(t=null);var u=t,f=c._dbInfo;f.serializer.serialize(t,function(t,s){s?a(s):f.db.transaction(function(e){E(e,f,"INSERT OR REPLACE INTO "+f.storeName+" (key, value) VALUES (?, ?)",[n,t],function(){o(u)},function(e,n){a(n)})},function(t){if(t.code===t.QUOTA_ERR){if(i>0)return void o(e.apply(c,[n,u,r,i-1]));a(t)}})})}).catch(a)});return o(u,r),u}.apply(this,[e,n,t,1])},removeItem:function(e,n){var t=this;e=a(e);var r=new j(function(n,r){t.ready().then(function(){var o=t._dbInfo;o.db.transaction(function(t){E(t,o,"DELETE FROM "+o.storeName+" WHERE key = ?",[e],function(){n()},function(e,n){r(n)})})}).catch(r)});return o(r,n),r},clear:function(e){var n=this,t=new j(function(e,t){n.ready().then(function(){var r=n._dbInfo;r.db.transaction(function(n){E(n,r,"DELETE FROM "+r.storeName,[],function(){e()},function(e,n){t(n)})})}).catch(t)});return o(t,e),t},length:function(e){var n=this,t=new j(function(e,t){n.ready().then(function(){var r=n._dbInfo;r.db.transaction(function(n){E(n,r,"SELECT COUNT(key) as c FROM "+r.storeName,[],function(n,t){var r=t.rows.item(0).c;e(r)},function(e,n){t(n)})})}).catch(t)});return o(t,e),t},key:function(e,n){var t=this,r=new j(function(n,r){t.ready().then(function(){var o=t._dbInfo;o.db.transaction(function(t){E(t,o,"SELECT key FROM "+o.storeName+" WHERE id = ? LIMIT 1",[e+1],function(e,t){var r=t.rows.length?t.rows.item(0).key:null;n(r)},function(e,n){r(n)})})}).catch(r)});return o(r,n),r},keys:function(e){var n=this,t=new j(function(e,t){n.ready().then(function(){var r=n._dbInfo;r.db.transaction(function(n){E(n,r,"SELECT key FROM "+r.storeName,[],function(n,t){for(var r=[],o=0;o<t.rows.length;o++)r.push(t.rows.item(o).key);e(r)},function(e,n){t(n)})})}).catch(t)});return o(t,e),t},dropInstance:function(e,n){n=c.apply(this,arguments);var t=this.config();(e="function"!=typeof e&&e||{}).name||(e.name=e.name||t.name,e.storeName=e.storeName||t.storeName);var r,i=this;return o(r=e.name?new j(function(n){var r;r=e.name===t.name?i._dbInfo.db:openDatabase(e.name,"","",0),n(e.storeName?{db:r,storeNames:[e.storeName]}:function(e){return new j(function(n,t){e.transaction(function(r){r.executeSql("SELECT name FROM sqlite_master WHERE type='table' AND name <> '__WebKitDatabaseInfoTable__'",[],function(t,r){for(var o=[],i=0;i<r.rows.length;i++)o.push(r.rows.item(i).name);n({db:e,storeNames:o})},function(e,n){t(n)})},function(e){t(e)})})}(r))}).then(function(e){return new j(function(n,t){e.db.transaction(function(r){function o(e){return new j(function(n,t){r.executeSql("DROP TABLE IF EXISTS "+e,[],function(){n()},function(e,n){t(n)})})}for(var i=[],a=0,c=e.storeNames.length;a<c;a++)i.push(o(e.storeNames[a]));j.all(i).then(function(){n()}).catch(function(e){t(e)})},function(e){t(e)})})}):j.reject("Invalid arguments"),n),r}},oe={_driver:"localStorageWrapper",_initStorage:function(e){var n={};if(e)for(var t in e)n[t]=e[t];return n.keyPrefix=S(e,this._defaultConfig),N()?(this._dbInfo=n,n.serializer=te,j.resolve()):j.reject()},_support:function(){try{return"undefined"!=typeof localStorage&&"setItem"in localStorage&&!!localStorage.setItem}catch(e){return!1}}(),iterate:function(e,n){var t=this,r=t.ready().then(function(){for(var n=t._dbInfo,r=n.keyPrefix,o=r.length,i=localStorage.length,a=1,c=0;c<i;c++){var u=localStorage.key(c);if(0===u.indexOf(r)){var f=localStorage.getItem(u);if(f&&(f=n.serializer.deserialize(f)),void 0!==(f=e(f,u.substring(o),a++)))return f}}});return o(r,n),r},getItem:function(e,n){var t=this;e=a(e);var r=t.ready().then(function(){var n=t._dbInfo,r=localStorage.getItem(n.keyPrefix+e);return r&&(r=n.serializer.deserialize(r)),r});return o(r,n),r},setItem:function(e,n,t){var r=this;e=a(e);var i=r.ready().then(function(){void 0===n&&(n=null);var t=n;return new j(function(o,i){var a=r._dbInfo;a.serializer.serialize(n,function(n,r){if(r)i(r);else try{localStorage.setItem(a.keyPrefix+e,n),o(t)}catch(e){"QuotaExceededError"!==e.name&&"NS_ERROR_DOM_QUOTA_REACHED"!==e.name||i(e),i(e)}})})});return o(i,t),i},removeItem:function(e,n){var t=this;e=a(e);var r=t.ready().then(function(){var n=t._dbInfo;localStorage.removeItem(n.keyPrefix+e)});return o(r,n),r},clear:function(e){var n=this,t=n.ready().then(function(){for(var e=n._dbInfo.keyPrefix,t=localStorage.length-1;t>=0;t--){var r=localStorage.key(t);0===r.indexOf(e)&&localStorage.removeItem(r)}});return o(t,e),t},length:function(e){var n=this.keys().then(function(e){return e.length});return o(n,e),n},key:function(e,n){var t=this,r=t.ready().then(function(){var n,r=t._dbInfo;try{n=localStorage.key(e)}catch(e){n=null}return n&&(n=n.substring(r.keyPrefix.length)),n});return o(r,n),r},keys:function(e){var n=this,t=n.ready().then(function(){for(var e=n._dbInfo,t=localStorage.length,r=[],o=0;o<t;o++){var i=localStorage.key(o);0===i.indexOf(e.keyPrefix)&&r.push(i.substring(e.keyPrefix.length))}return r});return o(t,e),t},dropInstance:function(e,n){if(n=c.apply(this,arguments),!(e="function"!=typeof e&&e||{}).name){var t=this.config();e.name=e.name||t.name,e.storeName=e.storeName||t.storeName}var r,i=this;return o(r=e.name?new j(function(n){n(e.storeName?S(e,i._defaultConfig):e.name+"/")}).then(function(e){for(var n=localStorage.length-1;n>=0;n--){var t=localStorage.key(n);0===t.indexOf(e)&&localStorage.removeItem(t)}}):j.reject("Invalid arguments"),n),r}},ie=function(e,n){return e===n||"number"==typeof e&&"number"==typeof n&&isNaN(e)&&isNaN(n)},ae=function(e,n){for(var t=e.length,r=0;r<t;){if(ie(e[r],n))return!0;r++}return!1},ce=Array.isArray||function(e){return"[object Array]"===Object.prototype.toString.call(e)},ue={},fe={},se={INDEXEDDB:k,WEBSQL:re,LOCALSTORAGE:oe},de=[se.INDEXEDDB._driver,se.WEBSQL._driver,se.LOCALSTORAGE._driver],le=["dropInstance"],he=["clear","getItem","iterate","key","keys","length","removeItem","setItem"].concat(le),ve={description:"",driver:de.slice(),name:"localforage",size:4980736,storeName:"keyvaluepairs",version:1},pe=new(function(){function e(n){for(var t in function(e,n){if(!(e instanceof n))throw new TypeError("Cannot call a class as a function")}(this,e),se)if(se.hasOwnProperty(t)){var r=se[t],o=r._driver;this[t]=o,ue[o]||this.defineDriver(r)}this._defaultConfig=D({},ve),this._config=D({},this._defaultConfig,n),this._driverSet=null,this._initDriver=null,this._ready=!1,this._dbInfo=null,this._wrapLibraryMethodsWithReady(),this.setDriver(this._config.driver).catch(function(){})}return e.prototype.config=function(e){if("object"===(void 0===e?"undefined":T(e))){if(this._ready)return new Error("Can't call config() after localforage has been used.");for(var n in e){if("storeName"===n&&(e[n]=e[n].replace(/\W/g,"_")),"version"===n&&"number"!=typeof e[n])return new Error("Database version must be a number.");this._config[n]=e[n]}return!("driver"in e&&e.driver)||this.setDriver(this._config.driver)}return"string"==typeof e?this._config[e]:this._config},e.prototype.defineDriver=function(e,n,t){var r=new j(function(n,t){try{var r=e._driver,i=new Error("Custom driver not compliant; see https://mozilla.github.io/localForage/#definedriver");if(!e._driver)return void t(i);for(var a=he.concat("_initStorage"),c=0,u=a.length;c<u;c++){var f=a[c];if((!ae(le,f)||e[f])&&"function"!=typeof e[f])return void t(i)}!function(){for(var n=function(e){return function(){var n=new Error("Method "+e+" is not implemented by the current driver"),t=j.reject(n);return o(t,arguments[arguments.length-1]),t}},t=0,r=le.length;t<r;t++){var i=le[t];e[i]||(e[i]=n(i))}}();var s=function(t){ue[r]&&console.info("Redefining LocalForage driver: "+r),ue[r]=e,fe[r]=t,n()};"_support"in e?e._support&&"function"==typeof e._support?e._support().then(s,t):s(!!e._support):s(!0)}catch(e){t(e)}});return i(r,n,t),r},e.prototype.driver=function(){return this._driver||null},e.prototype.getDriver=function(e,n,t){var r=ue[e]?j.resolve(ue[e]):j.reject(new Error("Driver not found."));return i(r,n,t),r},e.prototype.getSerializer=function(e){var n=j.resolve(te);return i(n,e),n},e.prototype.ready=function(e){var n=this,t=n._driverSet.then(function(){return null===n._ready&&(n._ready=n._initDriver()),n._ready});return i(t,e,e),t},e.prototype.setDriver=function(e,n,t){function r(){a._config.driver=a.driver()}function o(e){return a._extend(e),r(),a._ready=a._initStorage(a._config),a._ready}var a=this;ce(e)||(e=[e]);var c=this._getSupportedDrivers(e),u=null!==this._driverSet?this._driverSet.catch(function(){return j.resolve()}):j.resolve();return this._driverSet=u.then(function(){var e=c[0];return a._dbInfo=null,a._ready=null,a.getDriver(e).then(function(e){a._driver=e._driver,r(),a._wrapLibraryMethodsWithReady(),a._initDriver=function(e){return function(){var n=0;return function t(){for(;n<e.length;){var i=e[n];return n++,a._dbInfo=null,a._ready=null,a.getDriver(i).then(o).catch(t)}r();var c=new Error("No available storage method found.");return a._driverSet=j.reject(c),a._driverSet}()}}(c)})}).catch(function(){r();var e=new Error("No available storage method found.");return a._driverSet=j.reject(e),a._driverSet}),i(this._driverSet,n,t),this._driverSet},e.prototype.supports=function(e){return!!fe[e]},e.prototype._extend=function(e){D(this,e)},e.prototype._getSupportedDrivers=function(e){for(var n=[],t=0,r=e.length;t<r;t++){var o=e[t];this.supports(o)&&n.push(o)}return n},e.prototype._wrapLibraryMethodsWithReady=function(){for(var e=0,n=he.length;e<n;e++)O(this,he[e])},e.prototype.createInstance=function(n){return new e(n)},e}());n.exports=pe},{3:3}]},{},[4])(4)});var MoengageSW=function(e){var n,t,r,o={env:"sdk-01.moengage.com",get:function(){return"https://"+o.env},set:function(e){o.env=e}},i={addReport:function(){return o.get()+"/v2/report/add"},batch:function(){return o.get()+"/v2/sdk/report/"},FCM_END_POINT:"https://fcm.googleapis.com/fcm/send/",MOZILLA_END_POINT:"https://updates.push.services.mozilla.com/wpush/v2/"};const a=28,c="https://static.skillclash.com/notifications/moe-notification-badge.png",u="WVPG5STCJDMLCEWP2XYQ3XBF";function f(n){n.waitUntil(e.skipWaiting())}function s(n){n.waitUntil(e.clients.claim())}function d(e){e.data&&e.data.data&&e.data.data.app_id&&n.setItem("reportParams",e.data)}function l(r){if(e.Notification&&"granted"===e.Notification.permission){var i;t.iterate(function(e,n){const r=Date.now(),o=(r-e.timestamp)/864e5;o>a&&t.removeItem(n)});var f={};r.waitUntil(n.getItem("reportParams").then(function(e){e&&e.data&&(f=e.data,e.data.environment&&o.set(e.data.environment))}).then(function(){try{var e=r.data.json();if(e)return e}catch(e){console.error("payload not received in Mo Engage Push. Error: ",e)}}).then(async function(n){var r,o,a=n.payload;if(n.cid){if(i=n.cid,await function(e){return t.length().then(n=>{if(0===n)throw new Error("Existing campaign not present in indexedDB");return t.iterate(function(n,t){if(e===t)return!0}).then(e=>e)}).catch(()=>!1)}(i))throw new Error(`The campaign ${i} has already been executed.`);var s={cid:i};a&&(s={cid:i,title:a.title,message:a.message,actions:a.actions,image:a.image,moe_cid_attr:a.moe_cid_attr,timestamp:Date.now()}),t.setItem(i,s)}if(!a||!a.title||!a.message)return b("MOE_NO_PAYLOAD_WEB",{cid:n.cid},0),console.error("Moengage - Web Push payload error",err),m("Welcome",{body:"Something unexpected happened",requireInteraction:!1});try{r=a.moe_cid_attr.moe_campaign_id,o=a.moe_cid_attr.moe_campaign_name}catch(e){throw new Error("cannot get campaign ID or campaign Name.")}b("NOTIFICATION_RECEIVED_WEB_MOE",{cid:i,moe_campaign_id:r,moe_campaign_name:o,...a.moe_cid_attr},1),f.app_id===u&&(a.badge=c);var d={body:a.message,icon:a.icon,tag:n.cid||"moe-id",badge:a.badge,data:{url:a.urlToOpen,actions:a.actions,cid:i},requireInteraction:a&&!JSON.parse(n.payload.reqInteract)||!1,actions:a.actions,image:a.image};return function(n,t){return e.registration.showNotification(n,t)}(a.title,d)}).catch(function(e){return console.error("Moengage Service Worker Error",e),m("Welcome",{body:"Something unexpected happened",requireInteraction:!1})}))}}function h(e){var r,i=e.notification.data;e.notification.close();var a=Promise.resolve();i&&("0"===e.action&&i.actions&&i.actions instanceof Array&&i.actions.length>0&&i.actions[0].url?(a=clients.openWindow(i.actions[0].url),r=i.actions[0].title):"1"===e.action&&i.actions&&i.actions instanceof Array&&i.actions.length>1&&i.actions[1].url?(a=clients.openWindow(i.actions[1].url),r=i.actions[1].title):i.url&&(a=clients.openWindow(i.url),r=i.title));var c=new Promise(function(e){t.iterate(function(e,n){if(n==i.cid){var t,o;try{t=e.moe_cid_attr.moe_campaign_id,o=e.moe_cid_attr.moe_campaign_name}catch(e){throw new Error(e)}return b("NOTIFICATION_CLICKED_WEB_MOE",{cid:e.cid,button:r||void 0,moe_campaign_id:t,moe_campaign_name:o,...e.moe_cid_attr},1),n}}).then(function(n){console.info("Web Push Campaign clicked: ",n),e()})});e.waitUntil(n.getItem("reportParams").then(function(e){e.data.environment&&o.set(e.data.environment)}).then(function(){return Promise.all([a,c])}))}function v(e){var n=e.notification.data;t.iterate(function(e,t){if(t==n.cid)return t}).then(function(e){console.info("Web Push Campaign closed: ",e)})}function p(e){var n=e.endpoint;return 0===n.indexOf(i.FCM_END_POINT)?n.replace(i.FCM_END_POINT,""):0===n.indexOf(i.MOZILLA_END_POINT)?n.replace(i.MOZILLA_END_POINT,""):e.subscriptionId}function m(n,t){return e.registration.showNotification(n,t).then(function(){setTimeout(g,2e3)})}function g(){e.registration.getNotifications().then(function(e){for(var n=0;n<e.length;++n)e[n].close()})}function y(t,r,o){n.getItem("reportParams").then(function(n){var o=n.data;o.device_ts=_(),e.registration.pushManager.getSubscription().then(function(e){var n=p(e);n?o.push_id=n:delete o.push_id,delete o.os_platform,o.app_ver=o.app_ver.toString();const a={query_params:o,identifiers:{moe_user_id:"",segment_id:""},meta:{bid:([1e7]+-1e3+-4e3+-8e3+-1e11).replace(/[018]/g,e=>(e^crypto.getRandomValues(new Uint8Array(1))[0]&15>>e/4).toString(16)),request_time:(new Date).toISOString()},viewsCount:1,viewsInfo:[{EVENT_ACTION:t,EVENT_ATTRS:r,EVENT_G_TIME:(new Date).getTime().toString(),EVENT_L_TIME:function(){const e=new Date;return`${e.getDate()}:${e.getMonth()+1}:${e.getFullYear()}:${e.getHours()}:${e.getMinutes()}:${e.getSeconds()}`}()}]};fetch(i.batch()+o.app_id,{method:"POST",body:JSON.stringify(a)}).then(function(e){return e.json()})})})}function b(t,r,o){n.getItem("reportParams").then(function(n){var a=n.data;if("allowed"===a.isBatchingEnabled)return void y(t,r);var c={e:t={MOE_NO_PAYLOAD_WEB:"MOE_NO_PAYLOAD_WEB",NOTIFICATION_RECEIVED_WEB_MOE:"i",NOTIFICATION_CLICKED_WEB_MOE:"c"}[t],a:r,f:o};a.device_ts=_(),e.registration.pushManager.getSubscription().then(function(e){var n=p(e);n?a.push_id=n:delete a.push_id,delete a.os_platform;var t=function(e,n){for(var t in e+="?",n)e+=t+"="+n[t]+"&";return e}(i.addReport(),a);fetch(t,{method:"POST",body:JSON.stringify(c)}).then(function(e){return e.json()})})})}function _(){var e=new Date;return Number(Date.UTC(e.getUTCFullYear(),e.getUTCMonth(),e.getUTCDate(),e.getUTCHours(),e.getUTCMinutes(),e.getUTCSeconds(),e.getUTCMilliseconds()))}function I(e){"moe_offline_data_sync"===e.tag&&e.waitUntil(E().then(function(e){console.log(e)}))}function w(){return Promise.all([r.getItem("requestMetaData").then(function(e){return e}),new Promise(function(e){return r.keys().then(function(e){return e}).then(function(n){return new Promise(function(){var t=[];n.map(function(e){"requestMetaData"!==e&&t.push(r.getItem(e))}),Promise.all(t).then(function(n){e(n)})})})})]).then(function(e){if(e[0]&&e[1]){var n=e[0],t=function e(n){return n.reduce(function(n,t){return Array.isArray(t)?n.concat(e(t)):n.concat(t)},[])}(e[1]);return n.viewsInfo=t,n.viewsCount=t.length,n}})}function E(){return new Promise(function(e,n){w().then(function(n){if(n)return fetch(i.batch()+n.query_params.app_id,{method:"POST",body:JSON.stringify(n)}).then(function(e){return e.json()}).then(function(n){if("success"!==n.status)throw new Error;return r.clear().then(function(){e("successfully replayed failed requests and cleared db")})});e("No pending requests to replay")}).catch(function(e){n("Replaying failed.",e)})})}return{init:async function(){e.addEventListener("install",f),e.addEventListener("activate",s),e.addEventListener("message",d),e.addEventListener("push",l),e.addEventListener("notificationclick",h),e.addEventListener("notificationclose",v),e.addEventListener("sync",I),await async function(){return new Promise((e,o)=>{n=localforage.createInstance({driver:[localforage.INDEXEDDB],name:"moe_database",storeName:"moe_data"}),t=localforage.createInstance({driver:[localforage.INDEXEDDB],name:"moe_database",storeName:"moe_backup"}),r=localforage.createInstance({driver:[localforage.INDEXEDDB],name:"moe_database",storeName:"offline_data"}),Promise.all([n.ready(),t.ready(),r.ready()]).then(e())})}(),n.getItem("reportParams").then(function(e){e&&e.data&&"allowed"===e.data.isBatchingEnabled&&E().then(function(e){console.log(e)}).catch(function(e){console.log(e)})})}}}(self);MoengageSW.init();