// ==UserScript==
// @name         Mark BiliBili Movies Rank
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  try to take over the world!
// @author       NiceB
// @match        https://www.bilibili.com/v/popular/rank/movie/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=bilibili.com
// @grant        GM_xmlhttpRequest
// @require      https://cdn.bootcss.com/jquery/3.4.1/jquery.min.js
// @connect      https://niceb.icu/2023/05/10/shyf%E5%9C%A8NiceB%E7%9A%84%E6%94%BE%E6%98%A0%E5%AE%A4%E7%9C%8B%E8%BF%87%E7%9A%84%E7%94%B5%E5%BD%B1/
// @connect      bilibili.com
// @connect      niceb.icu

// @note         2023.05.16 13:14 shyf！他喵喵的，居然说我“这个有丶离谱的”， “正则硬解析”怎么你了 TAT
// @note         2023.05.16 14:37 shyf！我的超人，为我带来了bilibili的super api： https://api.bilibili.com/pgc/web/season/section?season_id=12763   这样我才能在列表上标记每个电影的收费情况


// ==/UserScript==

(function() {
    'use strict';


    GM_xmlhttpRequest({
        method: "GET",
        url: "https://niceb.icu/2023/05/10/shyf%E5%9C%A8NiceB%E7%9A%84%E6%94%BE%E6%98%A0%E5%AE%A4%E7%9C%8B%E8%BF%87%E7%9A%84%E7%94%B5%E5%BD%B1/",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded;charset=utf-8"
        },
        data:"content=erwer",
        onload: function(response){
            console.log("请求成功");
            // console.log(response.responseText);
            const movies_seen_list = response.responseText.match(/(?<=&gt;&gt;).+?(?=&lt;&lt;)/g)

            $(".title").map((index, item)=>{

                 // console.log(item)
                 // console.log(item.innerText)
                 // console.log(item.href)
                 const i = movies_seen_list.indexOf(item.innerText)
                 if(i > 0){
                     item.innerHTML += "&nbsp;<span style='background:#33CC99; border-radius:10px;'> &#8730; &nbsp;</span>"
                 }else{
                     // item.innerHTML += "&nbsp;<span style='background:#FFCC33; border-radius:10px;'> &times;&nbsp; </span>"

                     var ssid = item.href.match(/(?<=ss)\d+/)
                     var api_url = "https://api.bilibili.com/pgc/web/season/section?season_id=" + ssid

                     GM_xmlhttpRequest({
                         method: "GET",
                         url: api_url,
                         onload: function(res){
                             console.log("api success")
                             var resjson = JSON.parse(res.response)

                             if(resjson.code != 0){
                                 console.log("api failed, code" + resjson.code)
                                 return
                             }

                             var badge = resjson.result.main_section.episodes[0].badge

                             if(badge.length > 0){
                                 if (badge === "付费"){
                                     item.innerHTML += "&nbsp;<span style='background:#CCCCFF; border-radius:10px;'> "+ badge + "&nbsp; </span>"
                                 }else{
                                     item.innerHTML += "&nbsp;<span style='background:#FFCC33; border-radius:10px;'> "+ badge + "&nbsp; </span>"
                                 }
                             }
                         },
                         onerror: function(res){
                             console.log("api failed")
                         }
                     })
                 }
            })

        },
        onerror: function(response){
            console.log("请求失败");
        }
    })
    console.log("?")
    // Your code here...
})();
