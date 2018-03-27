import { Component } from '@angular/core';
import { NavController, AlertController } from 'ionic-angular';
import * as Highcharts from 'highcharts';
import * as HighchartsMore from 'highcharts/highcharts-more';
import * as SolidGauge from 'highcharts/modules/solid-gauge';

declare var Solace;
declare var cbgetSolaceDataS27;
declare var $;

HighchartsMore(Highcharts);
SolidGauge(Highcharts);

@Component({
  selector: 'page-about',
  templateUrl: 'about.html',
  styles: [ '#content table{ border-collapse: collapse; }  #content table tr td{ border: 1px solid gray; }']
})
export class AboutPage {
  title = 'hello about';
  constructor(public navCtrl: NavController, private alertCtrl: AlertController) {

  }

  getData_S27() {
    cbgetSolaceDataS27();
  }


}
