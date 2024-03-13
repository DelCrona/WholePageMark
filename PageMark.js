// ==UserScript==
// @name         NGA优化摸鱼体验插件-标记整页（封测版）
// @namespace    https://github.com/DelCrona/WholePageMark
// @version      0.0.3
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
            key: 'markEnable',
            title: '启用自动标记',
            desc: '勾选来启动自动标记（不用记得关）',
            default: false
        },{
            key: 'anonyEnable',
            title: '启用标记匿名',
            desc: '勾选标记匿名，不勾选就不标',
            default: false
        },{
            key: 'markInput',
            title: '输入你要挂的标记',
            desc: '在此处填写，不宜过长，我不知道会不会有bug',
            default: ''
        }],
        preProcFunc() {
            // console.log('已运行: preProcFunc()')
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
            // console.log('已运行: postProcFunc()')
        },
        // 主管贴内回复的函数，每检测到一个回复楼层运行一次
        renderFormsFunc($el) {
            // console.log('回复项 (JQuery) => ', $el)
            // console.log('回复项 (JS) => ', $el.get(0))
            // console.log(currentUid);
            const currentUid = $el.find('[name=uid]').text() + '' ; // 获取uid，具体什么方式是复制的本体，能用就行。
            // 判断是否勾选启动按钮和是否标记匿名
            if (!this.pluginSettings['markEnable']){    
                console.log("未勾选启动标记，直接return");
                return;
            }else if(!this.pluginSettings['anonyEnable']){
                if(parseInt(currentUid) < 0){
                    console.log("未勾选标记匿名，直接return");
                    return;
                }
            }
            var markArray;
            const preMark = this.pluginSettings['markInput']; // 获取设置内自己填写的标记（准备标记）
            // console.log(preMark+"(premark)");
            const userObj = ({uid: currentUid}); // 创建一个对象，属性是uid，刚获取到的，用来接收标签Array数组。
            // 获取标签对象用来比较重复标记，如果获取的对象为空那么可以直接标记
            // 有标记的话会比较对象里的marks然后比较，没重复的就标，有重复的就直接return结束
            // try用来抓报错
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
                    this.mainScript.getModule('MarkAndBan').setUserMarks(markObj); // 调用标记函数
                    console.log("无标记者标记成功");
                }else{
                    // console.log(markArray.marks[0].mark);
                    // 使用find函数找重复，有的话if判断为true接return
                    if(markArray.marks.find((element) => {return preMark === element.mark;}))
                    {
                        console.log("有重复，无需标记");
                        return;
                    }

                    /*
                    老版本写法：
                    for (let i=0; i<markArray.marks.length; i++){
                        if (preMark === markArray.marks[i].mark){
                            console.log("有重复，无需标记");
                            return;
                        }
                    }
                    */

                    console.log("没重复，添加标记"); 
                    // 没有重复那么直接标记
                    let markList = markArray.marks; // 接收标记数组
                    markList.push({mark: preMark, text_color: '#ffffff', bg_color: '#1f72f1'}); // 在末尾插入标记
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