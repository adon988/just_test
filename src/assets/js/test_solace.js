"use strict";

var Solace = Solace || {};
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
var WarrID = 'TSEA'
var AllData = [];
var UI = UI || {};
var Wdata = [];
var WdataSize = [];
var S43data_ALL = [];
var topicS43Finish = false;
var topicS27Finish = false;
var topicS43Finish_Target = false;
var InitialTable_tag = false;
var S60_cbInitialData = [];
var ProductName, LimitUp, LimitDown, YesterdayPrice;
var DigitNum = "";
var Max, Min, Rank;
//Draw
var MarketSize = [];
var WdataSize_High = [];
var MarketSize_Total = [];
var SizeNum = 0;
var Total_Size = 0;

//設定cookies
function setCookie(cookieName, cookieValue, extime) {
    if (document.cookie.indexOf(cookieName) >= 0) {
        var expD = new Date();
        expD.setTime(expD.getTime() + (-1 * 24 * 60 * 60 * 1000));
        var uexpires = "expires=" + expD.toUTCString();
        document.cookie = cookieName + "=" + cookieValue + "; " + uexpires;
    }
    var expD = new Date();
    expD.setTime(expD.getTime() + (extime * 24 * 15 * 1000));
    var expires = "expires=" + expD.toUTCString();
    document.cookie = cookieName + "=" + cookieValue + "; " + expires;
}

//讀取cookies
function getCookie(cookieName) {
    var name = cookieName + "=";
    var ca = document.cookie.split(';');
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') c = c.substring(1);
        if (c.indexOf(name) == 0) return c.substring(name.length, c.length);
    }
    return "";
}
//四捨五入取小數點到第幾位數 num: 數字  pos: 小數點第幾位
function formatFloat(num, pos) {
    var size = Math.pow(10, pos);
    return Math.round(num * size) / size;
}

//畫走勢圖
function drawTrend(Status, Data_Source, datetime, cbID) {
    // console.log(Data_Source);
}

//畫走勢圖(成交量)
function drawTrendSize(Status, Data_Source, datetime) {
    // console.log(Data_Source);
    MarketSize.push([Data_Source.Ptr, Data_Source.Time, Data_Source.Size, Data_Source.Price]);
    if (MarketSize[MarketSize.length - 1][1] < 90000) {
        MarketSize.pop().sort();
        if (MarketSize.length >= 2) {
            if (MarketSize[MarketSize.length - 1][0] == MarketSize[MarketSize.length - 2][0]) {
                MarketSize.pop();
            }
        }
    }
}
//大盤走勢圖資料顯示
function TrendContent(Data_Source, YSDClose, Status) {
    var range, S43_High, S43_Low, S43_Open;
    WdataSize_High.push(Data_Source.Price);
    MarketSize_Total.push(Data_Source.Size);
    
    if (Status == 'unsyn' && Data_Source.Time < '133000') {
        return;
    }

    // console.log(Data_Source);
    // console.log(Status);
    S43_Open = (MarketSize.length > 0)?MarketSize[0][3]:0;
    range = (parseFloat(Data_Source.Price) - parseFloat(YSDClose)) / parseFloat(YSDClose) * 100;
    WdataSize_High.sort(function (a, b) { return b - a; });//陣列排序，將最高的放在最前面
    S43_High = WdataSize_High[0];
    WdataSize_High.sort(function (a, b) { return a - b; });//陣列排序，將最低的放在最前面
    S43_Low = WdataSize_High[0];


    //總量
    if (SizeNum == 0) {
        //將陣列WdataSize_High的值相加放入SizeNum裡
        for (var i = 0; i <= MarketSize_Total.length - 1; i++) {
            Total_Size = Total_Size + MarketSize_Total[i];
        }
        SizeNum = (Total_Size);
    }
    else {
        SizeNum = (parseInt(SizeNum) + Data_Source.Size);
    }

    $("#DealPrice").text(Data_Source.Price);//成交
    $("#Movement").text(Math.abs(formatFloat((Data_Source.Price - parseFloat(YSDClose)), 2)));//漲跌
    $("#Range").text(Math.abs(formatFloat(range, 2))+'%');//幅度
    $("#YSDClose").text(YSDClose);//昨收
    $("#CbOpen").text(S43_Open);//開盤
    $("#CbHigh").text(S43_High);//最高
    $("#CbLow").text(S43_Low);//最低
    $("#CbTotal").text(SizeNum);//總量
}

(function () {
    var FormatNumber = function (n) {
        n += "";
        var arr = n.split(".");
        var re = /(\d{1,3})(?=(\d{3})+$)/g;
        return arr[0].replace(re, "$1,") + (arr.length == 2 ? "." + arr[1] : "");
    }

    this.SetUI_S27 = function (binaryData) {
        try {
            var s27 = new S27(binaryData).toJSON();
            var s27_Data = s27.Data;
            $.each(s27.Data, function (key, value) {
                if (value.CommodityID == WarrID) {
                    ProductName = value.ProductName;
                    //LimitUp = value.LimitUp * 0.01;
                    //LimitDown = value.LimitDown * 0.01;
                    YesterdayPrice = value.YesterdayPrice;
                    var MarketNo = '';
                    if (WarrID == 'TSEA') {
                        MarketNo = '0';
                    }
                    else {
                        MarketNo = '1';
                    }
                    setCookie('type', value.ClassType, '60');
                    var TopicObject_W = Solace.CreateTopicObject('M' + MarketNo + '/' + value.ClassType + '/' + WarrID + '/S_43');
                    Solace.Unsubscribe(TopicObject_W);
                    Solace.GetSolcacheData(TopicObject_W);
                }
            });

        } catch (error) {
            AddErrorLog('SetUI_S27 ' + error.toString());
        }
    }

    this.SetUI_S43 = function (binaryData, cacheStatus, CID) {
        try {
            var s43 = new S43(binaryData).toJSON();
            if (s43.SimulateFlag == 0) {
                s43.Time = s43.Time - (s43.Time % 100);
                var time = PadLeft(s43.Time.toString(), 6);   //tick裡面的time
                time = time.substring(0, 2) + ':' + time.substring(2, 4) + ':' + time.substring(4, 6)
                var date = s43.Date.toString().substring(0, 4) + '/' + s43.Date.toString().substring(4, 6) + '/' + s43.Date.toString().substring(6, 8)
                var datetime = Date.parse(date + ' ' + time);
                datetime = datetime + 28800000;
                if (topicS43Finish) {
                    console.log('gogo')
                    if (CID == WarrID) {
                        drawTrend('syn', s43, datetime, WarrID);
                        drawTrendSize('syn', s43, datetime);
                        if (WarrID === 'OTCA' || WarrID === 'TSEA') {
                            TrendContent(s43, YesterdayPrice,'syn');
                        }
                    }
                }
                else {
                    if (CID == WarrID) {
                        drawTrend('unsyn', s43, datetime, WarrID);
                        drawTrendSize('unsyn', s43, datetime);
                        if (WarrID === 'OTCA' || WarrID === 'TSEA') {
                            TrendContent(s43, YesterdayPrice,'unsyn');
                        }
                    }
                }
            }
        } catch (error) {
            AddErrorLog('SetUI_S43 ' + error.toString());
        }
    }

    this.UpdateCountPerSec = function () {
        try {
            console.log('updatecountpersec');
            $('#countPerSec').html(Solace.GetMsgCountPerSec().toString());
            setTimeout("UI.UpdateCountPerSec();", 1000);
        } catch (error) {
            AddErrorLog('UpdateCountPerSec ' + error.toString());
        }
    }

}).apply(UI);


(function () {
    var mySession = null;
    var cacheSession = null;

    Solace.Config = {
        //UserName: 'capital_cpweb',
        //Password: 'k5W3LQq69G67R',
        //VPN: 'capital_vpn',
        ////URL: 'wss://srvsolace-dev.capital.com.tw:81',   //solace主機ip
        //URL: 'https://srvsolace-dev.capital.com.tw:81',   //solace主機ip
        ////URL: 'ws://srvsolace-tp.capital.com.tw',

        UserName: 'capital_web',
        Password: 'password',
        VPN: 'capital_vpn',
        URL: 'ws://srvsolace-dev.capital.com.tw',   //solace主機ip
    }
    Solace.Events = {
        OnConnected: 'OnConnected'
    }

    /**要cache完成後的callback function*/
    var sessionEventCb; // forward declaration
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
            if (subcodeName == "NO_DATA") { //NO_DATA沒訂閱成功會顯示
                //$.notify("NO_DATA: " + userObject.Topic, { globalPosition: "bottom left", className: 'warn', });
            }
            AddLog("要cache完成 Subcode:" + subcodeName + " ,Topic:" + userObject.Topic);
        } catch (error) {
            AddErrorLog('cacheRequestCb ' + error.toString());
        }

        //手動設置
        //這裡將 S_43 完成標記為 true
        if (userObject.Topic.indexOf("S_43") > -1) {
            topicS43Finish = true;
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
            var topicMessage = message.m_destination.m_name;
//--------------------------------------------------------------001-1--------------------------------------------------------------
            //行情
            switch (msgData[0]) {
                case 0x1a:
                    switch (msgData[1]) {        
                        case 0x02:
                            console.log('UI.SetUI_G02');
                            console.log(msgData);
                            $(".results").text(msgData);
                            break;
                        case 0x03:
                            console.log('UI.SetUI_G03');
                            console.log(msgData);
                            $(".results").text(msgData);
                            break;
                    }
                    break;               
                case 0x1B:
                    switch (msgData[1]) {
                        case 0x27:
                            UI.SetUI_S27(msgData);
                            break;
                        case 0x43:
                            var CID = topicMessage.split("/")[2];
                            UI.SetUI_S43(msgData, cacheStatus, CID);
                            break;
                        case 0x36:
                            console.log('UI.SetUI_S36');
                            console.log(msgData);
                            $(".results").text(msgData);
                            break;
                        case 0x60:
                            console.log('UI.SetUI_S60');
                            console.log(msgData);
                            $(".results").text(msgData);
                            break;
                        case 0x61:
                            console.log('UI.SetUI_S61');
                            console.log(msgData);
                            $(".results").text(msgData);
                            break;
                        case 0x44:
                            console.log('UI.SetUI_S44');
                            console.log(msgData);
                            $(".results").text(msgData);
                            break;
                    }
                    break;
            }
            //回報
            switch (msgData[1]) {
                case 0x03://通知Client清回報
                    switch (msgData[4]) {                        
                        case 0xC9:
                            switch (msgData[7]) {
                                case 0x01:
                                    Solace.Unsubscribe("R201/" + ID + "/O"); //註冊委託
                                    Solace.Unsubscribe("R201/" + ID + "/D"); //註冊委託
                                    break;
                                case 0x02:
                                    var topicObject_R03_O = Solace.CreateTopicObject('R201/' + ID + '/O');
                                    //var topicObject_R03_O = Solace.CreateTopicObject('R201/SELF0082/O');
                                    if (topicObject_R03_O != null) {
                                        Solace.Unsubscribe(topicObject_R03_O);
                                    }
                                    Solace.GetSolcacheData(topicObject_R03_O);

                                    var topicObject_R03_D = Solace.CreateTopicObject('R201/' + ID + '/D');
                                    //var topicObject_R03_D = Solace.CreateTopicObject('R201/SELF0082/D');
                                    if (topicObject_R03_D != null) {
                                        Solace.Unsubscribe(topicObject_R03_D);
                                    }
                                    Solace.GetSolcacheData(topicObject_R03_D);

                                    //Solace.GetSolcacheData("R201/SELF0082/O"); //註冊委託
                                    //Solace.GetSolcacheData("R201/SELF0082/D"); //註冊委託                                                
                                    break;
                            }
                            break;
                    }
                    break;
                case 0x05: //回報                   
                        console.log('UI.SetUI_R03');
                        console.log(msgData);                    
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
                    Solace.SessionEventCb(session, event);
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
    /**
 * Session event callback
 * @param session
 * @param event
 */
    this.SessionEventCb = function (session, event) {
        console.log(event.toString());
        if (event.sessionEventCode === solace.SessionEventCode.UP_NOTICE) {
            console.log("UP_NOTICE");
            $(".status").append("<br/>UP_NOTICE");
            //ns.handle_sessionConnected();
        } else if (event.sessionEventCode === solace.SessionEventCode.SUBSCRIPTION_OK) {
            //ns.handle_subscriptionOperationSucceeded();
            console.log("SUBSCRIPTION_OK");
            $(".status").append("<br/>SUBSCRIPTION_OK");
        } else if (event.sessionEventCode === solace.SessionEventCode.SUBSCRIPTION_ERROR) {
            //ns.handle_failure("Failed to add subscription", true);
            console.log("SUBSCRIPTION_ERROR");
            $(".status").append("<br/>SUBSCRIPTION_ER");
        } else if (event.sessionEventCode === solace.SessionEventCode.LOGIN_FAILURE) {
            //ns.handle_failure("Failed to login to appliance:" + event.infoStr, true);
            console.log("LOGIN_FAILURE");
            $(".status").append("<br/>LOGIN_FAILURE");
        } else if (event.sessionEventCode === solace.SessionEventCode.CONNECTING) {
            //ns.utils_appendToConsole.log("Connecting...");
            console.log("CONNECTING");
            $(".status").append("<br/>CONNECTING");
        } else if (event.sessionEventCode === solace.SessionEventCode.DISCONNECTED) {
            //ns.handle_failure("Session is disconnected", false);
            console.log("DISCONNECTED");
            $(".status").append("<br/>DISCONNECTED");
        } else {
            //ns.handle_failure("Session failure!", false);
            console.log("Session failure!");
            $(".status").append("<br/>Session failure!");
        }
    }
}).apply(Solace);


//初始化-CB清單、即時報價
function SolaceInitial() {
    var topicObject_S60 = Solace.CreateTopicObject('M201/S_60');
    if (topicObject_S60 != null) {
        Solace.Unsubscribe(topicObject_S60);
    }
    Solace.GetSolcacheData(topicObject_S60);
}

//現股資訊-基本資料(S27)
function SubjectInfoInitial() {
    var TopicObject_S27 = Solace.CreateTopicObject('M0/S_27'); //上市
    if (TopicObject_S27 != null) {
        Solace.Unsubscribe(TopicObject_S27);
    }
    Solace.GetSolcacheData(TopicObject_S27);

    var TopicObject_S27 = Solace.CreateTopicObject('M1/S_27'); //上櫃
    if (TopicObject_S27 != null) {
        Solace.Unsubscribe(TopicObject_S27);
    }
    Solace.GetSolcacheData(TopicObject_S27);
}


//即時報價
function cbDynamic(ID) {
    var topicObject_S61 = Solace.CreateTopicObject('M201/' + ID + '/S_61');
    if (topicObject_S61 != null) {
        Solace.Unsubscribe(topicObject_S61);
    }
    Solace.GetSolcacheData(topicObject_S61);
}

//測試取得S_27
function cbgetSolaceDataS27(){
    //console.log('*** cbgetSolaceDataS27(4)');
    var MarketNo = '0';//test
    var TopicObject_S27 = Solace.CreateTopicObject('M' + MarketNo + '/S_27');
    //console.log('test'+TopicObject_S27);
    if (TopicObject_S27 != null) {
        Solace.Unsubscribe(TopicObject_S27);
    }
    Solace.GetSolcacheData(TopicObject_S27);
}


//--------------------------------------------------------------005--------------------------------------------------------------
// $(function () {
//     $(Solace).on(Solace.Events.OnConnected, function () {
//     	console.log('connect to solace');
//     	cbDynamic('18083');
//         // SolaceInitial(); //基本資料        
//         // SubjectInfoInitial(); //現股資訊-基本資料
//         //SubjectInfoInitial_S36(); //現貨資訊 - 即時報價
//         //initial();
//         //DynamicInitial(); //回報資料
//         //MySolace.SubscribeSocache("R201/SELF0082/O"); //註冊委託
//         //MySolace.SubscribeSocache("R201/SELF0082/D"); //註冊委託
//     });
//     Solace.Connect();
// }); 