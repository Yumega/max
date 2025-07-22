// ==UserScript==
// @name           新标签页打开链接
// @description    open links in new tab
// @match          https://www.google.com/search?*
// @match          *://*.reddit.com/r/*
// @match          *://*.cnn.com/*
// @match          *://*.politico.eu/*
// @match          *://*.bbc.com/*
// @match          *://*.economist.com/*
// @match          *://*.theguardian.com/*
// @match          *://*.sky.com/*
// @match          *://*.euronews.com/*
// @match          *://*.channelnewsasia.com/*
// @match          *://*.nbcnews.com/*
// @match          *://*.nbcnews.com/*
// @match          *://*.wsj.com/*
// @match          *://*.aljazeera.com/*
// @author         max
// @version        2025.7.22
// @namespace      none
// @grant          none
// @license        MIT
// @updateURL      https://raw.githubusercontent.com/Yumega/max/refs/heads/master/ios/js/OpenInNewtab.js
// ==/UserScript==

window.onload = function() {
  "use strict";

  // 链接例外列表
  const exception = [/^https:\/\/www\.google\.\w+\/search/];

  // 向上查找最近的 A 标签
  function getAncestorLink(element) {
    while (element && element.nodeName !== "A") {
      element = element.parentNode;
    }
    if (
      element &&
      element.nodeName === "A" &&
      element.href &&
      element.href.indexOf("http") === 0
    ) {
      return element;
    }
  }

  // 扩展 String 对象，检查是否匹配例外列表
  String.prototype.matched = function(strings) {
    for (let i = 0; i < strings.length; i++) {
      if (typeof strings[i] === "string" && this.indexOf(strings[i]) === 0)
        return true;
      else if (strings[i] instanceof RegExp && strings[i].test(this))
        return true;
    }
    return false;
  };

  // 添加点击事件监听器，统一处理所有网站
  document.addEventListener("click", function(e) {
    const link = getAncestorLink(e.target);
    if (
      link &&
      link.href &&
      !link.href.matched(exception) &&
      link.innerText &&
      !/^(\d+|Next|Prev|>|<|下一页|上一页|下一頁|上一頁|回首頁|次へ|前へ)$/.test(link.innerText)
    ) {
      e.preventDefault();  // 阻止默认行为
      window.open(link.href, '_blank');  // 使用 window.open 强制在新标签页中打开
    }
  });
};
