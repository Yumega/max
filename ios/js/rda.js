// ==UserScript==
// @name         自动启用 Readability 阅读模式
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  自动启用 Readability.js 简洁阅读模式
// @author       ChatGPT
// @match        *://*/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    // 动态加载 Readability.js
    function loadReadability(callback) {
        const script = document.createElement('script');
        script.src = 'https://unpkg.com/@mozilla/readability@0.4.4/Readability.js';
        script.onload = callback;
        document.head.appendChild(script);
    }

    // 执行阅读模式
    function applyReadability() {
        try {
            const article = new Readability(document.cloneNode(true)).parse();
            if (article && article.content) {
                document.body.innerHTML = `
                    <div style="max-width: 800px; margin: auto; font-family: serif; line-height: 1.6; padding: 2em;">
                        <h1>${article.title}</h1>
                        ${article.content}
                    </div>
                `;
                document.title = article.title;
                document.body.style.backgroundColor = '#f4f4f4';
            }
        } catch (e) {
            console.error('Readability解析失败:', e);
        }
    }

    // 延迟以确保页面加载完成
    window.addEventListener('load', () => {
        loadReadability(() => {
            // 等待 Readability 载入后再执行
            setTimeout(applyReadability, 500);
        });
    });
})();
