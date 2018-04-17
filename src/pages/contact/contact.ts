import { Component } from '@angular/core';
import { NavController, LoadingController } from 'ionic-angular';

declare var $;
declare var AllCertInfo;
declare var checkBrowserCert_PhoneWeb;
@Component({
  selector: 'page-contact',
  templateUrl: 'contact.html'
})
export class ContactPage {

  constructor(public navCtrl: NavController, public loadingCtrl: LoadingController) {
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

  
  deviceUserAgent='----';
  //Certificate Authority
  certificate_authority(obj){
    let ng2 = this;
    console.log({ 
      "note": "1",
      "idno": obj.id,
      "trantype": "78", 
      "certtype": AllCertInfo.certtype, //AllCertInfo.certtype
      "cn": obj.id,
      "certid": AllCertInfo.sn,//AllCertInfo.sn 
      "b64p7sig": AllCertInfo.verify_P7, //AllCertInfo.verify_P7
      "rawdata": obj.rawdata, 
      "clientip":obj.ip, 
      "source": "web"});
    //Agent check - Mobile Web
    if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
      ng2.deviceUserAgent = 'Agent: mobile web'+navigator.userAgent;
        let Url_data = "http://dev-ex.capital.com.tw/ExtProduct/Program/CBAS/Index_20180102.html?ID=" + obj.id + "&Acno=" + obj.acno + "&Token=" + obj.token;
        
        checkBrowserCert_PhoneWeb(obj.id, obj.token, Url_data);


        console.log({ 
          "note":"2",
          "idno": obj.id,
          "trantype": "78", 
          "certtype": AllCertInfo.certtype, //AllCertInfo.certtype
          "cn": obj.id,
          "certid": AllCertInfo.sn,//AllCertInfo.sn 
          "b64p7sig": AllCertInfo.verify_P7, //AllCertInfo.verify_P7
          "rawdata": obj.rawdata, 
          "clientip":obj.ip, 
          "source": "web"});
      // $.ajax({
      //     url: ng2.CBAS_URL + 'S0001.ashx',
      //     type: "POST",
      //     async: true,
      //     data: { 
      //               "idno": obj.id,
      //               "trantype": "78", 
      //               "certtype": AllCertInfo.certtype, //AllCertInfo.certtype
      //               "cn": obj.id,
      //               "certid": AllCertInfo.sn,//AllCertInfo.sn 
      //               "b64p7sig": AllCertInfo.verify_P7, //AllCertInfo.verify_P7
      //               "rawdata": obj.rawdata, 
      //               "clientip":obj.ip, 
      //               "source": "web"},
      //     success: function (data) {
      //         console.log('完成');
      //         console.log(data);  
            // //alert(data);
              // var ary = data.split(":")[1].split(",");
              // var ary_msg = data.split(":")[2].split("}");
              // if (ary[0] == '"000"') {
              //     //alert("PhoneWeb_SECCESS");
              //     // window.location.href = urlPortal + ID.toUpperCase() + "&Acno=" + Acno + "&Token=" + Token;
              //     console.log('phoneweb success');
              // }
              // else {
              //     console.log('other success');
              //     // if (Source == "ios" || Source == "android") {
              //     //     alert(ary_msg[0]);
              //     // }
              //     // else {
              //     //     alert(ary_msg[0]);
              //     // }
              // }
          // },
      //     error: function (xhr) {

      //         console.log('error happened');
      //         console.log(xhr);
      //         // if (Source == "ios" || Source == "android") {
      //         //     SystemMessage(xhr.statusText);
      //         // }
      //         // else {
      //         //     alert(xhr.statusText);
      //         // }
      //     }
      // });
    }else{
      ng2.deviceUserAgent = 'Agent: app'+navigator.userAgent;
    }
  }//certificate_authority()
  
}
