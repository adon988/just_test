import { Component } from '@angular/core';
import { NavController, AlertController } from 'ionic-angular';
import * as Highcharts from 'highcharts';
import * as HighchartsMore from 'highcharts/highcharts-more';
import * as SolidGauge from 'highcharts/modules/solid-gauge';

declare var Solace;
declare var cbDynamic;
declare var $;
declare var ng_p_tg;

HighchartsMore(Highcharts);
SolidGauge(Highcharts);

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})

export class HomePage {
    id = '';
    password = '';
    mylistResult =[
        { id: 11, name: 'Mr. Nice' },
        { id: 12, name: 'Narco' },
        { id: 13, name: 'Bombasto' },
        { id: 14, name: 'Celeritas' },
        { id: 15, name: 'Magneta' },
        { id: 16, name: 'RubberMan' },
        { id: 17, name: 'Dynama' },
        { id: 18, name: 'Dr IQ' },
        { id: 19, name: 'Magma' },
        { id: 20, name: 'Tornado' }
      ];
  connnectToSolace=false;
  constructor(public navCtrl: NavController, private alertCtrl: AlertController) {

  }
  startConnect (){
    $(Solace).on(Solace.Events.OnConnected, function () {});
    Solace.Connect();
  }

  statusDisconnect(){
    if(Solace.connectStatus==false){
      let alert = this.alertCtrl.create({
        title: '通知',
        subTitle: '連線尚未完成',
        buttons: ['關閉']
      });
      alert.present();
      return;
    }
  }

  S61_number = '45511';
  getData_S61() {
    if(this.S61_number==''){
        let alert = this.alertCtrl.create({
            title: '通知',
            subTitle: '請輸入代號',
            buttons: ['關閉']
        });
        alert.present();
        return;
    }
    var topic = Solace.CreateTopicObject('M201/' + this.S61_number + '/S_61');
    if (topic != null) {
        Solace.Unsubscribe(topic);
    }
    Solace.GetSolcacheData(topic);
  }
  

  onSelect(n){
    console.log(n);
  }

  onSubmit(){
    $.getJSON("http://localhost/testing/fackapi/data.php", {a:1,b:2}).done(function(json){
        console.log(json);
    }).fail(function(jqxhr, textStatus, error){
        var err = textStatus + ", " + error;
        console.log( "Request Failed: " + err );
    });
    let alert = this.alertCtrl.create({
      title: 'Submit Form',
      subTitle: this.id+','+this.password,
      buttons: ['關閉']
    });
    alert.present();
    console.log(this.id+','+this.password);
  }

  ionViewDidLoad(){
  }
  ionViewWillEnter(){
    ng_p_tg = this;
    this.connnectToSolace=Solace.connectStatus;
    console.log('enter home');
  }
}