import { Component } from '@angular/core';
import { NavController, LoadingController, AlertController } from 'ionic-angular';
import { InAppBrowser } from '@ionic-native/in-app-browser';
declare var $;
declare var AllCertInfo;
declare var checkBrowserCert_PhoneWeb;
declare var ng_p_tg;
declare var twcaLib;

@Component({
  selector: 'page-contact',
  templateUrl: 'contact.html'
})
export class ContactPage {

  constructor(private iab: InAppBrowser, public navCtrl: NavController, public loadingCtrl: LoadingController, private alertCtrl: AlertController) {
  }

  openBrowser(){
    const browser = this.iab.create('https://google.com/');
  }
  
  //Default Value
  id='P222698634';
  password='1111';
  CBAS_URL_GW_PORTAL = "https://dev-cbas.capital.com.tw/ExtProduct/Program/Portal/adam_test/";
  CBAS_URL_GW_PORTAL_IP = "https://dev-cbas.capital.com.tw/ExtProduct/Program/Portal/adam_test/getIP.aspx";
  CBAS_URL = "https://dev-cbas.capital.com.tw/ExtProduct/Program/CBAS/adam_test/"
  urlcode = "QG8RQS6FC7";
  check_results;
  ip_data;

  //login
  Login(){
      this.check_results='';
      this.ip_data='';
      let loader = this.loadingCtrl.create({
        content: "驗證中...",
      });
      loader.present();
      setTimeout(() => {
        let ng2= this;
        //Get IP
        $.getJSON(ng2.CBAS_URL_GW_PORTAL_IP).done(function(data){
          console.log(data);
          let get_ip = data.IP;
          //Check Login
          $.getJSON(ng2.CBAS_URL_GW_PORTAL, {id:ng2.id, pw: ng2.password, ip:get_ip, urlCode: ng2.urlcode}).done(function(data) {
            console.log(data);
            ng2.ip_data = get_ip;
            ng2.check_results = data;//JSON.stringify(data);

            let token = data.CAStatus.split(";")[1].split("{")[1].split("}")[0];
            let acno = data.Acno;

            if (ng2.id.toUpperCase() == "SELF0082") {
              console.log('營業員 自動登入');
            }else{
              console.log('一般使用者登入，需進入CA流程');
              ng2.certificate_authority({type:'signIn', id: ng2.id.toUpperCase(), rawdata: "srvgateway_Cert_S0001_"+acno, ip: get_ip, acno:acno, token:token });
            }
            
          }).fail(function(jqXHR, textStatus) {
            alert( "Request failed: " + textStatus );
          }).always(function() {
            loader.dismiss();
          });
        }).fail(function(jqXHR, textStatus) {
          loader.dismiss();
          alert( "Request failed: " + textStatus );
        });
      }, 3000);
  }//Login()

  
  deviceUserAgent='';
  //Certificate Authority
  certificate_authority(obj){
    let ng2 = this;
    //Agent check - Mobile Web
    if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
      ng2.deviceUserAgent = 'Agent: mobile web'+navigator.userAgent;
        let Url_data = "http://dev-ex.capital.com.tw/ExtProduct/Program/CBAS/Index_20180102.html?ID=" + obj.id + "&Acno=" + obj.acno + "&Token=" + obj.token;
        ng2.checkBrowserCert_PhoneWeb(obj.id, obj.token, Url_data);
    }else{
      ng2.deviceUserAgent = 'Agent: app'+navigator.userAgent;
    }
  }//certificate_authority()

  checkBrowserCert_PhoneWeb(id, token, url):void{
    var oFilter = "//S_CN=" + AllCertInfo.cn + ",S_OU=The Capital Group,S_OU=RA-TheCapital,S_O=Certification Service Provider,S_O=TaiCA Secure CA,S_C=TW//";
    var dwFlags = 0x04 | 0x08 | 0x00001000;
    var userPin = null;
    twcaLib.SelectSignerEx(oFilter, "", "", userPin, "", dwFlags, 0, null, "_retSelectSignerOnClicked_PhoneWeb");
  }
  
  _retSelectSignerOnClicked_PhoneWeb(code, msg, token, data):void {
    var Alertmessage;
    switch(code){
      case "5005":
        Alertmessage="參數錯誤";
        break;
      case "5010":
        Alertmessage="目前此裝置無有效TWID憑證，將導引到TWID憑證APP作業，若您尚未下載TWID APP，將自動導至Store/Play商店，請點選TWID APP進行安裝即可，並請於安裝完成後，關閉TWID APP，回到CBAS交易系統頁面進行後續操作，謝謝。"+code+','+msg+','+token+','+data;
        break;
        case "5070":
          Alertmessage="已取消";//使用者按下取消
          break;
        case "5071":
          Alertmessage="憑證錯誤";//憑證密碼錯誤
          break;
        case "5112":
          Alertmessage="讀取憑證失敗";
          break;
        case "5001":
          Alertmessage="一般錯誤";
          break;
    }

    if(Alertmessage!=''){
      let alert = this.alertCtrl.create({
        title: '通知',
        subTitle: Alertmessage,
        buttons: ['關閉']
      });
      alert.present();
      return;
    }

  }
  ionViewWillEnter(){
    ng_p_tg = this;
    console.log('enter contact');
  }
}
