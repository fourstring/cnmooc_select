// ==UserScript==
// @name         好大学在线选择题答题情况查看
// @namespace    https://zby.io
// @version      0.3
// @description  显示好大学在线测验与作业选择题回答情况
// @author       fourstring
// @match        https://cnmooc.org/examTest/stuExamList/*
// @grant        none
// @downloadURL  https://greasyfork.org/scripts/382050-%E5%A5%BD%E5%A4%A7%E5%AD%A6%E5%9C%A8%E7%BA%BF%E9%80%89%E6%8B%A9%E9%A2%98%E7%AD%94%E9%A2%98%E6%83%85%E5%86%B5%E6%9F%A5%E7%9C%8B/code/%E5%A5%BD%E5%A4%A7%E5%AD%A6%E5%9C%A8%E7%BA%BF%E9%80%89%E6%8B%A9%E9%A2%98%E7%AD%94%E9%A2%98%E6%83%85%E5%86%B5%E6%9F%A5%E7%9C%8B.user.js
// @updateURL    https://greasyfork.org/scripts/382050-%E5%A5%BD%E5%A4%A7%E5%AD%A6%E5%9C%A8%E7%BA%BF%E9%80%89%E6%8B%A9%E9%A2%98%E7%AD%94%E9%A2%98%E6%83%85%E5%86%B5%E6%9F%A5%E7%9C%8B/code/%E5%A5%BD%E5%A4%A7%E5%AD%A6%E5%9C%A8%E7%BA%BF%E9%80%89%E6%8B%A9%E9%A2%98%E7%AD%94%E9%A2%98%E6%83%85%E5%86%B5%E6%9F%A5%E7%9C%8B.user.js
// ==/UserScript==

(function() {
    'use strict';
    function createTipsNode(result){
        var tipsNode=document.createElement("span");
        if (result=="right"){
            tipsNode.innerText="[正确(结果不会即时更新，需要答题完暂存后再重新进入查看)]";
            tipsNode.style.color="green";
        }else{
            tipsNode.innerText="[错误(结果不会即时更新，需要答题完暂存后再重新进入查看)]";
            tipsNode.style.color="red";
        }
        return tipsNode;
    }
    function checkErrorFlags(){
        let problemsList=$('div.view-test.practice-item').toArray();
        if (!problemsList){
            return;
        }
        for (let problem of problemsList) {
            let currentProblemId=problem.getAttribute("id");
            if ($("div#"+currentProblemId+" a.input-r.selected").toArray().length>0){
                let currentResult=problem.getAttribute("error_flag");
                let addtionalTextArea=$("div#"+currentProblemId+" div.test-attach")[0];
                addtionalTextArea.appendChild(createTipsNode(currentResult));
            }
        }

    }
    function hook(func,pre,post){
        return function(){
            if (pre) pre.apply(window,arguments);
            func.apply(window,arguments);
            if (post) post.apply(window,arguments);
        }
    }
    var checked=false;
    var intervalId=setInterval(function(){
        if (window.hasOwnProperty("examLockTips")&&(!checked)&&window.examLockTips.closed&&$("div#enterObjectExamDiv").toArray().length==0){
            checkErrorFlags();
            checked=true;
            window.doSubmitExam=hook(window.doSubmitExam,null,function(){checked=false;});
            window.doSubmitExamBack=hook(window.doSubmitExamBack,null,function(){checked=false;});
        }
    },500);
})();
