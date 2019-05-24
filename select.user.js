// ==UserScript==
// @name         好大学在线选择题答题情况查看
// @namespace    https://zby.io
// @version      0.5
// @description  显示好大学在线测验与作业选择题回答情况
// @author       fourstring
// @match        https://cnmooc.org/examTest/stuExamList/*
// @match        https://www.cnmooc.org/examTest/stuExamList/*
// @match        https://www.cnmooc.org/study/*
// @grant        none
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
        for (let problem of problemsList) {
            let currentProblemId=problem.getAttribute("id");
            if ($("div#"+currentProblemId+" a.selected").toArray().length>0){
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
