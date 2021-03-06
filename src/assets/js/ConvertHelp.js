/**
 * 將string轉成byte array
 */
String.prototype.ToByteArray = function () {
    var x = 1;
    var self = this, hex, result = [];
    for (var i = 0; i < self.length; i++) {
        hex = self.charCodeAt(i).toString(16);
        result.push(parseInt('0x' + hex));
    }
    return result;
};
/**
 * 將指定範圍內容轉成ASCII字串(傳入start、len)，或將陣列內容print出來
 */
Array.prototype.ToString = function () {
    var self = this;
    var result = '[', hex = '';
    for (var i = 0; i < self.length; i++) {
        if (i > 1 && i % 10 == 0)
            result += '&nbsp;&nbsp;&nbsp;&nbsp;\\\\' + (i - 10).toString() + '~' + (i - 1).toString() + '</br>';
        hex = self[i].toString(16);
        if (hex.length == 1)
            hex = '0' + hex;
        result += '0x' + hex + ',';
    }
    return result.substring(0, result.length - 1) + ']';
};
/**
 * 將byte array range轉成十進位數字
 * @param start 起始位置
 * @param len 長度
 * @param digit 小數位數
 * @param sign 正負號(0x30正0x2d負)
 * @return number
 */
Array.prototype.ToInt = function (start, len, digit, sign) {
    if (digit === void 0) { digit = 0; }
    if (sign === void 0) { sign = 0x30; }
    var self = this, tmp = 0;
    var tmparr = self.slice(start, start + len);
    for (var i = tmparr.length; i > 0; i--) {
        //tmp = tmp | ((tmparr[i - 1] & 0xff) << (8 * (i - 1)));//數字很大會變負數
        tmp = tmp + ((tmparr[i - 1]) * (Math.pow(256, (i - 1))));
    }
    if (digit > 0 && tmp != 999999)
        tmp = tmp / Math.pow(10, digit);
    if (sign == 0x2d)
        tmp = tmp * -1;
    return tmp;
};
/**
 * 將指定範圍的byte轉成文字(商品索引用)
 * @param start 起始位置
 * @param len 長度
 * @return string
 */
Array.prototype.ToX2 = function (start, len) {
    var self = this, result = "";
    var tmparr = self.slice(start, start + len);
    for (var i = tmparr.length; i > 0; i--) {
        result += tmparr[i - 1].toString(16);
    }
    return result;
};
/**
 * 將指定範圍的byte用UTF-8編碼轉成文字
 * @param start 起始位置
 * @param len 長度
 * @return string
 */
Array.prototype.UTF8Decode = function (start, len) {
    //REF: https://terenceyim.wordpress.com/2011/03/04/javascript-utf-8-codec-that-supports-supplementary-code-points/
    var self = this;
    var tmparr = self.slice(start, start + len);
    var code, i;
    var result = "";
    for (i = 0; i < tmparr.length; i++) {
        if (tmparr[i] <= 0x7f) {
            result += String.fromCharCode(tmparr[i]);
        }
        else if (tmparr[i] >= 0xc0) {
            if (tmparr[i] < 0xe0) {
                code = ((tmparr[i++] & 0x1f) << 6) |
                    (tmparr[i] & 0x3f);
            }
            else if (tmparr[i] < 0xf0) {
                code = ((tmparr[i++] & 0x0f) << 12) |
                    ((tmparr[i++] & 0x3f) << 6) |
                    (tmparr[i] & 0x3f);
            }
            else {
                // turned into two characters in JS as surrogate pair
                code = (((tmparr[i++] & 0x07) << 18) |
                    ((tmparr[i++] & 0x3f) << 12) |
                    ((tmparr[i++] & 0x3f) << 6) |
                    (tmparr[i] & 0x3f)) - 0x10000;
                // High surrogate
                result += String.fromCharCode(((code & 0xffc00) >>> 10) + 0xd800);
                // Low surrogate
                code = (code & 0x3ff) + 0xdc00;
            }
            result += String.fromCharCode(code);
        } // Otherwise it's an invalid UTF-8, skipped.
    }
    return result.trim();
};
