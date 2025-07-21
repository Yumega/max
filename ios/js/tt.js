// ==UserScript==
// @name         Readability 自动阅读模式（CDN + 视频保留）
// @namespace    http://tampermonkey.net/
// @version      1.6
// @description  仅在路径段 ≥ 2 的页面启用 Readability.js（通过 CDN 加载），保留视频 iframe/video 元素。
// @author       ChatGPT
// @match        https://*/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    // 仅在路径段 ≥ 2 时运行
    const pathSegments = location.pathname.split('/').filter(s => s.trim() !== '');
    if (pathSegments.length < 2) {
        console.log('路径段过短，跳过脚本');
        return;
    }

    // 加载 Readability.js（使用 CDN）
    function loadReadability(callback) {
        const script = document.createElement('script');
        script.src = 'https://unpkg.com/@mozilla/readability@0.4.4/Readability.js';
        script.onload = callback;
        document.head.appendChild(script);
    }

    function applyReadability() {
        try {
            const docClone = document.cloneNode(true);

            // 保留视频元素
            const videos = [...docClone.querySelectorAll('video, iframe[src*="youtube"], iframe[src*="vimeo"]')]
                .map(el => el.cloneNode(true));

            const article = new Readability(docClone).parse();

            if (article && article.content) {
                const wrapper = document.createElement('div');
                wrapper.innerHTML = article.content;

                // 插入视频到正文顶部
                videos.reverse().forEach(video => {
                    wrapper.insertBefore(video, wrapper.firstChild);
                });

                document.body.innerHTML = `
                    <div style="max-width: 800px; margin: auto; font-family: serif; line-height: 1.6; padding: 2em;">
                        <h1>${article.title}</h1>
                        ${wrapper.innerHTML}
                    </div>`;
                document.title = article.title;
                document.body.style.backgroundColor = '#f4f4f4';
            }
        } catch (e) {
            console.error('Readability 解析失败:', e);
        }
    }

    // 等页面加载后运行
    window.addEventListener('load', () => {
        loadReadability(() => {
            setTimeout(applyReadability, 500); // 可视情况调整延迟
        });
    });
})();
