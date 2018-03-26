import { Component } from '@angular/core';
import { NavController, AlertController } from 'ionic-angular';
import * as Highcharts from 'highcharts';
import * as HighchartsMore from 'highcharts/highcharts-more';
import * as SolidGauge from 'highcharts/modules/solid-gauge';

declare var Solace;
declare var cbDynamic;
declare var $;

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
  constructor(public navCtrl: NavController, private alertCtrl: AlertController) {

  }
  connnectToSolace=false;
  startConnect (){
    this.connnectToSolace=true;
    $(Solace).on(Solace.Events.OnConnected, function () {
        console.log('connect to solace');
        // SolaceInitial(); //基本資料        
        // SubjectInfoInitial(); //現股資訊-基本資料
        //SubjectInfoInitial_S36(); //現貨資訊 - 即時報價
        //initial();
        //DynamicInitial(); //回報資料
        //MySolace.SubscribeSocache("R201/SELF0082/O"); //註冊委託
        //MySolace.SubscribeSocache("R201/SELF0082/D"); //註冊委託
    });
    Solace.Connect();
  }
  

  S61_number = '18083';
  getData_S61() {
    if(this.S61_number==''){
        let alert = this.alertCtrl.create({
            title: '通知',
            subTitle: '請輸入代號',
            buttons: ['關閉']
          });
          alert.present();
    }
    cbDynamic(this.S61_number);
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
    // Highcharts.chart('container', {

    //     chart: {
    //         type: 'boxplot'
    //     },

    //     title: {
    //         text: 'Highcharts Box Plot Example'
    //     },

    //     legend: {
    //         enabled: false
    //     },

    //     xAxis: {
    //         categories: ['1', '2', '3', '4', '5'],
    //         title: {
    //             text: 'Experiment No.'
    //         }
    //     },

    //     yAxis: {
    //         title: {
    //             text: 'Observations'
    //         },
    //         plotLines: [{
    //             value: 932,
    //             color: 'red',
    //             width: 1,
    //             label: {
    //                 text: 'Theoretical mean: 932',
    //                 align: 'center',
    //                 style: {
    //                     color: 'gray'
    //                 }
    //             }
    //         }]
    //     },

    //     series: [{
    //         name: 'Observations',
    //         data: [
    //             [760, 801, 848, 895, 965],
    //             [733, 853, 939, 980, 1080],
    //             [714, 762, 817, 870, 918],
    //             [724, 802, 806, 871, 950],
    //             [834, 836, 864, 882, 910]
    //         ],
    //         tooltip: {
    //             headerFormat: '<em>Experiment No {point.key}</em><br/>'
    //         }
    //     }, {
    //         name: 'Outlier',
    //         color: Highcharts.getOptions().colors[0],
    //         type: 'scatter',
    //         data: [ // x, y positions where 0 is the first category
    //             [0, 644],
    //             [4, 718],
    //             [4, 951],
    //             [4, 969]
    //         ],
    //         marker: {
    //             fillColor: 'white',
    //             lineWidth: 1,
    //             lineColor: Highcharts.getOptions().colors[0]
    //         },
    //         tooltip: {
    //             pointFormat: 'Observation: {point.y}'
    //         }
    //     }]

    //   });
  }
}