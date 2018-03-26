//http://www.rexegg.com/regex-quickstart.html
//http://rocksaying.tw/archives/2007/Regular%20Expression%20%28RegExp%29%20in%20JavaScript.html
//http://stackoverflow.com/questions/3512471/what-is-a-non-capturing-group
var RepeatData_S27 = (function () {
    function RepeatData_S27(input) {
        try {
            var pattern = /(\d{1,3})=((?:\w|\W)*)/g;
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
                    console.info;
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
                        case '13':
                            this.ClassType = regexArray[2];
                            break;
                        case '101':
                            this.MarketTypeFlag = regexArray[2];
                            break;
                        case '102':
                            this.LimitUp = regexArray[2];
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
        }
        catch (ex) {
            console.error(ex);
        }
    }
    return RepeatData_S27;
})();
/**S_27商品清單*/
var S27 = (function () {
    function S27(_Input) {
        this._rawData = [];
        this._Data = {};
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
            var tmp = this._rawData.slice(startIndex, endIndex);
            var tmp2 = new RepeatData_S27(tmp);
            this._Data[tmp2.ProductIndex] = tmp2;
        }
        var curIndex = 0;
    }
    S27.prototype.toJSON = function () {
        var obj = {
            Topic: 'S_27',
            MarketNo: this._marketNo,
            Count: this._count,
            Data: this._Data
        };
        return obj;
    };
    S27.prototype.toString = function () {
        var str = 'S_27 MarketNo:' + this._marketNo + ' Count:' + this._count + '\n';
        for (var i in this._Data) {
            var tmp = this._Data[i];
            str += '商品索引:' + tmp.ProductIndex + ',商品代碼:' + tmp.CommodityID + ',商品名稱:' + tmp.ProductName + ',幣別:' + tmp.Currency
                + ',參考價:' + tmp.YesterdayPrice + ',小數位數:' + tmp.DigitNum + ',開盤次數:' + tmp.OpenCount + ',開盤時間:' + tmp.OpenTime
                + ',收盤時間:' + tmp.CloseTime + ',分母:' + tmp.Denominator + ',可否交易:' + tmp.CanOrder + ',交易日:' + tmp.TradeDate
                + ',下單代號:' + tmp.TandemCommodityID + ',下單交易所代號:' + tmp.TandemExchangeCode + ',當地時差:' + tmp.UtcTimeOffset + ',跳動點:' + tmp.Tick + '\n';
        }
        return str;
    };
    return S27;
})();
//----------------------------------------------------------------
var RepeatData_S28 = (function () {
    function RepeatData_S28() {
    }
    return RepeatData_S28;
})();
/**S_28商品清盤通知*/
var S28 = (function () {
    function S28(_Input) {
        this._rawData = [];
        this._Data = [];
        if (typeof (_Input) === 'string')
            this._rawData = _Input.ToByteArray();
        else
            this._rawData = _Input;
        this._marketNo = this._rawData.ToInt(2, 1);
        this._count = this._rawData.ToInt(3, 2);
        var curIndex = 0;
        for (var i = 0; i < this._count; i++) {
            var d = new RepeatData_S28();
            d.ProductIndex = this._rawData.ToInt(curIndex + 5, 3);
            d.TradeDate = this._rawData.ToInt(curIndex + 8, 3);
            curIndex += 6;
            this._Data.push(d);
        }
    }
    S28.prototype.toJSON = function () {
        var obj = {
            Topic: 'S_28',
            MarketNo: this._marketNo,
            Count: this._count,
            Data: this._Data
        };
        return obj;
    };
    S28.prototype.toString = function () {
        var str = 'S_28 MarketNo:' + this._marketNo + ' Count:' + this._count + '\n';
        for (var i = 0; i < this._Data.length; i++) {
            var tmp = this._Data[i];
            str += '商品索引:' + tmp.ProductIndex + ',交易日:' + tmp.TradeDate + '\n';
        }
        return str;
    };
    return S28;
})();
//----------------------------------------------------------------
/**S_35商品初始資料*/
var S35 = (function () {
    function S35(_Input) {
        this._rawData = [];
        if (typeof (_Input) === 'string')
            this._rawData = _Input.ToByteArray();
        else
            this._rawData = _Input;
        this._marketNo = this._rawData.ToInt(2, 1); //市場編碼(位置,長度)
        this._productIndex = this._rawData.ToInt(3, 2);
        this._digitNum = this._rawData.ToInt(5, 1); //小數點位數
        this._count = this._rawData.ToInt(6, 1);
        var curIndex = 0;
        for (var i = 0; i < this._count; i++) {
            var type = this._rawData.UTF8Decode(curIndex + 7, 1); //原先curIndex = 0,加7,就是7的位置
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
            curIndex += 6; //位置7~9的長度為6
        }
    }
    S35.prototype.toJSON = function () {
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
    };
    S35.prototype.toString = function () {
        var str = 'S_35 MarketNo:' + this._marketNo + ' Count:' + this._count + ' DigitNum:' + this._digitNum + ' 商品索引:' + this._productIndex + '\n';
        str += "今開:" + this._openPrice + ",今平倉:" + this._OpenInterest + ",昨平倉:" + this._PrevOpenInterest + ",最高:" + this._highPrice + ",最低:" + this._lowPrice + ",昨日量:" + this._yesterdaySize + ",結算價:" + this._settlementPrice;
        return str;
    };
    return S35;
})();
/**G_02商品初始資料*/
var G02 = (function () {
    function G02(_Input) {
        var _this = this;
        //最終型態
        this.rawData = [];
        if (typeof (_Input) === 'string')
            this.rawData = _Input.ToByteArray();
        else
            this.rawData = _Input;
        this.marketNo = this.rawData.ToInt(2, 1); //市場編碼(位置,長度)     
        var content = this.rawData.UTF8Decode(3, this.rawData.length - 3); //原先curIndex = 0,加7,就是7的位置
        var contenarray = content.split(',');
        contenarray.forEach(function (data) {
            var _content = data.split('=');
            switch (_content[0]) {
                case '0':
                    _this.ProductIndex = Number(_content[1]);
                    break;
                case '1':
                    _this.CommodityID = _content[1];
                    break;
                case '2':
                    _this.ProductName = _content[1];
                    break;
                case '3':
                    _this.SubjectEx = _content[1];
                    break;
                case '4':
                    _this.SubjectID = _content[1];
                    break;
                case '5':
                    _this.SubjectName = _content[1];
                    break;
                case '6':
                    _this.StrikePrice = Number(_content[1]);
                    break;
                case '7':
                    _this.CP = _content[1];
                    break;
                case '8':
                    _this.WarrantCall = Number(_content[1]);
                    break;
                case '9':
                    _this.WarrantPut = Number(_content[1]);
                    break;
                case '10':
                    _this.Price = Number(_content[1]);
                    break;
                case '11':
                    _this.Change = Number(_content[1]);
                    break;
                case '12':
                    _this.Proportion = Number(_content[1]);
                    break;
                case '13':
                    _this.Volume = Number(_content[1]);
                    break;
                case '14':
                    _this.BIV = Number(_content[1]);
                    break;
                case '15':
                    _this.SIV = Number(_content[1]);
                    break;
                case '16':
                    _this.Tick = Number(_content[1]);
                    break;
                case '17':
                    _this.Tick1 = Number(_content[1]);
                case '18':
                    _this.StandardSell = Number(_content[1]);
                    break;
                case '19':
                    _this.StandardPut = Number(_content[1]);
                    break;
                case '20':
                    _this.StrikeType = Number(_content[1]);
                    break;
                case '21':
                    _this.RessetType = Number(_content[1]);
                    break;
                case '22':
                    _this.LimitPrice = Number(_content[1]);
                    break;
                case '23':
                    _this.IssueShares = Number(_content[1]);
                    break;
                case '24':
                    _this.EndMarketYmd = Number(_content[1]);
                    break;
                case '25':
                    _this.ColseYmd = Number(_content[1]);
                    break;
                case '26':
                    _this.RemainDays = Number(_content[1]);
                    break;
                case '27':
                    _this.EffectiveLevel = Number(_content[1]);
                    break;
                case '28':
                    _this.Impv = Number(_content[1]);
                    break;
                case '29':
                    _this.PriceTheory = Number(_content[1]);
                    break;
                case '30':
                    _this.Delta = Number(_content[1]);
                    break;
                case '31':
                    _this.Gamma = Number(_content[1]);
                    break;
                case '32':
                    _this.Vega = Number(_content[1]);
                    break;
                case '33':
                    _this.Theta = Number(_content[1]);
                    break;
                case '34':
                    _this.Rho = Number(_content[1]);
                    break;
                case '35':
                    _this.RateAnn = Number(_content[1]);
                    break;
                case '36':
                    _this.ExecuteRate = Number(_content[1]);
                    break;
                case '37':
                    _this.QtyPercent = Number(_content[1]);
                    break;
                case '38':
                    _this.RemainDaysN = Number(_content[1]);
                    break;
                case '39':
                    _this.MinusShares = Number(_content[1]);
                    break;
                case '40':
                    _this.ImpvDays20 = Number(_content[1]);
                    break;
                case '41':
                    _this.CalPriceSell = Number(_content[1]);
                    break;
                case '42':
                    _this.CalPriceBuy = Number(_content[1]);
                    break;
                case '43':
                    _this.Points = Number(_content[1]);
                    break;

            }
        });
    }
    G02.prototype.toJSON = function () {
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
            StandardPut: this.StandardPut,
            StrikeType: this.StrikeType,
            RessetType: this.RessetType,
            LimitPrice: this.LimitPrice,
            IssueShares: this.IssueShares,
            EndMarketYmd: this.EndMarketYmd,
            ColseYmd: this.ColseYmd,
            RemainDays: this.RemainDays,
            EffectiveLevel: this.EffectiveLevel,
            Impv: this.Impv,
            PriceTheory: this.PriceTheory,
            Delta: this.Delta,
            Gamma: this.Gamma,
            Vega: this.Vega,
            Theta: this.Theta,
            Rho: this.Rho,
            RateAnn: this.RateAnn,
            ExecuteRate: this.ExecuteRate,
            QtyPercent: this.QtyPercent,
            RemainDaysN: this.RemainDaysN,
            MinusShares: this.MinusShares,
            ImpvDays20: this.ImpvDays20,
            CalPriceSell: this.CalPriceSell,
            CalPriceBuy: this.CalPriceBuy,
            Points: this.Points
        };
        return obj;
    };
    G02.prototype.toString = function () {
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
            + ",美式/歐式:" + this.StrikeType
            + ",重設型:" + this.RessetType
            + ",界線價:" + this.LimitPrice
            + ",原始發行量:" + this.IssueShares
            + ",最後交易日:" + this.EndMarketYmd
            + ",到期日:" + this.ColseYmd
            + ",剩餘交易天數:" + this.RemainDays
            + ",有效槓桿:" + this.EffectiveLevel
            + ",成交隱波:" + this.Impv
            + ",理論價:" + this.PriceTheory
            + ",DELTA:" + this.Delta
            + ",GAMMA:" + this.Gamma
            + ",VEGA:" + this.Vega
            + ",THETA:" + this.Theta
            + ",Rho:" + this.Rho
            + ",無風險利率:" + this.RateAnn
            + ",執行比率:" + this.ExecuteRate
            + ",流通在外比例:" + this.QtyPercent
            + ",剩餘天數:" + this.RemainDaysN
            + ",註銷量:" + this.MinusShares
            + ",20日歷史波動率:" + this.ImpvDays20
            + ",標的委賣價格:" + this.CalPriceSell
            + ",標的委買價格:" + this.CalPriceBuy
            + ",折價點數:" + this.Points

        return str;
    };
    return G02;
})();
/**G_03商品初始資料*/
var G03 = (function () {
    function G03(_Input) {
        var _this = this;
        //最終型態
        this.rawData = [];
        if (typeof (_Input) === 'string')
            this.rawData = _Input.ToByteArray();
        else
            this.rawData = _Input;
        var content = this.rawData.UTF8Decode(2, this.rawData.length - 2); //原先curIndex = 0,加7,就是7的位置
        var contenarray = content.split(',');
        contenarray.forEach(function (data) {
            var _content = data.split('=');
            switch (_content[0]) {
                case '0':
                    _this.SubjectDate = _content[1];
                    break;
                case '1':
                    _this.MarketPoint = Number(_content[1]);
                    break;
                case '2':
                    _this.MarketChange = Number(_content[1]);
                    break;
                case '3':
                    _this.MarketExtent = Number(_content[1]);
                    break;
                case '4':
                    _this.SubjectID = _content[1];
                    break;
                case '5':
                    _this.SubjectName = _content[1];
                    break;
                case '6':
                    _this.SubjectPoint = Number(_content[1]);
                    break;
                case '7':
                    _this.SubjectChange = Number(_content[1]);
                    break;
                case '8':
                    _this.SubjectExtent = parseFloat(_content[1]);
                    break;
            }
        });
    }
    G03.prototype.toJSON = function () {
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
            SubjectExtent: this.SubjectExtent,
        };
        return obj;
    };
    G03.prototype.toString = function () {
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
    };
    return G03;
})();

/**G_04商品初始資料*/
var G04 = (function () {
    function G04(_Input) {
        var _this = this;
        //最終型態
        this.rawData = [];
        if (typeof (_Input) === 'string')
            _this.rawData = _Input.ToByteArray();
        else
            _this.rawData = _Input;
        var content = _this.rawData.UTF8Decode(3, _this.rawData.length - 3); //原先curIndex = 0,加7,就是7的位置
       //console.log(content);
      
        var contenarray = content.split(',');
        contenarray.forEach(function (data) {
            var _content = data.split('=');
            switch (_content[0]) {
                case '0':
                    _this.IndexItem = Number(_content[1]);
                    break;
                case '1':
                    _this.WarrantId = _content[1];
                    break;
                case '2':
                    _this.WarrantName = _content[1];
                    break;
                case '3':
                    _this.TargetId = _content[1];
                    break;
                case '4':
                    _this.TargetName = _content[1];
                    break;
                case '5':
                    _this.TargetdealPrice = Number(_content[1]);
                    break;
                case '6':
                    _this.TargetdealQty = Number(_content[1]);
                    break;
                case '7':
                    _this.TargetyesQty = Number(_content[1]);
                    break;
                case '8':
                    _this.TargetUpDowm = Number(_content[1]);
                    break;
                case '9':
                    _this.TargetUpDowmP = Number(_content[1]);
                    break;
                case '10':
                    _this.TargetHV = _content[1];
                    var TargetHVC = _this.TargetHV.split(';');
                    TargetHVC.forEach(function (item) {
                        var ary = item.split(':');
                        switch (ary[0]) {
                            case "20":
                                _this.TargetHV20 = Number(ary[1]);
                                break;
                            case "60":
                                _this.TargetHV60 = Number(ary[1]);
                                break;
                            case "90":
                                _this.TargetHV90 = Number(ary[1]);
                                break;
                        }
                    });
                case '11':
                    _this.WarrantUpDowm = Number(_content[1]);
                    break;
                case '12':
                    _this.WarrantUpDowmP = Number(_content[1]);
                    break;
                case '13':
                    _this.WarrantdealPrice = Number(_content[1]);
                    break;
                case '14':
                    _this.WarrantdealQty = Number(_content[1]);
                    break;
                case '15':
                    _this.WarrantyesQty = Number(_content[1]);
                    break;
                case '16':
                    _this.WarrantbuyPrice = Number(_content[1]);
                    break;
                case '17':
                    _this.WarrantsellPrice = Number(_content[1]);
                    break;
                case '18':
                    _this.WarrantpriceBuyStd = Number(_content[1]);
                    break;
                case '19':
                    _this.WarrantpriceSellStd = Number(_content[1]);
                    break;
                case '20':
                    _this.WarrantbuyQty = Number(_content[1]);
                    break;
                case '21':
                    _this.WarrantsellQty = Number(_content[1]);
                    break;
                case '22':
                    _this.RemainDays = Number(_content[1]);
                    break;
                case '23':
                    _this.ColseYmd = Number(_content[1]);
                    break;
                case '24':
                    _this.ExecuteRate = Number(_content[1]);
                    break;
                case '25':
                    _this.EffectiveLevel = Number(_content[1]);
                    break;
                case '26':
                    _this.WarrantType = _content[1];
                    break;
                case '27':
                    _this.Delta = Number(_content[1]);
                    break;
                case '28':
                    _this.Gamma = Number(_content[1]);
                    break;
                case '29':
                    _this.Theta = Number(_content[1]);
                    break;
                case '30':
                    _this.Vega = Number(_content[1]);
                    break;
                case '31':
                    _this.IssueShares = Number(_content[1]);
                    break;
                case '32':
                    _this.StrikePrice = Number(_content[1]);
                    break;
                case '33':
                    _this.PriceInOutRate = Number(_content[1]);
                    break;
                case '34':
                    _this.ImpvBuy = Number(_content[1]);
                    break;
                case '35':
                    _this.ImpvSell = Number(_content[1]);
                    break;
                case '36':
                    _this.Impv = Number(_content[1]);
                    break;
                case '37':
                    _this.ImpvAvg = Number(_content[1]);
                    break;
                case '38':
                    _this.FlowQty = Number(_content[1]);
                    break;
                case '39':
                    _this.QtyPercent = Number(_content[1]);
                    break;
                case '40':
                    _this.PriceDifRate_Buy = Number(_content[1]);
                    break;
                case '41':
                    _this.PriceDifRate_Sell = Number(_content[1]);
                    break;
                case '42':
                    _this.ReasonablePriceDiff = Number(_content[1]);
                    break;
                case '43':
                    _this.MarketMakerPoint = Number(_content[1]);
                    break;
                case '44':
                    _this.PriceOneTick = Number(_content[1]);
                    break;
                case '45':
                    _this.PriceOnePercent = Number(_content[1]);
                    break;
                case '46':
                    _this.RecoveryPrice = Number(_content[1]);
                    break;
                case '47':
                    _this.IssueFinRateBuy = Number(_content[1]);
                    break;
                case '48':
                    _this.IssueFinRateSell = Number(_content[1]);
                    break;
                case '49':
                    _this.IssueFinRate = Number(_content[1]);
                    break;
                case '50':
                    _this.IssueFinRate_origin = Number(_content[1]);
                    break;
                case '51':
                    _this.DealRecoverPrice = Number(_content[1]);
                    break;
                case '52':
                    _this.TomorrowTickBalance = Number(_content[1]);
                    break;
            }
        });
    }
    G04.prototype.toJSON = function () {
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
    };
    
    return G04;
})();

//----------------------------------------------------------------
/**S_36商品即時報價*/
var S36 = (function () {
    function S36(_Input) {
        this._rawData = [];
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
    S36.prototype.toJSON = function () {
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
    };
    S36.prototype.toString = function () {
        var str = 'S_36 MarketNo:' + this._marketNo + ' DigitNum:' + this._digitNum + ' 商品索引:' + this._productIndex + '\n';
        str += "成交價:" + this._price + ",總量:" + this._totalSize + ",買賣:" + this._bidAsk + ",瞬量:" + this._tickSize + ",買價:" + this._bid + ",買量:" + this._bidSize;
        str += "賣價:" + this._ask + ",賣量:" + this._askSize + ",買盤總量:" + this._bidTotalSize + ",賣盤總量:" + this._askTotalSize + ",時間:" + this._time + ",小數位數:" + this._digitNum;
        return str;
    };
    return S36;
})();
//----------------------------------------------------------------
/**S_43Tick*/
var S43 = (function () {
    function S43(_Input) {
        this._rawData = [];
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
        this._simulateFlag = this._rawData.ToInt(32, 1);
        this._date = this._rawData.ToInt(34, 4);
    }
    S43.prototype.toJSON = function () {
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
            DigitNum: this._digitNum,
            Date: this._date,
            SimulateFlag: this._simulateFlag
        };
        return obj;
    };
    S43.prototype.toString = function () {
        var str = 'S_43 MarketNo:' + this._marketNo + ' DigitNum:' + this._digitNum + ' 商品索引:' + this._productIndex + '\n';
        str += "流水號:" + this._ptr + ",時間:" + this._time + ",最佳買:" + this._bestBid + ",最佳賣:" + this._bestAsk + ",成交價:" + this._price + ",瞬量:" + this._size;
        return str;
    };
    return S43;
})();
//----------------------------------------------------------------
/**S_44商品5檔價量*/
var S44 = (function () {
    function S44(Input) {
        
        this.rawData = [];
        if (typeof (Input) === 'string')
            this.rawData = Input.ToByteArray();
        else
            this.rawData = Input;
        
        this.marketNo = this.rawData.ToInt(2, 1);
        this.productIndex = this.rawData.ToInt(3, 2);
        this.digitNum = this.rawData.ToInt(206, 1);
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
        this.Bid6 = this.rawData.ToInt(56, 4, this.digitNum, this.rawData[55]);
        this.BidSize6 = this.rawData.ToInt(61, 4);
        this.Bid7 = this.rawData.ToInt(66, 4, this.digitNum, this.rawData[65]);
        this.BidSize7 = this.rawData.ToInt(71, 4);
        this.Bid8 = this.rawData.ToInt(76, 4, this.digitNum, this.rawData[75]);
        this.BidSize8 = this.rawData.ToInt(81, 4);
        this.Bid9 = this.rawData.ToInt(86, 4, this.digitNum, this.rawData[85]);
        this.BidSize9 = this.rawData.ToInt(91, 4);
        this.Bid10 = this.rawData.ToInt(96, 4, this.digitNum, this.rawData[95]);
        this.BidSize10 = this.rawData.ToInt(101, 4);
        this.Ask1 = this.rawData.ToInt(106, 4, this.digitNum, this.rawData[105]);
        this.AskSize1 = this.rawData.ToInt(111, 4);
        this.Ask2 = this.rawData.ToInt(116, 4, this.digitNum, this.rawData[115]);
        this.AskSize2 = this.rawData.ToInt(121, 4);
        this.Ask3 = this.rawData.ToInt(126, 4, this.digitNum, this.rawData[125]);
        this.AskSize3 = this.rawData.ToInt(131, 4);
        this.Ask4 = this.rawData.ToInt(136, 4, this.digitNum, this.rawData[135]);
        this.AskSize4 = this.rawData.ToInt(141, 4);
        this.Ask5 = this.rawData.ToInt(146, 4, this.digitNum, this.rawData[145]);
        this.AskSize5 = this.rawData.ToInt(151, 4);
        this.Ask6 = this.rawData.ToInt(156, 4, this.digitNum, this.rawData[155]);
        this.AskSize6 = this.rawData.ToInt(161, 4);
        this.Ask7 = this.rawData.ToInt(166, 4, this.digitNum, this.rawData[165]);
        this.AskSize7 = this.rawData.ToInt(171, 4);
        this.Ask8 = this.rawData.ToInt(176, 4, this.digitNum, this.rawData[175]);
        this.AskSize8 = this.rawData.ToInt(181, 4);
        this.Ask9 = this.rawData.ToInt(186, 4, this.digitNum, this.rawData[185]);
        this.AskSize9 = this.rawData.ToInt(191, 4);
        this.Ask10 = this.rawData.ToInt(196, 4, this.digitNum, this.rawData[195]);
        this.AskSize10 = this.rawData.ToInt(201, 4);
    }
    S44.prototype.toJSON = function () {
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
            Bid6: this.Bid6,
            BidSize6: this.BidSize6,
            Bid7: this.Bid7,
            BidSize7: this.BidSize7,
            Bid8: this.Bid8,
            BidSize8: this.BidSize8,
            Bid9: this.Bid9,
            BidSize9: this.BidSize9,
            Bid10: this.Bid10,
            BidSize10: this.BidSize10,
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
            Ask6: this.Ask6,
            AskSize6: this.AskSize6,
            Ask7: this.Ask7,
            AskSize7: this.AskSize7,
            Ask8: this.Ask8,
            AskSize8: this.AskSize8,
            Ask9: this.Ask9,
            AskSize9: this.AskSize9,
            Ask10: this.Ask10,
            AskSize10: this.AskSize10,
        };
        return obj;
    };
    S44.prototype.toString = function () {
        var str = 'S_44 MarketNo:' + this.marketNo + ' DigitNum:' + this.digitNum + ' 商品索引:' + this.productIndex + '\n';
        str += "買1:" + this.Bid1 + ",買1量:" + this.BidSize1 + ",買2:" + this.Bid2 + ",買2量:" + this.BidSize2 + ",買3:" + this.Bid3 + ",買3量:" + this.BidSize3 + ",買4:" + this.Bid4 + ",買4量:" + this.BidSize4 + ",買5:" + this.Bid5 + ",買5量:" + this.BidSize5 + "買6:" + this.Bid6 + ",買6量:" + this.BidSize6 + ",買7:" + this.Bid7 + ",買7量:" + this.BidSize7 + ",買8:" + this.Bid8 + ",買8量:" + this.BidSize8 + ",買9:" + this.Bid9 + ",買9量:" + this.BidSize9 + ",買10:" + this.Bid10 + ",買10量:" + this.BidSize10 + '\n';
        str += "賣1:" + this.Ask1 + ",賣1量:" + this.AskSize1 + ",賣2:" + this.Ask2 + ",賣2量:" + this.AskSize2 + ",賣3:" + this.Ask3 + ",賣3量:" + this.AskSize3 + ",賣4:" + this.Ask4 + ",賣4量:" + this.AskSize4 + ",賣5:" + this.Ask5 + ",賣5量:" + this.AskSize5 + "賣6:" + this.Ask6 + ",賣6量:" + this.AskSize6 + ",賣7:" + this.Ask7 + ",賣7量:" + this.AskSize7 + ",賣8:" + this.Ask8 + ",賣8量:" + this.AskSize8 + ",賣9:" + this.Ask9 + ",賣9量:" + this.AskSize9 + ",賣10:" + this.Ask10 + ",賣10量:" + this.AskSize10;
        return str;
    };
    return S44;
})();
//# sourceMappingURL=OFTopicDecode.js.map

/**G_04商品初始資料*/
var G04_1 = (function () {
    function G04_1(_Input) {
        var _this = this;

        var contenarray = _Input.split(',');
        contenarray.forEach(function (data) {
            var _content = data.split('=');
            switch (_content[0]) {
                case '0':
                    _this.IndexItem = Number(_content[1]);    
                    break;
                case '1':
                    _this.WarrantId = _content[1];
                    break;
                case '2':
                    _this.WarrantName = _content[1];
                    break;
                case '3':
                    _this.TargetId = _content[1];
                    break;
                case '4':
                    _this.TargetName = _content[1];
                    break;
                case '5':
                    _this.TargetdealPrice = Number(_content[1]);
                    break;
                case '6':
                    _this.TargetdealQty = Number(_content[1]);
                    break;
                case '7':
                    _this.TargetyesQty = Number(_content[1]);
                    break;
                case '8':
                    _this.TargetUpDowm = Number(_content[1]);
                    break;
                case '9':
                    _this.TargetUpDowmP = Number(_content[1]);
                    break;
                case '10':
                    _this.TargetHV = _content[1];
                    //20:1;60:1;90:1
                    var TargetHVC = _this.TargetHV.split(';');
                    TargetHVC.forEach(function (item) {
                        var ary = item.split(':');
                        switch (ary[0]) {
                            case "20":
                                _this.TargetHV20 = Number(ary[1]);
                                break;
                            case "60":
                                _this.TargetHV60 = Number(ary[1]);
                                break;
                            case "90":
                                _this.TargetHV90 = Number(ary[1]);
                                break;
                        }
                    });
                    break;
                case '11':
                    _this.WarrantUpDowm = Number(_content[1]);
                    break;
                case '12':
                    _this.WarrantUpDowmP = Number(_content[1]);
                    break;
                case '13':
                    _this.WarrantdealPrice = Number(_content[1]);
                    break;
                case '14':
                    _this.WarrantdealQty = Number(_content[1]);
                    break;
                case '15':
                    _this.WarrantyesQty = Number(_content[1]);
                    break;
                case '16':
                    _this.WarrantbuyPrice = Number(_content[1]);
                    break;
                case '17':
                    _this.WarrantsellPrice = Number(_content[1]);
                    break;
                case '18':
                    _this.WarrantpriceBuyStd = Number(_content[1]);
                    break;
                case '19':
                    _this.WarrantpriceSellStd = Number(_content[1]);
                    break;
                case '20':
                    _this.WarrantbuyQty = Number(_content[1]);
                    break;
                case '21':
                    _this.WarrantsellQty = Number(_content[1]);
                    break;
                case '22':
                    _this.RemainDays = Number(_content[1]);
                    break;
                case '23':
                    _this.ColseYmd = Number(_content[1]);
                    break;
                case '24':
                    _this.ExecuteRate = Number(_content[1]);
                    break;
                case '25':
                    _this.EffectiveLevel = Number(_content[1]);
                    break;
                case '26':
                    _this.WarrantType = _content[1];
                    break;
                case '27':
                    _this.Delta = Number(_content[1]);
                    break;
                case '28':
                    _this.Gamma = Number(_content[1]);
                    break;
                case '29':
                    _this.Theta = Number(_content[1]);
                    break;
                case '30':
                    _this.Vega = Number(_content[1]);
                    break;
                case '31':
                    _this.IssueShares = Number(_content[1]);
                    break;
                case '32':
                    _this.StrikePrice = Number(_content[1]);
                    break;
                case '33':
                    _this.PriceInOutRate = Number(_content[1]);
                    break;
                case '34':
                    _this.ImpvBuy = Number(_content[1]);
                    break;
                case '35':
                    _this.ImpvSell = Number(_content[1]);
                    break;
                case '36':
                    _this.Impv = Number(_content[1]);
                    break;
                case '37':
                    _this.ImpvAvg = Number(_content[1]);
                    break;
                case '38':
                    _this.FlowQty = Number(_content[1]);
                    break;
                case '39':
                    _this.QtyPercent = Number(_content[1]);
                    break;
                case '40':
                    _this.PriceDifRate_Buy = Number(_content[1]);
                    break;
                case '41':
                    _this.PriceDifRate_Sell = Number(_content[1]);
                    break;
                case '42':
                    _this.ReasonablePriceDiff = Number(_content[1]);
                    break;
                case '43':
                    _this.MarketMakerPoint = Number(_content[1]);
                    break;
                case '44':
                    _this.PriceOneTick = Number(_content[1]);
                    break;
                case '45':
                    _this.PriceOnePercent = Number(_content[1]);
                    break;
                case '46':
                    _this.RecoveryPrice = Number(_content[1]);
                    break;
                case '47':
                    _this.IssueFinRateBuy = Number(_content[1]);
                    break;
                case '48':
                    _this.IssueFinRateSell = Number(_content[1]);
                    break;
                case '49':
                    _this.IssueFinRate = Number(_content[1]);
                    break;
                case '50':
                    _this.IssueFinRate_origin = Number(_content[1]);
                    break;
                case '51':
                    _this.DealRecoverPrice = Number(_content[1]);
                    break;
                case '52':
                    _this.TomorrowTickBalance = Number(_content[1]);
                    break;
            }
        });
    }

    G04_1.prototype.toJSON = function () {

        //alert("1"+this.IndexItem);
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
    };

    return G04_1;
})();


var RepeatData_S60 = (function () {
    function RepeatData_S60(input) {
        try {
            var pattern = /(\d{1,3})=((?:\w|\W)*)/g;
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
                    console.info;
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
        }
        catch (ex) {
            console.error(ex);
        }
    }
    return RepeatData_S60;
})();
/**S_60 CBAS基本資料*/
var S60 = (function () {
    function S60(_Input) {
        this._rawData = [];
        this._Data = {};
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
            var tmp = this._rawData.slice(startIndex, endIndex);
            var tmp2 = new RepeatData_S60(tmp);
            this._Data[tmp2.ProductIndex] = tmp2;
        }
        var curIndex = 0;
    }
    S60.prototype.toJSON = function () {
        var obj = {
            Topic: 'S_60',
            MarketNo: this._marketNo,
            Count: this._count,
            Data: this._Data
        };
        return obj;
    };
    S60.prototype.toString = function () {
        var str = 'S_60 MarketNo:' + this._marketNo + ' Count:' + this._count + '\n';
        for (var i in this._Data) {
            var tmp = this._Data[i];
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
    };
    return S60;
})();


/**S_61 CBAS即時行情 */
var S61 = (function () {
    function S61(Input) {
        this.rawData = [];
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
        this.cb_low_price = this.rawData.ToInt(36, 4 , this.digitNum, this.rawData[35]); //可轉債最低價
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
    S61.prototype.toJSON = function () {
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
    };
    S61.prototype.toString = function () {
        var str = 'S_61 資料長度:' + this.bodyLength +
            ' 市場代號:' + this.marketNo +
            ' 小數位數:' + this.digitNum +
            ' 商品索引:' + this.stockIndex + '\n';
        str += "可轉債買價:" + this.cb_bid_price +
            ",可轉債賣價:" + this.cb_ask_price +
            ",可轉債成交價:" + this.cb_deal_price +
            ",可轉債漲跌:" + this.cb_movement +
            ",可轉債漲跌幅度(%):" + this.cb_movement_percent +
            ",可轉債最高價:" + this.cb_high_price;+
            ",可轉債最低價:" + this.cb_low_price+
            ",可轉債單量:" + this.cb_dealQty +
            ",可轉債總成交量:" + this.cb_totalQty;
        str += "現股買價:" + this.target_bid_price +
            ",現股賣價:" + this.target_ask_price +
            ",現股成交價:" + this.target_deal_price +
            ",現股漲跌:" + this.target_movement +
            ",現股漲跌幅度(%):" + this.target_movement_percent +
            ",現股最高價:" + this.target_high_price+
            ",現股最低價:" + this.target_low_price +
            ",parity(%):" + this.parity;        
        return str;
    };
    return S61;
})();


/**R_03商品初始資料*/
var R03 = (function () {
    function R03(_Input) {
        //var _this = this;
        ////最終型態
        //this.rawData = [];
        //if (typeof (_Input) === 'string')
        //    this.rawData = _Input.ToByteArray();
        //else
        //    this.rawData = _Input;
        //var content = this.rawData.UTF8Decode(2, this.rawData.length - 2); //原先curIndex = 0,加7,就是7的位置
        //var contenarray = content.split(',');
        //var aa = contenarray.indexOf(0x01, 1);
        //console.log(aa);
        
        
        //contenarray.forEach(function (data) {
        //    var _content = data.split('=');
        //    console.log(_content);
        //    switch (_content[0]) {
        //        case '0':
        //            _this.SubjectDate = _content[1];
        //            break;
        //        case '1':
        //            _this.MarketPoint = Number(_content[1]);
        //            break;
        //        case '2':
        //            _this.MarketChange = Number(_content[1]);
        //            break;
        //        case '3':
        //            _this.MarketExtent = Number(_content[1]);
        //            break;
        //        case '4':
        //            _this.SubjectID = _content[1];
        //            break;
        //        case '5':
        //            _this.SubjectName = _content[1];
        //            break;
        //        case '6':
        //            _this.SubjectPoint = Number(_content[1]);
        //            break;
        //        case '7':
        //            _this.SubjectChange = Number(_content[1]);
        //            break;
        //        case '8':
        //            _this.SubjectExtent = parseFloat(_content[1]);
        //            break;
        //    }
        //});

        var pattern = /(\d{1,4})=((?:\w|\W)*)/g;
        var startIndex = 0;
        var endIndex = _Input.indexOf(0x01, 1);
        var runCount = 0;
        var isEnd = false;
        while (!isEnd) {
            if (runCount > 0) {
                startIndex = endIndex + 1;
                endIndex = _Input.indexOf(0x01, startIndex + 1);
                if (endIndex == -1) {
                    endIndex = _Input.length;
                    isEnd = true;
                }
            }
            var str = _Input.UTF8Decode(startIndex, endIndex - startIndex);
            pattern.lastIndex = 0;
            var regexArray = pattern.exec(str);
            //console.log(regexArray);
            if (regexArray == null) {                
                console.info;
            }
            if (regexArray != null ) {
                switch (regexArray[1]) {
                    case '1001':
                        this.MarketNo = regexArray[2];
                        break;
                    case '1002':
                        this.TWSE_No = regexArray[2];
                        break;
                    case '1003':
                        this.TradeNo = regexArray[2];
                        break;
                    case '1005':
                        this.MarketType = regexArray[2];
                        break;
                    case '1006':
                        this.ProductNo = regexArray[2];
                        break;
                    case '1007':
                        this.ReturnType = regexArray[2];
                        break;
                    case '1008':
                        this.ReturnNo = regexArray[2];
                        break;
                    case '1009':
                        this.eNumber = regexArray[2];
                        break;
                    case '1010':
                        this.pre_eNumber = regexArray[2];
                        break;
                    case '1011':
                        this.ReturnTradeType = regexArray[2];
                        break;
                    case '1012':
                        this.BrokerNo = regexArray[2];
                        break;
                    case '1013':
                        this.TradeAcno = regexArray[2];
                        break;
                    case '1014':
                        this.ibno = regexArray[2];
                        break;
                    case '1015':
                        this.TradeAcno_sub = regexArray[2];
                        break;
                    case '1016':
                        this.BuySell = regexArray[2];
                        break;
                    case '1017':
                        this.OrderType = regexArray[2];
                        break;
                    case '1018':
                        this.OrderCondition = regexArray[2];
                        break;
                    case '1019':
                        this.TradingTag = regexArray[2];
                        break;
                    case '1020':
                        this.TradeProductNo = regexArray[2];
                        break;
                    case '1021':
                        this.ReturnOneProductNo = regexArray[2];
                        break;
                    case '1022':
                        this.OneProductYM = regexArray[2];
                        break;
                    case '1023':
                        this.OneProductStrike = regexArray[2];
                        break;
                    case '1024':
                        this.ReturnTwoNo = regexArray[2];
                        break;
                    case '1025':
                        this.TwoProductYM = regexArray[2];
                        break;
                    case '1026':
                        this.TwoProductStrike = regexArray[2];
                        break;
                    case '1027':
                        this.OrderNo = regexArray[2];
                        break;
                    case '1028':
                        this.OrderPrice = regexArray[2];
                        break;
                    case '1029':
                        this.Foreign_Num = regexArray[2];
                        break;
                    case '1030':
                        this.Foreign_Den = regexArray[2];
                        break;
                    case '1031':
                        this.Foreign_TouchPrice = regexArray[2];
                        break;
                    case '1032':
                        this.Foreign_TouchPriceNum = regexArray[2];
                        break;
                    case '1033':
                        this.Foreign_TouchPriceDen = regexArray[2];
                        break;
                    case '1035':
                        this.OptionType = regexArray[2];
                        break;
                    case '1036':
                        this.Foreign_DealPriceNum = regexArray[2];
                        break;
                    case '1037':
                        this.Foreign_DealPriceDen = regexArray[2];
                        break;
                    case '1038':
                        this.OneTradePrice = regexArray[2];
                        break;
                    case '1039':
                        this.TwoTradePrice = regexArray[2];
                        break;
                    case '1040':
                        this.OrderLot = regexArray[2];
                        break;
                    case '1041':
                        this.DealLot = regexArray[2];
                        break;
                    case '1042':
                        this.TotalDealLot = regexArray[2];
                        break;
                    case '1043':
                        this.nonDealLot = regexArray[2];
                        break;
                    case '1045':
                        this.DealYMD = regexArray[2];
                        break;
                    case '1046':
                        this.DealTime = regexArray[2];
                        break;
                    case '1047':
                        this.TradeYMD = regexArray[2];
                        break;
                    case '1048':
                        this.DealNo = regexArray[2];
                        break;
                    case '1049':
                        this.DealerNo = regexArray[2];
                        break;
                    case '1050':
                        this.OrderSource = regexArray[2];
                        break;
                    case '1051':
                        this.OrderEffectiveDay = regexArray[2];
                        break;
                    case '1052':
                        this.DomesticOrderCondition = regexArray[2];
                        break;
                    case '1053':
                        this.OrderTag = regexArray[2];
                        break;
                    case '1054':
                        this.OrderVolume = regexArray[2];
                        break;
                    case '1055':
                        this.pre_OrderVolume = regexArray[2];
                        break;
                    case '1056':
                        this.DealPrice = regexArray[2];
                        break;
                    case '1057':
                        this.Domestic_Two_OneDeal = regexArray[2];
                        break;
                    case '1058':
                        this.Domestic_Two_TwoDeal = regexArray[2];
                        break;
                    case '1059':
                        this.DealType = regexArray[2];
                        break;
                    case '1060':
                        this.UserNote = regexArray[2];
                        break;
                    case '1062':
                        this.ReturnNo13 = regexArray[2];
                        break;
                    case '1063':
                        this.MarketCondition = regexArray[2];
                        break;
                    case '1064':
                        this.EffectiveOrderDate = regexArray[2];
                        break;
                    case '1065':
                        this.TotalDealLot_P_O = regexArray[2];
                        break;
                    case '1066':
                        this.nonDealLot_P_O = regexArray[2];
                        break;
                    case '1068':
                        this.RemainLot = regexArray[2];
                        break;
                    case '1070':
                        this.ReturnDeleteTag = regexArray[2];
                        break;
                    case '1071':
                        this.TandemOneTrade = regexArray[2];
                        break;
                    case '1072':
                        this.TandemTwoTrade = regexArray[2];
                        break;
                    case '1998':
                        this.ReturnErrorTag = regexArray[2];
                        break;
                    case '1999':
                        this.OrderFailMsg = regexArray[2];
                        break;
                    case '3001':
                        this.OrderNo_Sell = regexArray[2];
                        break;
                    case '3002':
                        this.HundredPrice_Buy = regexArray[2];
                        break;
                    case '3003':
                        this.Unit = regexArray[2];
                        break;
                }
                runCount++;
            }
            else {
                console.error('R03 轉換錯誤:' + str);
            }
        }
    }
    R03.prototype.toJSON = function () {
        var obj = {
            Topic: 'R_03',
            MarketNo: this.MarketNo,
            TWSE_No: this.TWSE_No,
            TradeNo: this.TradeNo,
            MarketType: this.MarketType,
            ProductNo: this.ProductNo,
            ReturnType: this.ReturnType,
            ReturnNo: this.ReturnNo,
            eNumber: this.eNumber,
            pre_eNumber: this.pre_eNumber,
            ReturnTradeType:this.ReturnTradeType,
            BrokerNo:this.BrokerNo,
            TradeAcno:this.TradeAcno,
            ibno: this.ibno,
            TradeAcno_sub: this.TradeAcno_sub,
            BuySell: this.BuySell,
            OrderType:this.OrderType,
            OrderCondition:this.OrderCondition,
            TradingTag:this.TradingTag,
            TradeProductNo:this.TradeProductNo,
            ReturnOneProductNo:this.ReturnOneProductNo,
            OneProductYM:this.OneProductYM,
            OneProductStrike:this.OneProductStrike,
            ReturnTwoNo:this.ReturnTwoNo,
            TwoProductYM:this.TwoProductYM,
            TwoProductStrike:this.TwoProductStrike,
            OrderNo:this.OrderNo,
            OrderPrice:this.OrderPrice,
            Foreign_Num:this.Foreign_Num,
            Foreign_Den:this.Foreign_Den,
            Foreign_TouchPrice:this.Foreign_TouchPrice,
            Foreign_TouchPriceNum:this.Foreign_TouchPriceNum,
            Foreign_TouchPriceDen:this.Foreign_TouchPriceDen,
            OptionType:this.OptionType,
            Foreign_DealPriceNum:this.Foreign_DealPriceNum,
            Foreign_DealPriceDen:this.Foreign_DealPriceDen,
            OneTradePrice:this.OneTradePrice,
            TwoTradePrice:this.TwoTradePrice,
            OrderLot:this.OrderLot,
            DealLot:this.DealLot,
            TotalDealLot:this.TotalDealLot,
            nonDealLot:this.nonDealLot,
            DealYMD:this.DealYMD,
            DealTime:this.DealTime,
            TradeYMD:this.TradeYMD,
            DealNo:this.DealNo,
            DealerNo:this.DealerNo,
            OrderSource:this.OrderSource,
            OrderEffectiveDay:this.OrderEffectiveDay,
            DomesticOrderCondition:this.DomesticOrderCondition,
            OrderTag:this.OrderTag,
            OrderVolume:this.OrderVolume,
            pre_OrderVolume:this.pre_OrderVolume,
            DealPrice:this.DealPrice,
            Domestic_Two_OneDeal:this.Domestic_Two_OneDeal,
            Domestic_Two_TwoDeal:this.Domestic_Two_TwoDeal,
            DealType:this.DealType,
            UserNote:this.UserNote,
            ReturnNo13:this.ReturnNo13,
            MarketCondition:this.MarketCondition,
            EffectiveOrderDate:this.EffectiveOrderDate,
            TotalDealLot_P_O:this.TotalDealLot_P_O,
            nonDealLot_P_O:this.nonDealLot_P_O,
            RemainLot:this.RemainLot,
            ReturnDeleteTag:this.ReturnDeleteTag,
            TandemOneTrade:this.TandemOneTrade,
            TandemTwoTrade:this.TandemTwoTrade,
            ReturnErrorTag:this.ReturnErrorTag,
            OrderFailMsg:this.OrderFailMsg,
            OrderNo_Sell:this.OrderNo_Sell,
            HundredPrice_Buy: this.HundredPrice_Buy,
            Unit:this.Unit,
        };
        return obj;
    };
    R03.prototype.toString = function () {
        var str = '市場別:' + this.MarketNo + '\n';
        str += "交易所別:" + this.TWSE_No
            + ",委託別:" + this.TradeNo
            + ",盤別:" + this.MarketType
            + ",商品別:" + this.ProductNo
            + ",回報類型(預約、委託..):" + this.ReturnType
            + ",回報流水號:" + this.ReturnNo
            + ",電子流水號:" + this.eNumber
            + ",原始流水號:" + this.pre_eNumber

        + ",回報類型(改價量..):" + this.ReturnTradeType
        + ",券商代號:" + this.BrokerNo
        + ",交易帳號:" + this.TradeAcno
        + ",IB代號:" + this.ibno
        + ",交易子帳號:" + this.TradeAcno_sub
        + ",買賣別:" + this.BuySell
        + ",委託方式(期選、複委託):" + this.OrderType
        + ",期選委託條件:" + this.OrderCondition
        + ",期選當沖註記:" + this.TradingTag
        + ",交易用商品代號:" + this.TradeProductNo
        + ",回報第一商品代號:" + this.ReturnOneProductNo
        + ",期選第一商品交割年月:" + this.OneProductYM
        + ",選擇權第一商品履約價:" + this.OneProductStrike
        + ",回報第二商品代號:" + this.ReturnTwoNo
        + ",期選第二商品交割年月:" + this.TwoProductYM
        + ",選擇權第二商品履約價:" + this.TwoProductStrike
        + ",委託書號:" + this.OrderNo
        + ",委託價格:" + this.OrderPrice
        + ",海期委託價格分子:" + this.Foreign_Num
        + ",海期委託價格分母:" + this.Foreign_Den
        + ",海期觸發價格:" + this.Foreign_TouchPrice
        + ",海期觸發價格分子:" + this.Foreign_TouchPriceNum
        + ",海期觸發價格分母:" + this.Foreign_TouchPriceDen
        + ",國內期選第一隻腳成交價:" + this.OneTradePrice
        + ",國內期選第二隻腳成交價:" + this.TwoTradePrice
        + ",委託股數/口數:" + this.OrderLot
        + ",成交股數/口數:" + this.DealLot
        + ",總成交股數/口數:" + this.TotalDealLot
        + ",尚未成交股數/口數:" + this.nonDealLot
        + ",下單(成交)日期:" + this.DealYMD
        + ",下單(成交)時間:" + this.DealTime
        + ",交易日期:" + this.TradeYMD
        + ",成交序號:" + this.DealNo
        + ",營業員代號:" + this.DealerNo
        + ",下單來源:" + this.OrderSource
        + ",委託有效日期:" + this.OrderEffectiveDay
        + ",國內證委託條件:" + this.DomesticOrderCondition
        + ",委託價格下單註記:" + this.OrderTag
        + ",變更前委託股數:" + this.OrderVolume
        + ",變更後委託股數:" + this.pre_OrderVolume
        + ",成交價格:" + this.DealPrice
        + ",國內期選第一隻腳成交價(第二隻腳需成交):" + this.Domestic_Two_OneDeal
        + ",國內期選第二隻腳成交價(第二隻腳需成交):" + this.Domestic_Two_TwoDeal
        + ",錯誤回報:" + this.ReturnErrorTag
        + ",委託失敗訊息:" + this.OrderFailMsg
        + ",契約代號:" + this.OrderNo_Sell
        + ",百元報價:" + this.HundredPrice_Buy
        + ",單位:" + this.Unit
        return str;
    };
    return R03;
})();