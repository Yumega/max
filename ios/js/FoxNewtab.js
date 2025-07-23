// ==UserScript==
// @name         在新标签页打开FoxNews
// @version      25.7.23
// @description  Make all links on foxnews.com open in a new tab
// @author       Max
// @match        *://*.foxnews.com/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    function modifyLinks() {
        const allLinks = document.querySelectorAll('a[href]');
        allLinks.forEach(link => {
            link.setAttribute('target', '_blank');
            link.setAttribute('rel', 'noopener noreferrer');
        });
    }

    // Modify links on initial load
    modifyLinks();

    // Also observe dynamically added content (infinite scroll, etc.)
    const observer = new MutationObserver(modifyLinks);
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
})();
