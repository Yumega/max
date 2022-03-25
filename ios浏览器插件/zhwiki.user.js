// ==UserScript==
// @name zhwiki
// @namespace    http://stay.app/
// @version 1.2
// @author max
// @description change font and background
// @match       *://zh.m.wikipedia.org/*
// @grant        GM_addStyle
// @run-at       document-start
// ==/UserScript==

(function() {
let css = `
body
 {
  border: none !important; 
  font-family: PingFangTC-Medium !important; 
  font-size: 14px !important; 
 }
ol.references {
    counter-reset: mw-ref-extends-parent list-item;
    font-size: 40%;
}
.mw-parser-output .refbegin {
    font-size: 40%;
}
 `;
if (typeof GM_addStyle !== "undefined") {
  GM_addStyle(css);
} else {
  let styleNode = document.createElement("style");
  styleNode.appendChild(document.createTextNode(css));
  (document.querySelector("head") || document.documentElement).appendChild(styleNode);
}
})();