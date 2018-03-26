//http://www.rexegg.com/regex-quickstart.html
//http://rocksaying.tw/archives/2007/Regular%20Expression%20%28RegExp%29%20in%20JavaScript.html
//http://stackoverflow.com/questions/3512471/what-is-a-non-capturing-group
class G04_1 {   //解G04的資料
    //最終型態
    rawData: Array<number> = [];
    IndexItem: number;//0=商品索引 
    WarrantId: string;//1=權證代號
    WarrantName: string;//2=權證名稱
    TargetId: string;//3=標的代號
    TargetName: string;//4=標的名稱
    TargetdealPrice: number;//5 = 標的成交價
    TargetdealQty: number;//6=標的成交量
    TargetyesQty: number;//7=標的昨量
    TargetUpDowm: number;//8=標的漲跌
    TargetUpDowmP: number;//9=標的漲跌(%)
    TargetHV: string; //10=標的HV
    TargetHV20: number; //10=標的HV20
    TargetHV60: number; //10=標的HV60
    TargetHV90: number; //10=標的HV90
    WarrantUpDowm: number;//11=權證漲跌
    WarrantUpDowmP: number;//12=權證漲跌(%)
    WarrantdealPrice: number;//13=權證成交價
    WarrantdealQty: number;//14=權證成交量
    WarrantyesQty: number;//15=權證昨量
    WarrantbuyPrice: number;//16=權證買價
    WarrantsellPrice: number;//17=權證賣價
    WarrantpriceBuyStd: number;// 18 = 買價標準化
    WarrantpriceSellStd: number;//19=賣價標準化
    WarrantbuyQty: number;//20=買張
    WarrantsellQty: number;//21=賣張
    RemainDays: number; //22 = 剩餘天數
    ColseYmd: number; //23=到期日
    ExecuteRate: number;//24=行使比例
    EffectiveLevel: number;//25=槓桿倍數 
    WarrantType: string;//26=型態
    Delta: number; //27=delta 
    Gamma: number; //28=gamma  
    Theta: number; //29=theta
    Vega: number; //30=vega
    IssueShares: number;  //31=發行單位數
    StrikePrice: number;   //32=履約價
    PriceInOutRate: number;    //33=價內外程度
    ImpvBuy: number;    //34=BIV
    ImpvSell: number;    //35=SIV
    Impv: number;     //36=IV
    ImpvAvg: number;     //37=市場平均IV
    FlowQty: number;      //38=流通在外股數
    QtyPercent: number;      //39=流通在外比例 
    PriceDifRate_Buy: number;      //40=價差比(分母委買)
    PriceDifRate_Sell: number;      //41=價差比(分母委賣)
    ReasonablePriceDiff: number;      //42=合適價差
    MarketMakerPoint: number;      //43=造市點數
    PriceOneTick: number;       //44=變動1 Tick
    PriceOnePercent: number;       //45=變動1 %
    RecoveryPrice: number;       //46=回收價
    IssueFinRateBuy: number;       //47=買價財務費用
    IssueFinRateSell: number;      //48=賣價財務費用
    IssueFinRate: number;      //49=年化財務費用
    IssueFinRate_origin: number;      //50=原始財務費用(年化)
    DealRecoverPrice: number;     //51=現股距離回收價
    TomorrowTickBalance: number;    //52=隔日損平

    constructor(_Input: any) {
        var contenarray = _Input.split(',');
        contenarray.forEach((data) => {
            var _content = data.split('=');
            switch (_content[0]) {
                case '0':
                    this.IndexItem = Number(_content[1]);
                    break;
                case '1':
                    this.WarrantId = _content[1];
                    break;
                case '2':
                    this.WarrantName = _content[1];
                    break;
                case '3':
                    this.TargetId = _content[1];
                    break;
                case '4':
                    this.TargetName = _content[1];
                    break;
                case '5':
                    this.TargetdealPrice = Number(_content[1]);
                    break;
                case '6':
                    this.TargetdealQty = Number(_content[1]);
                    break;
                case '7':
                    this.TargetyesQty = Number(_content[1]);
                    break;
                case '8':
                    this.TargetUpDowm = Number(_content[1]);
                    break;
                case '9':
                    this.TargetUpDowmP = Number(_content[1]);
                    break;
                case '10':
                    this.TargetHV = _content[1];
                    var TargetHVC = this.TargetHV.split(';');
                    var TargetHVC20 = TargetHVC[0].split(':');
                    this.TargetHV20 = Number(TargetHVC20[1]);
                    var TargetHVC60 = TargetHVC[1].split(':');
                    this.TargetHV60 = Number(TargetHVC60[1]);
                    var TargetHVC90 = TargetHVC[1].split(':');
                    this.TargetHV90 = Number(TargetHVC90[1]);
                    break;
                case '11':
                    this.WarrantUpDowm = Number(_content[1]);
                    break;
                case '12':
                    this.WarrantUpDowmP = Number(_content[1]);
                    break;
                case '13':
                    this.WarrantdealPrice = Number(_content[1]);
                    break;
                case '14':
                    this.WarrantdealQty = Number(_content[1]);
                    break;
                case '15':
                    this.WarrantyesQty = Number(_content[1]);
                    break;
                case '16':
                    this.WarrantbuyPrice = Number(_content[1]);
                    break;
                case '17':
                    this.WarrantsellPrice = Number(_content[1]);
                    break;
                case '18':
                    this.WarrantpriceBuyStd = Number(_content[1]);
                    break;
                case '19':
                    this.WarrantpriceSellStd = Number(_content[1]);
                    break;
                case '20':
                    this.WarrantbuyQty = Number(_content[1]);
                    break;
                case '21':
                    this.WarrantsellQty = Number(_content[1]);
                    break;
                case '22':
                    this.RemainDays = Number(_content[1]);
                    break;
                case '23':
                    this.ColseYmd = Number(_content[1]);
                    break;
                case '24':
                    this.ExecuteRate = Number(_content[1]);
                    break;
                case '25':
                    this.EffectiveLevel = Number(_content[1]);
                    break;
                case '26':
                    this.WarrantType = _content[1];
                    break;
                case '27':
                    this.Delta = Number(_content[1]);
                    break;
                case '28':
                    this.Gamma = Number(_content[1]);
                    break;
                case '29':
                    this.Theta = Number(_content[1]);
                    break;
                case '30':
                    this.Vega = Number(_content[1]);
                    break;
                case '31':
                    this.IssueShares = Number(_content[1]);
                    break;
                case '32':
                    this.StrikePrice = Number(_content[1]);
                    break;
                case '33':
                    this.PriceInOutRate = Number(_content[1]);
                    break;
                case '34':
                    this.ImpvBuy = Number(_content[1]);
                    break;
                case '35':
                    this.ImpvSell = Number(_content[1]);
                    break;
                case '36':
                    this.Impv = Number(_content[1]);
                    break;
                case '37':
                    this.ImpvAvg = Number(_content[1]);
                    break;
                case '38':
                    this.FlowQty = Number(_content[1]);
                    break;
                case '39':
                    this.QtyPercent = Number(_content[1]);
                    break;
                case '40':
                    this.PriceDifRate_Buy = Number(_content[1]);
                    break;
                case '41':
                    this.PriceDifRate_Sell = Number(_content[1]);
                    break;
                case '42':
                    this.ReasonablePriceDiff = Number(_content[1]);
                    break;
                case '43':
                    this.MarketMakerPoint = Number(_content[1]);
                    break;
                case '44':
                    this.PriceOneTick = Number(_content[1]);
                    break;
                case '45':
                    this.PriceOnePercent = Number(_content[1]);
                    break;
                case '46':
                    this.RecoveryPrice = Number(_content[1]);
                    break;
                case '47':
                    this.IssueFinRateBuy = Number(_content[1]);
                    break;
                case '48':
                    this.IssueFinRateSell = Number(_content[1]);
                    break;
                case '49':
                    this.IssueFinRate = Number(_content[1]);
                    break;
                case '50':
                    this.IssueFinRate_origin = Number(_content[1]);
                    break;
                case '51':
                    this.DealRecoverPrice = Number(_content[1]);
                    break;
                case '52':
                    this.TomorrowTickBalance = Number(_content[1]);
                    break;

            }
        }
        )
    }
    toJSON(): Object {
        var obj = {
            Topic: 'G_04_1',
            IndexItem: this.IndexItem,
            WarrantId: this.WarrantId,
            WarrantName: this.WarrantName,
            TargetId: this.TargetId,
            TargetName: this.TargetName,
            TargetdealPrice: this.TargetdealPrice,
            TargetdealQty: this.TargetdealQty,
            TargetyesQty: this.TargetyesQty,
            TargetUpDowm: this.TargetUpDowm,
            TargetUpDowmP: this.TargetUpDowmP,
            TargetHV: this.TargetHV,
            TargetHV20: this.TargetHV20,
            TargetHV60: this.TargetHV60,
            TargetHV90: this.TargetHV90,
            WarrantUpDowm: this.WarrantUpDowm,
            WarrantUpDowmP: this.WarrantUpDowmP,
            WarrantdealPrice: this.WarrantdealPrice,
            WarrantdealQty: this.WarrantdealQty,
            WarrantyesQty: this.WarrantyesQty,
            WarrantbuyPrice: this.WarrantbuyPrice,
            WarrantsellPrice: this.WarrantsellPrice,
            WarrantpriceBuyStd: this.WarrantpriceBuyStd,
            WarrantpriceSellStd: this.WarrantpriceSellStd,
            WarrantbuyQty: this.WarrantbuyQty,
            WarrantsellQty: this.WarrantsellQty,
            RemainDays: this.RemainDays,
            ColseYmd: this.ColseYmd,
            ExecuteRate: this.ExecuteRate,
            EffectiveLevel: this.EffectiveLevel,
            WarrantType: this.WarrantType,
            Delta: this.Delta,
            Gamma: this.Gamma,
            Theta: this.Theta,
            Vega: this.Vega,
            IssueShares: this.IssueShares,
            StrikePrice: this.StrikePrice,
            PriceInOutRate: this.PriceInOutRate,
            ImpvBuy: this.ImpvBuy,
            ImpvSell: this.ImpvSell,
            Impv: this.Impv,
            ImpvAvg: this.ImpvAvg,
            FlowQty: this.FlowQty,
            QtyPercent: this.QtyPercent,
            PriceDifRate_Buy: this.PriceDifRate_Buy,
            PriceDifRate_Sell: this.PriceDifRate_Sell,
            ReasonablePriceDiff: this.ReasonablePriceDiff,
            MarketMakerPoint: this.MarketMakerPoint,
            PriceOneTick: this.PriceOneTick,
            PriceOnePercent: this.PriceOnePercent,
            RecoveryPrice: this.RecoveryPrice,
            IssueFinRateBuy: this.IssueFinRateBuy,
            IssueFinRateSell: this.IssueFinRateSell,
            IssueFinRate: this.IssueFinRate,
            IssueFinRate_origin: this.IssueFinRate_origin,
            DealRecoverPrice: this.DealRecoverPrice,
            TomorrowTickBalance: this.TomorrowTickBalance
        };
        return obj;
    }

    //toString(): string {
    //    var str = '標的代號_年月:' + this.SubjectDate + '\n';
    //    str += "造市點數:" + this.MarketPoint
    //        + ",造市點數帳跌:" + this.MarketChange
    //        + ",造市點數漲跌幅度:" + this.MarketExtent
    //        + ",標的代號:" + this.SubjectID
    //        + ",標的名稱:" + this.SubjectName
    //        + ",標的點數:" + this.SubjectPoint
    //        + ",標的點數帳跌:" + this.SubjectChange
    //        + ",標的點數帳跌幅度:" + this.SubjectExtent
    //    return str;
}
class RepeatData_S27 {
    ProductIndex: string;//1 商品索引
    CommodityID: string;//2 商品代碼
    ProductName: string;//3 商品名稱
    Currency: string;//4 幣別
    YesterdayPrice: string;//5 參考價
    DigitNum: string;//6 小數位數
    OpenCount: string;//7 開盤次數
    OpenTime: string;//8 開盤時間1; 開盤時間2 ;… 依此類推 以" ; "分隔
    CloseTime: string;//9 收盤時間1; 收盤時間2 ;… 依此類推 以" ; "分隔
    Denominator: string;//10 價格分母數字
    CanOrder: string;//11 是否可交易 Y或N
    TradeDate: string;//12 交易日
    TandemCommodityID: string;//120 期選下單代號
    TandemExchangeCode: string;//121 期選交易所代號
    UtcTimeOffset: string;//122 當地時差
    Tick: string;//123 跳動點
    constructor(input: Array<number>) {
        try {
            var pattern: RegExp = /(\d{1,3})=((?:\w|\W)*)/g;
            var startIndex = 0;
            var endIndex = input.indexOf(0x01, 1);
            var runCount = 0;
            var isEnd = false;
            while (!isEnd) {
                if (runCount > 0) {
                    startIndex = endIndex + 1;
                    endIndex = input.indexOf(0x01, startIndex + 1);
                    if (endIndex == -1) {
                        endIndex = input.length;
                        isEnd = true;
                    }
                }
                var str = input.UTF8Decode(startIndex, endIndex - startIndex);
                pattern.lastIndex = 0;
                var regexArray = pattern.exec(str);
                if (regexArray == null) {
                    console.info
                }
                if (regexArray != null && regexArray.length == 3) {
                    switch (regexArray[1]) {
                        case '1':
                            this.ProductIndex = regexArray[2];
                            break;
                        case '2':
                            this.CommodityID = regexArray[2];
                            break;
                        case '3':
                            this.ProductName = regexArray[2];
                            break;
                        case '4':
                            this.Currency = regexArray[2];
                            break;
                        case '5':
                            this.YesterdayPrice = regexArray[2];
                            break;
                        case '6':
                            this.DigitNum = regexArray[2];
                            break;
                        case '7':
                            this.OpenCount = regexArray[2];
                            break;
                        case '8':
                            this.OpenTime = regexArray[2];
                            break;
                        case '9':
                            this.CloseTime = regexArray[2];
                            break;
                        case '10':
                            this.Denominator = regexArray[2];
                            break;
                        case '11':
                            this.CanOrder = regexArray[2];
                            break;
                        case '12':
                            this.TradeDate = regexArray[2];
                            break;
                        case '120':
                            this.TandemCommodityID = regexArray[2];
                            break;
                        case '121':
                            this.TandemExchangeCode = regexArray[2];
                            break;
                        case '122':
                            this.UtcTimeOffset = regexArray[2];
                            break;
                        case '123':
                            this.Tick = regexArray[2];
                            break;
                    }
                    runCount++;
                }
                else {
                    console.error('S27 轉換錯誤:' + str);
                }
            }
            this.YesterdayPrice = (parseFloat(this.YesterdayPrice) / Math.pow(10, parseInt(this.DigitNum))).toString();
        } catch (ex) {
            console.error(ex);
        }
    }
}
/**S_27商品清單*/
class S27 {
    _rawData: Array<number> = [];
    _marketNo: number;
    _count: number;
    _Data = {};
    constructor(_Input: any) {
        if (typeof (_Input) === 'string')
            this._rawData = _Input.ToByteArray();
        else
            this._rawData = _Input;
        this._marketNo = this._rawData.ToInt(4, 1);
        this._count = this._rawData.ToInt(5, 2);
        var startIndex = 5;
        var endIndex = this._rawData.indexOf(0x1e, 6);
        for (var i = 0; i < this._count; i++) {
            if (i > 0) {
                startIndex = endIndex + 1;
                endIndex = this._rawData.indexOf(0x1e, startIndex + 1);
                if (endIndex == -1)
                    endIndex = this._rawData.length;
            }
            var tmp: Array<number> = this._rawData.slice(startIndex, endIndex);
            var tmp2 = new RepeatData_S27(tmp);
            this._Data[tmp2.ProductIndex] = tmp2;
        }
        var curIndex = 0;
    }
    toJSON(): Object {
        var obj = {
            Topic: 'S_27',
            MarketNo: this._marketNo,
            Count: this._count,
            Data: this._Data
        };
        return obj;
    }
    toString(): string {
        var str = 'S_27 MarketNo:' + this._marketNo + ' Count:' + this._count + '\n';
        for (var i in this._Data) {
            var tmp: RepeatData_S27 = this._Data[i];
            str += '商品索引:' + tmp.ProductIndex + ',商品代碼:' + tmp.CommodityID + ',商品名稱:' + tmp.ProductName + ',幣別:' + tmp.Currency
                + ',參考價:' + tmp.YesterdayPrice + ',小數位數:' + tmp.DigitNum + ',開盤次數:' + tmp.OpenCount + ',開盤時間:' + tmp.OpenTime
                + ',收盤時間:' + tmp.CloseTime + ',分母:' + tmp.Denominator + ',可否交易:' + tmp.CanOrder + ',交易日:' + tmp.TradeDate
                + ',下單代號:' + tmp.TandemCommodityID + ',下單交易所代號:' + tmp.TandemExchangeCode + ',當地時差:' + tmp.UtcTimeOffset + ',跳動點:' + tmp.Tick + '\n';
        }
        return str;
    }
}
//----------------------------------------------------------------
class RepeatData_S28 {
    ProductIndex: number;//商品索引
    TradeDate: number;//交易日
}
/**S_28商品清盤通知*/
class S28 {
    _rawData: Array<number> = [];
    _marketNo: number;
    _count: number;
    _Data: Array<RepeatData_S28> = [];
    constructor(_Input: any) {
        if (typeof (_Input) === 'string')
            this._rawData = _Input.ToByteArray();
        else
            this._rawData = _Input;
        this._marketNo = this._rawData.ToInt(2, 1);
        this._count = this._rawData.ToInt(3, 2);
        var curIndex = 0;
        for (var i = 0; i < this._count; i++) {
            var d: RepeatData_S28 = new RepeatData_S28();
            d.ProductIndex = this._rawData.ToInt(curIndex + 5, 3);
            d.TradeDate = this._rawData.ToInt(curIndex + 8, 3);
            curIndex += 6;
            this._Data.push(d);
        }
    }
    toJSON(): Object {
        var obj = {
            Topic: 'S_28',
            MarketNo: this._marketNo,
            Count: this._count,
            Data: this._Data
        };
        return obj;
    }
    toString(): string {
        var str = 'S_28 MarketNo:' + this._marketNo + ' Count:' + this._count + '\n';
        for (var i = 0; i < this._Data.length; i++) {
            var tmp: RepeatData_S28 = this._Data[i];
            str += '商品索引:' + tmp.ProductIndex + ',交易日:' + tmp.TradeDate + '\n';
        }
        return str;
    }
}
//----------------------------------------------------------------
/**S_35商品初始資料*/
class S35 {   //解S35的資料
    _rawData: Array<number> = [];
    _marketNo: number;
    _productIndex: number;
    _digitNum: number;
    _count: number;
    _openPrice: number;//T
    _OpenInterest: number;//O
    _PrevOpenInterest: number;//D
    _highPrice: number;//H
    _lowPrice: number;//L
    _yesterdaySize: number;//Y
    _settlementPrice: number;//S
    constructor(_Input: any) {
        if (typeof (_Input) === 'string')
            this._rawData = _Input.ToByteArray();
        else
            this._rawData = _Input;
        this._marketNo = this._rawData.ToInt(2, 1);   //市場編碼(位置,長度)
        this._productIndex = this._rawData.ToInt(3, 2);
        this._digitNum = this._rawData.ToInt(5, 1);   //小數點位數
        this._count = this._rawData.ToInt(6, 1);
        var curIndex = 0;
        for (var i = 0; i < this._count; i++) {
            var type = this._rawData.UTF8Decode(curIndex + 7, 1);    //原先curIndex = 0,加7,就是7的位置
            switch (type) {
                case 'T':
                    this._openPrice = this._rawData.ToInt(curIndex + 9, 4, this._digitNum, this._rawData[curIndex + 8]);
                    break;
                case 'O':
                    this._OpenInterest = this._rawData.ToInt(curIndex + 9, 4);
                    break;
                case 'D':
                    this._PrevOpenInterest = this._rawData.ToInt(curIndex + 9, 4);
                    break;
                case 'H':
                    this._highPrice = this._rawData.ToInt(curIndex + 9, 4, this._digitNum, this._rawData[curIndex + 8]);
                    break;
                case 'L':
                    this._lowPrice = this._rawData.ToInt(curIndex + 9, 4, this._digitNum, this._rawData[curIndex + 8]);
                    break;
                case 'Y':
                    this._yesterdaySize = this._rawData.ToInt(curIndex + 9, 4, 0, this._rawData[curIndex + 8]);
                    break;
                case 'S':
                    this._settlementPrice = this._rawData.ToInt(curIndex + 9, 4, this._digitNum, this._rawData[curIndex + 8]);
                    break;
            }
            curIndex += 6;  //位置7~9的長度為6
        }
    }
    toJSON(): Object {
        var obj = {
            Topic: 'S_35',
            MarketNo: this._marketNo,
            ProductIndex: this._productIndex,
            OpenPrice: this._openPrice,
            OpenInterest: this._OpenInterest,
            PrevOpenInterest: this._PrevOpenInterest,
            HighPrice: this._highPrice,
            LowPrice: this._lowPrice,
            YesterdaySize: this._yesterdaySize,
            SettlementPrice: this._settlementPrice
        };
        return obj;
    }
    toString(): string {
        var str = 'S_35 MarketNo:' + this._marketNo + ' Count:' + this._count + ' DigitNum:' + this._digitNum + ' 商品索引:' + this._productIndex + '\n';
        str += "今開:" + this._openPrice + ",今平倉:" + this._OpenInterest + ",昨平倉:" + this._PrevOpenInterest + ",最高:" + this._highPrice + ",最低:" + this._lowPrice + ",昨日量:" + this._yesterdaySize + ",結算價:" + this._settlementPrice;
        return str;
    }
}

/**G_02商品初始資料*/
class G02 {   //解G02的資料
    //最終型態
    rawData: Array<number> = [];
    marketNo: number;
    ProductIndex: number;//0 股票索引
    CommodityID: string;//1 權證代號
    ProductName: string;//2 權證名稱
    SubjectEx: string;//3 標的交易所
    SubjectID: string;//4 標的代號
    SubjectName: string;//5 標的名稱
    StrikePrice: number;//6 履約價
    CP: number;//7 CP
    WarrantCall: number;//8 權證委買價
    WarrantPut: number;//9 權證委賣價
    Price: number;//10 權證成交價
    Change: number;//11 漲跌
    Proportion: number;//12 執行比例
    Volume: number;//13 成交量
    BIV: number;//14 BIV
    SIV: number;//15 SIV
    Tick: number;//16 變動1tick
    Tick1: number;//17 變動1%
    StandardSell: number;//18 買價標準化
    StandardPut: number;//19 賣價標準化

    constructor(_Input: any) {
        if (typeof (_Input) === 'string')
            this.rawData = _Input.ToByteArray();
        else
            this.rawData = _Input;
        this.marketNo = this.rawData.ToInt(2, 1);   //市場編碼(位置,長度)     

        var content = this.rawData.UTF8Decode(3, this.rawData.length - 3);    //原先curIndex = 0,加7,就是7的位置
        var contenarray = content.split(',');
        contenarray.forEach((data) => {
            var _content = data.split('=');
            switch (_content[0]) {
                case '0':
                    this.ProductIndex = Number(_content[1]);
                    break;
                case '1':
                    this.CommodityID = _content[1];
                    break;
                case '2':
                    this.ProductName = _content[1];
                    break;
                case '3':
                    this.SubjectEx = _content[1];
                    break;
                case '4':
                    this.SubjectID = _content[1];
                    break;
                case '5':
                    this.SubjectName = _content[1];
                    break;
                case '6':
                    this.StrikePrice = Number(_content[1]);
                    break;
                case '7':
                    this.CP = Number(_content[1]);
                    break;
                case '8':
                    this.WarrantCall = Number(_content[1]);
                    break;
                case '9':
                    this.WarrantPut = Number(_content[1]);
                    break;
                case '10':
                    this.Price = Number(_content[1]);
                    break;
                case '11':
                    this.Change = Number(_content[1]);
                    break;
                case '12':
                    this.Proportion = Number(_content[1]);
                    break;
                case '13':
                    this.Volume = Number(_content[1]);
                    break;
                case '14':
                    this.BIV = Number(_content[1]);
                    break;
                case '15':
                    this.SIV = Number(_content[1]);
                    break;
                case '16':
                    this.Tick = Number(_content[1]);
                    break;
                case '17':
                    this.Tick1 = Number(_content[1]);
                case '18':
                    this.StandardSell = Number(_content[1]);
                    break;
                case '19':
                    this.StandardPut = Number(_content[1]);
                    break;
            }
        }
        )
    }
    toJSON(): Object {
        var obj = {
            Topic: 'G_02',
            MarketNo: this.marketNo,
            ProductIndex: this.ProductIndex,
            CommodityID: this.CommodityID,
            ProductName: this.ProductName,
            SubjectEx: this.SubjectEx,
            SubjectID: this.SubjectID,
            SubjectName: this.SubjectName,
            StrikePrice: this.StrikePrice,
            CP: this.CP,
            WarrantCall: this.WarrantCall,
            WarrantPut: this.WarrantPut,
            Price: this.Price,
            Change: this.Change,
            Proportion: this.Proportion,
            Volume: this.Volume,
            BIV: this.BIV,
            SIV: this.SIV,
            Tick: this.Tick,
            Tick1: this.Tick1,
            StandardSell: this.StandardSell,
            StandardPut: this.StandardPut
        };
        return obj;
    }
    toString(): string {
        var str = 'G_02 MarketNo:' + this.marketNo + '\n';
        str += ' 股票索引:' + this.ProductIndex
            + "權證代號:" + this.CommodityID
            + ",權證名稱:" + this.ProductName
            + ",標的交易所:" + this.SubjectEx
            + ",標的代號:" + this.SubjectID
            + ",標的名稱:" + this.SubjectName
            + ",履約價:" + this.StrikePrice
            + ",CP:" + this.CP
            + ",權證委買價:" + this.WarrantCall
            + ",權證委賣價:" + this.WarrantPut
            + ",權證成交價:" + this.Price
            + ",漲跌:" + this.Change
            + ",執行比例:" + this.Proportion
            + ",成交量:" + this.Volume
            + ",BIV:" + this.BIV
            + ",SIV" + this.SIV
            + ",變動1tick:" + this.Tick
            + ",變動1%:" + this.Tick1
            + ",買價標準化:" + this.StandardSell
            + ",賣價標準化:" + this.StandardPut
        return str;

    }
}

/**G_03商品初始資料*/
class G03 {   //解G03的資料
    //最終型態
    rawData: Array<number> = [];
    SubjectDate: string;//0 標的代號_年月
    MarketPoint: number;//1 造市點數
    MarketChange: number;//2 造市點數漲跌
    MarketExtent: number;//3 造市點數漲跌幅度
    SubjectID: string;//4 標的代號
    SubjectName: string;//5 標的名稱
    SubjectPoint: number;//5 標的點數
    SubjectChange: number;//7 標的點數漲跌
    SubjectExtent: number;//8 標的點數漲跌幅度

    constructor(_Input: any) {
        if (typeof (_Input) === 'string')
            this.rawData = _Input.ToByteArray();
        else
            this.rawData = _Input;

        var content = this.rawData.UTF8Decode(2, this.rawData.length - 2);    //原先curIndex = 0,加7,就是7的位置
        var contenarray = content.split(',');
        contenarray.forEach((data) => {
            var _content = data.split('=');
            switch (_content[0]) {
                case '0':
                    this.SubjectDate = _content[1];
                    break;
                case '1':
                    this.MarketPoint = Number(_content[1]);
                    break;
                case '2':
                    this.MarketChange = Number(_content[1]);
                    break;
                case '3':
                    this.MarketExtent = Number(_content[1]);
                    break;
                case '4':
                    this.SubjectID = _content[1];
                    break;
                case '5':
                    this.SubjectName = _content[1];
                    break;
                case '6':
                    this.SubjectPoint = Number(_content[1]);
                    break;
                case '7':
                    this.SubjectChange = Number(_content[1]);
                    break;
                case '8':
                    this.SubjectExtent = parseFloat(_content[1]);
                    break;

            }
        }
        )
    }
    toJSON(): Object {
        var obj = {
            Topic: 'G_03',
            SubjectDate: this.SubjectDate,
            MarketPoint: this.MarketPoint,
            MarketChange: this.MarketChange,
            MarketExtent: this.MarketExtent,
            SubjectID: this.SubjectID,
            SubjectName: this.SubjectName,
            SubjectPoint: this.SubjectPoint,
            SubjectChange: this.SubjectChange,
            SubjectExtent: this.SubjectExtent
        };
        return obj;
    }

    toString(): string {
        var str = '標的代號_年月:' + this.SubjectDate + '\n';
        str += "造市點數:" + this.MarketPoint
            + ",造市點數帳跌:" + this.MarketChange
            + ",造市點數漲跌幅度:" + this.MarketExtent
            + ",標的代號:" + this.SubjectID
            + ",標的名稱:" + this.SubjectName
            + ",標的點數:" + this.SubjectPoint
            + ",標的點數帳跌:" + this.SubjectChange
            + ",標的點數帳跌幅度:" + this.SubjectExtent
        return str;
    }
}


/**G_04商品初始資料*/
class G04 {   //解G04的資料
    //最終型態
    rawData: Array<number> = [];
    IndexItem: number;//0=商品索引 
    WarrantId: string;//1=權證代號
    WarrantName: string;//2=權證名稱
    TargetId: string;//3=標的代號
    TargetName: string;//4=標的名稱
    TargetdealPrice: number;//5 = 標的成交價
    TargetdealQty: number;//6=標的成交量
    TargetyesQty: number;//7=標的昨量
    TargetUpDowm: number;//8=標的漲跌
    TargetUpDowmP: number;//9=標的漲跌(%)
    TargetHV: string; //10=標的HV
    TargetHV20: number; //10=標的HV20
    TargetHV60: number; //10=標的HV60
    TargetHV90: number; //10=標的HV90
    WarrantUpDowm: number;//11=權證漲跌
    WarrantUpDowmP: number;//12=權證漲跌(%)
    WarrantdealPrice: number;//13=權證成交價
    WarrantdealQty: number;//14=權證成交量
    WarrantyesQty: number;//15=權證昨量
    WarrantbuyPrice: number;//16=權證買價
    WarrantsellPrice: number;//17=權證賣價
    WarrantpriceBuyStd: number;// 18 = 買價標準化
    WarrantpriceSellStd: number;//19=賣價標準化
    WarrantbuyQty: number;//20=買張
    WarrantsellQty: number;//21=賣張
    RemainDays: number; //22 = 剩餘天數
    ColseYmd: number; //23=到期日
    ExecuteRate: number;//24=行使比例
    EffectiveLevel: number;//25=槓桿倍數 
    WarrantType: string;//26=型態
    Delta: number; //27=delta 
    Gamma: number; //28=gamma  
    Theta: number; //29=theta
    Vega: number; //30=vega
    IssueShares: number;  //31=發行單位數
    StrikePrice: number;   //32=履約價
    PriceInOutRate: number;    //33=價內外程度
    ImpvBuy: number;    //34=BIV
    ImpvSell: number;    //35=SIV
    Impv: number;     //36=IV
    ImpvAvg: number;     //37=市場平均IV
    FlowQty: number;      //38=流通在外股數
    QtyPercent: number;      //39=流通在外比例 
    PriceDifRate_Buy: number;      //40=價差比(分母委買)
    PriceDifRate_Sell: number;      //41=價差比(分母委賣)
    ReasonablePriceDiff: number;      //42=合適價差
    MarketMakerPoint: number;      //43=造市點數
    PriceOneTick: number;       //44=變動1 Tick
    PriceOnePercent: number;       //45=變動1 %
    RecoveryPrice: number;       //46=回收價
    IssueFinRateBuy: number;       //47=買價財務費用
    IssueFinRateSell: number;      //48=賣價財務費用
    IssueFinRate: number;      //49=年化財務費用
    IssueFinRate_origin: number;      //50=原始財務費用(年化)
    DealRecoverPrice: number;     //51=現股距離回收價
    TomorrowTickBalance: number;    //52=隔日損平

    constructor(_Input: any) {
        console.log(_Input);
        if (typeof (_Input) === 'string')
            this.rawData = _Input.ToByteArray();
        else
            this.rawData = _Input;

        var content = this.rawData.UTF8Decode(3, this.rawData.length - 3);    //原先curIndex = 0,加7,就是7的位置
       // console.log(content);
        var contenarray = content.split(',');
        contenarray.forEach((data) => {
            var _content = data.split('=');
            switch (_content[0]) {
                case '0':
                    this.IndexItem = Number(_content[1]);
                    break;
                case '1':
                    this.WarrantId = _content[1];
                    break;
                case '2':
                    this.WarrantName = _content[1];
                    break;
                case '3':
                    this.TargetId = _content[1];
                    break;
                case '4':
                    this.TargetName = _content[1];
                    break;
                case '5':
                    this.TargetdealPrice = Number(_content[1]);
                    break;
                case '6':
                    this.TargetdealQty = Number(_content[1]);
                    break;
                case '7':
                    this.TargetyesQty = Number(_content[1]);
                    break;
                case '8':
                    this.TargetUpDowm = Number(_content[1]);
                    break;
                case '9':
                    this.TargetUpDowmP = Number(_content[1]);
                    break;
                case '10':
                    this.TargetHV = _content[1];
                    var TargetHVC = this.TargetHV.split(';');
                    TargetHVC.forEach(function (item) {
                        var ary = item.split(':');
                        switch (ary[0]) {
                            case "20":
                                this.TargetHV20 = Number(ary[1]);
                                break;
                            case "60":
                                this.TargetHV60 = Number(ary[1]);
                                break;
                            case "90":
                                this.TargetHV90 = Number(ary[1]);
                                break;
                        }
                    });
                    break;
                case '11':
                    this.WarrantUpDowm = Number(_content[1]);
                    break;
                case '12':
                    this.WarrantUpDowmP = Number(_content[1]);
                    break;
                case '13':
                    this.WarrantdealPrice = Number(_content[1]);
                    break;
                case '14':
                    this.WarrantdealQty = Number(_content[1]);
                    break;
                case '15':
                    this.WarrantyesQty = Number(_content[1]);
                    break;
                case '16':
                    this.WarrantbuyPrice = Number(_content[1]);
                    break;
                case '17':
                    this.WarrantsellPrice = Number(_content[1]);
                    break;
                case '18':
                    this.WarrantpriceBuyStd = Number(_content[1]);
                    break;
                case '19':
                    this.WarrantpriceSellStd = Number(_content[1]);
                    break;
                case '20':
                    this.WarrantbuyQty = Number(_content[1]);
                    break;
                case '21':
                    this.WarrantsellQty = Number(_content[1]);
                    break;
                case '22':
                    this.RemainDays = Number(_content[1]);
                    break;
                case '23':
                    this.ColseYmd = Number(_content[1]);
                    break;
                case '24':
                    this.ExecuteRate = Number(_content[1]);
                    break;
                case '25':
                    this.EffectiveLevel = Number(_content[1]);
                    break;
                case '26':
                    this.WarrantType = _content[1];
                    break;
                case '27':
                    this.Delta = Number(_content[1]);
                    break;
                case '28':
                    this.Gamma = Number(_content[1]);
                    break;
                case '29':
                    this.Theta = Number(_content[1]);
                    break;
                case '30':
                    this.Vega = Number(_content[1]);
                    break;
                case '31':
                    this.IssueShares = Number(_content[1]);
                    break;
                case '32':
                    this.StrikePrice = Number(_content[1]);
                    break;
                case '33':
                    this.PriceInOutRate = Number(_content[1]);
                    break;
                case '34':
                    this.ImpvBuy = Number(_content[1]);
                    break;
                case '35':
                    this.ImpvSell = Number(_content[1]);
                    break;
                case '36':
                    this.Impv = Number(_content[1]);
                    break;
                case '37':
                    this.ImpvAvg = Number(_content[1]);
                    break;
                case '38':
                    this.FlowQty = Number(_content[1]);
                    break;
                case '39':
                    this.QtyPercent = Number(_content[1]);
                    break;
                case '40':
                    this.PriceDifRate_Buy = Number(_content[1]);
                    break;
                case '41':
                    this.PriceDifRate_Sell = Number(_content[1]);
                    break;
                case '42':
                    this.ReasonablePriceDiff = Number(_content[1]);
                    break;
                case '43':
                    this.MarketMakerPoint = Number(_content[1]);
                    break;
                case '44':
                    this.PriceOneTick = Number(_content[1]);
                    break;
                case '45':
                    this.PriceOnePercent = Number(_content[1]);
                    break;
                case '46':
                    this.RecoveryPrice = Number(_content[1]);
                    break;
                case '47':
                    this.IssueFinRateBuy = Number(_content[1]);
                    break;
                case '48':
                    this.IssueFinRateSell = Number(_content[1]);
                    break;
                case '49':
                    this.IssueFinRate = Number(_content[1]);
                    break;
                case '50':
                    this.IssueFinRate_origin = Number(_content[1]);
                    break;
                case '51':
                    this.DealRecoverPrice = Number(_content[1]);
                    break;
                case '52':
                    this.TomorrowTickBalance = Number(_content[1]);
                    break;

            }
        }
        )
    }
    toJSON(): Object {
        var obj = {
            Topic: 'G_04',
            IndexItem: this.IndexItem,
            WarrantId: this.WarrantId,
            WarrantName: this.WarrantName,
            TargetId: this.TargetId,
            TargetName: this.TargetName,
            TargetdealPrice: this.TargetdealPrice,
            TargetdealQty: this.TargetdealQty,
            TargetyesQty: this.TargetyesQty,
            TargetUpDowm: this.TargetUpDowm,
            TargetUpDowmP: this.TargetUpDowmP,
            TargetHV: this.TargetHV,
            TargetHV20: this.TargetHV20,
            TargetHV60: this.TargetHV60,
            TargetHV90: this.TargetHV90,
            WarrantUpDowm: this.WarrantUpDowm,
            WarrantUpDowmP: this.WarrantUpDowmP,
            WarrantdealPrice: this.WarrantdealPrice,
            WarrantdealQty: this.WarrantdealQty,
            WarrantyesQty: this.WarrantyesQty,
            WarrantbuyPrice: this.WarrantbuyPrice,
            WarrantsellPrice: this.WarrantsellPrice,
            WarrantpriceBuyStd: this.WarrantpriceBuyStd,
            WarrantpriceSellStd: this.WarrantpriceSellStd,
            WarrantbuyQty: this.WarrantbuyQty,
            WarrantsellQty: this.WarrantsellQty,
            RemainDays: this.RemainDays,
            ColseYmd: this.ColseYmd,
            ExecuteRate: this.ExecuteRate,
            EffectiveLevel: this.EffectiveLevel,
            WarrantType: this.WarrantType,
            Delta: this.Delta,
            Gamma: this.Gamma,
            Theta: this.Theta,
            Vega: this.Vega,
            IssueShares: this.IssueShares,
            StrikePrice: this.StrikePrice,
            PriceInOutRate: this.PriceInOutRate,
            ImpvBuy: this.ImpvBuy,
            ImpvSell: this.ImpvSell,
            Impv: this.Impv,
            ImpvAvg: this.ImpvAvg,
            FlowQty: this.FlowQty,
            QtyPercent: this.QtyPercent,
            PriceDifRate_Buy: this.PriceDifRate_Buy,
            PriceDifRate_Sell: this.PriceDifRate_Sell,
            ReasonablePriceDiff: this.ReasonablePriceDiff,
            MarketMakerPoint: this.MarketMakerPoint,
            PriceOneTick: this.PriceOneTick,
            PriceOnePercent: this.PriceOnePercent,
            RecoveryPrice: this.RecoveryPrice,
            IssueFinRateBuy: this.IssueFinRateBuy,
            IssueFinRateSell: this.IssueFinRateSell,
            IssueFinRate: this.IssueFinRate,
            IssueFinRate_origin: this.IssueFinRate_origin,
            DealRecoverPrice: this.DealRecoverPrice,
            TomorrowTickBalance: this.TomorrowTickBalance
        };
        return obj;
    }

    //toString(): string {
    //    var str = '標的代號_年月:' + this.SubjectDate + '\n';
    //    str += "造市點數:" + this.MarketPoint
    //        + ",造市點數帳跌:" + this.MarketChange
    //        + ",造市點數漲跌幅度:" + this.MarketExtent
    //        + ",標的代號:" + this.SubjectID
    //        + ",標的名稱:" + this.SubjectName
    //        + ",標的點數:" + this.SubjectPoint
    //        + ",標的點數帳跌:" + this.SubjectChange
    //        + ",標的點數帳跌幅度:" + this.SubjectExtent
    //    return str;
    }
}


//----------------------------------------------------------------
/**S_36商品即時報價*/
class S36 {
    _rawData: Array<number> = [];
    _marketNo: number;
    _productIndex: number;
    _digitNum: number;
    _price: number;
    _totalSize: number;
    _bidAsk: string;
    _tickSize: number;
    _bid: number;
    _bidSize: number;
    _ask: number;
    _askSize: number;
    _bidTotalSize: number;
    _askTotalSize: number;
    _time: number;
    constructor(_Input: any) {
        if (typeof (_Input) === 'string')
            this._rawData = _Input.ToByteArray();
        else
            this._rawData = _Input;
        this._marketNo = this._rawData.ToInt(2, 1);
        this._productIndex = this._rawData.ToInt(3, 2);
        this._digitNum = this._rawData.ToInt(48, 1);
        this._price = this._rawData.ToInt(6, 4, this._digitNum, this._rawData[5]);
        this._totalSize = this._rawData.ToInt(10, 4);
        this._bidAsk = this._rawData.UTF8Decode(14, 1);
        this._tickSize = this._rawData.ToInt(15, 3);
        this._bid = this._rawData.ToInt(19, 4, this._digitNum, this._rawData[18]);
        this._bidSize = this._rawData.ToInt(23, 3);
        this._ask = this._rawData.ToInt(27, 4, this._digitNum, this._rawData[26]);
        this._askSize = this._rawData.ToInt(31, 3);
        this._bidTotalSize = this._rawData.ToInt(34, 4);
        this._askTotalSize = this._rawData.ToInt(38, 4);
        this._time = this._rawData.ToInt(42, 3);
    }
    toJSON(): Object {
        var obj = {
            Topic: 'S_36',
            MarketNo: this._marketNo,
            ProductIndex: this._productIndex,
            Price: this._price,
            TotalSize: this._totalSize,
            BidAsk: this._bidAsk,
            TickSize: this._tickSize,
            Bid: this._bid,
            BidSize: this._bidSize,
            Ask: this._ask,
            AskSize: this._askSize,
            BidTotalSize: this._bidTotalSize,
            AskTotalSize: this._askTotalSize,
            Time: this._time,
            DigitNum: this._digitNum
        };
        return obj;
    }
    toString(): string {
        var str = 'S_36 MarketNo:' + this._marketNo + ' DigitNum:' + this._digitNum + ' 商品索引:' + this._productIndex + '\n';
        str += "成交價:" + this._price + ",總量:" + this._totalSize + ",買賣:" + this._bidAsk + ",瞬量:" + this._tickSize + ",買價:" + this._bid + ",買量:" + this._bidSize;
        str += "賣價:" + this._ask + ",賣量:" + this._askSize + ",買盤總量:" + this._bidTotalSize + ",賣盤總量:" + this._askTotalSize + ",時間:" + this._time + ",小數位數:" + this._digitNum;
        return str;
    }
}
//----------------------------------------------------------------
/**S_43Tick*/
class S43 {
    _rawData: Array<number> = [];
    _marketNo: number;
    _productIndex: number;
    _ptr: number;
    _time: number;
    _bestBid: number;
    _bestAsk: number;
    _price: number;
    _size: number;
    _digitNum: number;
    constructor(_Input: any) {
        if (typeof (_Input) === 'string')
            this._rawData = _Input.ToByteArray();
        else
            this._rawData = _Input;
        this._marketNo = this._rawData.ToInt(2, 1);
        this._productIndex = this._rawData.ToInt(3, 2);
        this._ptr = this._rawData.ToInt(5, 3);
        this._time = this._rawData.ToInt(8, 3);
        this._digitNum = this._rawData.ToInt(33, 1);

        this._bestBid = this._rawData.ToInt(15, 4, this._digitNum, this._rawData[14]);
        this._bestAsk = this._rawData.ToInt(20, 4, this._digitNum, this._rawData[19]);
        this._price = this._rawData.ToInt(25, 4, this._digitNum, this._rawData[24]);
        this._size = this._rawData.ToInt(29, 3);
    }
    toJSON(): Object {
        var obj = {
            Topic: 'S_43',
            MarketNo: this._marketNo,
            ProductIndex: this._productIndex,
            Ptr: this._ptr,
            Time: this._time,
            BestBid: this._bestBid,
            BestAsk: this._bestAsk,
            Price: this._price,
            Size: this._size,
            DigitNum: this._digitNum
        };
        return obj;
    }
    toString(): string {
        var str = 'S_43 MarketNo:' + this._marketNo + ' DigitNum:' + this._digitNum + ' 商品索引:' + this._productIndex + '\n';
        str += "流水號:" + this._ptr + ",時間:" + this._time + ",最佳買:" + this._bestBid + ",最佳賣:" + this._bestAsk + ",成交價:" + this._price + ",瞬量:" + this._size;
        return str;
    }
}
//----------------------------------------------------------------
/**S_44商品5檔價量*/
class S44 {
    rawData: Array<number> = [];
    marketNo: number;
    productIndex: number;
    digitNum: number;
    Bid1: number; Bid2: number; Bid3: number; Bid4: number; Bid5: number;
    BidSize1: number; BidSize2: number; BidSize3: number; BidSize4: number; BidSize5: number;
    Ask1: number; Ask2: number; Ask3: number; Ask4: number; Ask5: number;
    AskSize1: number; AskSize2: number; AskSize3: number; AskSize4: number; AskSize5: number;
    constructor(Input: any) {
        if (typeof (Input) === 'string')
            this.rawData = Input.ToByteArray();
        else
            this.rawData = Input;
        this.marketNo = this.rawData.ToInt(2, 1);
        this.productIndex = this.rawData.ToInt(3, 2);
        this.digitNum = this.rawData.ToInt(126, 1);
        this.Bid1 = this.rawData.ToInt(6, 4, this.digitNum, this.rawData[5]);
        this.BidSize1 = this.rawData.ToInt(11, 4);
        this.Bid2 = this.rawData.ToInt(16, 4, this.digitNum, this.rawData[15]);
        this.BidSize2 = this.rawData.ToInt(21, 4);
        this.Bid3 = this.rawData.ToInt(26, 4, this.digitNum, this.rawData[25]);
        this.BidSize3 = this.rawData.ToInt(31, 4);
        this.Bid4 = this.rawData.ToInt(36, 4, this.digitNum, this.rawData[35]);
        this.BidSize4 = this.rawData.ToInt(41, 4);
        this.Bid5 = this.rawData.ToInt(46, 4, this.digitNum, this.rawData[45]);
        this.BidSize5 = this.rawData.ToInt(51, 4);

        this.Ask1 = this.rawData.ToInt(66, 4, this.digitNum, this.rawData[65]);
        this.AskSize1 = this.rawData.ToInt(71, 4);
        this.Ask2 = this.rawData.ToInt(76, 4, this.digitNum, this.rawData[75]);
        this.AskSize2 = this.rawData.ToInt(81, 4);
        this.Ask3 = this.rawData.ToInt(86, 4, this.digitNum, this.rawData[85]);
        this.AskSize3 = this.rawData.ToInt(91, 4);
        this.Ask4 = this.rawData.ToInt(96, 4, this.digitNum, this.rawData[95]);
        this.AskSize4 = this.rawData.ToInt(101, 4);
        this.Ask5 = this.rawData.ToInt(106, 4, this.digitNum, this.rawData[105]);
        this.AskSize5 = this.rawData.ToInt(111, 4);
    }
    toJSON(): Object {
        var obj = {
            Topic: 'S_44',
            MarketNo: this.marketNo,
            ProductIndex: this.productIndex,
            DigitNum: this.digitNum,
            Bid1: this.Bid1,
            BidSize1: this.BidSize1,
            Bid2: this.Bid2,
            BidSize2: this.BidSize2,
            Bid3: this.Bid3,
            BidSize3: this.BidSize3,
            Bid4: this.Bid4,
            BidSize4: this.BidSize4,
            Bid5: this.Bid5,
            BidSize5: this.BidSize5,

            Ask1: this.Ask1,
            AskSize1: this.AskSize1,
            Ask2: this.Ask2,
            AskSize2: this.AskSize2,
            Ask3: this.Ask3,
            AskSize3: this.AskSize3,
            Ask4: this.Ask4,
            AskSize4: this.AskSize4,
            Ask5: this.Ask5,
            AskSize5: this.AskSize5,
        };
        return obj;
    }
    toString(): string {
        var str = 'S_44 MarketNo:' + this.marketNo + ' DigitNum:' + this.digitNum + ' 商品索引:' + this.productIndex + '\n';
        str += "買1:" + this.Bid1 + ",買1量:" + this.BidSize1 + ",買2:" + this.Bid2 + ",買2量:" + this.BidSize2 + ",買3:" + this.Bid3 + ",買3量:" + this.BidSize3 + ",買4:" + this.Bid4 + ",買4量:" + this.BidSize4 + ",買5:" + this.Bid5 + ",買5量:" + this.BidSize5 + '\n'
        str += "賣1:" + this.Ask1 + ",賣1量:" + this.AskSize1 + ",賣2:" + this.Ask2 + ",賣2量:" + this.AskSize2 + ",賣3:" + this.Ask3 + ",賣3量:" + this.AskSize3 + ",賣4:" + this.Ask4 + ",賣4量:" + this.AskSize4 + ",賣5:" + this.Ask5 + ",賣5量:" + this.AskSize5
        return str;
    }
}

/**S_60 CBAS基本資料 - 1 */
class RepeatData_S60 {    
    ProductIndex: string;//1 商品索引
    MarketType: string;//2 市場別
    cbID: string;//3 可轉債代號
    cbHundred: string;//4 權利金百元報價
    CloseYMD: string;//5 選擇權到期日
    RemainYears: string;//6 剩餘年限
    PutDay: string;//7 賣價天期
    CreditRate: string;//8 信用評級
    CouponRate: string;//9 票面利率
    PutPrice: string;//10 賣回價格
    StrikeDisRate: string;//11 履約折現率
    RefStrikePrice: string;//12 參考履約價
    ConversionPrice: string;//13 轉換價格
    Pre_Dis_Rate: string;//14 溢(折)價率
    TargetMarketType: string;//15 標的市場別
    TargetNo: string;//16 標的股票代號
    eTradeTag: string;//17 電子交易註記
    DigitNum: string;//18 小數位數
    cbName: string;//19 可轉債名稱
    TargetName: string;//20 現貨名稱
    Levy:string//21罰金
    constructor(input: Array<number>) {
        try {
            var pattern: RegExp = /(\d{1,3})=((?:\w|\W)*)/g;
            var startIndex = 0;
            var endIndex = input.indexOf(0x01, 1);
            var runCount = 0;
            var isEnd = false;
            while (!isEnd) {
                if (runCount > 0) {
                    startIndex = endIndex + 1;
                    endIndex = input.indexOf(0x01, startIndex + 1);
                    if (endIndex == -1) {
                        endIndex = input.length;
                        isEnd = true;
                    }
                }
                var str = input.UTF8Decode(startIndex, endIndex - startIndex);
                pattern.lastIndex = 0;
                var regexArray = pattern.exec(str);
                if (regexArray == null) {
                    console.info
                }
                if (regexArray != null && regexArray.length == 3) {
                    switch (regexArray[1]) {
                        case '1':
                            this.ProductIndex = regexArray[2];
                            break;
                        case '2':
                            this.MarketType = regexArray[2];
                            break;
                        case '3':
                            this.cbID = regexArray[2];
                            break;
                        case '4':
                            this.cbHundred = regexArray[2];
                            break;
                        case '5':
                            this.CloseYMD = regexArray[2];
                            break;
                        case '6':
                            this.RemainYears = regexArray[2];
                            break;
                        case '7':
                            this.PutDay = regexArray[2];
                            break;
                        case '8':
                            this.CreditRate = regexArray[2];
                            break;
                        case '9':
                            this.CouponRate = regexArray[2];
                            break;
                        case '10':
                            this.PutPrice = regexArray[2];
                            break;
                        case '11':
                            this.StrikeDisRate = regexArray[2];
                            break;
                        case '12':
                            this.RefStrikePrice = regexArray[2];
                            break;
                        case '13':
                            this.ConversionPrice = regexArray[2];
                            break;
                        case '14':
                            this.Pre_Dis_Rate = regexArray[2];
                            break;
                        case '15':
                            this.TargetMarketType = regexArray[2];
                            break;
                        case '16':
                            this.TargetNo = regexArray[2];
                            break;
                        case '17':
                            this.eTradeTag = regexArray[2];
                            break;
                        case '18':
                            this.DigitNum = regexArray[2];
                            break;
                        case '19':
                            this.cbName = regexArray[2];
                            break;
                        case '20':
                            this.TargetName = regexArray[2];
                            break;
                        case '21':
                            this.Levy = regexArray[2];
                            break;
                    }
                    runCount++;
                }
                else {
                    console.error('S60 轉換錯誤:' + str);
                }
            }
        } catch (ex) {
            console.error(ex);
        }
    }
}
/**S_60 CBAS基本資料 - 2 */
class S60 {
    _rawData: Array<number> = [];
    _marketNo: number;
    _count: number;
    _Data = {};
    constructor(_Input: any) {
        if (typeof (_Input) === 'string')
            this._rawData = _Input.ToByteArray();
        else
            this._rawData = _Input;
        this._marketNo = this._rawData.ToInt(5, 1);
        this._count = this._rawData.ToInt(8, 2);
        var startIndex = 8;
        var endIndex = this._rawData.indexOf(0x1e, 9);
        for (var i = 0; i < this._count; i++) {
            if (i > 0) {
                startIndex = endIndex + 1;
                endIndex = this._rawData.indexOf(0x1e, startIndex + 1);
                if (endIndex == -1)
                    endIndex = this._rawData.length;
            }
            var tmp: Array<number> = this._rawData.slice(startIndex, endIndex);
            var tmp2 = new RepeatData_S60(tmp);
            this._Data[tmp2.ProductIndex] = tmp2;
        }
        var curIndex = 0;
    }
    toJSON(): Object {
        var obj = {
            Topic: 'S_60',
            ProductIndex: this.ProductIndex,
            MarketType: this.MarketType,
            cbID: this.cbID,
            cbHundred: this.cbHundred,
            CloseYMD: this.CloseYMD,
            RemainYears: this.RemainYears,
            PutDay: this.PutDay,
            CreditRate: this.CreditRate,
            CouponRate: this.CouponRate,
            PutPrice: this.PutPrice,
            StrikeDisRate: this.StrikeDisRate,
            RefStrikePrice: this.RefStrikePrice,
            ConversionPrice: this.ConversionPrice,
            Pre_Dis_Rate: this.Pre_Dis_Rate,
            TargetMarketType: this.TargetMarketType,
            TargetNo: this.TargetNo,
            eTradeTag: this.eTradeTag,
            DigitNum: this.DigitNum,
            cbName: this.cbName,
            TargetName: this.TargetName,
            Levy:this.Levy,
        };
        return obj;
    }
    toString(): string {
        var str = 'S_60 MarketNo:' + this._marketNo + ' Count:' + this._count + '\n';
        for (var i in this._Data) {
            var tmp: RepeatData_S60 = this._Data[i];
            str += '商品索引:' + tmp.ProductIndex +
                ',市場別:' + tmp.MarketType +
                ',可轉債代號:' + tmp.cbID +
                ',權利金百元報價:' + tmp.cbHundred +
                ',選擇權到期日:' + tmp.CloseYMD +
                ',剩餘年限:' + tmp.RemainYears +
                ',賣價天期:' + tmp.PutDay +
                ',信用評級:' + tmp.CreditRate +
                ',票面利率:' + tmp.CouponRate +
                ',賣回價格:' + tmp.PutPrice +
                ',履約折現率:' + tmp.StrikeDisRate +
                ',參考履約價:' + tmp.RefStrikePrice +
                ',轉換價格:' + tmp.ConversionPrice +
                ',溢(折)價率:' + tmp.Pre_Dis_Rate +
                ',標的市場別:' + tmp.TargetMarketType +
                ',標的股票代號:' + tmp.TargetNo +
                ',電子交易註記:' + tmp.eTradeTag +
                ',小數位數:' + tmp.DigitNum +
                ',可轉債名稱:' + tmp.cbName +
                ',現貨名稱:' + tmp.TargetName + 
                ',罰金:' + tmp.Levy + '\n';  
        }
        return str;
    }
}

/**S_61 CBAS即時行情 */
class S61 {
    rawData: Array<number> = [];
    bodyLength: number;
    marketNo: number;
    stockIndex: number;
    digitNum: number;
    cb_bid_price: number;
    cb_ask_price: number;
    cb_deal_price: number;
    cb_movement: number;
    cb_movement_percent: number;
    cb_high_price: number;
    cb_low_price: number;
    cb_dealQty: number;
    cb_totalQty: number;
    target_bid_price: number;
    target_ask_price: number;
    target_deal_price: number;
    target_movement: number;
    target_movement_percent: number;
    target_high_price: number;
    target_low_price: number;
    parity: number;
    constructor(Input: any) {
        if (typeof (Input) === 'string')
            this.rawData = Input.ToByteArray();
        else
            this.rawData = Input;
        this.bodyLength = this.rawData.ToInt(2, 3);  //資料長度 (位置,長度)
        this.marketNo = this.rawData.ToInt(5, 1);   //市場代號
        this.stockIndex = this.rawData.ToInt(6, 2);  //商品索引   
        this.digitNum = DigitNum; // 小數位數 (來自 S60 CBAS基本資料)
        this.cb_bid_price = this.rawData.ToInt(9, 4, this.digitNum, this.rawData[8]);   //可轉債買價 主要參數(位置,長度 , 小數位數的變數 , 正負號位置)
        this.cb_ask_price = this.rawData.ToInt(14, 4, this.digitNum, this.rawData[13]); //可轉債賣價
        this.cb_deal_price = this.rawData.ToInt(19, 4, this.digitNum, this.rawData[18]); //可轉債成交價
        this.cb_movement = this.rawData.ToInt(24, 3, this.digitNum, this.rawData[23]); //可轉債漲跌
        this.cb_movement_percent = this.rawData.ToInt(27, 3, this.digitNum, this.rawData[23]); //可轉債漲跌幅度(%)
        this.cb_high_price = this.rawData.ToInt(31, 4, this.digitNum, this.rawData[30]); //可轉債最高價
        this.cb_low_price = this.rawData.ToInt(36, 4, this.digitNum, this.rawData[35]); //可轉債最低價
        this.cb_dealQty = this.rawData.ToInt(40, 3); //可轉債單量
        this.cb_totalQty = this.rawData.ToInt(43, 3); //可轉債總成交量
        this.target_bid_price = this.rawData.ToInt(47, 4, this.digitNum, this.rawData[46]); //現股買價
        this.target_ask_price = this.rawData.ToInt(52, 4, this.digitNum, this.rawData[51]); //現股賣價
        this.target_deal_price = this.rawData.ToInt(57, 4, this.digitNum, this.rawData[56]); //現股成交價
        this.target_movement = this.rawData.ToInt(62, 3, this.digitNum, this.rawData[61]); //現股漲跌
        this.target_movement_percent = this.rawData.ToInt(65, 3, this.digitNum, this.rawData[61]); //現股漲跌幅度(%)
        this.target_high_price = this.rawData.ToInt(69, 4, this.digitNum, this.rawData[68]); //現股最高價
        this.target_low_price = this.rawData.ToInt(74, 4, this.digitNum, this.rawData[73]); //現股最低價
        this.parity = this.rawData.ToInt(78, 4); //parity(%)
    }
    toJSON(): Object {
        var obj = {
            Topic: 'S_61',
            bodyLength: this.bodyLength,
            marketNo: this.marketNo,
            stockIndex: this.stockIndex,
            digitNum: this.digitNum,
            cb_bid_price: this.cb_bid_price,
            cb_ask_price: this.cb_ask_price,
            cb_deal_price: this.cb_deal_price,
            cb_movement: this.cb_movement,
            cb_movement_percent: this.cb_movement_percent,
            cb_high_price: this.cb_high_price,
            cb_low_price: this.cb_low_price,
            cb_dealQty: this.cb_dealQty,
            cb_totalQty: this.cb_totalQty,
            target_bid_price: this.target_bid_price,
            target_ask_price: this.target_ask_price,
            target_deal_price: this.target_deal_price,
            target_movement: this.target_movement,
            target_movement_percent: this.target_movement_percent,
            target_high_price: this.target_high_price,
            target_low_price: this.target_low_price,
            parity: this.parity
        };
        return obj;
    }
    toString(): string {
        var str = 'S_61 資料長度:' + this.bodyLength +
            ' 市場代號:' + this.marketNo +
            ' 小數位數:' + this.digitNum +
            ' 商品索引:' + this.stockIndex + '\n';
        str += "可轉債買價:" + this.cb_bid_price +
            ",可轉債賣價:" + this.cb_ask_price +
            ",可轉債成交價:" + this.cb_deal_price +
            ",可轉債漲跌:" + this.cb_movement +
            ",可轉債漲跌幅度(%):" + this.cb_movement_percent +
            ",可轉債最高價:" + this.cb_high_price; +
                ",可轉債最低價:" + this.cb_low_price +
                ",可轉債單量:" + this.cb_dealQty +
                ",可轉債總成交量:" + this.cb_totalQty;
        str += "現股買價:" + this.target_bid_price +
            ",現股賣價:" + this.target_ask_price +
            ",現股成交價:" + this.target_deal_price +
            ",現股漲跌:" + this.target_movement +
            ",現股漲跌幅度(%):" + this.target_movement_percent +
            ",現股最高價:" + this.target_high_price +
            ",現股最低價:" + this.target_low_price +
            ",parity(%):" + this.parity;
        return str;
    }
}
/**R_03商品初始資料*/
class R03 {   //解G03的資料
    //最終型態
    rawData: Array<number> = [];
    SubjectDate: string;//0 標的代號_年月
    MarketPoint: number;//1 造市點數
    MarketChange: number;//2 造市點數漲跌
    MarketExtent: number;//3 造市點數漲跌幅度
    SubjectID: string;//4 標的代號
    SubjectName: string;//5 標的名稱
    SubjectPoint: number;//5 標的點數
    SubjectChange: number;//7 標的點數漲跌
    SubjectExtent: number;//8 標的點數漲跌幅度

    constructor(_Input: any) {
        if (typeof (_Input) === 'string')
            this.rawData = _Input.ToByteArray();
        else
            this.rawData = _Input;
        

        var content = this.rawData.UTF8Decode(2, this.rawData.length - 2);    //原先curIndex = 0,加7,就是7的位置
        var contenarray = content.split(',');
        contenarray.forEach((data) => {
            var _content = data.split('=');
            switch (_content[0]) {
                case '0':
                    this.SubjectDate = _content[1];
                    break;
                case '1':
                    this.MarketPoint = Number(_content[1]);
                    break;
                case '2':
                    this.MarketChange = Number(_content[1]);
                    break;
                case '3':
                    this.MarketExtent = Number(_content[1]);
                    break;
                case '4':
                    this.SubjectID = _content[1];
                    break;
                case '5':
                    this.SubjectName = _content[1];
                    break;
                case '6':
                    this.SubjectPoint = Number(_content[1]);
                    break;
                case '7':
                    this.SubjectChange = Number(_content[1]);
                    break;
                case '8':
                    this.SubjectExtent = parseFloat(_content[1]);
                    break;

            }
        }
        )
    }
    toJSON(): Object {
        var obj = {
            Topic: 'R_03',
            SubjectDate: this.SubjectDate,
            MarketPoint: this.MarketPoint,
            MarketChange: this.MarketChange,
            MarketExtent: this.MarketExtent,
            SubjectID: this.SubjectID,
            SubjectName: this.SubjectName,
            SubjectPoint: this.SubjectPoint,
            SubjectChange: this.SubjectChange,
            SubjectExtent: this.SubjectExtent
        };
        return obj;
    }

    toString(): string {
        var str = '標的代號_年月:' + this.SubjectDate + '\n';
        str += "造市點數:" + this.MarketPoint
            + ",造市點數帳跌:" + this.MarketChange
            + ",造市點數漲跌幅度:" + this.MarketExtent
            + ",標的代號:" + this.SubjectID
            + ",標的名稱:" + this.SubjectName
            + ",標的點數:" + this.SubjectPoint
            + ",標的點數帳跌:" + this.SubjectChange
            + ",標的點數帳跌幅度:" + this.SubjectExtent
        return str;
    }
}