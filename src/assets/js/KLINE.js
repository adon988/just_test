var UI = UI || {};
var S53data = [];
var S53dataT = [];
var S53dataO = [];
var S53dataH = [];
var S53dataL = [];
var S53dataC = [];
var S53dataSize = [];
var S53dataSize_T = [];
var S53dataSize_5MA = [];
//var S53dataSize_All = [];
var S53dataSize_D = [];
var S53dataSize_5MA_Sort = [];
var S53dataSize_5MA_Sort_t = [];
var S53dataSize_5MA_H = [];
var S53dataSize_5MA_L = [];
var S53dataSize_D_ALL = [];
var topicS4DFinish = false;
var topicS53Finish = false;
var QtyForce = [];
var DealForce = [];
var OrderForce = [];
var DeffSize = [];
var Wdata = [];
var WdataSize = [];
var Wdata_High = [];
var WdataSize_High = [];
var MarketSize = [];
var MarketSize_Sort = [];
var MarketSize_Total = [];
var Total_Size = 0;

//畫分K、5分K整理與畫圖
function drawKline(K_Par, Status, Data_Source, datetime) {
    if (Data_Source.Open == '-99999900' || Data_Source.High == '-99999900' || Data_Source.Low == '-99999900' || Data_Source.Close == '-99999900') {
    }
    else {
        if (Status == 'syn') {
            var index = Highcharts.charts[Highcharts.charts.length - 1].series[0].data.length - 1;
            var Kline = Highcharts.charts[Highcharts.charts.length - 1].series[0].data[index];

            if (S53dataO.length == 0) {
                S53dataO.push(Data_Source.Open * 0.01);
            }
            S53dataH.push(Data_Source.High * 0.01);
            S53dataL.push(Data_Source.Low * 0.01);

            S53dataH.sort(function (a, b) { return b - a; });
            S53dataL.sort(function (a, b) { return b - a; });
            //刪除小於0
            for (var i = 1 ; i <= S53dataL.length; i++) {
                if (S53dataL[S53dataL.length - 1] < 0) {
                    S53dataL.pop();
                }
                else {
                    S53dataL.sort(function (a, b) { return a - b; });
                    break;
                }
            }

            if (K_Par == 'T') {
                if (datetime > Kline.x) {
                    if (datetime < S53data[S53data.length - 1][0]) {
                    }
                    else {
                        if (S53dataSize_T.length > 2) {
                            if (S53dataSize_T[S53dataSize_T.length - 1][0] == S53dataSize_T[S53dataSize_T.length - 2][0]) {
                                S53dataSize_T.pop();
                                Highcharts.charts[Highcharts.charts.length - 1].series[0].addPoint([datetime, S53dataO[0], S53dataH[0], S53dataL[0], Data_Source.Close * 0.01]);
                            }
                            else {
                                Highcharts.charts[Highcharts.charts.length - 1].series[0].addPoint([datetime, S53dataO[0], S53dataH[0], S53dataL[0], Data_Source.Close * 0.01]);
                            }
                        }
                    }
                    S53dataO.length = 0;
                    S53dataH.length = 0;
                    S53dataL.length = 0;
                }
                else if (datetime < Kline.x) {
                }
                else {
                    if (Data_Source.High * 0.01 == S53dataH[0] && Data_Source.Low * 0.01 == S53dataL[0] && Data_Source.Close * 0.01 == S53dataSize_T[S53dataSize_T.length - 1][4]) {
                    }
                    else {
                        Highcharts.charts[Highcharts.charts.length - 1].series[0].data[index].update([datetime, S53dataO[0], S53dataH[0], S53dataL[0], Data_Source.Close * 0.01]);
                    }
                }
            }
            else if (K_Par == '5') {
                var LastTime, kline, LastTime1, kline1;
                S53dataSize_5MA_Sort_t.push([datetime, Data_Source.Open * 0.01, Data_Source.High * 0.01, Data_Source.Low * 0.01, Data_Source.Close * 0.01, Data_Source.Time]);
                LastTime = PadLeft(S53dataSize_5MA_Sort_t[0][5].toString(), 6);
                LastTime = LastTime.substring(3, 4);
                LastTime1 = PadLeft(S53dataSize_5MA_Sort_t[S53dataSize_5MA_Sort_t.length - 1][5].toString(), 6);
                LastTime1 = LastTime1.substring(3, 4);

                switch (LastTime) {
                    case '0':
                    case '5':
                        kline = 300000;
                        break;
                    case '1':
                    case '6':
                        kline = 240000;
                        break;
                    case '2':
                    case '7':
                        kline = 180000;
                        break;
                    case '3':
                    case '8':
                        kline = 120000;
                        break;
                    case '4':
                    case '9':
                        kline = 60000;
                        break;
                    default:
                        kline = 300000;
                        break;
                }

                switch (LastTime1) {
                    case '0':
                    case '5':
                        kline1 = 300000;
                        break;
                    case '1':
                    case '6':
                        kline1 = 240000;
                        break;
                    case '2':
                    case '7':
                        kline1 = 180000;
                        break;
                    case '3':
                    case '8':
                        kline1 = 120000;
                        break;
                    case '4':
                    case '9':
                        kline1 = 60000;
                        break;
                    default:
                        kline1 = 300000;
                        break;
                }

                if (S53dataSize_5MA_Sort_t[0][5] == '84600') {
                    //第一筆
                    if (S53dataSize_5MA[S53dataSize_5MA.length - 1][0] + 6000000 < datetime) {
                        S53dataSize_5MA.push([datetime, Data_Source.Open * 0.01, Data_Source.High * 0.01, Data_Source.Low * 0.01, Data_Source.Close * 0.01]);
                        Highcharts.charts[Highcharts.charts.length - 1].series[0].addPoint([datetime + 240000, Data_Source.Open * 0.01, Data_Source.High * 0.01, Data_Source.Low * 0.01, Data_Source.Close * 0.01]);
                    }
                    if (datetime >= Kline.x) {
                        Highcharts.charts[Highcharts.charts.length - 1].series[0].addPoint([datetime + kline1, S53dataO[0], S53dataH[0], S53dataL[0], Data_Source.Close * 0.01]);
                        S53dataSize_5MA_Sort_t.length = 0;
                        S53dataO.length = 0;
                        S53dataH.length = 0;
                        S53dataL.length = 0;
                    }
                    else {
                        Highcharts.charts[Highcharts.charts.length - 1].series[0].data[index].update([S53dataSize_5MA[S53dataSize_5MA.length - 1][0] + 240000, S53dataO[0], S53dataH[0], S53dataL[0], Data_Source.Close * 0.01]);
                    }
                }
                else {
                    if (datetime - 60000 >= Kline.x) {
                        /*
                        if (getCookie('Last_Trading') == '3') {
                            if (Data_Source.Time > '132900') {
                            }
                            else {
                                Highcharts.charts[Highcharts.charts.length - 1].series[0].addPoint([datetime + kline1, S53dataO[0], S53dataH[0], S53dataL[0], Data_Source.Close * 0.01]);
                                S53dataSize_5MA_Sort_t.length = 0;
                                S53dataO.length = 0;
                                S53dataH.length = 0;
                                S53dataL.length = 0;
                            }
                        }
                        else if (getCookie('Last_Trading') == '1') {
                            if (Data_Source.Time > '134400') {
                            }
                            else {
                                Highcharts.charts[Highcharts.charts.length - 1].series[0].addPoint([datetime + kline1, S53dataO[0], S53dataH[0], S53dataL[0], Data_Source.Close * 0.01]);
                                S53dataSize_5MA_Sort_t.length = 0;
                                S53dataO.length = 0;
                                S53dataH.length = 0;
                                S53dataL.length = 0;
                            }
                        }
                        */

                        if (Data_Source.Time > '134400') {
                        }
                        else {
                            Highcharts.charts[Highcharts.charts.length - 1].series[0].addPoint([datetime + kline1, S53dataO[0], S53dataH[0], S53dataL[0], Data_Source.Close * 0.01]);
                            S53dataSize_5MA_Sort_t.length = 0;
                            S53dataO.length = 0;
                            S53dataH.length = 0;
                            S53dataL.length = 0;
                        }

                    }
                    else {
                        Highcharts.charts[Highcharts.charts.length - 1].series[0].data[index].update([S53dataSize_5MA[S53dataSize_5MA.length - 1][0], S53dataO[0], S53dataH[0], S53dataL[0], Data_Source.Close * 0.01]);
                    }
                }
            }
        }
        else if (Status == 'unsyn') {
            if (K_Par == 'T') {
                if (S53dataSize_T.length >= 2) {
                    if (S53dataSize_T[S53dataSize_T.length - 1][0] <= S53dataSize_T[S53dataSize_T.length - 2][0]) {
                        S53dataSize_T.pop();
                    }

                    if (datetime <= S53dataSize_T[S53dataSize_T.length - 1][0]) {
                    }
                    else {
                        if (datetime <= S53dataSize_T[S53dataSize_T.length - 1][0]) {
                        }
                        else {
                            S53dataSize_T.push([datetime, Data_Source.Open * 0.01, Data_Source.High * 0.01, Data_Source.Low * 0.01, Data_Source.Close * 0.01]);
                        }
                    }
                }
                else {
                    S53dataSize_T.push([datetime, Data_Source.Open * 0.01, Data_Source.High * 0.01, Data_Source.Low * 0.01, Data_Source.Close * 0.01]);
                }
            }
            else if (K_Par == '5') {
                if (S53dataSize_5MA_Sort.length == 0) {
                    if (S53dataSize_5MA.length == 0) {
                        S53dataSize_5MA_Sort.push([datetime, Data_Source.Open * 0.01, Data_Source.High * 0.01, Data_Source.Low * 0.01, Data_Source.Close * 0.01, Data_Source.Time]);
                        S53dataSize_5MA_H.push(S53dataSize_5MA_Sort[S53dataSize_5MA_Sort.length - 1][2]);
                        S53dataSize_5MA_L.push(S53dataSize_5MA_Sort[S53dataSize_5MA_Sort.length - 1][3]);
                    }
                    else {
                        if (datetime < S53dataSize_5MA[S53dataSize_5MA.length - 1][0]) {
                        }
                        else {
                            S53dataSize_5MA_Sort.push([datetime, Data_Source.Open * 0.01, Data_Source.High * 0.01, Data_Source.Low * 0.01, Data_Source.Close * 0.01, Data_Source.Time]);
                            S53dataSize_5MA_H.push(S53dataSize_5MA_Sort[S53dataSize_5MA_Sort.length - 1][2]);
                            S53dataSize_5MA_L.push(S53dataSize_5MA_Sort[S53dataSize_5MA_Sort.length - 1][3]);
                        }
                    }
                }
                else if (S53dataSize_5MA_Sort.length <= 5) {
                    if (datetime <= S53dataSize_5MA_Sort[S53dataSize_5MA_Sort.length - 1][0]) {
                        S53dataSize_5MA_Sort.pop();
                        S53dataSize_5MA_H.pop();
                        S53dataSize_5MA_L.pop();

                        S53dataSize_5MA_Sort.push([datetime, Data_Source.Open * 0.01, Data_Source.High * 0.01, Data_Source.Low * 0.01, Data_Source.Close * 0.01, Data_Source.Time]);
                        S53dataSize_5MA_H.push(S53dataSize_5MA_Sort[S53dataSize_5MA_Sort.length - 1][2]);
                        S53dataSize_5MA_L.push(S53dataSize_5MA_Sort[S53dataSize_5MA_Sort.length - 1][3]);
                    }
                    else {
                        S53dataSize_5MA_Sort.push([datetime, Data_Source.Open * 0.01, Data_Source.High * 0.01, Data_Source.Low * 0.01, Data_Source.Close * 0.01, Data_Source.Time]);
                        S53dataSize_5MA_H.push(S53dataSize_5MA_Sort[S53dataSize_5MA_Sort.length - 1][2]);
                        S53dataSize_5MA_L.push(S53dataSize_5MA_Sort[S53dataSize_5MA_Sort.length - 1][3]);
                        S53dataSize_5MA_Sort.sort();

                        var LastTime, kline, LastTime1, Firstdatetime;
                        LastTime = PadLeft(S53dataSize_5MA_Sort[0][5].toString(), 6);
                        LastTime = LastTime.substring(3, 4);

                        LastTime1 = PadLeft(S53dataSize_5MA_Sort[S53dataSize_5MA_Sort.length - 1][5].toString(), 6);
                        LastTime1 = LastTime1.substring(3, 4);

                        switch (LastTime) {
                            case '0':
                            case '5':
                                kline = 300000;
                                break;
                            case '1':
                            case '6':
                                kline = 240000;
                                break;
                            case '2':
                            case '7':
                                kline = 180000;
                                break;
                            case '3':
                            case '8':
                                kline = 120000;
                                break;
                            case '4':
                            case '9':
                                kline = 60000;
                                break;
                            default:
                                kline = 300000;
                                break;
                        }

                        if (S53dataSize_5MA_Sort[S53dataSize_5MA_Sort.length - 1][0] > S53dataSize_5MA_Sort[0][0] + kline) {
                            S53dataSize_5MA_Sort.pop();
                        }

                        S53dataSize_5MA_Sort.sort();


                        if (S53dataSize_5MA_Sort[0][5] < '85000') {
                            Firstdatetime = 240000;
                        }
                        else {
                            Firstdatetime = 300000;
                        }

                        if (LastTime1 == 4 || LastTime1 == 9) {
                            var datetime1, S53_5MA_Open, S53_5MA_High, S53_5MA_Low, S53_5MA_Close;

                            datetime1 = S53dataSize_5MA_Sort[0][0];
                            S53_5MA_Open = S53dataSize_5MA_Sort[0][1];

                            S53dataSize_5MA_H.sort(function (a, b) { return b - a; });
                            S53_5MA_High = S53dataSize_5MA_H[0],

                            S53dataSize_5MA_L.sort(function (a, b) { return a - b; });
                            S53_5MA_Low = S53dataSize_5MA_L[0];

                            S53_5MA_Close = S53dataSize_5MA_Sort[S53dataSize_5MA_Sort.length - 1][4];

                            if (S53dataSize_5MA.length == 0) {
                                S53dataSize_5MA.push([datetime1 + Firstdatetime, S53_5MA_Open, S53_5MA_High, S53_5MA_Low, S53_5MA_Close]);
                            }
                            else {
                                if (datetime1 + Firstdatetime < S53dataSize_5MA[S53dataSize_5MA.length - 1][0]) {
                                }
                                else {
                                    S53dataSize_5MA.push([datetime1 + Firstdatetime, S53_5MA_Open, S53_5MA_High, S53_5MA_Low, S53_5MA_Close]);
                                }
                            }

                            if (S53dataSize_5MA.length >= 2) {
                                if (S53dataSize_5MA[S53dataSize_5MA.length - 1][0] == S53dataSize_5MA[S53dataSize_5MA.length - 2][0]) {
                                    S53dataSize_5MA.pop();
                                }
                            }
                            //清除陣列
                            S53dataSize_5MA_Sort.length = 0;
                            S53dataSize_5MA_H.length = 0;
                            S53dataSize_5MA_L.length = 0;
                        }
                    }
                }
            }
            else {
            }
        }
        else {
        }
    }
}

//畫日K、週K、月K
function drawD(K_Par, Status, Data_Source, datetrans, datetime) {
    if (Data_Source.Open == '-99999900' || Data_Source.High == '-99999900' || Data_Source.Low == '-99999900' || Data_Source.Close == '-99999900') {
    }
    else {
        var S53datetime;
        S53dataSize_D_ALL.push(datetime, Data_Source.Close * 0.01);

        if (K_Par == 'D') {
            if (S53dataO.length == 0) {
                S53dataO.push(Data_Source.Open * 0.01);
            }

            S53dataH.push(Data_Source.High * 0.01);
            S53dataL.push(Data_Source.Low * 0.01);
        }
        else if (K_Par == 'W') {
            var TodayWeek, ThisWeek, ThisWeek_datetime, dayNum;
            ThisWeek_datetime = S53data[S53data.length - 1][0];
            ThisWeek_datetime = ThisWeek_datetime - 28800000;
            ThisWeek = new Date(ThisWeek_datetime);

            switch (ThisWeek.getDay()) {
                case 1:
                    dayNum = 86400000 * 6;
                    break;
                case 2:
                    dayNum = 86400000 * 5;
                    break;
                case 3:
                    dayNum = 86400000 * 4;
                    break;
                case 4:
                    dayNum = 86400000 * 3;
                    break;
                case 5:
                    dayNum = 86400000 * 2;
                    break;
                case 6:
                    dayNum = 86400000 * 1;
                    break;
                default:
                    dayNum = 86400000 * 5;
            }

            ThisWeek_datetime = ThisWeek_datetime + dayNum;

            if (datetime - 28800000 > ThisWeek_datetime) {
                //第一天
                if (S53dataO.length == 0) {
                    S53dataO.push(Data_Source.Open * 0.01);
                }
                S53dataH.push(Data_Source.High * 0.01);
                S53dataL.push(Data_Source.Low * 0.01);
            }
            else {
                if (S53dataO.length == 0) {
                    //將同一個月的資料寫入
                    S53dataT.push(S53data[S53data.length - 1][0]);
                    S53dataO.push(S53data[S53data.length - 1][1]);
                    S53dataH.push(S53data[S53data.length - 1][2]);
                    S53dataL.push(S53data[S53data.length - 1][3]);
                }
                S53dataH.push(Data_Source.High * 0.01);
                S53dataL.push(Data_Source.Low * 0.01);
            }
        }
        else if (K_Par == 'M') {
            var TodayMonth, ThisMonth, ThisMonth_datetime;
            ThisMonth_datetime = S53data[S53data.length - 1][0];
            ThisMonth_datetime = ThisMonth_datetime - 28800000;
            ThisMonth = new Date(ThisMonth_datetime).format("mm");
            datetime = datetime - 28800000
            TodayMonth = new Date(datetime).format("mm");

            if (ThisMonth == TodayMonth) {
                if (S53dataO.length == 0) {
                    //將同一個月的資料寫入
                    S53dataT.push(S53data[S53data.length - 1][0]);
                    S53dataO.push(S53data[S53data.length - 1][1]);
                    S53dataH.push(S53data[S53data.length - 1][2]);
                    S53dataL.push(S53data[S53data.length - 1][3]);
                }
                S53dataH.push(Data_Source.High * 0.01);
                S53dataL.push(Data_Source.Low * 0.01);
            }
            else {
                if (S53dataO.length == 0) {
                    S53dataO.push(Data_Source.Open * 0.01);
                }
                S53dataH.push(Data_Source.High * 0.01);
                S53dataL.push(Data_Source.Low * 0.01);
            }
        }

        if (Status == 'syn') {
            if (K_Par == 'D') {
                if (S53dataSize_D_ALL[0] == Data_Source.Close * 0.01) {
                }
                else {
                    var index = Highcharts.charts[Highcharts.charts.length - 1].series[0].data.length - 1;
                    S53dataH.sort(function (a, b) { return b - a; });
                    S53dataL.sort(function (a, b) { return b - a; });
                    //刪除小於0
                    for (var i = 1 ; i <= S53dataL.length; i++) {
                        if (S53dataL[S53dataL.length - 1] < 0) {
                            S53dataL.pop();
                        }
                        else {
                            S53dataL.sort(function (a, b) { return a - b; });
                            break;
                        }
                    }
                    if (S53dataSize_D[S53dataSize_D.length - 1][0] < datetrans) {
                        Highcharts.charts[Highcharts.charts.length - 1].series[0].addPoint([datetrans, S53dataO[0], S53dataH[0], S53dataL[0], Data_Source.Close * 0.01]);
                    }
                    else {
                        Highcharts.charts[Highcharts.charts.length - 1].series[0].data[index].update([datetrans, S53dataO[0], S53dataH[0], S53dataL[0], Data_Source.Close * 0.01]);
                    }

                    S53dataSize_D_ALL.length = 0;
                }
            }
            else if (K_Par == 'W' || K_Par == 'M') {
                var index = Highcharts.charts[Highcharts.charts.length - 1].series[0].data.length - 1;
                if (S53dataT.length > 0) {
                    S53datetime = S53dataT[0];
                }
                else {
                    S53datetime = datetrans;
                }

                S53dataH.sort(function (a, b) { return b - a; });
                S53dataL.sort(function (a, b) { return b - a; });
                //刪除小於0
                for (var i = 1 ; i <= S53dataL.length; i++) {
                    if (S53dataL[S53dataL.length - 1] < 0) {
                        S53dataL.pop();
                    }
                    else {
                        S53dataL.sort(function (a, b) { return a - b; });
                        break;
                    }
                }
                if (K_Par == 'W') {
                    if (datetime - 28800000 > ThisWeek_datetime) {
                        Highcharts.charts[Highcharts.charts.length - 1].series[0].addPoint([S53datetime, S53dataO[0], S53dataH[0], S53dataL[0], Data_Source.Close * 0.01]);
                    }
                    else {
                        Highcharts.charts[Highcharts.charts.length - 1].series[0].data[index].update([S53datetime, S53dataO[0], S53dataH[0], S53dataL[0], Data_Source.Close * 0.01]);
                    }
                }
                else if (K_Par == 'M') {
                    if (ThisMonth == TodayMonth) {
                        Highcharts.charts[Highcharts.charts.length - 1].series[0].data[index].update([S53datetime, S53dataO[0], S53dataH[0], S53dataL[0], Data_Source.Close * 0.01]);
                    }
                    else {
                        Highcharts.charts[Highcharts.charts.length - 1].series[0].addPoint([S53datetime, S53dataO[0], S53dataH[0], S53dataL[0], Data_Source.Close * 0.01]);
                    }
                }
                if (S53data.length >= 2) {
                    if (S53data[S53data.length - 1][0] == S53data[S53data.length - 2][0]) {
                        S53data.pop();
                    }
                }
                S53dataSize_D_ALL.length = 0;
            }
            else {
            }
        }
        else if (Status == 'unsyn') {
            if (K_Par == 'D') {
                if (S53dataSize_D[S53dataSize_D.length - 1][0] == datetrans) {
                    S53dataSize_D.pop();
                }

                S53dataH.sort(function (a, b) { return b - a; });
                S53dataL.sort(function (a, b) { return b - a; });
                //刪除小於0
                for (var i = 1 ; i <= S53dataL.length; i++) {
                    if (S53dataL[S53dataL.length - 1] < 0) {
                        S53dataL.pop();
                    }
                    else {
                        S53dataL.sort(function (a, b) { return a - b; });
                        break;
                    }
                }

                S53dataSize_D.push([datetrans, S53dataO[0], S53dataH[0], S53dataL[0], Data_Source.Close * 0.01]);
            }
            else if (K_Par == 'W' || K_Par == 'M') {
                if (S53data[S53data.length - 1][0] == datetrans) {
                    S53data.pop();
                }
                if (S53dataT.length > 0) {
                    S53datetime = S53dataT[0];
                }
                else {
                    S53datetime = datetrans;
                }

                S53dataH.sort(function (a, b) { return b - a; });
                S53dataL.sort(function (a, b) { return b - a; });
                //刪除小於0
                for (var i = 1 ; i <= S53dataL.length; i++) {
                    if (S53dataL[S53dataL.length - 1] < 0) {
                        S53dataL.pop();
                    }
                    else {
                        S53dataL.sort(function (a, b) { return a - b; });
                        break;
                    }
                }

                S53data.push([S53datetime, S53dataO[0], S53dataH[0], S53dataL[0], Data_Source.Close * 0.01]);

                if (S53data.length >= 2) {
                    if (S53data[S53data.length - 1][0] == S53data[S53data.length - 2][0]) {
                        S53data.pop();
                    }
                }
            }
            else {
            }
        }
        else {
        }
    }
}

//設定CSS
function getCssColor(num) {
    var rise_color, fall_color, middle_color;
    rise_color = '#D10000';
    fall_color = '#008F00';
    middle_color = '#6E6E6E';
    if (num > 0) {
        //漲
        return 'color:' + rise_color;
    }
    else if (num == 0) {
        //中間
        return 'color:' + middle_color;
    }
    else {
        //跌
        return 'color:' + fall_color;
    }
}

//時間設定
function timeCompare() {
    //IE日期格式不能使用 2010-01-01格式 必須要使用 2010/01/01格式
    var today = new Date();
    var close_time_r, Last_Trading;

    if (getCookie('Last_Trading') == '') {
        Last_Trading = '1';
    }
    else {
        Last_Trading = getCookie('Last_Trading');
    }

    var clear_time = today.getFullYear() + "/" + (today.getMonth() + 1) + "/" + today.getDate() + " " + "05:00:00";
    var open_time = today.getFullYear() + "/" + (today.getMonth() + 1) + "/" + today.getDate() + " " + "08:30:00";

    if (Last_Trading == '1') {
        close_time_r = today.getFullYear() + "/" + (today.getMonth() + 1) + "/" + today.getDate() + " " + "13:45:00";
    }
    else if (Last_Trading == '3') {
        close_time_r = today.getFullYear() + "/" + (today.getMonth() + 1) + "/" + today.getDate() + " " + "13:30:00";
    }

    var close_time = today.getFullYear() + "/" + (today.getMonth() + 1) + "/" + today.getDate() + " " + "14:10:00";
    var n_date = today.getFullYear() + "/" + (today.getMonth() + 1) + "/" + today.getDate() + " " + today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();

    if (Date.parse(n_date).valueOf() < Date.parse(close_time).valueOf() && Date.parse(n_date).valueOf() > Date.parse(open_time).valueOf()) {
        //盤中
        return '0';
    }
    else if (Date.parse(n_date).valueOf() < Date.parse(open_time).valueOf() && Date.parse(n_date).valueOf() > Date.parse(clear_time).valueOf()) {
        //5:00~8:45
        return '2';
    }
    else if (Date.parse(n_date).valueOf() < Date.parse(close_time).valueOf() && Date.parse(n_date).valueOf() > Date.parse(close_time_r).valueOf()) {
        return '3';
    }
    else {
        //未開盤或收盤
        return '1';
    }
}

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

//取得get參數
function getK_Par(Status) {
    var url = window.location.toString();
    var cbID = "", K_Par = "";
    if (url.indexOf("?") != -1) {
        var ary = url.split("?")[1].split("&");
        if (ary.length == 1) {
            cbID = decodeURI(ary[0].split("=")[1]); //cb代號 
            K_Par = 'D'; //k線參數
        }
        else if (ary.length == 2) {
            cbID = decodeURI(ary[0].split("=")[1]); //cb代號 
            K_Par = decodeURI(ary[1].split("=")[1]); //k線參數 
        }
        else {
        }
        if (Status === "cbID") {
            return cbID.replace(/([\(\)\[\]\{\}\^\$\＋\-\*\?\.\"\'\|\/\\])/g, "");
        }
        else if (Status === "K_Par") {
            return K_Par.replace(/([\(\)\[\]\{\}\^\$\＋\-\*\?\.\"\'\|\/\\])/g, "");
        }
        else {
        }
    }
}

//設定div資料
function setHtmlText(data, status, type) {
    if (type === 'KLine') {
        var content, n_time_color, OHLC_Text_color, rise_color, fall_color, middle_color;
        n_time_color = '#6E6E6E';
        OHLC_Text_color = '#4682B4';
        rise_color = '#D10000';
        fall_color = '#008F00';
        middle_color = '#6E6E6E';
        //時間轉換
        var m_sec = data[data.length - 1][0] - 28800000;
        var n_time;
        if (getK_Par('K_Par') === 'T' || getK_Par('K_Par') === '5') {
            n_time = new Date(m_sec).format("yyyy/mm/dd HH:MM");
        }
        else {
            n_time = new Date(m_sec).format("yyyy/mm/dd");
        }

        //數字比較 並給予css
        var txt_color_open, txt_color_close;
        if (data[data.length - 1][1] < data[data.length - 1][2] && data[data.length - 1][1] == data[data.length - 1][3]) {
            txt_color_open = 'color:' + fall_color; //009900
        }
        else if (data[data.length - 1][1] < data[data.length - 1][2] && data[data.length - 1][1] > data[data.length - 1][3]) {
            txt_color_open = 'color:' + middle_color;
        }
        else if (data[data.length - 1][1] > data[data.length - 1][2]) {
            txt_color_open = 'color:' + rise_color; //FF0000
        }
        else if (data[data.length - 1][1] < data[data.length - 1][3]) {
            txt_color_open = 'color:' + fall_color;
        }
        else {
            txt_color_open = 'color:' + rise_color;
        }

        if (data[data.length - 1][4] < data[data.length - 1][2] && data[data.length - 1][4] == data[data.length - 1][3]) {
            txt_color_close = 'color:' + fall_color;
        }
        else if (data[data.length - 1][4] < data[data.length - 1][2] && data[data.length - 1][4] > data[data.length - 1][3]) {
            txt_color_close = 'color:' + middle_color;
        }
        else if (data[data.length - 1][4] > data[data.length - 1][2]) {
            txt_color_open = 'color:' + rise_color;
        }
        else if (data[data.length - 1][4] < data[data.length - 1][3]) {
            txt_color_open = 'color:' + fall_color;
        }
        else {
            txt_color_close = 'color:' + rise_color;
        }

        if (status === 'Only_KLine') {
            content = '<br><span text =' + n_time + ' style="font-size:14px;color:' + n_time_color + ';font-weight:bold;">' + n_time +
          '</span><span style="font-size:14px;color:' + OHLC_Text_color + '; "> 開：</span><span style="font-weight:bold;font-size:14px;' + txt_color_open + '; ">' + data[data.length - 1][1] +
          '</span><span style="font-size:14px;color:' + OHLC_Text_color + '; "> 高：</span><span style="font-weight:bold;font-size:14px;color:' + rise_color + ' ;">' + data[data.length - 1][2] +
          '</span><span style="font-size:14px;color:' + OHLC_Text_color + '; "> 低：</span><span style="font-weight:bold;font-size:14px;color:' + fall_color + ';">' + data[data.length - 1][3] +
          '</span><span style="font-size:14px;color:' + OHLC_Text_color + '; "> 收：</span><span style="font-weight:bold;font-size:14px;' + txt_color_close + ';">' + data[data.length - 1][4] +
          '</span>';
        }
        else {
        }
    }
    else if (type === 'Trend') {
        var m_sec = data[data.length - 1].x - 28800000;
        var n_time;
        n_time = new Date(m_sec).format("yyyy/mm/dd HH:MM");
        var CBPrice = data[data.length - 1].y;

        if (status === 'Wdata_unsyn') {
            content = '<span>' + n_time + '</span> <span style="color:#FF3300;">CB價格(' + WarrID + '):</span> <b>' + CBPrice + '</b>';
        }
        else {
        }
    }
    else {
    }
    return content;
}

//畫走勢圖
function drawTrend(Status, Data_Source, datetime, cbID) {
    var S43_High, S43_Low;
    Wdata_High.push(Data_Source.Price);
    //最高
    Wdata_High.sort(function (a, b) { return b - a; });
    S43_High = Wdata_High[0];

    //最低
    Wdata_High.sort(function (a, b) { return a - b; });

    if (Data_Source.Time < '133500') {
        S43_Low = Wdata_High[0];
        if (Status === 'syn') {
            var index = Highcharts.charts[0].series[0].data.length - 1;
            var Trendline = Highcharts.charts[0].series[0].data[index];

            if (datetime > Trendline.x) {
                Highcharts.charts[0].series[0].addPoint({
                    x: datetime,
                    y: Data_Source.Price
                });
            }
            else if (datetime == Trendline.x) {
                Highcharts.charts[0].series[0].data[index].update([datetime, Data_Source.Price, true, true]);
            }
            else {
            }
        }
        else if (Status === 'unsyn') {
            if (Wdata.length >= 1) {
                if (datetime < Wdata[Wdata.length - 1].x) {
                }
                else if (datetime == Wdata[Wdata.length - 1].x) {
                    Wdata.pop();
                    Wdata.push({
                        x: datetime,
                        y: Data_Source.Price,
                        a: Data_Source.Ptr
                    });
                }
                else {
                    //TSEA OOTCA時間差別太大(現在時間)，過濾 
                    if (datetime > Wdata[Wdata.length - 1].x + 600000) {
                        if (cbID == 'TSEA' || cbID == 'OTCA') {
                        }
                        else {
                            if (Data_Source.Ptr == parseInt(Wdata[Wdata.length - 1].a) + 1) {
                                if (datetime < Wdata[Wdata.length - 1].x) {
                                }
                                else if (datetime == Wdata[Wdata.length - 1].x) {
                                    Wdata.pop();
                                    Wdata.push({
                                        x: datetime,
                                        y: Data_Source.Price,
                                        a: Data_Source.Ptr,
                                    });
                                }
                                else {
                                    Wdata.push({
                                        x: datetime,
                                        y: Data_Source.Price,
                                        a: Data_Source.Ptr,
                                    });
                                }
                            }
                        }
                    }
                    else {
                        Wdata.push({
                            x: datetime,
                            y: Data_Source.Price,
                            a: Data_Source.Ptr
                        });
                    }
                }
            }
            else {
                if (Data_Source.Time >= '90000') {
                    Wdata.push({
                        x: datetime,
                        y: Data_Source.Price,
                        a: Data_Source.Ptr
                    });
                }
            }
        }
        else {
        }
    }
}

//畫走勢圖(成交量)
function drawTrendSize(Status, Data_Source, datetime) {
    MarketSize.push([Data_Source.Ptr, Data_Source.Time, Data_Source.Size, Data_Source.Price]);
    if (MarketSize[MarketSize.length - 1][1] < 90000) {
        MarketSize.pop().sort();
        if (MarketSize.length >= 2) {
            if (MarketSize[MarketSize.length - 1][0] == MarketSize[MarketSize.length - 2][0]) {
                MarketSize.pop();
            }
        }
    }

    if (Data_Source.Time < '133500') {
        if (Status === 'syn') {
            var index = Highcharts.charts[1].series[0].data.length - 1;
            var TrendSizeline = Highcharts.charts[1].series[0].data[index];

            if (datetime > TrendSizeline.x) {
                //add
                if (MarketSize_Sort.length > 0) {
                    //重整後的第一筆
                    if (MarketSize_Sort[MarketSize_Sort.length - 1] + 1 == Data_Source.Ptr) {
                        Highcharts.charts[1].series[0].addPoint({
                            x: datetime,
                            y: parent($('#SizeTick').val()) + Data_Source.Size,
                        });
                    }
                    else {
                        Highcharts.charts[1].series[0].addPoint({
                            x: datetime,
                            y: Data_Source.Size,
                        });
                    }
                }
                else {
                    Highcharts.charts[1].series[0].addPoint({
                        x: datetime,
                        y: Data_Source.Size,
                    });
                }
            }
            else {
                //update
                Highcharts.charts[1].series[0].data[index].update([datetime, parseInt(WdataSize[WdataSize.length - 1].y) + Data_Source.Size, true, true]);
            }
        }
        else if (Status === 'unsyn') {
            if (MarketSize.length >= 2) {
                if (MarketSize[MarketSize.length - 1][1] == MarketSize[MarketSize.length - 2][1]) {
                    $('#SizeTick').val(parseInt($('#SizeTick').val()) + Data_Source.Size);
                    WdataSize.pop();
                    WdataSize.push({
                        x: datetime,
                        y: parseInt($('#SizeTick').val()),
                    });
                }
                else if (MarketSize[MarketSize.length - 1][1] < MarketSize[MarketSize.length - 2][1]) {
                }
                else {
                    WdataSize.push({
                        x: datetime,
                        y: Data_Source.Size,
                    });
                    $('#SizeTick').val(Data_Source.Size);
                    MarketSize_Sort.push([Data_Source.Ptr]);
                }
            }
            else {
                WdataSize.push({
                    x: datetime,
                    y: parseInt(Data_Source.Size),
                });
                $('#SizeTick').val(Data_Source.Size);
                MarketSize_Sort.push([Data_Source.Ptr]);
            }
        }
        else {
        }
    }
}

//大盤走勢圖資料顯示
function TrendContent(Data_Source, YSDClose, Status) {
    if (Status == 'syn') {
        var range, S43_High, S43_Low, S43_Open;
        WdataSize_High.push(Data_Source.Price);
        MarketSize_Total.push(Data_Source.Size);
        //幅度
        range = (parseFloat(Data_Source.Price) - parseFloat(YSDClose)) / parseFloat(YSDClose) * 100;

        if (MarketSize.length > 0) {
            S43_Open = MarketSize[0][3];
        }
        else {
            S43_Open = 0;
        }

        //最高
        WdataSize_High.sort(function (a, b) { return b - a; });
        S43_High = WdataSize_High[0];

        //最低
        WdataSize_High.sort(function (a, b) { return a - b; });
        S43_Low = WdataSize_High[0];

        //總量
        if ($('#SizeNum').val() === '0') {
            //將陣列WdataSize_High的值相加放入SizeNum裡
            for (var i = 0; i <= MarketSize_Total.length - 1; i++) {
                Total_Size = Total_Size + MarketSize_Total[i];
            }
            $('#SizeNum').val(Total_Size);
        }
        else {
            $('#SizeNum').val(parseInt($('#SizeNum').val()) + Data_Source.Size);
        }

        $("#DealPrice").html('<font color="' + cssText(Data_Source.Price, YSDClose, 'none') + '">' + Data_Source.Price + '</font>');
        $("#Movement").html('<font color="' + cssText(Data_Source.Price, YSDClose, 'none') + '">' + cssText(Data_Source.Price, YSDClose, 'arrow') + Math.abs(formatFloat((Data_Source.Price - parseFloat(YSDClose)), 2)) + '</font>');
        $("#Range").html('<font color="' + cssText(Data_Source.Price, YSDClose, 'none') + '">' + cssText(Data_Source.Price, YSDClose, 'arrow') + Math.abs(formatFloat(range, 2)) + '%</font>');
        $("#YSDClose").html('<font color="black">' + YSDClose + '</font>');
        $("#CbOpen").html('<font color="' + cssText(Wdata[0].y, YSDClose, 'none') + '">' + S43_Open + '</font>');
        $("#CbHigh").html('<font color="' + cssText(S43_High, YSDClose, 'none') + '">' + S43_High + '</font>');
        $("#CbLow").html('<font color="' + cssText(S43_Low, YSDClose, 'none') + '">' + S43_Low + '</font>');
        $("#CbTotal").html('<font color="red">' + $('#SizeNum').val() + '</font>');
    }
    else if (Status == 'unsyn') {
        WdataSize_High.push(Data_Source.Price);
        MarketSize_Total.push(Data_Source.Size);
        if (Data_Source.Time >= '133000') {
            var range, S43_High, S43_Low, S43_Open;
            //幅度
            range = (parseFloat(Data_Source.Price) - parseFloat(YSDClose)) / parseFloat(YSDClose) * 100;

            if (MarketSize.length > 0) {
                S43_Open = MarketSize[0][3];
            }
            else {
                S43_Open = 0;
            }

            //最高
            WdataSize_High.sort(function (a, b) { return b - a; });
            S43_High = WdataSize_High[0];

            //最低
            WdataSize_High.sort(function (a, b) { return a - b; });
            S43_Low = WdataSize_High[0];

            //總量
            if ($('#SizeNum').val() === '0') {
                //將陣列WdataSize_High的值相加放入SizeNum裡
                for (var i = 0; i <= MarketSize_Total.length - 1; i++) {
                    Total_Size = Total_Size + MarketSize_Total[i];
                }
                $('#SizeNum').val(Total_Size);
            }
            else {
                $('#SizeNum').val(parseInt($('#SizeNum').val()) + Data_Source.Size);
            }

            $("#DealPrice").html('<font color="' + cssText(Data_Source.Price, YSDClose, 'none') + '">' + Data_Source.Price + '</font>');
            $("#Movement").html('<font color="' + cssText(Data_Source.Price, YSDClose, 'none') + '">' + cssText(Data_Source.Price, YSDClose, 'arrow') + Math.abs(formatFloat((Data_Source.Price - parseFloat(YSDClose)), 2)) + '</font>');
            $("#Range").html('<font color="' + cssText(Data_Source.Price, YSDClose, 'none') + '">' + cssText(Data_Source.Price, YSDClose, 'arrow') + Math.abs(formatFloat(range, 2)) + '%</font>');
            $("#YSDClose").html('<font color="black">' + YSDClose + '</font>');
            $("#CbOpen").html('<font color="' + cssText(Wdata[0].y, YSDClose, 'none') + '">' + S43_Open + '</font>');
            $("#CbHigh").html('<font color="' + cssText(S43_High, YSDClose, 'none') + '">' + S43_High + '</font>');
            $("#CbLow").html('<font color="' + cssText(S43_Low, YSDClose, 'none') + '">' + S43_Low + '</font>');
            $("#CbTotal").html('<font color="red">' + $('#SizeNum').val() + '</font>');
        }
        else {
        }
    }
    else {
    }
}
//Math.abs(formatFloat(range, 2))
//四捨五入取小數點到第幾位數 num: 數字  pos: 小數點第幾位
function formatFloat(num, pos) {
    var size = Math.pow(10, pos);
    return Math.round(num * size) / size;
}

function cssText(Par1, Par2,Status) {
    var CssStyle;
    if (Status === 'none') {
        if (Par1 > Par2) {
            CssStyle = 'red';
        }
        else if (Par1 == Par2) {
            CssStyle = 'black';

        }
        else {
            CssStyle = 'green';
        }
    }
    else if (Status === 'arrow') {
        if (Par1 > Par2) {
            CssStyle = '▲';
        }
        else if (Par1 == Par2) {
            CssStyle = '';

        }
        else {
            CssStyle = '▼';
        }      
    }

    return CssStyle;
}

function setRefreshTime() {
    var today = new Date();
    var Now = today.getFullYear() + "/" + (today.getMonth() + 1) + "/" + today.getDate() + " " + today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
    var StartTime = today.getFullYear() + "/" + (today.getMonth() + 1) + "/" + today.getDate() + " " + "09:00:03";

    var DT_Start = Date.parse(StartTime);
    var DT_Now = Date.parse(Now);

    var Time_Cal = DT_Start - DT_Now;

    if (Time_Cal > 0) {
        return Time_Cal;
    }
    else {
        return 'Con';
    }
}