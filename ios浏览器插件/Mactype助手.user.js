// ==UserScript==
// @name              Mactype助手
// @namespace         https://github.com/syhyz1990/mactype
// @version           2.2.1
// @icon              https://www.youxiaohou.com/mactype.png
// @description       Windows下的浏览器浏览网页时文字往往发虚，颜色很淡，看不清楚。有了它可以让浏览器中显示的文字更加清晰，支持Chrome ，360 ，QQ ，Firfox ，Edge  等浏览器。
// @author            YouXiaoHou
// @license           MIT
// @homepage          https://www.youxiaohou.com/tool/install-mactype.html
// @supportURL        https://github.com/syhyz1990/mactype
// @require           https://unpkg.com/sweetalert2@10.16.6/dist/sweetalert2.min.js
// @resource          swalStyle https://unpkg.com/sweetalert2@10.16.6/dist/sweetalert2.min.css
// @match             *://*/*
// @run-at            document-start
// @grant             GM_getValue
// @grant             GM_setValue
// @grant             GM_registerMenuCommand
// @grant             GM_getResourceText
// ==/UserScript==

(function () {
    'use strict';

    let util = {
        getValue(name) {
            return GM_getValue(name);
        },

        setValue(name, value) {
            GM_setValue(name, value);
        },

        addStyle(id, tag, css) {
            tag = tag || 'style';
            let doc = document, styleDom = doc.getElementById(id);
            if (styleDom) return;
            let style = doc.createElement(tag);
            style.rel = 'stylesheet';
            style.id = id;
            tag === 'style' ? style.innerHTML = css : style.href = css;
            document.head.appendChild(style);
        },

        removeElementById(eleId) {
            let ele = document.getElementById(eleId);
            ele && ele.parentNode.removeChild(ele);
        }
    };

    let main = {
        /**
         * 配置默认值
         */
        initValue() {
            let value = [{
                name: 'current_val',
                value: 0
            }, {
                name: 'has_init',
                value: false
            }, {
                name: 'white_list',
                value: []
            }];

            value.forEach((v) => {
                util.getValue(v.name) === undefined && util.setValue(v.name, v.value);
            });
        },

        showSetting() {
            Swal.fire({
                title: '请选择清晰度',
                icon: 'info',
                input: 'range',
                showCancelButton: true,
                confirmButtonText: '保存',
                cancelButtonText: '还原',
                showCloseButton: true,
                inputLabel: '拖动滑块观察变化，数字越大字越清晰',
                customClass: {
                    popup: 'mactype-popup',
                },
                footer: '<div style="text-align: center;font-size: 1em">点击查看 <a href="https://www.youxiaohou.com/tool/install-mactype.html" target="_blank">使用说明</a>，配合 <a href="https://www.youxiaohou.com/tool/install-mactype.html#增强显示" target="_blank">XHei字体</a> 更清晰，Powered by <a href="https://www.youxiaohou.com">油小猴</a></div>',
                inputAttributes: {
                    min: 0,
                    max: 1,
                    step: 0.05
                },
                inputValue: util.getValue('current_val')
            }).then((res) => {
                util.setValue('has_init', true);
                if (res.isConfirmed) {
                    util.setValue('current_val', res.value);
                    this.changeStyle();
                }
                if (res.isDismissed && res.dismiss === "cancel") {
                    util.setValue('current_val', 0);
                    this.changeStyle();
                }
            });

            document.getElementById('swal2-input').addEventListener('change', (e) => {
                util.setValue('current_val', e.target.value);
                this.changeStyle();
            });
        },

        registerMenuCommand() {
            let whiteList = util.getValue('white_list');
            let host = location.host;
            if (whiteList.includes(host)) {
                GM_registerMenuCommand('💡 当前网站：❌', () => {
                    let index = whiteList.indexOf(host);
                    whiteList.splice(index, 1);
                    util.setValue('white_list', whiteList);
                    history.go(0);
                });
            } else {
                GM_registerMenuCommand('💡 当前网站：✔️', () => {
                    whiteList.push(host);
                    util.setValue('white_list', whiteList);
                    history.go(0);
                });
            }
            GM_registerMenuCommand('⚙️ 设置', () => {
                this.showSetting();
            });
        },

        generateStyle() {
            let val = util.getValue('current_val');
            return `
                .mactype-popup { font-size: 14px!important }
                *:not(pre) { -webkit-text-stroke: ${val}px !important; text-stroke: ${val}px !important }
                ::selection { color: #fff;background: #338fff }
            `;
        },

        changeStyle() {
            document.getElementById('mactype-style').innerHTML = this.generateStyle();
        },

        addPluginStyle() {
            let style = this.generateStyle();

            if (document.head) {
                util.addStyle('swal-pub-style', 'style', GM_getResourceText('swalStyle'));
                util.addStyle('mactype-style', 'style', style);
            }
            const headObserver = new MutationObserver(() => {
                util.addStyle('swal-pub-style', 'style', GM_getResourceText('swalStyle'));
                util.addStyle('mactype-style', 'style', style);
            });
            headObserver.observe(document.head, {childList: true, subtree: true});
        },

        isTopWindow() {
            return window.self === window.top;
        },

        init() {
            this.initValue();
            this.isTopWindow() && !util.getValue('has_init') && this.showSetting();
            this.isTopWindow() && this.registerMenuCommand();
            if (util.getValue('white_list').includes(location.host)) return;
            this.addPluginStyle();
        }
    };
    main.init();
})();
