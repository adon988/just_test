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
                            console.log('UI.SetUI_S27');
                            console.log(msgData);
                            $(".results").text(msgData);
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