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
var MarketPoint = 0;

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
                            UI.SetUI_G02(msgData);
                            break;
                        case 0x03:
                            UI.SetUI_G03(msgData);
                            break;
                    }
                    break;               
                case 0x1B:
                    switch (msgData[1]) {
                        case 0x27:
                            UI.SetUI_S27(msgData);
                            break;
                        case 0x36:
                            UI.SetUI_S36(msgData);
                            break;
                        case 0x60:
                            UI.SetUI_S60(msgData);
                            break;
                        case 0x61:
                            UI.SetUI_S61(msgData);
                            break;
                        case 0x44:
                            UI.SetUI_S44(msgData);
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
                        UI.SetUI_R03(msgData);                    
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
                    //Solace.SessionEventCb(session, event);
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
            //ns.handle_sessionConnected();
        } else if (event.sessionEventCode === solace.SessionEventCode.SUBSCRIPTION_OK) {
            //ns.handle_subscriptionOperationSucceeded();
            console.log("SUBSCRIPTION_OK");
        } else if (event.sessionEventCode === solace.SessionEventCode.SUBSCRIPTION_ERROR) {
            //ns.handle_failure("Failed to add subscription", true);
            console.log("SUBSCRIPTION_ERROR");
        } else if (event.sessionEventCode === solace.SessionEventCode.LOGIN_FAILURE) {
            //ns.handle_failure("Failed to login to appliance:" + event.infoStr, true);
            console.log("LOGIN_FAILURE");
        } else if (event.sessionEventCode === solace.SessionEventCode.CONNECTING) {
            //ns.utils_appendToConsole("Connecting...");
            console.log("CONNECTING");
        } else if (event.sessionEventCode === solace.SessionEventCode.DISCONNECTED) {
            //ns.handle_failure("Session is disconnected", false);
            console.log("DISCONNECTED");
        } else {
            //ns.handle_failure("Session failure!", false);
            console.log("Session failure!");
        }
    }
}).apply(Solace);
//-----------------------------------------------------------------003-----------------------------------------------------------------

var UI = UI || {};
var TopicS61_flag = false;
var s61Array = [];
(function () {
    var FormatNumber = function (n) {
        n += "";
        var arr = n.split(".");
        var re = /(\d{1,3})(?=(\d{3})+$)/g;
        return arr[0].replace(re, "$1,") + (arr.length == 2 ? "." + arr[1] : "");
    }

    this.SetUI_S27 = function (binaryData) {
        try {
            var i = 0;
            var s27 = new S27(binaryData).toJSON();
            var s27_Data = s27.Data;

                var N_s27 = Object.keys(s27.Data);
                var i_s27 = [];
                for (i = 1; i <= s27.Count; i++) {
                    i_s27.push({ index: N_s27[i] })
                    if (s27.Data[i_s27[i - 1].index] != null) {
                        S27_subjectInitialData.push({ Index: s27.Data[i_s27[i - 1].index].ProductIndex, ClassType: s27.Data[i_s27[i - 1].index].ClassType, MarketNo: s27.MarketNo, stockID: s27.Data[i_s27[i - 1].index].CommodityID, stockName: s27.Data[i_s27[i - 1].index].ProductName, YesterdayPrice: s27.Data[i_s27[i - 1].index].YesterdayPrice });
                    }
                }

            if (InitialTable_tagS27 == true) {
                var SubjectInfoObj = (document.getElementById) ? document.getElementById("SubjectInfo") : document.all("SubjectInfo");
                SubjectInfoObj.src = TitleHTML + "SubjectInfo.html";
            }

        } catch (error) {
            AddErrorLog('SetUI_S27 ' + error.toString());
        }
    }

    this.SetUI_S36 = function (binaryData) {
        try {
            var s36 = new S36(binaryData).toJSON();
            var s36_Data = s36.Data;
            var color = "";
            var color2 = "";

            var iframeSubjectInfo = document.getElementById('SubjectInfo');

            if (iframeSubjectInfo.contentDocument.getElementById(s36.ProductIndex + "_Buy") != null) {
                iframeSubjectInfo.contentDocument.getElementById(s36.ProductIndex + "_Buy").innerHTML = ""; //現貨買價
                if (s36.ProductIndex != 0) {
                    iframeSubjectInfo.contentDocument.getElementById(s36.ProductIndex + "_Buy").innerHTML = (s36.Bid / 100).toFixed(2);
                }
                else {
                    iframeSubjectInfo.contentDocument.getElementById(s36.ProductIndex + "_Buy").innerHTML = "-";
                }
            }

            if (iframeSubjectInfo.contentDocument.getElementById(s36.ProductIndex + "_Sell") != null) {
                iframeSubjectInfo.contentDocument.getElementById(s36.ProductIndex + "_Sell").innerHTML = ""; //現貨賣價
                if (s36.ProductIndex != 0) {
                    iframeSubjectInfo.contentDocument.getElementById(s36.ProductIndex + "_Sell").innerHTML = (s36.Ask / 100).toFixed(2);
                }
                else {
                    iframeSubjectInfo.contentDocument.getElementById(s36.ProductIndex + "_Sell").innerHTML = "-";
                }
            }

            if (iframeSubjectInfo.contentDocument.getElementById(s36.ProductIndex + "_Deal") != null) {
                iframeSubjectInfo.contentDocument.getElementById(s36.ProductIndex + "_Deal").innerHTML = ""; //現貨成交價
                if (s36.ProductIndex != 0) {
                    iframeSubjectInfo.contentDocument.getElementById(s36.ProductIndex + "_Deal").innerHTML = (s36.Price / 100).toFixed(2);

                    var yPrice = parseFloat(iframeSubjectInfo.contentDocument.getElementById(s36.ProductIndex + "_yPrice").textContent);

                    var ChangeM = (((parseFloat((s36.Price / 100).toFixed(2)) / yPrice) - 1) * 100).toFixed(2);

                    var Change = (parseFloat((s36.Price / 100).toFixed(2)) - yPrice).toFixed(2);

                    if (Change < 0) {
                        color = "<font color=" + '"' + "#009900" + '"' + ">▼";
                        color2 = "<font color=" + '"' + "#009900" + '"' + ">";
                    }
                    else if (Change == 0) {
                        color = "<font>";
                        color2 = "<font>";
                    }
                    else {
                        color = "<font color=" + '"' + "#FF0000" + '"' + ">▲";
                        color2 = "<font color=" + '"' + "#FF0000" + '"' + ">";
                    }

                    iframeSubjectInfo.contentDocument.getElementById(s36.ProductIndex + "_ChangeM").innerHTML = color2 + ChangeM + '</font>';

                    iframeSubjectInfo.contentDocument.getElementById(s36.ProductIndex + "_Change").innerHTML = color + Change + '</font>';
                }
                else {
                    iframeSubjectInfo.contentDocument.getElementById(s36.ProductIndex + "_Deal").innerHTML = "-";
                }
            }

            if (iframeSubjectInfo.contentDocument.getElementById(s36.ProductIndex + "_TotalQty") != null) {
                iframeSubjectInfo.contentDocument.getElementById(s36.ProductIndex + "_TotalQty").innerHTML = ""; //現貨總量
                if (s36.ProductIndex != 0) {
                    iframeSubjectInfo.contentDocument.getElementById(s36.ProductIndex + "_TotalQty").innerHTML = s36.TotalSize;
                }
                else {
                    iframeSubjectInfo.contentDocument.getElementById(s36.ProductIndex + "_TotalQty").innerHTML = "-";
                }
            }
        } catch (error) {
            AddErrorLog('SetUI_S36 ' + error.toString());
        }
    }

    this.SetUI_S60 = function (binaryData) {
        try {
            var i = 1;
            var s60 = new S60(binaryData).toJSON();
            if (InitialTable_tag != true) {
                for (i = 1; i <= s60.Count; i++) {
                    if (s60.Data[i] != null) {
                        S60_cbInitialData.push({ Index: s60.Data[i].ProductIndex, cbID: s60.Data[i].cbID, cbName: s60.Data[i].cbName, StrikeDisRate: s60.Data[i].StrikeDisRate, cbHundred: s60.Data[i].cbHundred, ConversionPrice: s60.Data[i].ConversionPrice, CloseYMD: s60.Data[i].CloseYMD, DigitNum: s60.Data[i].DigitNum, Levy: s60.Data[i].Levy, eTag: s60.Data[i].eTradeTag });
                        DigitNum = S60_cbInitialData[0].DigitNum;
                    }
                    InitialTable_tag = true;
                }
            }

            if (InitialTable_tag == true) {
                var QuotesObj = (document.getElementById) ? document.getElementById("Quotes") : document.all("Quotes");
                QuotesObj.src = TitleHTML + "Quotes.html";
                InitialTable_success = true;
            }

        } catch (error) {
            AddErrorLog('SetUI_S60 ' + error.toString());
        }
    }

    this.SetUI_S61 = function (binaryData) {
        try {
            var s61 = new S61(binaryData).toJSON();
            var flag_s61 = false;
            var flag_eTag = false;
            var e_Tag = "";
            var e_CB = "";
            //將stockIndex放入陣列後，由大到小整理
            s61Array.push(s61.stockIndex);
            s61Array.sort(function (a, b) { return b - a; });

            var iframeQuotes = document.getElementById('Quotes');
            if (iframeQuotes.contentDocument.getElementById(s61.stockIndex + "_cbID") != null) {
                var v_cbID = iframeQuotes.contentDocument.getElementById(s61.stockIndex + "_cbID").textContent;
                var A_cbDealPrice = parseFloat(iframeQuotes.contentDocument.getElementById(s61.stockIndex + "_cbDealPrice").textContent);
                var A_targetDealPrice = parseFloat(iframeQuotes.contentDocument.getElementById(s61.stockIndex + "_targetDealPrice").textContent);
                var A_cbMovement = parseFloat(iframeQuotes.contentDocument.getElementById(s61.stockIndex + "_cbMovement").textContent);
                var A_cbMovement_percent = parseFloat(iframeQuotes.contentDocument.getElementById(s61.stockIndex + "_cbMovement_percent").textContent);
                var A_cbHighPrice = parseFloat(iframeQuotes.contentDocument.getElementById(s61.stockIndex + "_cbHighPrice").textContent);
                var A_cbLowPrice = parseFloat(iframeQuotes.contentDocument.getElementById(s61.stockIndex + "_cbLowPrice").textContent);
                var A_parity = parseFloat(iframeQuotes.contentDocument.getElementById(s61.stockIndex + "_parity").textContent);

                A_cbDealPrice = isNaN(A_cbDealPrice) ? 0 : A_cbDealPrice;
                A_targetDealPrice = isNaN(A_targetDealPrice) ? 0 : A_targetDealPrice;
                A_cbMovement = isNaN(A_cbMovement) ? 0 : A_cbMovement;
                A_cbMovement_percent = isNaN(A_cbMovement_percent) ? 0 : A_cbMovement_percent;
                A_cbHighPrice = isNaN(A_cbHighPrice) ? 0 : A_cbHighPrice;
                A_cbLowPrice = isNaN(A_cbLowPrice) ? 0 : A_cbLowPrice;
                A_parity = isNaN(A_parity) ? 0 : A_parity;

                flag_s61 = true;
            }

            var p_cbID;
            var iframeCbInfo = document.getElementById('cbInfo');
            var cbInfoUrl = iframeCbInfo.src.toString();

            if (cbInfoUrl == "") {
                p_cbID = 0;
            }
            else {
                if (cbInfoUrl.indexOf("?") != -1) {
                    var ary = cbInfoUrl.split("?")[1].split("&");
                    if (ary.length == 1) {
                        p_cbID = decodeURI(ary[0].split("=")[1]); //權證代號 
                    }
                }
            }

            if (p_cbID == v_cbID) {
                var color = '';
                if (s61.cb_movement < 0) {
                    color = "<font color=" + '"' + "#009900" + '"' + ">▼";
                }
                else if (s61.cb_movement == 0) {
                    color = "<font color=" + '"' + "#000000" + '"' + ">";
                }
                else {
                    color = "<font color=" + '"' + "#FF0000" + '"' + ">▲";
                }

                var s61_deal_price = s61.cb_deal_price == 0 ? '-' : (s61.cb_deal_price == -999999 ? '-' : s61.cb_deal_price);
                var s61_cb_movement = s61.cb_movement == 0 ? '-' : (s61.cb_movement == -999999 ? '-' : color + Math.abs(s61.cb_movement).toFixed(2) + "</font>");
                var s61_cb_totalQty = s61.cb_totalQty == 0 ? '-' : (s61.cb_totalQty == -999999 ? '-' : s61.cb_totalQty);
                var s61_cb_high_price = s61.cb_high_price == 0 ? '-' : (s61.cb_high_price == -999999 ? '-' : s61.cb_high_price);
                var s61_cb_low_price = s61.cb_low_price == 0 ? '-' : (s61.cb_low_price == -999999 ? '-' : s61.cb_low_price);

                iframeCbInfo.contentDocument.getElementById('DealPrice').innerHTML = "";
                iframeCbInfo.contentDocument.getElementById('DealPrice').innerHTML = s61_deal_price;

                iframeCbInfo.contentDocument.getElementById('Movement').innerHTML = "";
                iframeCbInfo.contentDocument.getElementById('Movement').innerHTML = s61_cb_movement;

                iframeCbInfo.contentDocument.getElementById('QTY').innerHTML = "";
                iframeCbInfo.contentDocument.getElementById('QTY').innerHTML = s61_cb_totalQty;

                iframeCbInfo.contentDocument.getElementById('HightPrice').innerHTML = "";
                iframeCbInfo.contentDocument.getElementById('HightPrice').innerHTML = s61_cb_high_price;

                iframeCbInfo.contentDocument.getElementById('LowPrice').innerHTML = "";
                iframeCbInfo.contentDocument.getElementById('LowPrice').innerHTML = s61_cb_low_price;
            }

            if (flag_s61 == true) {
                //用於　漲跌、漲跌幅度
                var color = '';
                var color2 = '';
                var color_target = '';

                if (s61.cb_movement < 0) {
                    color = "<font color=" + '"' + "#009900" + '"' + ">▼";
                    color2 = "<font color=" + '"' + "#009900" + '"' + '  style="text-decoration:underline;"' + " >";
                    s61.cb_movement = s61.cb_movement * (-1);
                    s61.cb_movement_percent = s61.cb_movement_percent * (-1);
                }
                else if (s61.cb_movement == 0) {
                    color = "<font>";
                    color2 = "<font" + '  style="text-decoration:underline;"' + ">";
                }
                else {
                    color = "<font color=" + '"' + "#FF0000" + '"' + ">▲";
                    color2 = "<font color=" + '"' + "#FF0000" + '"' + '  style="text-decoration:underline;"' + ">";
                }

                if (s61.target_movement < 0) {
                    color_target = "<font color=" + '"' + "#009900" + '"' + ">";
                }
                else if (s61.target_movement > 0) {
                    color_target = "<font color=" + '"' + "#FF0000" + '"' + ">";
                }
                else {
                    color_target = "<font>";
                }

                //即時報價                       
                iframeQuotes.contentDocument.getElementById(s61.stockIndex + "_cbName").onclick = function () {  //點選 可轉換ID
                    //點擊前先紀錄"點擊前的cbID"
                    Before_cbID = document.getElementById("cbInfo_Name").textContent.split(" ")[2];
                    parent.document.getElementById("cbInfo_Name1").textContent = iframeQuotes.contentDocument.getElementById(s61.stockIndex + "_cbName").textContent;
                    parent.document.getElementById("cbInfo_Name").textContent = iframeQuotes.contentDocument.getElementById(s61.stockIndex + "_cbName").textContent + " ( " + iframeQuotes.contentDocument.getElementById(s61.stockIndex + "_cbID").textContent + " ) ";
                    var cbInforObj = (document.getElementById) ? document.getElementById("cbInfo") : document.all("cbInfo");
                    cbInforObj.src = TitleHTML + "cbInfo.html?cbID=" + v_cbID;

                    var cbChartObj = (document.getElementById) ? document.getElementById("cbChart") : document.all("cbChart");
                    cbChartObj.src = TitleHTML + "cbChart.html?cbID=" + v_cbID;
                }
                iframeQuotes.contentDocument.getElementById(s61.stockIndex + "_cbID").onclick = function () {  //點選  可轉換名稱
                    //點擊前先紀錄"點擊前的cbID"
                    Before_cbID = document.getElementById("cbInfo_Name").textContent.split(" ")[2];
                    parent.document.getElementById("cbInfo_Name1").textContent = iframeQuotes.contentDocument.getElementById(s61.stockIndex + "_cbName").textContent;
                    parent.document.getElementById("cbInfo_Name").textContent = iframeQuotes.contentDocument.getElementById(s61.stockIndex + "_cbName").textContent + " ( " + iframeQuotes.contentDocument.getElementById(s61.stockIndex + "_cbID").textContent + " ) ";
                    var cbInforObj = (document.getElementById) ? document.getElementById("cbInfo") : document.all("cbInfo");
                    cbInforObj.src = TitleHTML + "cbInfo.html?cbID=" + v_cbID;

                    var cbChartObj = (document.getElementById) ? document.getElementById("cbChart") : document.all("cbChart");
                    cbChartObj.src = TitleHTML + "cbChart.html?cbID=" + v_cbID;
                }

                iframeQuotes.contentDocument.getElementById(s61.stockIndex + "_cbDealPrice").innerHTML = ""; //可轉債成交價
                if (s61.cb_deal_price != -999999) {
                    iframeQuotes.contentDocument.getElementById(s61.stockIndex + "_cbDealPrice").innerHTML = color2 + (s61.cb_deal_price).toFixed(2) + '</font>';
                    if (ID != "SELF0082") {
                        flag_eTag = S60_cbInitialData.some(function (value, index, array) {
                            e_Tag = value.eTag;
                            e_CB = value.cbID;
                            return value.Index == s61.stockIndex ? true : false;
                        })
                        if (e_Tag != "0") {
                            //Parameter：CB ID + CB name、CB price；BuySellCode：Buy
                            iframeQuotes.contentDocument.getElementById(s61.stockIndex + "_cbDealPrice").onclick = function () {
                                orderType = "1"; //【買單】，委託類型 (1:買 2:賣 3:改量 4:刪單 6:改價)
                                parent.document.getElementById("cbOrderName").value = iframeQuotes.contentDocument.getElementById(s61.stockIndex + "_cbID").textContent + " " + iframeQuotes.contentDocument.getElementById(s61.stockIndex + "_cbName").textContent;  //************需要丟動態參數
                                parent.document.getElementById("cbOrderName2").value = iframeQuotes.contentDocument.getElementById(s61.stockIndex + "_cbID").textContent + " " + iframeQuotes.contentDocument.getElementById(s61.stockIndex + "_cbName").textContent;  //************需要丟動態參數
                                parent.document.getElementById("cbPrice").value = (s61.cb_deal_price);
                                parent.document.getElementById("cbPrice2").value = (s61.cb_deal_price);
                                parent.document.getElementById("SellDataNo").style.display = "none";
                                parent.document.getElementById("SellDataNo2").style.display = "none";
                                document.getElementById("batchBtn2").style.display = "none";
                                parent.document.getElementById("AcnoID_SELF0082_2").style.display = "none";
                                parent.eTag_cbHundred = iframeQuotes.contentDocument.getElementById(s61.stockIndex + "_cbHundred").textContent;
                                parent.eTag_closeYMD = iframeQuotes.contentDocument.getElementById(s61.stockIndex + "_closeYMD").textContent;

                                parent.$('nav a').removeClass('now')
                                parent.$('.right button').removeClass('now')
                                parent.$('.right button').removeClass('sell')
                                parent.$('nav a.buy').addClass('now')
                                parent.$('.right button').addClass('buy')
                                parent.$('header button').parents().removeClass('buy sell').addClass("buy")

                                parent.$('.order').removeClass('sell')
                                parent.$('.order').fadeIn(300).addClass('buy').find('nav .buy').addClass('now');
                                parent.$('.order button').addClass('buy')
                                parent.$('html').addClass('fixed')
                                parent.eOrder_tag = true;
                            }
                        }
                        else {
                            //Parameter：CB ID + CB name、CB price；BuySellCode：Buy
                            iframeQuotes.contentDocument.getElementById(s61.stockIndex + "_cbDealPrice").onclick = function () {
                                orderType = "2"; //【賣單】，委託類型 (1:買 2:賣 3:改量 4:刪單 6:改價)
                                parent.document.getElementById("cbOrderName").value = iframeQuotes.contentDocument.getElementById(s61.stockIndex + "_cbID").textContent + " " + iframeQuotes.contentDocument.getElementById(s61.stockIndex + "_cbName").textContent;  //************需要丟動態參數
                                parent.document.getElementById("cbOrderName2").value = iframeQuotes.contentDocument.getElementById(s61.stockIndex + "_cbID").textContent + " " + iframeQuotes.contentDocument.getElementById(s61.stockIndex + "_cbName").textContent;  //************需要丟動態參數
                                parent.document.getElementById("cbPrice").value = (s61.cb_deal_price);
                                parent.document.getElementById("cbPrice2").value = (s61.cb_deal_price);
                                parent.document.getElementById("SellDataNo").style.display = "inline";
                                parent.document.getElementById("SellDataNo2").style.display = "inline";
                                document.getElementById("batchBtn2").style.display = "none";
                                parent.document.getElementById("AcnoID_SELF0082_2").style.display = "none";
                                parent.eTag_cbHundred = iframeQuotes.contentDocument.getElementById(s61.stockIndex + "_cbHundred").textContent;
                                parent.eTag_closeYMD = iframeQuotes.contentDocument.getElementById(s61.stockIndex + "_closeYMD").textContent;

                                parent.document.getElementById("SellDataNo").style.display = "inline";
                                parent.$('nav a').removeClass('now')
                                parent.$('.right button').removeClass('now')
                                parent.$('.right button').removeClass('buy')
                                parent.$('nav a.sell').addClass('now')
                                parent.$('.right button').addClass('sell')
                                parent.$('header button').parents().removeClass('buy sell').addClass('sell')
                                parent.SellDataList(e_CB);
                                parent.eOrder_tag = true;

                                parent.$('.order').removeClass('buy')
                                parent.$('.order').fadeIn(300).addClass('sell').find('nav .sell').addClass('now');
                                parent.$('.order button').addClass('sell')
                                parent.$('html').addClass('fixed')
                            }
                        }
                        //判斷即時報價區是否完成，完成才跑右下角走勢圖
                        if (s61Array[0] - 1 == (s61Array.length / 2) + 1) {
                            TopicS61_flag = true;
                        }
                    }
                    else {
                        //Parameter：CB ID + CB name、CB price；BuySellCode：Buy
                        iframeQuotes.contentDocument.getElementById(s61.stockIndex + "_cbDealPrice").onclick = function () {
                            orderType = "1"; //【買單】，委託類型 (1:買 2:賣 3:改量 4:刪單 6:改價)
                            parent.document.getElementById("cbOrderName").value = iframeQuotes.contentDocument.getElementById(s61.stockIndex + "_cbID").textContent + " " + iframeQuotes.contentDocument.getElementById(s61.stockIndex + "_cbName").textContent;  //************需要丟動態參數
                            parent.document.getElementById("cbOrderName2").value = iframeQuotes.contentDocument.getElementById(s61.stockIndex + "_cbID").textContent + " " + iframeQuotes.contentDocument.getElementById(s61.stockIndex + "_cbName").textContent;  //************需要丟動態參數
                            parent.document.getElementById("cbPrice").value = (s61.cb_deal_price);
                            parent.document.getElementById("cbPrice2").value = (s61.cb_deal_price);
                            parent.document.getElementById("SellDataNo").style.display = "none";
                            parent.document.getElementById("SellDataNo2").style.display = "none";
                            document.getElementById("batchBtn2").style.display = "none";
                            parent.document.getElementById("AcnoID_SELF0082_2").style.display = "block";

                            parent.$('nav a').removeClass('now')
                            parent.$('.right button').removeClass('now')
                            parent.$('.right button').removeClass('sell')
                            parent.$('nav a.buy').addClass('now')
                            parent.$('.right button').addClass('buy')
                            parent.$('header button').parents().removeClass('buy sell').addClass("buy")

                            parent.$('.order').removeClass('sell')
                            parent.$('.order').fadeIn(300).addClass('buy').find('nav .buy').addClass('now');
                            parent.$('.order button').addClass('buy')
                            parent.$('html').addClass('fixed')
                        }
                    }
                }
                else {
                    iframeQuotes.contentDocument.getElementById(s61.stockIndex + "_cbDealPrice").innerHTML = "-";
                }

                iframeQuotes.contentDocument.getElementById(s61.stockIndex + "_targetDealPrice").innerHTML = ""; //現股成交價
                if (s61.target_deal_price != -999999) {
                    iframeQuotes.contentDocument.getElementById(s61.stockIndex + "_targetDealPrice").innerHTML = color_target + (s61.target_deal_price).toFixed(2) + '</font>';
                }
                else {
                    iframeQuotes.contentDocument.getElementById(s61.stockIndex + "_targetDealPrice").innerHTML = "-";
                }

                iframeQuotes.contentDocument.getElementById(s61.stockIndex + "_cbMovement").innerHTML = ""; //可轉債漲跌
                if (s61.cb_movement != -999999) {
                    if (s61.cb_movement != 0) {
                        iframeQuotes.contentDocument.getElementById(s61.stockIndex + "_cbMovement").innerHTML = color + (s61.cb_movement).toFixed(2) + '</font>';
                    }
                    else {
                        if (s61.cb_deal_price != -999999) {
                            iframeQuotes.contentDocument.getElementById(s61.stockIndex + "_cbMovement").innerHTML = "0";
                        }
                        else {
                            iframeQuotes.contentDocument.getElementById(s61.stockIndex + "_cbMovement").innerHTML = "-";
                        }
                    }
                }
                else {
                    iframeQuotes.contentDocument.getElementById(s61.stockIndex + "_cbMovement").innerHTML = "-";
                }

                iframeQuotes.contentDocument.getElementById(s61.stockIndex + "_cbMovement_percent").innerHTML = ""; //可轉債漲跌幅度(%)
                if (s61.cb_movement_percent != -999999) {
                    if (s61.cb_movement_percent != 0) {
                        iframeQuotes.contentDocument.getElementById(s61.stockIndex + "_cbMovement_percent").innerHTML = color + (s61.cb_movement_percent).toFixed(2) + '%</font>';
                    }
                    else {
                        if (s61.cb_deal_price != -999999) {
                            iframeQuotes.contentDocument.getElementById(s61.stockIndex + "_cbMovement_percent").innerHTML = "0" + '%</font>';
                        }
                        else {
                            iframeQuotes.contentDocument.getElementById(s61.stockIndex + "_cbMovement_percent").innerHTML = "-";
                        }
                    }
                }
                else {
                    iframeQuotes.contentDocument.getElementById(s61.stockIndex + "_cbMovement_percent").innerHTML = "-";
                }

                iframeQuotes.contentDocument.getElementById(s61.stockIndex + "_cbHighPrice").innerHTML = ""; //可轉債最高價
                if (s61.cb_high_price != -999999) {
                    iframeQuotes.contentDocument.getElementById(s61.stockIndex + "_cbHighPrice").innerHTML = (s61.cb_high_price).toFixed(2);
                }
                else {
                    iframeQuotes.contentDocument.getElementById(s61.stockIndex + "_cbHighPrice").innerHTML = "-";
                }

                iframeQuotes.contentDocument.getElementById(s61.stockIndex + "_cbLowPrice").innerHTML = ""; //可轉債最低價
                if (s61.cb_low_price != -999999) {
                    iframeQuotes.contentDocument.getElementById(s61.stockIndex + "_cbLowPrice").innerHTML = (s61.cb_low_price).toFixed(2);
                }
                else {
                    iframeQuotes.contentDocument.getElementById(s61.stockIndex + "_cbLowPrice").innerHTML = "-";
                }

                iframeQuotes.contentDocument.getElementById(s61.stockIndex + "_parity").innerHTML = ""; //parity(%)
                if (s61.parity != -999999) {
                    iframeQuotes.contentDocument.getElementById(s61.stockIndex + "_parity").innerHTML = ((s61.parity) / 100).toFixed(2) + '%';
                }
                else {
                    iframeQuotes.contentDocument.getElementById(s61.stockIndex + "_parity").innerHTML = "-";
                }

                //即時變動 - 閃爍            
                iframeQuotes.contentDocument.getElementById(s61.stockIndex + "_cbDealPrice").className = "nonClass";
                iframeQuotes.contentDocument.getElementById(s61.stockIndex + "_targetDealPrice").className = "nonClass";
                iframeQuotes.contentDocument.getElementById(s61.stockIndex + "_cbMovement").className = "nonClass";
                iframeQuotes.contentDocument.getElementById(s61.stockIndex + "_cbMovement_percent").className = "nonClass";
                iframeQuotes.contentDocument.getElementById(s61.stockIndex + "_cbHighPrice").className = "nonClass";
                iframeQuotes.contentDocument.getElementById(s61.stockIndex + "_cbLowPrice").className = "nonClass";
                iframeQuotes.contentDocument.getElementById(s61.stockIndex + "_parity").className = "nonClass";

                var B_cbDealPrice = s61.cb_deal_price;
                var B_targetDealPrice = s61.target_deal_price;
                var B_cbMovement = s61.cb_movement;
                var B_cbMovement_percent = s61.cb_movement_percent;
                var B_cbHighPrice = s61.cb_high_price;
                var B_cbLowPrice = s61.cb_low_price;
                var B_parity = s61.parity;

                //判斷即時報價區是否完成，完成才跑右下角走勢圖
                if (s61Array[0] - 1 == (s61Array.length / 2) + 1) {
                    TopicS61_flag = true;
                }
            }
            //如果跑完即時報價區才給畫右下走勢圖，右下預設圖為TSEA 並且載入回報
            if (TopicS61_flag == true) {
                //預設給予其祥一KY  12581
                var cbID = 12581;
                var CbInfoObj = (document.getElementById) ? document.getElementById("cbInfo") : document.all("cbInfo");
                if (CbInfoObj.src == "") {
                    CbInfoObj.src = TitleHTML + "cbInfo.html?cbID=" + cbID;
                }

                //default帶TSEA
                var MarketObj = (document.getElementById) ? document.getElementById("MarketInfo") : document.all("MarketInfo");
                if (MarketObj.src == "") {
                    MarketObj.src = TitleHTML + "MarketInfo.html?MarketType=TSEA";
                }

                var Obj = (document.getElementById) ? document.getElementById("DynamicInfo") : document.all("DynamicInfo");
                if (Obj.src == "") {
                    Obj.src = TitleHTML + "DynamicInfo.html";
                }

                $("#loadingImg0, #loadingImg1, #loadingImg2").empty();

                document.getElementById("loadingImg0").style.display = "none";
                document.getElementById("DataUI0").style.display = "block";

                document.getElementById("loadingImg1").style.display = "none";
                if (parent.document.getElementById("tab1").className == "now") {
                    document.getElementById("DataUI1").style.display = "block";
                }
                else {
                    document.getElementById("DataUI1").style.display = "none";
                }

                document.getElementById("loadingImg2").style.display = "none";
                if (parent.document.getElementById("MarketTab1").className == "now") {
                    document.getElementById("DataUI2").style.display = "block";
                }
                else {
                    document.getElementById("DataUI2").style.display = "none";
                }
            }
        } catch (error) {
            AddErrorLog('SetUI_S61 ' + error.toString());
        }
    }

    /*設定S44資料到UI上*/
    this.SetUI_S44 = function (binaryData) {
        try {
            var s44 = new S44(binaryData).toJSON();
            var iframeCBinfo = document.getElementById('cbInfo');
            var cbID = document.getElementById("cbInfo_Name").textContent.split(" ")[2];
            var cbName = document.getElementById("cbInfo_Name").textContent.split(" ")[0];
            var s27_ProductIndex;

            S27_subjectInitialData.some(function (value, index, array) {
                if (cbID == value.stockID) {
                    s27_ProductIndex = value.Index;
                }
            })

            if (s44.ProductIndex == s27_ProductIndex) {
                var Ask1 = s44.Ask1 == 0 ? '-' : (s44.Ask1).toFixed(2)
                var Ask2 = s44.Ask2 == 0 ? '-' : (s44.Ask2).toFixed(2)
                var Ask3 = s44.Ask3 == 0 ? '-' : (s44.Ask3).toFixed(2)
                var Ask4 = s44.Ask4 == 0 ? '-' : (s44.Ask4).toFixed(2)
                var Ask5 = s44.Ask5 == 0 ? '-' : (s44.Ask5).toFixed(2)
                var AskSize1 = s44.AskSize1 == 0 ? '-' : s44.AskSize1
                var AskSize2 = s44.AskSize2 == 0 ? '-' : s44.AskSize2
                var AskSize3 = s44.AskSize3 == 0 ? '-' : s44.AskSize3
                var AskSize4 = s44.AskSize4 == 0 ? '-' : s44.AskSize4
                var AskSize5 = s44.AskSize5 == 0 ? '-' : s44.AskSize5
                var Bid1 = s44.Bid1 == 0 ? '-' : (s44.Bid1).toFixed(2)
                var Bid2 = s44.Bid2 == 0 ? '-' : (s44.Bid2).toFixed(2)
                var Bid3 = s44.Bid3 == 0 ? '-' : (s44.Bid3).toFixed(2)
                var Bid4 = s44.Bid4 == 0 ? '-' : (s44.Bid4).toFixed(2)
                var Bid5 = s44.Bid5 == 0 ? '-' : (s44.Bid5).toFixed(2)
                var BidSize1 = s44.BidSize1 == 0 ? '-' : s44.BidSize1
                var BidSize2 = s44.BidSize2 == 0 ? '-' : s44.BidSize2
                var BidSize3 = s44.BidSize3 == 0 ? '-' : s44.BidSize3
                var BidSize4 = s44.BidSize4 == 0 ? '-' : s44.BidSize4
                var BidSize5 = s44.BidSize5 == 0 ? '-' : s44.BidSize5
                var BidTotal = s44.BidSize1 + s44.BidSize2 + s44.BidSize3 + s44.BidSize4 + s44.BidSize5;
                var AskTotal = s44.AskSize1 + s44.AskSize2 + s44.AskSize3 + s44.AskSize4 + s44.AskSize5;

                if (s44.Ask1 != 0) {
                    iframeCBinfo.contentDocument.getElementById("Ask1").onclick = function () {
                        orderType = "1";
                        parent.document.getElementById("cbOrderName").value = cbID + " " + cbName;
                        parent.document.getElementById("cbOrderName2").value = cbID + " " + cbName;
                        parent.document.getElementById("cbPrice").value = Ask1;
                        parent.document.getElementById("cbPrice2").value = Ask1;
                        parent.document.getElementById("SellDataNo").style.display = "inline";
                        parent.document.getElementById("SellDataNo2").style.display = "inline";
                        parent.document.getElementById("batchBtn2").style.display = "inline";
                        parent.$('nav a').removeClass('now')
                        parent.$('.right button').removeClass('now')
                        parent.$('.right button').removeClass('buy')
                        parent.$('nav a.sell').addClass('now')
                        parent.$('.right button').addClass('sell')
                        parent.$('header button').parents().removeClass('buy sell').addClass('sell')
                        parent.SellDataList(cbID);
                        parent.document.getElementById("SellDataNo2").style.display = "inline";
                        parent.$('.order').fadeIn(300).addClass('sell').find('nav .sell').addClass('now');
                        parent.$('.order button').addClass('sell')
                        parent.$('html').addClass('fixed')
                    }
                }

                if (s44.Ask2 != 0) {
                    iframeCBinfo.contentDocument.getElementById("Ask2").onclick = function () {
                        orderType = "1";
                        parent.document.getElementById("cbOrderName").value = cbID + " " + cbName;
                        parent.document.getElementById("cbOrderName2").value = cbID + " " + cbName;
                        parent.document.getElementById("cbPrice").value = Ask2;
                        parent.document.getElementById("cbPrice2").value = Ask2;
                        parent.document.getElementById("SellDataNo").style.display = "inline";
                        parent.document.getElementById("batchBtn2").style.display = "inline";
                        parent.$('nav a').removeClass('now')
                        parent.$('.right button').removeClass('now')
                        parent.$('.right button').removeClass('buy')
                        parent.$('nav a.sell').addClass('now')
                        parent.$('.right button').addClass('sell')
                        parent.$('header button').parents().removeClass('buy sell').addClass('sell')
                        parent.SellDataList(cbID);
                        parent.document.getElementById("SellDataNo2").style.display = "inline";
                        parent.$('.order').fadeIn(300).addClass('sell').find('nav .sell').addClass('now');
                        parent.$('.order button').addClass('sell')
                        parent.$('html').addClass('fixed')
                    }
                }

                if (s44.Ask3 != 0) {
                    iframeCBinfo.contentDocument.getElementById("Ask3").onclick = function () {
                        orderType = "1";
                        parent.document.getElementById("cbOrderName").value = cbID + " " + cbName;
                        parent.document.getElementById("cbOrderName2").value = cbID + " " + cbName;
                        parent.document.getElementById("cbPrice").value = Ask3;
                        parent.document.getElementById("cbPrice2").value = Ask3;
                        parent.document.getElementById("SellDataNo").style.display = "inline";
                        parent.document.getElementById("batchBtn2").style.display = "inline";
                        parent.$('nav a').removeClass('now')
                        parent.$('.right button').removeClass('now')
                        parent.$('.right button').removeClass('buy')
                        parent.$('nav a.sell').addClass('now')
                        parent.$('.right button').addClass('sell')
                        parent.$('header button').parents().removeClass('buy sell').addClass('sell')
                        parent.SellDataList(cbID);
                        parent.document.getElementById("SellDataNo2").style.display = "inline";
                        parent.$('.order').fadeIn(300).addClass('sell').find('nav .sell').addClass('now');
                        parent.$('.order button').addClass('sell')
                        parent.$('html').addClass('fixed')
                    }
                }

                if (s44.Ask4 != 0) {
                    iframeCBinfo.contentDocument.getElementById("Ask4").onclick = function () {
                        orderType = "1";
                        parent.document.getElementById("cbOrderName").value = cbID + " " + cbName;
                        parent.document.getElementById("cbOrderName2").value = cbID + " " + cbName;
                        parent.document.getElementById("cbPrice").value = Ask4;
                        parent.document.getElementById("cbPrice2").value = Ask4;
                        parent.document.getElementById("SellDataNo").style.display = "inline";
                        parent.document.getElementById("batchBtn2").style.display = "inline";
                        parent.$('nav a').removeClass('now')
                        parent.$('.right button').removeClass('now')
                        parent.$('.right button').removeClass('buy')
                        parent.$('nav a.sell').addClass('now')
                        parent.$('.right button').addClass('sell')
                        parent.$('header button').parents().removeClass('buy sell').addClass('sell')
                        parent.SellDataList(cbID);
                        parent.document.getElementById("SellDataNo2").style.display = "inline";
                        parent.$('.order').fadeIn(300).addClass('sell').find('nav .sell').addClass('now');
                        parent.$('.order button').addClass('sell')
                        parent.$('html').addClass('fixed')
                    }
                }

                if (s44.Ask5 != 0) {
                    iframeCBinfo.contentDocument.getElementById("Ask5").onclick = function () {
                        orderType = "1";
                        parent.document.getElementById("cbOrderName").value = cbID + " " + cbName;
                        parent.document.getElementById("cbOrderName2").value = cbID + " " + cbName;
                        parent.document.getElementById("cbPrice").value = Ask5;
                        parent.document.getElementById("cbPrice2").value = Ask5;
                        parent.document.getElementById("SellDataNo").style.display = "inline";
                        parent.document.getElementById("batchBtn2").style.display = "inline";
                        parent.$('nav a').removeClass('now')
                        parent.$('.right button').removeClass('now')
                        parent.$('.right button').removeClass('buy')
                        parent.$('nav a.sell').addClass('now')
                        parent.$('.right button').addClass('sell')
                        parent.$('header button').parents().removeClass('buy sell').addClass('sell')
                        parent.SellDataList(cbID);
                        parent.document.getElementById("SellDataNo2").style.display = "inline";
                        parent.$('.order').fadeIn(300).addClass('sell').find('nav .sell').addClass('now');
                        parent.$('.order button').addClass('sell')
                        parent.$('html').addClass('fixed')
                    }
                }

                if (s44.Bid1 != 0) {
                    iframeCBinfo.contentDocument.getElementById("Bid1").onclick = function () {
                        orderType = "2";
                        parent.document.getElementById("cbOrderName").value = cbID + " " + cbName;
                        parent.document.getElementById("cbOrderName2").value = cbID + " " + cbName;
                        parent.document.getElementById("cbPrice").value = Bid1;
                        parent.document.getElementById("cbPrice2").value = Bid1;
                        parent.document.getElementById("SellDataNo").style.display = "none";
                        parent.document.getElementById("SellDataNo2").style.display = "none";
                        parent.document.getElementById("batchBtn2").style.display = "none";
                        parent.$('nav a').removeClass('now')// 買賣button
                        parent.$('.right button').removeClass('sell')
                        parent.$('nav a.buy').addClass('now')// 買賣button
                        parent.$('.right button').addClass('buy')
                        parent.$('header button').parents().removeClass('buy sell').addClass('buy')
                        parent.$('.order').removeClass('sell')
                        parent.$('.order').fadeIn(300).addClass('buy').find('nav .buy').addClass('now');
                        parent.$('.order button').addClass('buy')
                        parent.$('html').addClass('fixed')
                    }
                }

                if (s44.Bid2 != 0) {
                    iframeCBinfo.contentDocument.getElementById("Bid2").onclick = function () {
                        orderType = "2";
                        parent.document.getElementById("cbOrderName").value = cbID + " " + cbName;
                        parent.document.getElementById("cbOrderName2").value = cbID + " " + cbName;
                        parent.document.getElementById("cbPrice").value = Bid2;
                        parent.document.getElementById("cbPrice2").value = Bid2;
                        parent.document.getElementById("SellDataNo").style.display = "none";
                        parent.document.getElementById("SellDataNo2").style.display = "none";
                        parent.document.getElementById("batchBtn2").style.display = "none";
                        parent.$('nav a').removeClass('now')
                        parent.$('.right button').removeClass('sell')
                        parent.$('nav a.buy').addClass('now')
                        parent.$('.right button').addClass('buy')
                        parent.$('header button').parents().removeClass('buy sell').addClass('buy')
                        parent.$('.order').removeClass('sell')
                        parent.$('.order').fadeIn(300).addClass('buy').find('nav .buy').addClass('now');
                        parent.$('.order button').addClass('buy')
                        parent.$('html').addClass('fixed')
                    }
                }
                if (s44.Bid3 != 0) {
                    iframeCBinfo.contentDocument.getElementById("Bid3").onclick = function () {
                        orderType = "2";
                        parent.document.getElementById("cbOrderName").value = cbID + " " + cbName;
                        parent.document.getElementById("cbOrderName2").value = cbID + " " + cbName;
                        parent.document.getElementById("cbPrice").value = Bid3;
                        parent.document.getElementById("cbPrice2").value = Bid3;
                        parent.document.getElementById("SellDataNo").style.display = "none";
                        parent.document.getElementById("SellDataNo2").style.display = "none";
                        parent.document.getElementById("batchBtn2").style.display = "none";
                        parent.$('nav a').removeClass('now')
                        parent.$('.right button').removeClass('sell')
                        parent.$('nav a.buy').addClass('now')
                        parent.$('.right button').addClass('buy')
                        parent.$('header button').parents().removeClass('buy sell').addClass('buy')
                        parent.$('.order').removeClass('sell')
                        parent.$('.order').fadeIn(300).addClass('buy').find('nav .buy').addClass('now');
                        parent.$('.order button').addClass('buy')
                        parent.$('html').addClass('fixed')
                    }
                }
                if (s44.Bid4 != 0) {
                    iframeCBinfo.contentDocument.getElementById("Bid4").onclick = function () {
                        orderType = "2";
                        parent.document.getElementById("cbOrderName").value = cbID + " " + cbName;
                        parent.document.getElementById("cbOrderName2").value = cbID + " " + cbName;
                        parent.document.getElementById("cbPrice").value = Bid4;
                        parent.document.getElementById("cbPrice2").value = Bid4;
                        parent.document.getElementById("SellDataNo").style.display = "none";
                        parent.document.getElementById("SellDataNo2").style.display = "none";
                        parent.document.getElementById("batchBtn2").style.display = "none";
                        parent.$('nav a').removeClass('now')
                        parent.$('.right button').removeClass('sell')
                        parent.$('nav a.buy').addClass('now')
                        parent.$('.right button').addClass('buy')
                        parent.$('header button').parents().removeClass('buy sell').addClass('buy')
                        parent.$('.order').removeClass('sell')
                        parent.$('.order').fadeIn(300).addClass('buy').find('nav .buy').addClass('now');
                        parent.$('.order button').addClass('buy')
                        parent.$('html').addClass('fixed')
                    }
                }
                if (s44.Bid5 != 0) {
                    iframeCBinfo.contentDocument.getElementById("Bid5").onclick = function () {
                        orderType = "2";
                        parent.document.getElementById("cbOrderName").value = cbID + " " + cbName;
                        parent.document.getElementById("cbOrderName2").value = cbID + " " + cbName;
                        parent.document.getElementById("cbPrice").value = Bid5;
                        parent.document.getElementById("cbPrice2").value = Bid5;
                        parent.document.getElementById("SellDataNo").style.display = "none";
                        parent.document.getElementById("SellDataNo2").style.display = "none";
                        parent.document.getElementById("batchBtn2").style.display = "none";
                        parent.$('nav a').removeClass('now')
                        parent.$('.right button').removeClass('sell')
                        parent.$('nav a.buy').addClass('now')
                        parent.$('.right button').addClass('buy')
                        parent.$('header button').parents().removeClass('buy sell').addClass('buy')
                        parent.$('.order').removeClass('sell')
                        parent.$('.order').fadeIn(300).addClass('buy').find('nav .buy').addClass('now');
                        parent.$('.order button').addClass('buy')
                        parent.$('html').addClass('fixed')
                    }
                }

                iframeCBinfo.contentDocument.getElementById('cbID_Lable').innerHTML = "";
                iframeCBinfo.contentDocument.getElementById('cbID_Lable').innerHTML = "( " + cbID + " )";

                iframeCBinfo.contentDocument.getElementById('cbID_Text').innerHTML = "";
                iframeCBinfo.contentDocument.getElementById('cbID_Text').innerHTML = cbID + "五檔報價";

                iframeCBinfo.contentDocument.getElementById('Ask1').innerHTML = "";
                iframeCBinfo.contentDocument.getElementById('Ask1').innerHTML = Ask1;

                iframeCBinfo.contentDocument.getElementById('Ask2').innerHTML = "";
                iframeCBinfo.contentDocument.getElementById('Ask2').innerHTML = Ask2;

                iframeCBinfo.contentDocument.getElementById('Ask3').innerHTML = "";
                iframeCBinfo.contentDocument.getElementById('Ask3').innerHTML = Ask3;

                iframeCBinfo.contentDocument.getElementById("Ask4").innerHTML = "";
                iframeCBinfo.contentDocument.getElementById("Ask4").innerHTML = Ask4;

                iframeCBinfo.contentDocument.getElementById("Ask5").innerHTML = "";
                iframeCBinfo.contentDocument.getElementById("Ask5").innerHTML = Ask5;

                iframeCBinfo.contentDocument.getElementById('AskSize1').innerHTML = "";
                iframeCBinfo.contentDocument.getElementById('AskSize1').innerHTML = AskSize1;

                iframeCBinfo.contentDocument.getElementById('AskSize2').innerHTML = "";
                iframeCBinfo.contentDocument.getElementById('AskSize2').innerHTML = AskSize2;

                iframeCBinfo.contentDocument.getElementById('AskSize3').innerHTML = "";
                iframeCBinfo.contentDocument.getElementById('AskSize3').innerHTML = AskSize3;

                iframeCBinfo.contentDocument.getElementById('AskSize4').innerHTML = "";
                iframeCBinfo.contentDocument.getElementById('AskSize4').innerHTML = AskSize4;

                iframeCBinfo.contentDocument.getElementById('AskSize5').innerHTML = "";
                iframeCBinfo.contentDocument.getElementById('AskSize5').innerHTML = AskSize5;

                iframeCBinfo.contentDocument.getElementById('Bid1').innerHTML = "";
                iframeCBinfo.contentDocument.getElementById('Bid1').innerHTML = Bid1;

                iframeCBinfo.contentDocument.getElementById('Bid2').innerHTML = "";
                iframeCBinfo.contentDocument.getElementById('Bid2').innerHTML = Bid2;

                iframeCBinfo.contentDocument.getElementById('Bid3').innerHTML = "";
                iframeCBinfo.contentDocument.getElementById('Bid3').innerHTML = Bid3;

                iframeCBinfo.contentDocument.getElementById('Bid4').innerHTML = "";
                iframeCBinfo.contentDocument.getElementById('Bid4').innerHTML = Bid4;

                iframeCBinfo.contentDocument.getElementById('Bid5').innerHTML = "";
                iframeCBinfo.contentDocument.getElementById('Bid5').innerHTML = Bid5;

                iframeCBinfo.contentDocument.getElementById('BidSize1').innerHTML = "";
                iframeCBinfo.contentDocument.getElementById('BidSize1').innerHTML = BidSize1;

                iframeCBinfo.contentDocument.getElementById('BidSize2').innerHTML = "";
                iframeCBinfo.contentDocument.getElementById('BidSize2').innerHTML = BidSize2;

                iframeCBinfo.contentDocument.getElementById('BidSize3').innerHTML = "";
                iframeCBinfo.contentDocument.getElementById('BidSize3').innerHTML = BidSize3;

                iframeCBinfo.contentDocument.getElementById('BidSize4').innerHTML = "";
                iframeCBinfo.contentDocument.getElementById('BidSize4').innerHTML = BidSize4;

                iframeCBinfo.contentDocument.getElementById('BidSize5').innerHTML = "";
                iframeCBinfo.contentDocument.getElementById('BidSize5').innerHTML = BidSize5;

                iframeCBinfo.contentDocument.getElementById('BidTotal').innerHTML = "";
                iframeCBinfo.contentDocument.getElementById('BidTotal').innerHTML = "( " + BidTotal + " )";

                iframeCBinfo.contentDocument.getElementById('AskTotal').innerHTML = "";
                iframeCBinfo.contentDocument.getElementById('AskTotal').innerHTML = "( " + AskTotal + " )";
            }
        } catch (error) {
            AddErrorLog('SetUI_S44 ' + error.toString());
        }
    }

    this.SetUI_R03 = function (binaryData) {
        try {            
            var r03 = new R03(binaryData).toJSON();
            var DealTime = "";
            var TradeType = "";
            var DealLotType = "";
            var BS = "";
            var flag = "";
            var flag2 = "";
            var cbID_1 = "";
            var cbID = "";
            var CustName_1 = "";
            var CustName = "";
            var Status = "";
            var BSstyle = "";
            var tr_BSstyle = "";
            var ShowDealTime = parseInt(r03.DealTime);

            //CB ID
            flag = S60_cbInitialData.some(function (value, index, array) {
                cbID_1 = value.cbName;
                return value.cbID == r03.TradeProductNo ? true : false;                
            })
            if (flag != false) {
                cbID = cbID_1;
            }
            else {
                cbID = r03.TradeProductNo;
            }
            //客戶名字
            flag2 = CustAcnoData.some(function (value, index, array) {
                CustName_1 = value.Name;
                return value.Acno == r03.TradeAcno ? true : false;
            })
            if (flag2 != false) {
                CustName = CustName_1;
            }
            else {
                CustName = r03.TradeAcno;
            }

            if (r03.DealTime.length == 6) {
                DealTime = r03.DealTime[0] + r03.DealTime[1] + ":" + r03.DealTime[2] + r03.DealTime[3] + ":" + r03.DealTime[4] + r03.DealTime[5];
            }
            else {
                DealTime = "TimeError";
            }

            if (r03.BuySell == 'B') {
                BS = "買進";
                BSstyle = 'style="color:#FF0000;font-weight:bold"';
                tr_BSstyle = '<tr style="background:#FFF7F7">';
            }
            else {
                BS = "賣出";
                BSstyle = 'style="color:#339900;font-weight:bold"';
                tr_BSstyle = '<tr style="background:#ECFAE8">';
            }

            if (r03.ReturnErrorTag == 'N') {
                Status = "成功";
            }
            else if (r03.ReturnErrorTag == null) {
                Status = "成功";
            }
            else {
                Status = "失敗";
            }

            var iframeDynamicInfo = document.getElementById('DynamicInfo');

            //委託回報
            if (r03.ReturnType == 'O') {
                if (r03.ReturnTradeType == 'N') {
                    TradeType = "委託";
                }
                else if (r03.ReturnTradeType == 'C') {
                    TradeType = "刪單";
                }
                else if (r03.ReturnTradeType == 'U') {
                    TradeType = "改量";
                }
                else if (r03.ReturnTradeType == 'P') {
                    if (Status == "成功") {
                        if (r03.pre_OrderVolume == 0) {
                            TradeType = "刪單";
                        }
                        else if (r03.pre_OrderVolume != 0) {
                            TradeType = "改價";
                            ShowDealTime = parseInt(r03.DealTime) + 10;
                        }
                    }
                    else {
                        TradeType = "改價";
                    }
                }
                iframeDynamicInfo.contentDocument.getElementById('reportTbody').innerHTML += tr_BSstyle + '<td style="display:none;">' + ShowDealTime + '</td>'
                        + '<td>' + DealTime + '</td>'
                        + '<td>' + Status + '</td>'
                        + '<td>' + TradeType + '</td>'
                        + '<td ' + BSstyle + '>' + BS + '</td>'
                        + '<td>' + cbID + '</td>'
                        + '<td>' + parseFloat(r03.OrderPrice).toFixed(2) + '</td>'
                        + '<td>' + (r03.OrderLot) / 1000 + '</td>'
                        + '<td>' + CustName + '</td>'
                        + '<td>' + r03.OrderNo + '</td>'
                    + '</tr>'
            }

            //成交回報
            if (r03.ReturnType == 'D') {
                if (r03.ReturnTradeType == 'N') {
                    TradeType = "委託";
                }
                else if (r03.ReturnTradeType == 'C') {
                    TradeType = "刪單";
                }
                else if (r03.ReturnTradeType == 'U') {
                    TradeType = "改量";
                }
                else if (r03.ReturnTradeType == 'P') {
                    TradeType = "改價";
                }

                if (parseInt(r03.nonDealLot) > 0) {
                    DealLotType = "部分";
                    Status = "成交";
                }
                else if (parseInt(r03.nonDealLot) == 0) {
                    DealLotType = "全部";
                    Status = "成交";
                }

                iframeDynamicInfo.contentDocument.getElementById('reportTbody').innerHTML += tr_BSstyle + '<td style="display:none;">' + parseInt(r03.DealTime) + '</td>'
                        + '<td>' + DealTime + '</td>'
                        + '<td>' + DealLotType + Status + '</td>'
                        + '<td>' + TradeType + '</td>'
                        + '<td ' + BSstyle + '>' + BS + '</td>'
                        + '<td>' + cbID + '</td>'
                        + '<td>' + parseFloat(r03.DealPrice).toFixed(2) + '</td>'
                        + '<td>' + (r03.DealLot) / 1000 + '</td>'
                        + '<td>' + CustName + '</td>'
                        + '<td>' + r03.OrderNo + '</td>'
                    + '</tr>'
            }

            iframeDynamicInfo.contentWindow.sorter.sortBy('item');

            if (parent.DynamicChangeFlag == true) {
                var Obj = (document.getElementById) ? document.getElementById("Commissioned") : document.all("Commissioned");
                Obj.src = TitleHTML + "Commissioned.html";
            }            

        } catch (error) {
            AddErrorLog('SetUI_R03 ' + error.toString());
        }
    }

    //--------------------------------------------------------------004--------------------------------------------------------------
    
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
}).apply(UI);

//--------------------------------------------------------------005--------------------------------------------------------------
$(function () {
    $(Solace).on(Solace.Events.OnConnected, function () {
        SolaceInitial(); //基本資料        
        SubjectInfoInitial(); //現股資訊-基本資料
        //SubjectInfoInitial_S36(); //現貨資訊 - 即時報價
        //initial();
        //DynamicInitial(); //回報資料
        //MySolace.SubscribeSocache("R201/SELF0082/O"); //註冊委託
        //MySolace.SubscribeSocache("R201/SELF0082/D"); //註冊委託
    });
    Solace.Connect();
}); 