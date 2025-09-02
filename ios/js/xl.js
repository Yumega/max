// ==UserScript==
// @name 伪装成Windows桌面版Chrome（仅限xunlei.com）
// @namespace http://tampermonkey.net/
// @version 0.2
// @description 在iOS Safari里，把UA和平台伪装成Windows桌面版Chrome，仅在xunlei.com生效
// @author 你
// @match *://*.xunlei.com/*
// @grant none
// @run-at document-start
// @license MIT
// ==/UserScript==

(function() {
    'use strict';
    // 伪装平台
    Object.defineProperty(navigator, 'platform', {
        get: function() { return 'Win32'; }
    });
    // 伪装 UA（示例：Windows 10 + Chrome 120）
    Object.defineProperty(navigator, 'userAgent', {
        get: function() {
            return 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) ' +
                   'AppleWebKit/537.36 (KHTML, like Gecko) ' +
                   'Chrome/120.0.0.0 Safari/537.36';
        }
    });
})();
