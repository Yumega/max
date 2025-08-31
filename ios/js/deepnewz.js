// ==UserScript==
// @name         deepnewz优化
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  隐藏烦人内容
// @match        https://deepnewz.com/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    // 定义一个函数来隐藏元素
    function hideTrendingNav() {
        document.querySelectorAll('nav[aria-label="Trending tickers"]').forEach(el => {
            el.style.display = 'none';
        });
    }

    // 页面加载后先执行一次
    hideTrendingNav();

    // 监听 DOM 变化，防止页面异步加载时再次出现
    const observer = new MutationObserver(hideTrendingNav);
    observer.observe(document.body, { childList: true, subtree: true });
})();
