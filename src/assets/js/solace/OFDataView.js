"use strict";
//-----------------------------------------------------------------000-----------------------------------------------------------------
function PadLeft(str, lenght) {
    if (str.length >= lenght)
        return str;
    else
        return PadLeft("0" + str, lenght);
};
var AddLog = function (msg) {
};
var AddErrorLog = function (msg) {
    var d = new Date();
    console.error(PadLeft(d.getHours().toString(), 2) + ':' + PadLeft(d.getMinutes().toString(), 2) + ':' + PadLeft(d.getSeconds().toString(), 2) + '  ' + msg);
};

//-----------------------------------------------------------------001-----------------------------------------------------------------
var Solace = Solace || {};
var tag = 0;

(function () {
    var mySession = null;
    var cacheSession = null;

    Solace.Config = {
        //UserName: 'capital_cpweb',
        //Password: 'k5W3LQq69G67R',
        //VPN: 'capital_vpn',
        //URL: 'ws://srvsolace-tp.capital.com.tw',

        UserName: 'capital_web',
        Password: 'password',
        VPN: 'capital_vpn',
        //URL: 'ws://srvsolace-dev.capital.com.tw',   //solace主機ip
        URL: 'wss://srvsolace-dev.capital.com.tw:4433',   //solace主機ip

    }
    Solace.Events = {
        OnConnected: 'OnConnected'
    }
    var cacheRequestCb = function (requestID, cacheRequestResult, userObject) {
        try {
            var key;
            var subcodeName;
            for (key in solace.CacheReturnSubcode) {
                if (cacheRequestResult.subcode === solace.CacheReturnSubcode[key]) {
                    subcodeName = key;
                    break;
                }
            }
            if (subcodeName == "NO_DATA") {
                $.notify("NO_DATA: " + userObject.Topic, { globalPosition: "bottom left", className: 'warn', });
            }
            AddLog("要cache完成 Subcode:" + subcodeName + " ,Topic:" + userObject.Topic);
        } catch (error) {
            AddErrorLog('cacheRequestCb ' + error.toString());
        }
    }
    this.GetMsgCountPerSec = function () {
        if (currentSecond != new Date().getSeconds())
            return 0;
        else
            return countPerSecond;
    }
    var countPerSecond = 0, prevSecond = 0, currentSecond = 0;
    var MsgRxCallback = function (session, message) {
        try {
            currentSecond = new Date().getSeconds();
            if (currentSecond != prevSecond) {
                prevSecond = currentSecond;
                countPerSecond = 1;
            }
            else {
                ++countPerSecond;
            }
            var cacheStatus = message.getCacheStatus();
            var msgData = message.getBinaryAttachment().ToByteArray();
            var str = '', dataObj;
            //--------------------------------------------------------------001-1--------------------------------------------------------------
            switch (msgData[0]) {
                case 0x1a:
                    switch (msgData[1]) {
                        case 0x02:
                            UI.SetUI_G02(msgData);
                            break;
                        case 0x03:
                            UI.SetUI_G03(msgData);
                            break;
                        case 0x04:
                            UI.SetUI_G04(msgData);
                            break;
                     

                    }
                    break;
            }
        } catch (error) {
            AddErrorLog('MsgRxCallback ' + error.toString());
        }
    }
    //-----------------------------------------------------------------002-----------------------------------------------------------------
    this.Connect = function () {
        try {
            var mySessionProperties = new solace.SessionProperties();
            mySessionProperties.userName = Solace.Config.UserName;
            mySessionProperties.password = Solace.Config.Password;
            mySessionProperties.vpnName = Solace.Config.VPN;
            mySessionProperties.url = Solace.Config.URL;
            mySessionProperties.clientName = '';
            mySessionProperties.keepAliveIntervalsLimit = 10;
            mySession = solace.SolclientFactory.createSession(
                mySessionProperties,
                new solace.MessageRxCBInfo(MsgRxCallback, this),
                new solace.SessionEventCBInfo(function (session, event) {
                    AddLog("Session事件:" + event.toString());
                    if (event.sessionEventCode == 1) {
                        $(Solace).trigger(Solace.Events.OnConnected);
                    }
                }, this)
            );
            mySession.connect();
            var cacheSessionProperties = new solace.CacheSessionProperties('capital_solcache', 0, 0, 10000);
            cacheSession = mySession.createCacheSession(cacheSessionProperties);
        }
        catch (error) {
            AddErrorLog('Connect ' + error.toString());
        }
    }
    this.CreateTopicObject = function (topicString) {
        return solace.SolclientFactory.createTopic(topicString);
    }
    var requestID = 1;
    this.GetSolcacheData = function (topicObject) {
        try {
            cacheSession.sendCacheRequest(requestID, topicObject, true, solace.CacheLiveDataAction.FLOW_THRU,
                new solace.CacheCBInfo(cacheRequestCb, { Topic: topicObject.m_name })
            );
            requestID++;
        }
        catch (error) {
            AddErrorLog('GetSolcacheData ' + error.toString());
        }
    }
    this.Unsubscribe = function (topicObject) {
        try {
            mySession.unsubscribe(topicObject, true, "Unsubscribe_" + topicObject.m_name, 10000);
        } catch (error) {
            AddErrorLog('Unsubscribe ' + error.toString());
        }
    }
}).apply(Solace);

//-----------------------------------------------------------------003-----------------------------------------------------------------
var WarrantData = [];
var WarrantData2 = [];
var market_point = '';
var UI = UI || {};
var A_CommodityID = '';
(function () {
    var FormatNumber = function (n) {
        n += "";
        var arr = n.split(".");
        var re = /(\d{1,3})(?=(\d{3})+$)/g;
        return arr[0].replace(re, "$1,") + (arr.length == 2 ? "." + arr[1] : "");
    }
    this.SetUI_G02 = function (binaryData) {
        try {
            var g02 = new G02(binaryData).toJSON();
            g02.WarrantCall = (g02.WarrantCall).toFixed(2);
            g02.WarrantPut = (g02.WarrantPut).toFixed(2);
            g02.StandardSell = (g02.StandardSell).toFixed(2);
            g02.StandardPut = (g02.StandardPut).toFixed(2);
            g02.BIV = (g02.BIV * 100).toFixed(2);
            g02.SIV = (g02.SIV * 100).toFixed(2);
            g02.Tick = g02.Tick.toFixed(2);
            g02.Tick1 = (g02.Tick1 * 100).toFixed(2);
            g02.Change = (g02.Change * 100).toFixed(2);
            g02.Proportion = (g02.Proportion).toFixed(3);
            g02.Price = (g02.Price).toFixed(2);
            // $("#t1234").empty().html(g02.WarrantCall);

            //--------------------------------------------------------------003-1--------------------------------------------------------------
            var Bling = dataArray;
            var B_CommodityID = '';
            var Bling_ID = [];
            var flag = '';
            var search_one = $('#IDList').val();
            var none_data = $('#none_data').text();

            if (search_one == "" && none_data != "沒有符合篩選條件的權證!!") {
                $(Bling).each(function (i, data) {
                    var Bling_2 = data.Table;

                    for (i = 0; i < Bling_2.length;) {
                        Bling_ID.push(Bling_2[i].WARRANT_ID);
                        i++
                    }

                    B_CommodityID = g02.CommodityID;
                    if (A_CommodityID != B_CommodityID) {
                        A_CommodityID = B_CommodityID
                    }

                    flag = Bling_ID.some(function (value, index, array) {
                        return value == B_CommodityID ? true : false;
                    })

                    if (flag == true) {
                        document.getElementById(B_CommodityID + "_Call").className = "pre_animate";
                        document.getElementById(B_CommodityID + "_Put").className = "pre_animate";
                        document.getElementById(B_CommodityID + "_BIV").className = "pre_animate";
                        document.getElementById(B_CommodityID + "_SIV").className = "pre_animate";
                        document.getElementById(B_CommodityID + "_Tick").className = "pre_animate";
                        document.getElementById(B_CommodityID + "_Tick_2").className = "pre_animate";

                        var A_WarrantCall = $('#' + B_CommodityID + '_Call').text();
                        A_WarrantCall = A_WarrantCall.split(".");

                        var A_WarrantPut = $('#' + B_CommodityID + '_Put').text();
                        A_WarrantPut = A_WarrantPut.split(".");

                        var A_BIV = $('#' + B_CommodityID + '_BIV').text();
                        var A_SIV = $('#' + B_CommodityID + '_SIV').text();
                        var A_Tick = $('#' + B_CommodityID + '_Tick').text();
                        var A_Tick1 = $('#' + B_CommodityID + '_Tick_2').text();


                        var B_WarrantCall = g02.WarrantCall + g02.StandardSell;
                        B_WarrantCall = B_WarrantCall.split(".");

                        var B_WarrantPut = g02.WarrantPut + g02.StandardPut;
                        B_WarrantPut = B_WarrantPut.split(".");

                        var B_BIV = g02.BIV + "%";
                        var B_SIV = g02.SIV + "%";
                        var B_Tick1 = g02.Tick1;
                        var B_Tick = g02.Tick;

                        if (A_WarrantCall != "") {
                            if (A_WarrantCall[1] != B_WarrantCall[1]) {
                                document.getElementById(B_CommodityID + "_Call").className = "animate";
                            }
                            if (A_WarrantPut[1] != B_WarrantPut[1]) {
                                document.getElementById(B_CommodityID + "_Put").className = "animate";
                            }
                            if (A_BIV != B_BIV) {
                                document.getElementById(B_CommodityID + "_BIV").className = "animate";
                            }
                            if (A_SIV != B_SIV) {
                                document.getElementById(B_CommodityID + "_SIV").className = "animate";
                            }
                            if (A_Tick != B_Tick) {
                                document.getElementById(B_CommodityID + "_Tick").className = "animate";
                            }
                            if (A_Tick1 != B_Tick1) {
                                document.getElementById(B_CommodityID + "_Tick_2").className = "animate";
                            }
                        };
                    }
                });
            }
            if (search_one != "" && none_data != "沒有符合篩選條件的權證!!") {
                search_one = search_one.split(" ");

                document.getElementById(search_one[0] + "_Call").className = "pre_animate";
                document.getElementById(search_one[0] + "_Put").className = "pre_animate";
                document.getElementById(search_one[0] + "_BIV").className = "pre_animate";
                document.getElementById(search_one[0] + "_SIV").className = "pre_animate";
                document.getElementById(search_one[0] + "_Tick").className = "pre_animate";
                document.getElementById(search_one[0] + "_Tick_2").className = "pre_animate";

                var A_WarrantCall = $('#' + search_one[0] + '_Call').text();
                A_WarrantCall = A_WarrantCall.split(".");

                var A_WarrantPut = $('#' + search_one[0] + '_Put').text();
                A_WarrantPut = A_WarrantPut.split(".");

                var A_BIV = $('#' + search_one[0] + '_BIV').text();
                var A_SIV = $('#' + search_one[0] + '_SIV').text();
                var A_Tick = $('#' + search_one[0] + '_Tick').text();
                var A_Tick1 = $('#' + search_one[0] + '_Tick_2').text();


                var B_WarrantCall = g02.WarrantCall + g02.StandardSell;
                B_WarrantCall = B_WarrantCall.split(".");

                var B_WarrantPut = g02.WarrantPut + g02.StandardPut;
                B_WarrantPut = B_WarrantPut.split(".");

                var B_BIV = g02.BIV + "%";
                var B_SIV = g02.SIV + "%";
                var B_Tick1 = g02.Tick1;
                var B_Tick = g02.Tick;

                if (A_WarrantCall != "") {
                    if (A_WarrantCall[1] != B_WarrantCall[1]) {
                        document.getElementById(search_one[0] + "_Call").className = "animate";
                    }
                    if (A_WarrantPut[1] != B_WarrantPut[1]) {
                        document.getElementById(search_one[0] + "_Put").className = "animate";
                    }
                    if (A_BIV != B_BIV) {
                        document.getElementById(search_one[0] + "_BIV").className = "animate";
                    }
                    if (A_SIV != B_SIV) {
                        document.getElementById(search_one[0] + "_SIV").className = "animate";
                    }
                    if (A_Tick != B_Tick) {
                        document.getElementById(search_one[0] + "_Tick").className = "animate";
                    }
                    if (A_Tick1 != B_Tick1) {
                        document.getElementById(search_one[0] + "_Tick_2").className = "animate";
                    }
                };
            }

            var color = '';
            if (g02.Change < 0) {
                color = "<font color=" + '"' + "#009900" + '"' + ">▼";
                g02.Change = ((g02.Change) * (-1)).toFixed(2);
            }
            else if (g02.Change == 0) {
                color = "<font>";
            }
            else {
                color = "<font color=" + '"' + "#FF0000" + '"' + ">▲";
            }

            $("#123_060355").empty().html(g02.WarrantCall);

            $("#" + g02.CommodityID + "_Call").empty().append(g02.StandardSell == 0 ? '－' : "<span id=" + '"' + g02.CommodityID + '_B_Call"' + ">" + "<a class=" + '"' + 'toggle-menu menu-left jPushMenuBtn' + '"' + " onclick=" + '"' + "gotoTradebyTypeAll('','" + g02.CommodityID + "','','" + g02.WarrantCall + "','B')" + '"' + "href=" + '"' + "#" + '"' + ">" + g02.WarrantCall + "<br></a></font>" + g02.StandardSell + "</span>");
            $("#" + g02.CommodityID + "_Put").empty().html(g02.StandardPut == 0 ? '－' : "<span id=" + '"' + g02.CommodityID + '_B_Put"' + ">" + "<a  class=" + '"' + 'toggle-menu menu-left jPushMenuBtn' + '"' + " onclick=" + '"' + "gotoTradebyTypeAll('','" + g02.CommodityID + "','','" + g02.WarrantPut + "','B')" + '"' + "href=" + '"' + "#" + '"' + ">" + g02.WarrantPut + "<br></a>" + g02.StandardPut + "</span>");
            $("#" + g02.CommodityID + "_Price").empty().html(g02.Change == 0 ? '－' + "<br></a>" + '－' : "<a  class=" + '"' + 'toggle-menu menu-left jPushMenuBtn' + '"' + " onclick=" + '"' + "gotoTradebyTypeAll('','" + g02.CommodityID + "','','" + g02.Price + "','B')" + '"' + "href=" + '"' + "#" + '"' + ">" + color + g02.Price + "</a><br>" + g02.Change + "%" + "</font>");
            $("#" + g02.CommodityID + "_Prop").empty().html(g02.Proportion == undefined ? '' : g02.Proportion);
            $("#" + g02.CommodityID + "_Volume").empty().html(g02.Volume == 0 ? '－' : g02.Volume);
            $("#" + g02.CommodityID + "_BIV").empty().html(g02.BIV == 0 ? '－' : "<span id=" + '"' + g02.CommodityID + '_B_BIV"' + ">" + g02.BIV + "%" + "</span>");
            $("#" + g02.CommodityID + "_SIV").empty().html(g02.SIV == 0 ? '－' : "<span id=" + '"' + g02.CommodityID + '_B_SIV"' + ">" + g02.SIV + "%" + "</span>");
            $("#" + g02.CommodityID + "_Tick").empty().html(g02.Tick == 0 ? '－' : "<span id=" + '"' + g02.CommodityID + '_B_Tick"' + ">" + g02.Tick + "</span>");
            $("#" + g02.CommodityID + "_Tick_2").empty().html(g02.Tick1 == 0 ? '－' : "<span id=" + '"' + g02.CommodityID + '_B_Tick_2"' + ">" + g02.Tick1 + "</span>");

        } catch (error) {
            AddErrorLog('SetUI_G02 ' + error.toString());
        }

    }

    //--------------------------------------------------------------004--------------------------------------------------------------
    var blod_ID = '';
    var GetDelay = function (tradeTime) {
        try {
            var hour = parseInt(tradeTime / 10000), minuteAndSecond = parseInt(tradeTime - (hour * 10000));
            var d = new Date();
            var currnet = d.getMinutes() * 100 + d.getSeconds();
            return (currnet - minuteAndSecond).toString();
        } catch (error) {
            AddErrorLog('GetDelay ' + error.toString());
        }
    }

    this.UpdateCountPerSec = function () {
        try {
            $('#countPerSec').html(Solace.GetMsgCountPerSec().toString());
            setTimeout("UI.UpdateCountPerSec();", 1000);
        } catch (error) {
            AddErrorLog('UpdateCountPerSec ' + error.toString());
        }
    }
    this.SetUI_G03 = function (binaryData) {
        try {
            var g03 = new G03(binaryData).toJSON();
            var result = String.fromCharCode.apply(String, binaryData);
            g03.MarketExtent = (g03.MarketExtent).toFixed(2);
            g03.SubjectExtent = ((g03.SubjectExtent) * 100).toFixed(2);
            var SubjectDate = g03.SubjectDate.split("_");
            var color_Market = '';
            var color_Subject = '';
            var color_M = '';
            var color_S = '';
            market_point = g03.MarketPoint;
            Match_2 = market_point;
            if (g03.MarketChange < 0) {
                color_Market = "<font color=" + '"' + "#009900" + '"' + ">▼";
                color_M = "<font color=" + '"' + "#009900" + '"' + ">";
                g03.MarketChange = (g03.MarketChange) * (-1);
                g03.MarketExtent = (g03.MarketExtent) * (-1);
            }
            else if (g03.MarketChange == 0) {
                color_Market = "<font>";
            }
            else {
                color_Market = "<font color=" + '"' + "#FF0000" + '"' + ">▲";
                color_M = "<font color=" + '"' + "#FF0000" + '"' + ">";
            }
            if (g03.SubjectChange < 0) {
                color_Subject = "<font color=" + '"' + "#009900" + '"' + ">▼";
                color_S = "<font color=" + '"' + "#009900" + '"' + ">";
                g03.SubjectChange = (g03.SubjectChange) * (-1);
                g03.SubjectExtent = ((g03.SubjectExtent) * (-1)).toFixed(2);
            }
            else if (g03.SubjectChange == 0) {
                color_Subject = "<font>";
            }
            else {
                color_Subject = "<font color=" + '"' + "#FF0000" + '"' + ">▲";
                color_S = "<font color=" + '"' + "#FF0000" + '"' + ">";
            }
            $("#" + g03.SubjectDate + "_MarketPoint").empty().html(g03.MarketPoint);
            $("#" + g03.SubjectDate + "_MarketChange").empty().html(color_Market + g03.MarketChange + "</font>");
            $("#" + g03.SubjectDate + "_MarketExtent").empty().html(color_M + g03.MarketExtent + "%" + "</font>");
            $("#" + g03.SubjectDate + "_SubjectName").empty().html(g03.SubjectName);
            $("#" + g03.SubjectDate + "_SubjectPoint").empty().html(g03.SubjectPoint);
            $("#" + g03.SubjectDate + "_SubjectChange").empty().html(color_Subject + g03.SubjectChange + "</font>");
            $("#" + g03.SubjectDate + "_SubjectExtent").empty().html(color_S + g03.SubjectExtent + "%" + "</font>");
            $("#" + g03.SubjectDate + "_Date").empty().html("到期日");


            //-----------------------------------------------------------004-1-----------------------------------------------------------            
            var MinValue = '';
            var MinID = '';
            var ChangeData = [];
            var change_id = [];
            var flag = '';
            var MinData = dataArray;
            var search_one = $('#IDList').val();
            var none_data = $('#none_data').text();

            if (search_one == "" && none_data != "沒有符合篩選條件的權證!!") {
                $(MinData).each(function (i, data) {
                    var dataArray_1 = data.Table;
                    var Min_tag = 0;

                    for (i = 0; i < dataArray_1.length;) {
                        change_id.push(dataArray_1[i].WARRANT_ID);
                        i++
                    }

                    flag = change_id.some(function (value, index, array) {
                        return value == blod_ID ? true : false;
                    })

                    for (var i = 0; i < dataArray_1.length;) {
                        var c = Math.abs(dataArray_1[i].STRIKE_PRICE - g03.MarketPoint);



                        ChangeData.push({ Compare: c, ID: dataArray_1[i].WARRANT_ID });
                        i++



                        if (MinValue == '') {
                            MinValue = c;
                        }
                        if (MinValue > c) {
                            MinValue = c;
                            var w = i - 1;
                            MinID = dataArray_1[w].WARRANT_ID;
                            if (i == dataArray_1.length) {
                                if (flag != false) {
                                    document.getElementById(blod_ID + "_Strike_P").className = "C_none";
                                }
                                blod_ID = ChangeData[w].ID;
                                document.getElementById(ChangeData[w].ID + "_Strike_P").className = "C_bold";
                                Min_tag = 1;
                            }
                        }
                        if (MinValue < c) {
                            if (Min_tag == 0) {
                                var k = i - 2;
                                MinValue = c;
                                MinID = dataArray_1[k].WARRANT_ID;

                                var p = i - 2;
                                var p_2 = i - 3;
                                if (w != undefined && p_2 != undefined && p != undefined) {
                                    if (MinID[5] == "P") {
                                        if (dataArray_1.length == 2) {
                                            p_2 = i - 1;
                                        }
                                        if (p_2 < 0) {
                                            p_2 = i - 1;
                                        }

                                        if (ChangeData[p].Compare == ChangeData[p_2].Compare) {
                                            if (flag != false) {
                                                document.getElementById(blod_ID + "_Strike_P").className = "C_none";
                                            }
                                            blod_ID = ChangeData[p_2].ID;
                                            document.getElementById(ChangeData[p_2].ID + "_Strike_P").className = "C_bold";
                                            Min_tag = 1;
                                        }
                                        else {
                                            if (flag != false) {
                                                document.getElementById(blod_ID + "_Strike_P").className = "C_none";
                                            }
                                            blod_ID = ChangeData[p].ID;
                                            document.getElementById(ChangeData[p].ID + "_Strike_P").className = "C_bold";
                                            Min_tag = 1;
                                        }

                                    }
                                    else {
                                        if (flag != false) {
                                            document.getElementById(blod_ID + "_Strike_P").className = "C_none";
                                        }
                                        blod_ID = MinID;
                                        document.getElementById(MinID + "_Strike_P").className = "C_bold";
                                        Min_tag = 1;
                                    }
                                }
                            }
                        }
                    }
                });
            }
        } catch (error) {
            AddErrorLog('SetUI_G03 ' + error.toString());
        }
    }

    //--------------------------------------------------------------------------------------------------------------------------------
    this.SetUI_G04 = function (binaryData) {
        var color_Warrant = '';
        var color_Warrant_P = '';
        var color_Target = '';
        var color_Target_P = '';
        var color_PriceInOutRate = '';
        var vType = "";
        var days = new Date().format("yyyy/mm/dd HH:MM:ss");
        $("#lblTime").empty().html(days);
        try {

            var g04 = new G04(binaryData).toJSON();
            var table = $('#WarrantDT').DataTable();
           // console.log(table.columns().header().length);
           // console.log(table.column(1).header());
            
            if (g04.WarrantUpDowm < 0) {
                color_Warrant = "<font color=" + '"' + "#009900" + '"' + ">▼" + (g04.WarrantUpDowm * -1).toFixed(2) + "</font>";
                color_Warrant_P = "<font color=" + '"' + "#009900" + '"' + ">" + (g04.WarrantUpDowmP * -1).toFixed(2) + "%</font>";
            }
            else if (g04.WarrantUpDowm > 0) {
                color_Warrant = "<font color=" + '"' + "#FF0000" + '"' + ">▲" + (g04.WarrantUpDowm).toFixed(2) + "</font>";
                color_Warrant_P = "<font color=" + '"' + "#FF0000" + '"' + ">" + (g04.WarrantUpDowmP).toFixed(2) + "%</font>";
            }
            else {
                color_Warrant = (g04.WarrantUpDowm).toFixed(2);
                color_Warrant_P = (g04.WarrantUpDowmP).toFixed(2) + "%";
            }

            if (g04.TargetUpDowm < 0) {
                color_Target = "<font color=" + '"' + "#009900" + '"' + ">▼" + (g04.TargetUpDowm*-1).toFixed(2)  + "</font>";
                color_Target_P = "<font color=" + '"' + "#009900" + '"' + ">" + (g04.TargetUpDowmP*-1).toFixed(2)  + "%</font>";
            }
            else if (g04.TargetUpDowm > 0) {
                color_Target = "<font color=" + '"' + "#FF0000" + '"' + ">▲" + g04.TargetUpDowm.toFixed(2) + "</font>";
                color_Target_P = "<font color=" + '"' + "#FF0000" + '"' + ">" + g04.TargetUpDowmP.toFixed(2) + "%</font>";
            }
            else {
                color_Target = g04.TargetUpDowm.toFixed(2) ;
                color_Target_P =  g04.TargetUpDowmP.toFixed(2) + "%";
            }

            if (g04.PriceInOutRate < 0) {
                color_PriceInOutRate = "<font color=" + '"' + "#0D47A1" + '"' + ">外 " + (g04.PriceInOutRate*-1).toFixed(1)  + "%</font>";
            }
            else if (g04.PriceInOutRate > 0) {
                color_PriceInOutRate = "<font color=" + '"' + "#FFAB00" + '"' + ">內 " + g04.PriceInOutRate.toFixed(1) + "%</font>";
            }
            else {
                color_PriceInOutRate = g04.PriceInOutRate.toFixed(1) + "%";
            }

            switch (g04.WarrantType) {
                case "C":
                    vType = "認購";
                    break;
                case "P":
                    vType = "認售";
                    break;
                case "A":
                    if (g04.WarrantId.substring(6, 5) == "X") {
                        vType = "展牛";
                    }
                    else {
                        vType = "牛證";
                    }

                    break;
                case "B":
                    if (g04.WarrantId.substring(6, 5) == "Y") {
                        vType = "展熊";
                    }
                    else {
                        vType = "熊證";
                    }
                    break;
            }

            
            $("#" + g04.WarrantId + "_WarrantName").empty().html(g04.WarrantName);  //0
            $("#" + g04.WarrantId + "_WarrantId").empty().html(g04.WarrantId);      //1

            if (table.column(2).visible()) {
                $("#" + g04.WarrantId + "_WarrantbuyPrice").empty().html(g04.WarrantbuyPrice.toFixed(2));
                $('td#' + g04.WarrantId + '_WarrantbuyPrice').attr('data-order', g04.WarrantbuyPrice);
            }
            if (table.column(3).visible()) {
                $("#" + g04.WarrantId + "_WarrantbuyQty").empty().html(g04.WarrantbuyQty);
                $('td#' + g04.WarrantId + '_WarrantbuyQty').attr('data-order', g04.WarrantbuyQty);
            }
            if (table.column(4).visible()) {
                $("#" + g04.WarrantId + "_WarrantsellPrice").empty().html(g04.WarrantsellPrice.toFixed(2));
                $('td#' + g04.WarrantId + '_WarrantsellPrice').attr('data-order', g04.WarrantsellPrice);
            }
            if (table.column(5).visible()) {
                $("#" + g04.WarrantId + "_WarrantsellQty").empty().html(g04.WarrantsellQty);
                $('td#' + g04.WarrantId + '_WarrantsellQty').attr('data-order', g04.WarrantsellQty);
            }
            if (table.column(6).visible()) {
                $("#" + g04.WarrantId + "_WarrantdealPrice").empty().html(g04.WarrantdealPrice.toFixed(2));
                $('td#' + g04.WarrantId + '_WarrantdealPrice').attr('data-order', g04.WarrantdealPrice);
            }
            if (table.column(7).visible()) {
                $("#" + g04.WarrantId + "_WarrantdealQty").empty().html(g04.WarrantdealQty);
                $('td#' + g04.WarrantId + '_WarrantdealQty').attr('data-order', g04.WarrantdealQty);
            }
            if (table.column(8).visible()) {
                $("#" + g04.WarrantId + "_WarrantUpDowm").empty().html(color_Warrant);
                $('td#' + g04.WarrantId + '_WarrantUpDowm').attr('data-order', g04.WarrantUpDowm);
            }
            if (table.column(9).visible()) {
                $("#" + g04.WarrantId + "_WarrantUpDowmP").empty().html(color_Warrant_P);
                $('td#' + g04.WarrantId + '_WarrantUpDowmP').attr('data-order', g04.WarrantUpDowmP);
            }
            if (table.column(10).visible()) {
                $("#" + g04.WarrantId + "_WarrantpriceBuyStd").empty().html(g04.WarrantpriceBuyStd.toFixed(2));
                $('td#' + g04.WarrantId + '_WarrantpriceBuyStd').attr('data-order', g04.WarrantpriceBuyStd);
            }
            if (table.column(11).visible()) {
                $("#" + g04.WarrantId + "_WarrantpriceSellStd").empty().html(g04.WarrantpriceSellStd.toFixed(2));
                $('td#' + g04.WarrantId + '_WarrantpriceSellStd').attr('data-order', g04.WarrantpriceSellStd);
            }
            if (table.column(12).visible()) {
                $("#" + g04.WarrantId + "_StrikePrice").empty().html(g04.StrikePrice.toFixed(2));
            }
            if (table.column(13).visible()) {
                $("#" + g04.WarrantId + "_ExecuteRate").empty().html(g04.ExecuteRate.toFixed(3));
            }
            if (table.column(14).visible()) {
                $("#" + g04.WarrantId + "_ExecuteRate").empty().html(g04.ExecuteRate.toFixed(3));
            }
            if (table.column(15).visible()) {
                $("#" + g04.WarrantId + "_PriceInOutRate").empty().html(color_PriceInOutRate);
                $('td#' + g04.WarrantId + '_PriceInOutRate').attr('data-order', g04.PriceInOutRate);
            }
            if (table.column(16).visible()) {
                $("#" + g04.WarrantId + "_ColseYmd").empty().html(g04.ColseYmd);
            }
            if (table.column(17).visible()) {
                $("#" + g04.WarrantId + "_RemainDays").empty().html(g04.RemainDays);
            }
            if (table.column(18).visible()) {
                $("#" + g04.WarrantId + "_MarketMakerPoint").empty().html(g04.MarketMakerPoint.toFixed(1));
                $('td#' + g04.WarrantId + '_MarketMakerPoint').attr('data-order', g04.MarketMakerPoint);
            }
            if (table.column(19).visible()) {
                $("#" + g04.WarrantId + "_RecoveryPrice").empty().html(g04.RecoveryPrice.toFixed(2));
                $('td#' + g04.WarrantId + '_RecoveryPrice').attr('data-order', g04.RecoveryPrice);
            }
            if (table.column(20).visible()) {
                $("#" + g04.WarrantId + "_IssueFinRate").empty().html(g04.IssueFinRate.toFixed(0));
            }
            if (table.column(21).visible()) {
                $("#" + g04.WarrantId + "_IssueFinRate_origin").empty().html(g04.IssueFinRate_origin.toFixed(0));
            }
            if (table.column(22).visible()) {
                $("#" + g04.WarrantId + "_IssueFinRateBuy ").empty().html(g04.IssueFinRateBuy.toFixed(0));
            }
            if (table.column(23).visible()) {
                $("#" + g04.WarrantId + "_IssueFinRateSell").empty().html(g04.IssueFinRateSell.toFixed(0));
            }
            if (table.column(24).visible()) {
                $("#" + g04.WarrantId + "_WarrantType").empty().html(vType);
            }
            if (table.column(25).visible()) {
                $("#" + g04.WarrantId + "_TomorrowTickBalance").empty().html(g04.TomorrowTickBalance.toFixed(2));
                $('td#' + g04.WarrantId + '_TomorrowTickBalance').attr('data-order', g04.TomorrowTickBalance);
            }
            if (table.column(26).visible()) {
                $("#" + g04.WarrantId + "_DealRecoverPrice").empty().html(g04.DealRecoverPrice.toFixed(2));
                $('td#' + g04.WarrantId + '_DealRecoverPrice').attr('data-order', g04.DealRecoverPrice);
            }
            if (table.column(27).visible()) {
                $("#" + g04.WarrantId + "_IssueShares").empty().html(g04.IssueShares);
            }
            if (table.column(28).visible()) {
                $("#" + g04.WarrantId + "_QtyPercent").empty().html(g04.QtyPercent.toFixed(0));
                $('td#' + g04.WarrantId + '_QtyPercent').attr('data-order', g04.QtyPercent);
            }
            if (table.column(29).visible()) {
                $("#" + g04.WarrantId + "_FlowQty").empty().html(g04.FlowQty);
                $('td#' + g04.WarrantId + '_FlowQty').attr('data-order', g04.FlowQty);
            }
            if (table.column(30).visible()) {
                $("#" + g04.WarrantId + "_TargetId").empty().html(g04.TargetId);
            }
            if (table.column(31).visible()) {
                $("#" + g04.WarrantId + "_TargetName").empty().html(g04.TargetName);
            }
            if (table.column(32).visible()) {
                $("#" + g04.WarrantId + "_TargetdealPrice").empty().html(g04.TargetdealPrice.toFixed(2));
            }
            if (table.column(33).visible()) {
                $("#" + g04.WarrantId + "_TargetdealQty").empty().html(g04.TargetdealQty);
            }
            if (table.column(34).visible()) {
                $("#" + g04.WarrantId + "_TargetUpDowm").empty().html(color_Target);
            }
            if (table.column(35).visible()) {
                $("#" + g04.WarrantId + "_TargetUpDowmP").empty().html(color_Target_P);
            }
            if (table.column(36).visible()) {
                $("#" + g04.WarrantId + "_TargetyesQty").empty().html(g04.TargetyesQty);
            }
            if (table.column(37).visible()) {
                $("#" + g04.WarrantId + "_TargetHV20").empty().html(g04.TargetHV20.toFixed(2) + "%");
            }
            if (table.column(38).visible()) {
                $("#" + g04.WarrantId + "_TargetHV60").empty().html(g04.TargetHV60.toFixed(2) + "%");
            }
            if (table.column(39).visible()) {
                $("#" + g04.WarrantId + "_TargetHV90").empty().html(g04.TargetHV90.toFixed(2) + "%");
            }
            if (table.column(40).visible()) {
                $("#" + g04.WarrantId + "_PriceDifRate_Buy").empty().html(g04.PriceDifRate_Buy.toFixed(1));
                $('td#' + g04.WarrantId + '_PriceDifRate_Buy').attr('data-order', g04.PriceDifRate_Buy);
            }
            if (table.column(41).visible()) {
                $("#" + g04.WarrantId + "_PriceDifRate_Sell").empty().html(g04.PriceDifRate_Sell.toFixed(1));
                $('td#' + g04.WarrantId + '_PriceDifRate_Sell').attr('data-order', g04.PriceDifRate_Sell);
            }
            if (table.column(42).visible()) {
                $("#" + g04.WarrantId + "_ReasonablePriceDiff").empty().html(g04.ReasonablePriceDiff.toFixed(1));
                $('td#' + g04.WarrantId + '_ReasonablePriceDiff').attr('data-order', g04.ReasonablePriceDiff);
            }
            if (table.column(43).visible()) {
                $("#" + g04.WarrantId + "_EffectiveLevel").empty().html(g04.EffectiveLevel.toFixed(2));
                $('td#' + g04.WarrantId + '_EffectiveLevel').attr('data-order', g04.EffectiveLevel);
            }
            if (table.column(44).visible()) {
                $("#" + g04.WarrantId + "_Impv").empty().html(g04.Impv.toFixed(2) + "%");
                $('td#' + g04.WarrantId + '_Impv').attr('data-order', g04.Impv);
            }
            if (table.column(45).visible()) {
                $("#" + g04.WarrantId + "_ImpvBuy").empty().html(g04.ImpvBuy.toFixed(2) + "%");
                $('td#' + g04.WarrantId + '_ImpvBuy').attr('data-order', g04.ImpvBuy);
            }
            if (table.column(46).visible()) {
                $("#" + g04.WarrantId + "_ImpvSell").empty().html(g04.ImpvSell.toFixed(2) + "%");
                $('td#' + g04.WarrantId + '_ImpvSell').attr('data-order', g04.ImpvSell);
            }
            if (table.column(47).visible()) {
                $("#" + g04.WarrantId + "_ImpvAvg").empty().html(g04.ImpvAvg.toFixed(2));
                $('td#' + g04.WarrantId + '_ImpvAvg').attr('data-order', g04.ImpvAvg);
            }
            if (table.column(48).visible()) {
                $("#" + g04.WarrantId + "_Delta").empty().html(g04.Delta.toFixed(4));
                $('td#' + g04.WarrantId + '_Delta').attr('data-order', g04.Delta);
            }
            if (table.column(49).visible()) {
                $("#" + g04.WarrantId + "_Gamma").empty().html(g04.Gamma.toFixed(4));
                $('td#' + g04.WarrantId + '_Gamma').attr('data-order', g04.Gamma);
            }
            if (table.column(50).visible()) {
                $("#" + g04.WarrantId + "_Vega").empty().html(g04.Vega.toFixed(4));
                $('td#' + g04.WarrantId + '_Vega').attr('data-order', g04.Vega);
            }
            if (table.column(51).visible()) {
                $("#" + g04.WarrantId + "_Theta").empty().html(g04.Theta.toFixed(4));
                $('td#' + g04.WarrantId + '_Theta').attr('data-order', g04.Theta);
            }
            if (table.column(52).visible()) {
                $("#" + g04.WarrantId + "_PriceOneTick").empty().html(g04.PriceOneTick.toFixed(2));
                $('td#' + g04.WarrantId + '_PriceOneTick').attr('data-order', g04.PriceOneTick);
            }
            if (table.column(53).visible()) {
                $("#" + g04.WarrantId + "_PriceOnePercent").empty().html(g04.PriceOnePercent.toFixed(2));
                $('td#' + g04.WarrantId + '_PriceOnePercent').attr('data-order', g04.PriceOnePercent);
            }
            table.row("#" + g04.WarrantId).invalidate();
            
        } catch (error) {
            AddErrorLog('SetUI_G04 ' + error.toString());
        }
    }
    
}).apply(UI);

//--------------------------------------------------------------005--------------------------------------------------------------
$(function () {

    $(Solace).on(Solace.Events.OnConnected, function () {

        initial();

    });
    Solace.Connect();
});