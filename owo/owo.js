/* eslint-disable linebreak-style */
/* eslint-disable no-console */
/* eslint-disable no-undef */
/* eslint-disable quotes */
/* eslint-disable no-unused-vars */
'use strict';

function insertAtCursor(myField, myValue) {
    var textTop = myField.scrollTop;
    var documentTop = document.documentElement.scrollTop;

    //IE 浏览器
    if (document.selection) {
        myField.focus();
        var sel = document.selection.createRange();
        sel.text = myValue;
        sel.select();
    }

    //FireFox、Chrome等
    else if (myField.selectionStart || myField.selectionStart == '0') {
        var startPos = myField.selectionStart;
        var endPos = myField.selectionEnd;

        myField.value = myField.value.substring(0, startPos) + myValue + myField.value.substring(endPos, myField.value.length);

        myField.focus();
        myField.selectionStart = startPos + myValue.length;
        myField.selectionEnd = startPos + myValue.length;
    } else {

        myField.value += myValue;
        myField.focus();
    }

    myField.scrollTop = textTop;
    document.documentElement.scrollTop=documentTop;
}

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

(function () {
    var Typecho_Plugin_OwO = function () {
        function Typecho_Plugin_OwO(option) {
            var _this = this;

            _classCallCheck(this, Typecho_Plugin_OwO);

            var defaultOption = {
                logo: 'OwO',
                container: document.getElementsByClassName('Typecho_Plugin_OwO')[0],
                target: document.getElementsByTagName('textarea')[0],
                position: 'down',
                width: '100%',
                maxHeight: '250px',
                api: '/usr/plugins/TypechoPluginOwO/owo/list.json'
            };
            for (var defaultKey in defaultOption) {
                if (defaultOption.hasOwnProperty(defaultKey) && !option.hasOwnProperty(defaultKey)) {
                    option[defaultKey] = defaultOption[defaultKey];
                }
            }
            this.container = option.container;
            this.target = option.target;
            if (option.position === 'up') {
                this.container.classList.add('OwO-up');
            }

            var xhr = new XMLHttpRequest();
            xhr.onreadystatechange = function () {
                if (xhr.readyState === 4) {
                    if (xhr.status >= 200 && xhr.status < 300 || xhr.status === 304) {
                        _this.odata = JSON.parse(xhr.responseText);
                        _this.init(option);
                    } else {
                        console.log('OwO data request was unsuccessful: ' + xhr.status);
                    }
                }
            };
            xhr.open('get', option.api, true);
            xhr.send(null);
        }

        _createClass(Typecho_Plugin_OwO, [{
            key: 'init',
            value: function init(option) {
                var _this2 = this;
                console.log(this);
                this.area = option.target;
                this.packages = Object.keys(this.odata);

                // fill in HTML
                var html = '\n            <div class="OwO-logo"><span>' + option.logo + '</span></div>\n            <div class="OwO-body" style="width: ' + option.width + '">';

                for (var i = 0; i < this.packages.length; i++) {

                    html += '\n                <ul class="OwO-items OwO-items-' + this.odata[this.packages[i]].type + '" style="max-height: ' + (parseInt(option.maxHeight) - 53 + 'px') + ';">';
                    var type = this.odata[this.packages[i]].type;
                    var opackage = this.odata[this.packages[i]].container;
                    for (var _i = 0; _i < opackage.length; _i++) {
                        if (type == "image") {
                            html += '\n                    <li class="OwO-item" data-id="' + opackage[_i].data + '" title="' + opackage[_i].text + '">' + opackage[_i].icon + '</li>';
                        } else {
                            html += '\n                    <li class="OwO-item" data-id="not-given" title="' + opackage[_i].text + '">' + opackage[_i].icon + '</li>';
                        }
                    }

                    html += '\n                </ul>';
                }

                html += '\n                <div class="OwO-bar">\n                    <ul class="OwO-packages">';

                for (var _i2 = 0; _i2 < this.packages.length; _i2++) {

                    html += '\n                        <li><span style="height:40px!important">' + this.odata[this.packages[_i2]].icon + '</span></li>';
                }

                html += '\n                    </ul>\n                </div>\n            </div>\n            ';
                this.container.innerHTML = html;

                // 新增：保存下拉栏主体元素（用于动态调整位置）
                this.body = this.container.getElementsByClassName('OwO-body')[0];

                // bind event
                this.logo = this.container.getElementsByClassName('OwO-logo')[0];
                this.logo.addEventListener('click', function () {
                    _this2.toggle();
                });

                this.container.getElementsByClassName('OwO-body')[0].addEventListener('click', function (e) {
                    var target = null;
                    if (e.target.classList.contains('OwO-item')) {
                        target = e.target;
                    } else if (e.target.parentNode.classList.contains('OwO-item')) {
                        target = e.target.parentNode;
                    }
                    if (target) {
                        var cursorPos = _this2.area.selectionEnd;
                        var areaValue = _this2.area.value;
                        if (target.dataset.id == "not-given") {
                            insertAtCursor(_this2.area, ' ' + target.innerHTML + ' ');
                            //_this2.area.value = areaValue.slice(0, cursorPos) + target.innerHTML + areaValue.slice(cursorPos) + ' ';
                        } else {
                            insertAtCursor(_this2.area, ' ' + target.dataset.id + ' ');
                            //_this2.area.value = areaValue.slice(0, cursorPos) + target.dataset.id + areaValue.slice(cursorPos) + ' ';
                        }
                        _this2.area.focus();
                        _this2.toggle();
                    }
                });

                this.packagesEle = this.container.getElementsByClassName('OwO-packages')[0];

                var _loop = function _loop(_i3) {
                    (function (index) {
                        _this2.packagesEle.children[_i3].addEventListener('click', function () {
                            _this2.tab(index);
                        });
                    })(_i3);
                };

                for (var _i3 = 0; _i3 < this.packagesEle.children.length; _i3++) {
                    _loop(_i3);
                }

                this.tab(0);
            }
        }, {
            key: 'toggle',
            value: function toggle() {
                if (this.container.classList.contains('OwO-open')) {
                    this.container.classList.remove('OwO-open');
                    // 恢复下拉栏的原始样式（清除内联样式）
                    if (this.body) {
                        this.body.style.position = '';
                        this.body.style.top = '';
                        this.body.style.left = '';
                        this.body.style.right = '';
                        this.body.style.bottom = '';
                    }
                } else {
                    this.container.classList.add('OwO-open');
                    // 调整位置以避免底部空白
                    this._adjustPosition();
                }
            }
        }, {
            key: '_adjustPosition',
            value: function _adjustPosition() {
                // 获取触发按钮和下拉栏主体
                var button = this.logo;
                var dropdown = this.body;
                if (!button || !dropdown) return;

                // 获取按钮和下拉栏的尺寸及位置（相对于视口）
                var btnRect = button.getBoundingClientRect();
                var dropdownHeight = dropdown.offsetHeight;
                console.log(dropdownHeight);
                var dropdownWidth = dropdown.offsetWidth;
                console.log(dropdownWidth);

                // 获取页面总高度
                var docHeight = document.documentElement.scrollHeight;
                console.log(docHeight);
                // 按钮底部相对于文档顶部的绝对位置
                var btnBottomAbs = btnRect.bottom + window.scrollY;
                console.log(btnBottomAbs);
                // 按钮下方相对于页面底部的剩余空间
                var spaceBelowPage = docHeight - btnBottomAbs;
                console.log(spaceBelowPage);


                if (spaceBelowPage >= dropdownHeight) {
                    // 下方空间足够：恢复默认样式（让 CSS 自行处理）
                    dropdown.style.position = '';
                    dropdown.style.top = '';
                    dropdown.style.left = '';
                    dropdown.style.right = '';
                    dropdown.style.bottom = '';
                } else {
                    // 下方空间不足：改为 fixed 定位，显示在右侧并尽量靠下（但优先靠近按钮）
                    dropdown.style.position = 'fixed';

                    // 垂直方向：优先对齐按钮顶部，同时确保不超出视口底部
                    var topPos = btnRect.top;
                    if (topPos + dropdownHeight > docHeight) {
                        topPos = topPos - dropdownHeight-dropdownHeight-20;
                    }
                    if (topPos < 0) topPos = 0;
                    dropdown.style.top = dropdownHeight+'px';
                    dropdown.style.bottom = 'auto';

                    // 水平方向：按钮右侧 + 8px 间距
                    var leftPos = btnRect.right + 8;
                    dropdown.style.left = leftPos + 'px';
                    dropdown.style.right = 'auto';
                }
            }
        }, {
            key: 'tab',
            value: function tab(index) {
                var itemsShow = this.container.getElementsByClassName('OwO-items-show')[0];
                if (itemsShow) {
                    itemsShow.classList.remove('OwO-items-show');
                }
                this.container.getElementsByClassName('OwO-items')[index].classList.add('OwO-items-show');

                if(!this.container.getElementsByClassName('OwO-items')[index].classList.contains('OwO-image-items-load')
                    &&this.container.getElementsByClassName('OwO-items')[index].classList.contains('OwO-items-image'))
                {
                    this.container.getElementsByClassName('OwO-items')[index].classList.add('OwO-image-items-load');
                    var imgs = this.container.getElementsByClassName('OwO-items')[index].getElementsByTagName('img');
                    for (var i = 0; i < imgs.length; i++) {
                        imgs[i].setAttribute('src',imgs[i].dataset.src);
                    }
                }

                var packageActive = this.container.getElementsByClassName('OwO-package-active')[0];
                if (packageActive) {
                    packageActive.classList.remove('OwO-package-active');
                }
                this.packagesEle.getElementsByTagName('li')[index].classList.add('OwO-package-active');
            }
        }]);

        return Typecho_Plugin_OwO;
    }();

    if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
        module.exports = Typecho_Plugin_OwO;
    } else {
        window.Typecho_Plugin_OwO = Typecho_Plugin_OwO;
    }
})();