// ==UserScript==
// @name         NGA优化摸鱼体验插件-标记整页（封测版）
// @namespace    127.0.0.1
// @version      0.0.1
// @author       DelCrona
// @description  一键（划掉）自动标记整页用户
// @license      MIT
// @match        *://bbs.nga.cn/*
// @match        *://ngabbs.com/*
// @match        *://nga.178.com/*
// @match        *://g.nga.cn/*
// @grant        unsafeWindow
// @run-at       document-start
// @inject-into  content
// ==/UserScript==

(function (registerPlugin) {
    'use strict';
    const PageMark = ({
        name: 'PageMark',  // 插件唯一KEY
        title: '标记整页',  // 插件名称
        desc: '一键对整页用户上标记,点击右边设置按钮使用',  // 插件说明
        settings: [{
            key: 'tips',
            title: '非常重要的提示：1.使用之前先备份你的摸鱼本体配置文件和标记列表 2.不用的时候一定要取消勾选或者关闭插件，否则看到哪标到哪。 3.出bug的话可以反馈，修不一定，作者第二天学JS。'
        },{
            key: 'markInput',
            title: '输入你要挂的标记',
            desc: '在此处填写，不宜过长，我不知道会不会有bug',
            default: ''
        },{
            key: 'markEnable',
            title: '启用标记',
            desc: '勾选来启动自动标记',
            default: false
        }],
        preProcFunc() {
            console.log('已运行: preProcFunc()')
        },
        initFunc() {
            const $ = this.mainScript.libs.$
            console.log($.trim(' '))
            console.log('已运行: 标记整页')
            console.log('插件ID: ', this.pluginID)
            console.log('插件配置: ', this.pluginSettings)
            console.log('主脚本: ', this.mainScript)
            console.log('主脚本引用库: ', this.mainScript.libs)
        },
        postProcFunc() {
            console.log('已运行: postProcFunc()')
        },
        // 主管贴内回复的函数，每检测到一个回复楼层运行一次
        renderFormsFunc($el) {
            console.log('回复项 (JQuery) => ', $el)
            console.log('回复项 (JS) => ', $el.get(0))
            // 判断是否勾选启动按钮
            if (!this.pluginSettings['markEnable']){
                console.log("未勾选启动标记，直接return")
                return;
            }
            // 获取设置内自己填写的标记（准备标记）
            var markArray;
            const preMark = this.pluginSettings['markInput'];
            // console.log(preMark+"(premark)");
            // 获取uid，具体什么方式是复制的本体，能用就行。
            const currentUid = $el.find('[name=uid]').text() + '' ;
            // console.log(currentUid);
            // 创建一个对象，属性是uid，刚获取到的，用来接收标签Array数组。
            const userObj = ({uid: currentUid});
            // 获取标签对象用来比较重复标记，如果获取的对象为空那么可以直接标记
            // 有标记的话会比较对象里的marks然后比较，没重复的就标，有重复的就直接return结束
            try{
                markArray = this.mainScript.getModule('MarkAndBan').getUserMarks(userObj);
                // 判断是否为空
                if (markArray === null){
                    // 空的直接标
                    // console.log("没被标记过，可以直接标");
                    // 定义标记对象
                    let markObj = {
                        marks: [{mark: preMark, text_color: '#ffffff', bg_color: '#1f72f1'}],
                        name: '',
                        uid: currentUid
                    }
                    // 调用标记函数
                    this.mainScript.getModule('MarkAndBan').setUserMarks(markObj);
                    console.log("无标记者标记成功");
                }else{
                    // console.log(markArray);
                    // console.log(markArray.marks);
                    // console.log(markArray.marks[0].mark);
                    // 判断是否有重复，有直接return
                    for (let i=0; i<markArray.marks.length; i++){
                        if (preMark === markArray.marks[i].mark){
                            console.log("有重复，无需标记")
                            return;
                        }
                    }
                    // 没有重复那么直接标记
                    console.log("没重复，添加标记");
                    // 接收标记数组
                    let markList = markArray.marks;
                    // 在末尾插入标记
                    markList.push({mark: preMark, text_color: '#ffffff', bg_color: '#1f72f1'});
                    // 写明标记对象并调用标记函数
                    let markObj = {marks: markList, name: '', uid: currentUid};
                    this.mainScript.getModule('MarkAndBan').setUserMarks(markObj);
                    console.log("有标记者标记成功");
                }
            }catch(e){
                console.log(e);
            }
        },
        renderAlwaysFunc() {
            // console.log('循环运行: renderAlwaysFunc()')
        },
        asyncStyle() {
            return `#ngascript_plugin_${this.pluginID} {color: red}`
        },
        style: `
        #ngascript_plugin_test {color: red}
        `
    })
    registerPlugin(PageMark)
})(function(plugin) {
    plugin.meta = GM_info.script
    unsafeWindow.ngaScriptPlugins = unsafeWindow.ngaScriptPlugins || []
    unsafeWindow.ngaScriptPlugins.push(plugin)
});