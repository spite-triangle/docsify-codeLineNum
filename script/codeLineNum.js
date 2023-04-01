
! function () {
    window.$docsify.plugins = [].concat(window.$docsify.plugins, function (hook, vm) {

        // 通过属性值捕获元素
        var getElementByAttr = function (tag, dataAttr) {
            var aElements = document.getElementsByTagName(tag);
            var aEle = [];
            for (var i = 0; i < aElements.length; i++) {
                var ele = aElements[i].getAttribute(dataAttr).toLowerCase();
            // 配置检测
                if(window.$docsify.codeLineNum === undefined || window.$docsify.codeLineNum.blacklist === undefined) {
                    aEle.push(aElements[i]);
                    continue;
                }

                if (window.$docsify.codeLineNum.blacklist.indexOf(ele) == -1) {
                    aEle.push(aElements[i]);
                }
            }
            return aEle;
        };

        // 通过标签名，获取子元素内的第一个元素
        var getFirstSubelementByTag = function (parent, tagName) {
            // 没有子元素
            if (parent.childNodes == undefined) {
                return null;
            }
            var element = null;
            for (var i = 0; i < parent.childNodes.length; i++) {
                if (parent.childNodes[i].tagName != undefined && parent.childNodes[i].tagName == tagName) {
                    element = parent.childNodes[i];
                    break;
                }
            }
            return element;
        };

        // 创建一行
        var createLine = function (index, content) {
            var line = "<tr>";
            line += '<td id="L' + index + '" class="td-code td-code-line-number" data-line-number="' + index + '">';
            line += '<span class="code-line-number">' + index + '</span>'
            line += '</td>';
            line += '<td id="LC' + index + '" class="td-code td-code-line-content">' + content + '</td>';
            line += "</tr>"
            return line;
        };

        // 重新规范配置参数
        hook.init(function () {

            // 配置检测
            if ( window.$docsify.codeLineNum === undefined || window.$docsify.codeLineNum.blacklist == undefined) {
                return;
            }
            window.$docsify.codeLineNum.blacklist.forEach(function (item, index) {
                window.$docsify.codeLineNum.blacklist[index] = item.trim().toLowerCase();
            });
        });

        // 添加行号
        hook.doneEach(function () {
            // 清空选中
            window.$docsify["lastSelectedLine"] = null;

            // 查找所有的 code，黑名单除外
            var pres = getElementByAttr('pre', 'data-lang');
            console.log(pres);
            // 遍历所有的 code
            pres.forEach(function (pre, index) {
                // 增加一个标记
                pre.classList.add("pre-code-block");

                var html = '';
                
                // 获取 code 标签
                var code = getFirstSubelementByTag(pre, 'CODE');
                // 代码拆分行
                var lines = code.innerHTML.split('\n');
                for (var i = 0; i < lines.length; i++) {
                    html += createLine(i + 1, lines[i]);
                }
                code.innerHTML = '<table class="code-table"><tbody width=100%>' + html + '</tbody></table>';
                code.classList.add("code-block")
                // 高亮行
                var codeLineNums = code.querySelectorAll('.td-code-line-content');
                codeLineNums.forEach(function (line) {

                    // 行高亮
                    line.addEventListener('mouseup', function (e) {
                        var curTime = new Date();

                        // 左键点击，且不是长按
                        if (e.button != 0 || (curTime - window.$docsify.lastTime) > 200) {
                            return;
                        }

                        // 当前行被选中
                        this.classList.add("code-line-highlight");
                        window.$docsify.lastSelectedLine = this;
                    });
                    
                    line.addEventListener('mousedown', function(e){
                        // 存一下当前时间
                        window.$docsify.lastTime = new Date();

                        // 查看之前有没有被选中的
                        if (window.$docsify.lastSelectedLine != null) {
                            window.$docsify.lastSelectedLine.classList.remove("code-line-highlight");
                        }
                    });
                });
            });
        });
    });
}();