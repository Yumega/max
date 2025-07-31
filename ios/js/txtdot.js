// ==UserScript==
// @name         链接替换为txtdot
// @namespace    http://tampermonkey.net/
// @version      25.7.31
// @description  替换新闻站链接为代理地址，仅替换文章页（路径层级≥2），排除视频/列表等非文章链接
// @match        https://*.ifeng.com/*
// @match        https://*.qq.com/*
// @match        https://*.sina.com.cn/*
// @match        https://*.sohu.com/*
// @match        https://*.google.com/*
// @match        https://*.cnn.com/*
// @match        https://*.bbc.com/*
// @match        https://*.foxnews.com/*
// @match        https://*.channelnewsasia.com/*
// @match        https://*.theguardian.com/*
// @match        https://*.euronews.com/*
// @match        https://*.sky.com/*
// @match        https://*.nbcnews.com/*
// @match        https://*.yahoo.com/*
// @exclude      https://www.bbc.com/news/videos/*
// @exclude      https://www.channelnewsasia.com/listen/*
// @exclude      https://*.cnn.com/*/video/*
// @exclude      https://*.theguardian.com/*/gallery/*
// @exclude      https://*.foxnews.com/video/*
// @exclude      https://*.euronews.com/tag/*
// @exclude      https://*.euronews.com/video/*
// @exclude      https://podcasts.euronews.com/*
// @exclude      https://news.sky.com/video/*
// @exclude      https://*.cnn.com/*/video/*
// @exclude      https://www.foxnews.com/category/*
// @grant        none
// ==/UserScript==

(function () {
    'use strict';

    const proxyBase = "http://192.168.11.1:8686/get?url=";

    const supportedDomains = [
        'ifeng.com',
        'qq.com',
        'sina.com.cn',
        'sohu.com',
        'thepaper.cn',
        'bbc.com',
        'cnn.com',
        'nbcnews.com',
        'channelnewsasia.com',
        'foxnews.com',
        'theguardian.com',
        'euronews.com',
        'sky.com',
        'yahoo.com'
    ];

    // 正则排除的路径模式
    const exclusionPatterns = [
        /:\/\/www\.channelnewsasia\.com\/listen\//,
        /:\/\/[^/]*cnn\.com\/.*\/video\//,
        /:\/\/[^/]*theguardian\.com\/.*\/gallery\//,
        /:\/\/[^/]*foxnews\.com\/video\//,
        /:\/\/[^/]*euronews\.com\/tag\//,
        /:\/\/[^/]*euronews\.com\/video\//,
        /:\/\/podcasts\.euronews\.com\//,
        /:\/\/news\.sky\.com\/video\//,
        /:\/\/www\.foxnews\.com\/category\//,
        /:\/\/www\.bbc\.com\/news\/videos\//
    ];

    function isExcluded(url) {
        return exclusionPatterns.some(pattern => pattern.test(url));
    }

    function shouldReplace(href, baseUrl) {
        if (!href) return false;

        try {
            let url = null;

            if (href.startsWith('/')) {
                url = new URL(href, baseUrl);
            } else if (href.startsWith('https://')) {
                url = new URL(href);
            } else {
                return false;
            }

            const isSupported = supportedDomains.some(domain => url.hostname.endsWith(domain));
            const pathDepth = url.pathname.split('/').filter(Boolean).length;
            const isDeepPath = pathDepth >= 2;
            const fullUrl = url.href;

            return url.protocol === 'https:' &&
                   isSupported &&
                   isDeepPath &&
                   !isExcluded(fullUrl);

        } catch (e) {
            return false;
        }
    }

    function replaceLinks(context = document) {
        const links = context.querySelectorAll('a[href]');
        links.forEach(link => {
            const href = link.getAttribute('href');
            if (shouldReplace(href, location.origin)) {
                const absoluteUrl = new URL(href, location.origin).href;
                link.setAttribute('href', proxyBase + encodeURIComponent(absoluteUrl));
            }
        });
    }

    // 初始处理
    replaceLinks();

    // 监听动态变化
    const observer = new MutationObserver(mutations => {
        mutations.forEach(mutation => {
            mutation.addedNodes.forEach(node => {
                if (node.nodeType === 1) {
                    replaceLinks(node);
                }
            });
        });
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

})();
