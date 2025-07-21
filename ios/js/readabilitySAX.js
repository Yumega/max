// ==UserScript==
// @name         自动阅读模式（基于 readabilitySAX）
// @namespace    https://yourdomain.com/
// @version      1.0
// @description  自动从网页中提取正文并启用阅读模式。
// @author       You
// @match        *://*/*
// @grant        none
// ==/UserScript==

(function () {
  'use strict';

  // 1. 载入 readabilitySAX（你需要部署它或者使用打包好的版本）
  const script = document.createElement('script');
  script.src = 'https://raw.githubusercontent.com/Yumega/max/refs/heads/master/ios/someJS/readabilitySAX.bundle.js'; // 替换为实际 CDN 路径
  script.onload = () => {
    startReadability();
  };
  document.head.appendChild(script);

  // 2. 启动阅读模式
  function startReadability() {
    const { WritableStream, Readability } = window.readabilitySAX; // 通过 script 注入的 global 对象

    const parser = new Readability();
    parser.on("end", function (result) {
      // 3. 构建阅读页面
      const { title, content } = result;

      document.body.innerHTML = `
        <div style="max-width: 800px; margin: 2rem auto; line-height: 1.7; font-size: 1.1rem; font-family: serif;">
          <h1>${title}</h1>
          <div>${content}</div>
        </div>
      `;
      document.title = title;
    });

    const stream = new WritableStream(parser);
    stream.write(document.documentElement.outerHTML);
    stream.end();
  }
})();
