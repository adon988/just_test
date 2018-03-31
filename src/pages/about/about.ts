import { Component } from '@angular/core';
import { NavController, AlertController } from 'ionic-angular';
import * as Highcharts from 'highcharts';
import * as HighchartsMore from 'highcharts/highcharts-more';
import * as SolidGauge from 'highcharts/modules/solid-gauge';

declare var about_tg;
declare var $;
declare var highchartsOptionsSetting;
declare var endDate;
declare var beingDate;
declare var Solace;
declare var ng_p_tg;

HighchartsMore(Highcharts);
SolidGauge(Highcharts);

@Component({
  selector: 'page-about',
  templateUrl: 'about.html',
  styles: [ '#content table{ border-collapse: collapse; }  #content table tr td{ border: 1px solid gray; }']
})
export class AboutPage {
  title = 'hello about';
  fn;
  TAIEX_trend_charts;
  TAIEX_volume_charts;
  taiex_datetime;
  taiex_price;
  DealPrice = '-';
  Movement = '-';
  Range = '-';
  YSDClose = '-';
  CbOpen = '-';
  CbHigh = '-';
  CbLow = '-';
  CbTotal = '-';
  connnectToSolace=false;

  constructor(public navCtrl: NavController, private alertCtrl: AlertController) {}

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
  
  getData_S27() {
    if(Solace.connectStatus==false){
      let alert = this.alertCtrl.create({
        title: '通知',
        subTitle: '連線尚未完成',
        buttons: ['關閉']
      });
      alert.present();
      return;
    }
    var MarketNo = '0';
    var topic = Solace.CreateTopicObject('M' + MarketNo + '/S_27');
    if (topic != null) {
        Solace.Unsubscribe(topic);
    }
    this.initCharts();
    Solace.GetSolcacheData(topic , function(requestID, cacheRequestResult, userObject){},{about_tg:this});
  }

  //TAIEX_trend
  TAIEX_trend_charts_setData(data){
    this.TAIEX_trend_charts.series[0].setData(data, false);
    this.TAIEX_trend_charts.redraw();
  }
  TAIEX_trend_charts_addPoint(data){
    this.TAIEX_trend_charts.series[0].addPoint(data);
  }
  TAIEX_trend_charts_update(data, index){
    this.TAIEX_trend_charts.series[0].data[index].update(data);
  }

  //TAIEX_volume
  TAIEX_volume_charts_setData(data){
    this.TAIEX_volume_charts.series[0].setData(data, false);
    this.TAIEX_volume_charts.redraw();
  }
  TAIEX_volume_charts_addPoint(data){
    this.TAIEX_volume_charts.series[0].addPoint(data);
  }
  TAIEX_volume_charts_update(data){
    var index =this.TAIEX_volume_charts.series[0].data.length - 1;
    this.TAIEX_volume_charts.series[0].data[index].update(data);
  }

  //TAIEX_trend_table
  TAIEX_trend_table_setData(data){
    this.DealPrice = data.DealPrice;
    this.Movement = data.Movement;
    this.Range = data.Range;
    this.YSDClose = data.YSDClose;
    this.CbOpen = data.CbOpen;
    this.CbHigh = data.CbHigh;
    this.CbLow = data.CbLow;
    this.CbTotal = data.CbTotal;
  }

  initCharts(){
    this.DealPrice ='-';
    this.Movement ='-';
    this.Range ='-';
    this.YSDClose ='-';
    this.CbOpen ='-';
    this.CbHigh ='-';
    this.CbLow ='-';
    this.CbTotal ='-';

    this.fn = {
      tooltip:{
        shared: true,
        formatter: function (tg) {
          about_tg.taiex_datetime = Highcharts.dateFormat('%Y-%m-%d %H:%M:%S', tg.x);
          about_tg.taiex_price = Highcharts.numberFormat(tg.y, 2);
              // $(".taiex_datetime").text(Highcharts.dateFormat('%Y-%m-%d %H:%M:%S', tg.x));
              // $(".taiex_price").text(Highcharts.numberFormat(tg.y, 2));
              return false;
          }
        }
    }
    this.TAIEX_trend_charts = new Highcharts.chart('taiex_trend_charts', highchartsOptionsSetting({
      "title":"",
      "name":"chart1",
      "type": "spline",
      "unit":"元",
      "xAxis":{
            type: 'datetime',
            tickPixelInterval: 100,
              maxPadding: 1.5,
              max: endDate,
              min: beingDate,
              visible : false,
              crosshair: true
          },
      "data":[]
    },this.fn));

    this.TAIEX_volume_charts = new Highcharts.chart('taiex_volume_charts', highchartsOptionsSetting({
      "title":"",
      "name":"chart2",
      "type": "column",
      "unit":"元",
      "xAxis":{
            type: 'datetime',
            tickPixelInterval: 100,
              maxPadding: 1.5,
              max: endDate,
              min: beingDate,
              visible : true,
              crosshair: true
          },
      "yAxis":{"title": {text:""}},
      "data":[]
    },this.fn));
  }
  ionViewDidLoad(){
  }
  ionViewWillEnter(){
    ng_p_tg = this;
    this.connnectToSolace=Solace.connectStatus;
    console.log('enter about');
  }
}
