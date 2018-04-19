
//讀取憑證資訊宣告
var AllCertInfo = {
    sn: '',//憑證序號
    cn: '',//憑證主旨
    ntb: '',
    nta: '',
    issdn: '',
    subdn: '',
    certfinger: '',
    rawdata: '',//明文
    certtype: '',//E:台網;C:中華
    certb64: '',//密文
    verify_Code: '',
    verify_P7: '',
    verrify_Msg: '',
    code: '',
    msg: '',
    action: 'NO'
};
var VerifyInfo = {
    verify_Code: '',
    verify_P7: '',
    verrify_Msg: ''
}

var VerifyResult = '';
var g_CN = '';
var g_RawData = '';

//2016-11-22 新增各電子前台傳入idno, token
var Front = {
    idno: '',
    token: '',
    client: '',
    source: ''
};
//2016-11-22 新增判斷有無登入過
var check_login = '';

//2017-01-11 postdata
var OtherDomain = {
    idno: '',
    token: '',
    backurl: '',
    client: '',
    source: 'web'
};
//--------unnesscessary now--------//
function btnGetVersionOnClick() {

    twcaLib.GetVersion("_retGetVersion");

}
function _retGetVersion(code, msg, token, data) {
    if (data != "") {
        data = JSON.parse(data).version;
    }

    var oErrCode = $f("GetVersion_errCode");
    oErrCode.innerHTML = "錯誤代碼: " + code + "\n"
            + "錯誤訊息: " + msg + "\n"
            + "元件版本: " + data + "\n";
}
//--------unnesscessary now--------//
var checkTestVar=0;
//檢查有無憑證function
function checkBrowserCert_PhoneWeb(id, token, url) {
    //穿透使用開始↓檢查有無登入權限，並將資訊寫入session
    OtherDomain.idno = id;
    OtherDomain.token = token;
    OtherDomain.backurl = url;
   
    //穿透使用結束↑
    //var GotoCheck = function () {
    var errCode = -1;
    //暫時註解formal↓
    var oFilter = "//S_CN=" + AllCertInfo.cn + ",S_OU=The Capital Group,S_OU=RA-TheCapital,S_O=Certification Service Provider,S_O=TaiCA Secure CA,S_C=TW//";  //正式環境用
    //testing
    //var oFilter = "//S_CN=" + AllCertInfo.cn + ",S_OU=The Capital Group,S_OU=RA-TheCapitalT,S_O=Certificate Service Provider - Evaluation Only,S_O=TaiCA Secure CA - Evaluation Only,S_C=TW//";  //測試環境用
    //testing 2016/11/12
    //var oFilter = "//S_C=TW//";
    var oPassword = "";
    var oIsPasswordNull = "";
    var dDwFlagCheckCert = "0x00001000";

    var dwFlags = 0x04 | 0x08 | dDwFlagCheckCert;

    var userPin = oPassword;
    userPin = null;
    console.log('ready to twcaLib');
    do {
        console.log('continue to twcaLib');
        twcaLib.SelectSignerEx(oFilter, "", "", userPin, "", dwFlags, 0, null, "_retSelectSignerOnClicked_PhoneWeb");
    } while (false);
    //};

}
//輸入憑證匯入密碼function
function pwdBrowserCert() {
    var errCode = -1;
    //暫時註解↓
    var oFilter = "//S_CN=" + AllCertInfo.cn + ",S_OU=The Capital Group,S_OU=RA-TheCapital,S_O=Certification Service Provider,S_O=TaiCA Secure CA,S_C=TW//";     //正式環境用
    //測試環境用
    var oPassword = "";
    var oIsPasswordNull = "";
    var dDwFlagCheckCert = "0x00000000";
    var dwFlags = 0x04 | 0x08 | dDwFlagCheckCert;
    var userPin = oPassword;
    userPin = null;
    do {
        twcaLib.SelectSignerEx(oFilter, "", "", userPin, "", dwFlags, 0, null, "_retSelectSignerOnClicked_PhoneWeb");
    } while (false);
}

function _retSelectSignerOnClicked_PhoneWeb(code, msg, token, data) {
    ng_p_tg._retSelectSignerOnClicked_PhoneWeb(code, msg, token, data);
}


function btnSignPkcs7OnClick_PhoneWeb() {
    //console.log("btnSignPkcs7OnClick_PhoneWeb");
    do {
        var dwFlags = 0x0000 | 0x0001 | 0x0000;
        twcaLib.SignPkcs7(AllCertInfo.rawdata, dwFlags, "_retSignPkcs7OnClick_PhoneWeb");
    } while (false);
}
function _retSignPkcs7OnClick_PhoneWeb(code, msg, token, data) {

    if (data != "") {
        data = JSON.parse(data).signature;
    }
    var VerifyInfo = {
        verify_Code: '',
        verify_P7: '',
        verrify_Msg: ''
    }
    VerifyInfo.verify_Code = code;
    if (code == "0") {
        AllCertInfo.action = 'YES';
        AllCertInfo.verify_P7 = data;
        AllCertInfo.verrify_Msg = msg;
    }
    if (code == "5005") {
        //參數錯誤
        AllCertInfo.verify_P7 = "";
        AllCertInfo.verrify_Msg = msg;
    }
    if (code == "5067") {
        //執行簽章時，尚未選擇簽章憑證
        AllCertInfo.verify_P7 = "";
        AllCertInfo.verrify_Msg = msg;
        pwdBrowserCert();

    }
    if (code == "5061") {
        //簽章失敗
        AllCertInfo.verify_P7 = "";
        AllCertInfo.verrify_Msg = msg;
    }
    var oErrCode = $f("SignPkcs7_signValue");
}
function btnSignPkcs1OnClick() {

    var oPlainText = $f("SignPkcs1_plainText");
    var oFlag_Out = $f("SignPkcs1_FLAG_Out");
    var oFlag_Hash = $f("SignPkcs1_FLAG_Hash");

    do {
        var dwFlags = 0x0100;
        twcaLib.SignPkcs1(oPlainText.value, dwFlags, "_retSignPkcs1OnClick_PhoneWeb");

    } while (false);

}
function _retSignPkcs1OnClick_PhoneWeb(code, msg, token, data) {
    var oErrCode = $f("SignPkcs1_signValue");
    oErrCode.innerHTML = "錯誤代碼: " + code + "\n"
            + "錯誤訊息: " + msg + "\n"
            + "回傳資訊: " + data + "\n";
}
function btnResetKeyOnClick() {

    twcaLib.ResetKey("_retResetKey");

}
function _retResetKey(code, msg, token, data) {
    var oErrCode = $f("ResetKey_errCode");
    oErrCode.innerHTML = "錯誤代碼: " + code + "\n"
            + "錯誤訊息: " + msg + "\n";
}
function btnNewWindow() {

    window.open("./signTest_childWindow.htm", 'mywin', 'scrollbars=yes,width=500,height=400');

}
function SelectSignerPasswordIsNullOnClicked() {

    var oIsNull = $f("SelectSigner_password_isNull");
    var oPassword = $f("SelectSigner_password");

    if (oIsNull.checked) {
        oPassword.disabled = true;
    } else {
        oPassword.disabled = false;
    }

}
//--------unnesscessary now--------//

function $f(tagId) {
    if (document.getElementById(tagId)) {
        return document.getElementById(tagId);
    } else {
        return null;
    }
}
function downloadTCEMAP() {
    location.href = 'CapitalAP/TCEM.exe';  //正式環境
    //location.href = 'CapitalAP/TCEM(test).exe';   //測試環境
}
