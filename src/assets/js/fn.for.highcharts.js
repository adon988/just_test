
/*
Highchart opttings
there will sendback option for highcharts,
default value is setted.
*/
var date = new Date();
var year = date.getYear() + 1900;
var month = (date.getMonth() + 1 < 10 ? '0' : '') + (date.getMonth() + 1);
var day = (date.getDate() < 10 ? '0' : '') + date.getDate();
var alldate = year + "/" + month + "/" + day;
var endDate = Date.parse(alldate + ' 13:35:00');   //動態
endDate = endDate + 28800000;
var beingDate = Date.parse(alldate + ' 09:00:00');
beingDate = beingDate + 28800000;

function highchartsOptionsSetting(dataset, fn){
	//預設圖表參數
	var chartDefault = {
		"title":"",
		"name":"",
		"type": "line",
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
		"yAxis":{
	    	tickPixelInterval: 5,
	        title: {
	            text: ''
	        },
           labels: {
               style: {
                   color: '#339900'
               }
           },
	        tickcolor: '#efeb09',
	        plotLines: [{
	            value: 0,
	            width: 1,
	            color: '#808080'
	        }]
	    },
		"data":[{}]
	};
	var option = {
		lang: {noData: "無成交資料"},
        chart: {
        	type: chartDefault.type,
            backgroundColor: '#FFFFFF',
            marginRight: 20,
            marginLeft: 65
        },
        title: {
            text: chartDefault.title,
        },
        credits: {
            enabled: false
        },
        xAxis: chartDefault.xAxis,
	    yAxis: chartDefault.yAxis,
	    tooltip: {
	    	shared: true,
	        formatter: function () {
                //check tooltip
	        	try{ return fn.tooltip.formatter(this); }catch(e){ return false; }
	        }
	    },
        plotOptions: {
            series: {
                lineWidth: 1,
                turboThreshold: 50000//set it to a larger threshold, it is by default to 1000
            }
        },
        exporting: {
            enabled: false
        },
        legend: {
            enabled: false
        },
        series: [{
            data: chartDefault.data,
            name: chartDefault.name,
            type: chartDefault.type,
            color: '#FF0000',
            negativeColor: '#33CC00'
        }]
    };
    //自定義圖表
	if(typeof(dataset)!='undefined' && dataset!=""){
		option.chart.type = typeof(dataset.type)!='undefined'?dataset.type:"";
		option.title.text = typeof(dataset.title)!='undefined'?dataset.title:"";
		option.series[0].data = typeof(dataset.data)!='undefined'?dataset.data:"";
		option.series[0].name = typeof(dataset.name)!='undefined'?dataset.name:"";
		option.series[0].type = typeof(dataset.type)!='undefined'?dataset.type:"";
		option.xAxis = typeof(dataset.xAxis)!='undefined'?dataset.xAxis:chartDefault.xAxis;
		option.yAxis = typeof(dataset.yAxis)!='undefined'?dataset.yAxis:chartDefault.yAxis;
	}
	return option;
}