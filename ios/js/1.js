// ==UserScript==
// @name         Readability 自动阅读模式（增强美化版）
// @namespace    http://tampermonkey.net/
// @version      2.0
// @description  使用 Readability.js 对网页正文进行提取与美化，仅在路径层级 ≥2 的页面生效，并保留视频元素，提升阅读体验。
// @author       ChatGPT
// @match        https://*/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    // ✅ 仅在路径层级 ≥ 2 的页面执行
    const pathDepth = location.pathname.split('/').filter(Boolean).length;
    if (pathDepth < 2) {
        console.log('[Readability] 路径层级过低，跳过阅读模式');
        return;
    }

    // ✅ 加载 Readability.js（通过 CDN）
    function loadReadability(callback) {
        const script = document.createElement('script');
        script.src = 'https://unpkg.com/@mozilla/readability@0.4.4/Readability.js';
        script.onload = callback;
        document.head.appendChild(script);
    }

    // ✅ 应用阅读模式 + 美化样式 + 保留视频
    function applyReadability() {
        try {
            const docClone = document.cloneNode(true);

            // 保留 video 和常见 iframe（YouTube、Vimeo 等）
            const videos = [...docClone.querySelectorAll('video, iframe[src*="youtube"], iframe[src*="vimeo"], iframe[src*="bbc"], iframe[src*="player"]')]
                .map(el => el.cloneNode(true));

            const article = new Readability(docClone).parse();
            if (!article || !article.content) {
                console.warn('[Readability] 无法提取正文');
                return;
            }

            // 构建阅读区 HTML
            const wrapper = document.createElement('div');
            wrapper.innerHTML = article.content;
            videos.reverse().forEach(video => wrapper.insertBefore(video, wrapper.firstChild));

            // 应用美化排版
            document.body.innerHTML = `
                <div id="readability-content" style="
                    max-width: 800px;
                    margin: auto;
                    font-family: 'Georgia', 'Times New Roman', serif;
                    font-size: 18px;
                    line-height: 1.8;
                    color: #2c2c2c;
                    background-color: #fdfdfd;
                    padding: 4em 2em;
                    box-shadow: 0 0 30px rgba(0, 0, 0, 0.05);
                ">
                    <h1 style="
                        font-size: 1.8em;
                        font-weight: bold;
                        margin-bottom: 0.5em;
                        line-height: 1.3;
                        color: #111;
                    ">${article.title}</h1>
                    ${wrapper.innerHTML}
                </div>
            `;
            document.title = article.title;

            // 插入统一样式
            const style = document.createElement('style');
            style.textContent = `
                #readability-content p {
                    margin: 1.2em 0;
                }
                #readability-content img {
                    max-width: 100%;
                    height: auto;
                    display: block;
                    margin: 1.5em auto;
                }
                #readability-content blockquote {
                    border-left: 4px solid #ccc;
                    margin: 1.5em;
                    padding-left: 1em;
                    color: #666;
                    font-style: italic;
                }
                #readability-content h2, h3, h4 {
                    margin-top: 2em;
                    line-height: 1.4;
                    color: #333;
                }
                #readability-content a {
                    color: #0077cc;
                    text-decoration: underline;
                }
                #readability-content ul, ol {
                    margin: 1em 2em;
                    padding-left: 1em;
                }
                video, iframe {
                    max-width: 100%;
                    display: block;
                    margin: 1.5em auto;
                }
            `;
            document.head.appendChild(style);

        } catch (err) {
            console.error('[Readability] 执行失败:', err);
        }
    }

    // ✅ 延迟执行，等待动态内容加载
    window.addEventListener('load', () => {
        loadReadability(() => {
            setTimeout(applyReadability, 1000); // 可根据实际情况调整
        });
    });
})();
