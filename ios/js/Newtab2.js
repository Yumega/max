// ==UserScript==
// @name         在新标签页打开链接2.0
// @version      25.10.3
// @description  Make all links open in a new tab
// @author       Max
// @match        *://*.scmp.com/*   
// @match        https://www.google.com/search?*  
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
