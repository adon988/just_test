import { Component } from '@angular/core';
import { NavController, LoadingController } from 'ionic-angular';

declare var $;
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
  urlcode = "QG8RQS6FC7";
  check_results;
  ip_data;

  //login check
  Login(){
      this.check_results='';
      this.ip_data='';
      let loader = this.loadingCtrl.create({
        content: "驗證中...",
      });
      loader.present();
      setTimeout(() => {let ng2= this;
        //Get IP
        $.getJSON(ng2.CBAS_URL_GW_PORTAL_IP).done(function(data){
          console.log(data);
          let get_ip = data.IP;
          //Check Login
          $.getJSON(ng2.CBAS_URL_GW_PORTAL, {id:ng2.id, pw: ng2.password, ip:get_ip, urlCode: ng2.urlcode}).done(function(data) {
            console.log(data);
            ng2.ip_data = get_ip;
            ng2.check_results = data;//JSON.stringify(data);
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
  }
}
