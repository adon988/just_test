"use strict";
var ng_p_tg = {};
var about_tg = {};

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
var topicS27Finish = false;
var topicS43Finish_Target = false;
var InitialTable_tag = false;
var S60_cbInitialData = [];
var ProductName, LimitUp, LimitDown, YesterdayPrice;
var DigitNum = "";
var Max, Min, Rank;

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
                    // Solace.GetSolcacheData(TopicObject_W);
                    /*呼叫 cbgetSolaceDataS43 ，再自定義完成 callback function*/
                    cbgetSolaceDataS43(TopicObject_W);
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
                    if (CID == WarrID) {
                        // console.log('get point data');
                        // //畫走勢圖
                        TAIEX_Trend_setData('syn', s43, datetime, WarrID);
                        // //畫走勢圖(成交量)
                        TAIEX_TrendSize_setData('syn', s43, datetime);
                        if (WarrID === 'OTCA' || WarrID === 'TSEA') {
                            //(3) 大盤最後走勢總計資料表
                            TAIEX_Trend_Content(s43, YesterdayPrice,'syn');
                        }
                    }
                }
                else {
                    if (CID == WarrID) {
                        // //畫走勢圖
                        TAIEX_Trend_setData('unsyn', s43, datetime, WarrID);
                        // //畫走勢圖(成交量)
                        TAIEX_TrendSize_setData('unsyn', s43, datetime);
                        if (WarrID === 'OTCA' || WarrID === 'TSEA') {
                            //(3) 大盤最後走勢總計資料表
                            TAIEX_Trend_Content(s43, YesterdayPrice,'unsyn');
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
                console.log('無資料');
                //$.notify("NO_DATA: " + userObject.Topic, { globalPosition: "bottom left", className: 'warn', });
            }
            AddLog("要cache完成 Subcode:" + subcodeName + " ,Topic:" + userObject.Topic);
        } catch (error) {
            AddErrorLog('cacheRequestCb ' + error.toString());
        }
        //這裡將 S_43 完成標記為 true
        if (userObject.Topic.indexOf("S_43") > -1) {
            topicS43Finish = true;
        }
    }
    this.GetMsgCountPerSec = function () {
        //console.log('*** GetMsgCountPerSec');
        if (currentSecond != new Date().getSeconds())
            return 0;
        else
            return countPerSecond;
    }
    var countPerSecond = 0, prevSecond = 0, currentSecond = 0;
    var MsgRxCallback = function (session, message) {
        try {
            //console.log('*** MsgRxCallback(final)');
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
                            //console.log('UI.SetUI_G02');
                            //console.log(msgData);
                            $(".results").text(msgData);
                            break;
                        case 0x03:
                            //console.log('UI.SetUI_G03');
                            //console.log(msgData);
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
                            //console.log('UI.SetUI_S36');
                            //console.log(msgData);
                            $(".results").text(msgData);
                            break;
                        case 0x60:
                            //console.log('UI.SetUI_S60');
                            //console.log(msgData);
                            $(".results").text(msgData);
                            break;
                        case 0x61:
                            //console.log('UI.SetUI_S61');
                            //console.log(msgData);
                            console.log('get s61');
                            $(".results").text(msgData);
                            break;
                        case 0x44:
                            //console.log('UI.SetUI_S44');
                            //console.log(msgData);
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
                        //console.log('UI.SetUI_R03');
                        //console.log(msgData);                    
                    break;

            }
        } catch (error) {
            AddErrorLog('MsgRxCallback ' + error.toString());
        }
    }
    //-----------------------------------------------------------------002-----------------------------------------------------------------
    this.Connect = function () {
        try {
            //console.log('*** this.Connect (1)');
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
                    //console.log('SessionEventCBInfo>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>');
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
    this.GetSolcacheData = function (topicObject, callback, tg) {
        try {
            //Setting global tg to components tg
            try {if(typeof(tg.home_tg)!='undefined'){home_tg = tg.home_tg;};}catch (error) {}
            try {if(typeof(tg.about_tg)!='undefined'){about_tg = tg.about_tg;};}catch (error) {}
            //if isset callback function, used this reset cacheCB function
            if(typeof(callback)!='undefined'){
                var solaceCacheCBInfo = new solace.CacheCBInfo(callback, { Topic: topicObject.m_name });
            }else{
                var solaceCacheCBInfo = new solace.CacheCBInfo(cacheRequestCb, { Topic: topicObject.m_name });
            }

            cacheSession.sendCacheRequest(requestID, topicObject, true, solace.CacheLiveDataAction.FLOW_THRU, solaceCacheCBInfo);
            requestID++;
        }
        catch (error) {
            AddErrorLog('GetSolcacheData ' + error.toString());
        }
    }
    this.Unsubscribe = function (topicObject) {
        try {
            //console.log('*** this.Unsubscribe(5)');
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
    this.connectStatus=false;
    this.SessionEventCb = function (session, event) {
        if (event.sessionEventCode === solace.SessionEventCode.UP_NOTICE) {
            //console.log("UP_NOTICE");
            try{ng_p_tg.connnectToSolace=true}catch (error) {}
            Solace.connectStatus=true;
            $(".status").prepend("<br/>UP_NOTICE");
            //ns.handle_sessionConnected();
        } else if (event.sessionEventCode === solace.SessionEventCode.SUBSCRIPTION_OK) {
            //ns.handle_subscriptionOperationSucceeded();
            //console.log("SUBSCRIPTION_OK");
            try{ng_p_tg.connnectToSolace=true}catch (error) {}
            Solace.connectStatus=true;
            $(".status").prepend("<br/>SUBSCRIPTION_OK");
        } else if (event.sessionEventCode === solace.SessionEventCode.SUBSCRIPTION_ERROR) {
            //ns.handle_failure("Failed to add subscription", true);
            //console.log("SUBSCRIPTION_ERROR");
            try{ng_p_tg.connnectToSolace=true}catch (error) {}
            Solace.connectStatus=true;
            $(".status").prepend("<br/>SUBSCRIPTION_ER");
        } else if (event.sessionEventCode === solace.SessionEventCode.LOGIN_FAILURE) {
            //ns.handle_failure("Failed to login to appliance:" + event.infoStr, true);
            //console.log("LOGIN_FAILURE");
            try{ng_p_tg.connnectToSolace=false}catch (error) {}
            Solace.connectStatus=false;
            $(".status").prepend("<br/>LOGIN_FAILURE");
        } else if (event.sessionEventCode === solace.SessionEventCode.CONNECTING) {
            ////ns.utils.prependToConsole.log("Connecting...");
            //console.log("CONNECTING");
            // try{ng_p_tg.connnectToSolace=true}catch (error) {}
            // Solace.connectStatus=true;
            $(".status").prepend("<br/>CONNECTING");
        } else if (event.sessionEventCode === solace.SessionEventCode.DISCONNECTED) {
            //ns.handle_failure("Session is disconnected", false);
            //console.log("DISCONNECTED");
            try{ng_p_tg.connnectToSolace=false}catch (error) {}
            try{ng_p_tg.statusDisconnect()}catch (error) {}
            Solace.connectStatus=false;
            $(".status").prepend("<br/>DISCONNECTED");
        } else {
            //ns.handle_failure("Session failure!", false);
            //console.log("Session failure!");
            try{ng_p_tg.connnectToSolace=false}catch (error) {}
            Solace.connectStatus=false;
            $(".status").prepend("<br/>Session failure!");
        }
    }
}).apply(Solace);


	//畫走勢圖
	var Wdata_High = [];
	function TAIEX_Trend_setData(Status, Data_Source, datetime, cbID) {
		
	    Wdata_High.push(Data_Source.Price);
	    
	    //提供最高與最低價給 TAIEX_Trend_Content
	    //最高
	    Wdata_High.sort(function (a, b) { return b - a; });
	    var S43_High = Wdata_High[0];
	    //最低
	    Wdata_High.sort(function (a, b) { return a - b; });
	    var S43_Low = Wdata_High[0];
	
	    if (Data_Source.Time >= '133500') { return; }
	    if (Status === 'syn') {
            //syn add single point
            var index = about_tg.TAIEX_trend_charts.series[0].data.length - 1;

            var Trendline = about_tg.TAIEX_trend_charts.series[0].data[index];
	        console.log('!!!!! add point here! x='+datetime+', y='+Data_Source.Price);
            if (datetime > Trendline.x) {
                about_tg.TAIEX_trend_charts_addPoint({ x: datetime, y: Data_Source.Price });
            }
            else if (datetime == Trendline.x) {
                about_tg.TAIEX_trend_charts_update([datetime, Data_Source.Price, true, true],index);
            }
	    }else if (Status === 'unsyn') {
	    	//unsyn collect datas
    		if(TAIEXTrend_DataSet.length==0){
                if (Data_Source.Time >= '90000') {
                    TAIEXTrend_DataSet.push({
                        x: datetime,
                        y: Data_Source.Price,
                        a: Data_Source.Ptr
                    });
                }
    			return;
    		}

    		if (datetime > TAIEXTrend_DataSet[TAIEXTrend_DataSet.length - 1].x) {
                    //TSEA OOTCA時間差別太大(現在時間)，過濾 
                    if (datetime > TAIEXTrend_DataSet[TAIEXTrend_DataSet.length - 1].x + 600000) {
                        if (cbID == 'TSEA' || cbID == 'OTCA') {
                        }
                        else {
                            if (Data_Source.Ptr == parseInt(TAIEXTrend_DataSet[TAIEXTrend_DataSet.length - 1].a) + 1) {
                                if (datetime < TAIEXTrend_DataSet[TAIEXTrend_DataSet.length - 1].x) {
                                }
                                else if (datetime == TAIEXTrend_DataSet[TAIEXTrend_DataSet.length - 1].x) {
                                    TAIEXTrend_DataSet.pop();
                                    TAIEXTrend_DataSet.push({
                                        x: datetime,
                                        y: Data_Source.Price,
                                        a: Data_Source.Ptr,
                                    });
                                }
                                else {
                                    TAIEXTrend_DataSet.push({
                                        x: datetime,
                                        y: Data_Source.Price,
                                        a: Data_Source.Ptr,
                                    });
                                }
                            }
                        }
                    } else {
                        TAIEXTrend_DataSet.push({
                            x: datetime,
                            y: Data_Source.Price,
                            a: Data_Source.Ptr
                        });
                    }
    		}else if (datetime == TAIEXTrend_DataSet[TAIEXTrend_DataSet.length - 1].x) {
                TAIEXTrend_DataSet.pop();
                TAIEXTrend_DataSet.push({
                    x: datetime,
                    y: Data_Source.Price,
                    a: Data_Source.Ptr
                });
            }else{

            }

	    }
	}

	//畫走勢圖(成交量)
	var TAIEX_TrendSize_DataSet = [];
	var TAIEX_MarketSize = [];
	var TAIEX_TrendSize_Sort = [];
	var TAIEX_TrendSize_parentTick;
	function TAIEX_TrendSize_setData(Status, Data_Source, datetime) {
	    // console.log(Data_Source);
	    TAIEX_MarketSize.push([Data_Source.Ptr, Data_Source.Time, Data_Source.Size, Data_Source.Price]);
	    if (TAIEX_MarketSize[TAIEX_MarketSize.length - 1][1] < 90000) {
	        TAIEX_MarketSize.pop().sort();
	        if (TAIEX_MarketSize.length >= 2) {
	            if (TAIEX_MarketSize[TAIEX_MarketSize.length - 1][0] == TAIEX_MarketSize[TAIEX_MarketSize.length - 2][0]) {
	                TAIEX_MarketSize.pop();
	            }
	        }
	    }
	    if (Data_Source.Time < '133500') {
	    	if(Status=='syn'){
		    	// syn 時建立增加單點資料
	            var index = about_tg.TAIEX_volume_charts.series[0].data.length - 1;
	            var Trendline = about_tg.TAIEX_volume_charts.series[0].data[index];
	            //輸出後續增加的資料
                // console.log('!!!! add point here! x='+datetime+', y='+Data_Source.Price);
                // console.log(datetime+','+Trendline.x);
                if (datetime > Trendline.x) {
	                //add
	                if (TAIEX_TrendSize_Sort.length > 0) {
                        // console.log('!!!!! mark1');
	                    //重整後的第一筆
	                    if (TAIEX_TrendSize_Sort[TAIEX_TrendSize_Sort.length - 1] + 1 == Data_Source.Ptr) {
                            // console.log('!!!!! mark2');
                            about_tg.TAIEX_volume_charts_addPoint({x: datetime, y: parent(TAIEX_TrendSize_parentTick) + Data_Source.Size})
	                    }
	                    else {
                            // console.log('!!!!! mark3');
	                        about_tg.TAIEX_volume_charts_addPoint({ x: datetime, y: Data_Source.Size });
	                    }
	                }
	                else {
                        // console.log('!!!!! mark4');
		                about_tg.TAIEX_volume_charts_addPoint({x: datetime, y: Data_Source.Price});
	                }
	            }
	            else {
                    // console.log('!!!!! mark5');
	                about_tg.TAIEX_volume_charts_update([datetime, parseInt(TAIEX_TrendSize_DataSet[TAIEX_TrendSize_DataSet.length - 1].y) + Data_Source.Size, true, true]);
	            }

	    	}else if(Status=='unsyn'){
	    	//unsyn 時蒐集資料
	            if (TAIEX_MarketSize.length >= 2) {
	                if (TAIEX_MarketSize[TAIEX_MarketSize.length - 1][1] == TAIEX_MarketSize[TAIEX_MarketSize.length - 2][1]) {
	                    TAIEX_TrendSize_parentTick = (parseInt(TAIEX_TrendSize_parentTick) + Data_Source.Size);
	                    TAIEX_TrendSize_DataSet.pop();
	                    TAIEX_TrendSize_DataSet.push({
	                        x: datetime,
	                        y: parseInt(TAIEX_TrendSize_parentTick),
	                    });
	                }
	                else if (TAIEX_MarketSize[TAIEX_MarketSize.length - 1][1] < TAIEX_MarketSize[TAIEX_MarketSize.length - 2][1]) {
	                }
	                else {
	                    TAIEX_TrendSize_DataSet.push({
	                        x: datetime,
	                        y: Data_Source.Size,
	                    });
	                    TAIEX_TrendSize_parentTick = (Data_Source.Size);
	                    TAIEX_TrendSize_Sort.push([Data_Source.Ptr]);
	                }
	            }
	            else {
	                TAIEX_TrendSize_DataSet.push({
	                    x: datetime,
	                    y: parseInt(Data_Source.Size),
	                });
	                TAIEX_TrendSize_parentTick = (Data_Source.Size);
	                TAIEX_TrendSize_Sort.push([Data_Source.Ptr]);
	            }

	    	}
	    }
	}



    var TAIEXTrend_DataSet = [];
    var topicS43Finish = false;

	//訂閱 S_43
	function cbgetSolaceDataS43(TopicObject_S43){
	    /*這裡getSolacacheData 有加入一個 callback function ，可取代 cacheRequestCb()要cache完成後的callback function**/
	    Solace.GetSolcacheData(TopicObject_S43 , function(requestID, cacheRequestResult, userObject){
	        console.log('cache完成');
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
	                console.log('無資料');
	                //$.notify("NO_DATA: " + userObject.Topic, { globalPosition: "bottom left", className: 'warn', });
	            }
	            console.log("要cache完成 Subcode:" + subcodeName + " ,Topic:" + userObject.Topic);


	        } catch (error) {
	            console.error('cacheRequestCb ' + error.toString());
            }
		    if (userObject.Topic.indexOf("S_43") > -1) {
		        topicS43Finish = true;
			     //這裡將 S_43 完成標記為 true
                 //初始化圖表
                 about_tg.TAIEX_trend_charts_setData(TAIEXTrend_DataSet);
                 //  TAIEX_trend_charts.series[0].setData(TAIEXTrend_DataSet, false);
                 //  TAIEX_trend_charts.redraw();
                 about_tg.TAIEX_volume_charts_setData(TAIEX_TrendSize_DataSet);
			    //  TAIEX_volume_charts.series[0].setData(TAIEX_TrendSize_DataSet, false);
			    //  TAIEX_volume_charts.redraw();
		    }
    	});
	}
	//大盤走勢圖資料顯示
	var SizeNum = 0;
	var Total_Size = 0;
	var TAIEX_TrendSize_DataSet_High = [];
	var MarketSize_Total = [];
	function TAIEX_Trend_Content(Data_Source, YSDClose, Status) {
	    var range, S43_High, S43_Low, S43_Open;
	    TAIEX_TrendSize_DataSet_High.push(Data_Source.Price);
	    MarketSize_Total.push(Data_Source.Size);
	    if (topicS43Finish==false && Data_Source.Time < '133000') {
	        return;
	    }
	    S43_Open = (TAIEX_MarketSize.length > 0)?TAIEX_MarketSize[0][3]:0;
	    range = (parseFloat(Data_Source.Price) - parseFloat(YSDClose)) / parseFloat(YSDClose) * 100;
	    TAIEX_TrendSize_DataSet_High.sort(function (a, b) { return b - a; });//陣列排序，將最高的放在最前面
	    S43_High = TAIEX_TrendSize_DataSet_High[0];
	    TAIEX_TrendSize_DataSet_High.sort(function (a, b) { return a - b; });//陣列排序，將最低的放在最前面
	    S43_Low = TAIEX_TrendSize_DataSet_High[0];
        //總量
        // if disconnect - set Sizenum to 0, this will re-caculate when re-connection
        if(Solace.connectStatus==false){
            SizeNum = 0;
            return;
        }
	    if (SizeNum == 0) {
	        //將陣列TAIEX_TrendSize_DataSet_High的值相加放入SizeNum裡
	        for (var i = 0; i <= MarketSize_Total.length - 1; i++) {
	            Total_Size = Total_Size + MarketSize_Total[i];
	        }
	        SizeNum = (Total_Size);
	    }
	    else {
	        SizeNum = (parseInt(SizeNum) + Data_Source.Size);
        }
        about_tg.TAIEX_trend_table_setData({
            DealPrice: Data_Source.Price,
            Movement: Math.abs(formatFloat((Data_Source.Price - parseFloat(YSDClose)), 2)),
            Range: Math.abs(formatFloat(range, 2))+'%',
            YSDClose: YSDClose,
            CbOpen: S43_Open,
            CbHigh: S43_High,
            CbLow: S43_Low,
            CbTotal: SizeNum
        });
    }

    function testoutside(tg){
        about_tg = tg;
        console.log('outsite');
        console.log(about_tg.componentFn())
    }
