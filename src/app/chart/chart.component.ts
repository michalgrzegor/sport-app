import { Component, OnInit, OnDestroy } from '@angular/core';
import { SummaryDataService } from './../shared/summary-data.service';
import { Answear } from '../shared/store/chart-data.reducers';
import { HttpClientService } from '../shared/http-client.service';
import { TrainingPlan } from '../shared/store/tiles-data.reducers';
import { Observable, Subscription } from 'rxjs';
import { Tile } from '../models/tile';

import { Store } from '@ngrx/store';
import * as ChartDataActions from '../shared/store/chart-data.actions';
import * as fromApp from '../shared/store/app.reducers';

import * as moment from 'moment';
import * as _ from 'lodash';
import * as Highcharts from 'highcharts';


declare var require: any;
let Boost = require('highcharts/modules/boost');
let noData = require('highcharts/modules/no-data-to-display');
let More = require('highcharts/highcharts-more');

Boost(Highcharts);
noData(Highcharts);
More(Highcharts);
noData(Highcharts);

@Component({
  selector: 'app-chart',
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.scss']
})
export class ChartComponent implements OnInit, OnDestroy {
  summary = [
    {tag: 'trainingSessions', name: 'training sessions', selected: false, id: null}, {tag: 'totalKilometers', name: 'total km', selected: false, id: null}, {tag: 'totalMiles', name: 'total miles', selected: false, id: null}, {tag: 'totalTime', name: 'training time min', selected: false, id: null}, {tag: 'totalMeals', name: 'number of meals', selected: false, id: null}, {tag: 'totalCaloriesKj', name: 'total Kj', selected: false, id: null}, {tag: 'totalCaloriesKcal', name: 'total Kcal', selected: false, id: null}, {tag: 'totalCarbCaloriesKj', name: 'total carbohydrates kj', selected: false, id: null}, {tag: 'totalCarbCaloriesKcal', name: 'total carbohydrates Kcal', selected: false, id: null}, {tag: 'totalCarbGrams', name: 'total carbohydrates g', selected: false, id: null}, {tag: 'totalFatCaloriesKj', name: 'total fat kj', selected: false, id: null}, {tag: 'totalFatCaloriesKcal', name: 'total fat Kcal', selected: false, id: null}, {tag: 'totalFatGrams', name: 'total fat g', selected: false, id: null}, {tag: 'totalProteinCaloriesKj', name: 'total proteins kj', selected: false, id: null}, {tag: 'totalProteinCaloriesKcal', name: 'total proteins Kcal', selected: false, id: null}, {tag: 'totalProteinGrams', name: 'total proteins g', selected: false, id: null}
  ];

  trainingPlanState: Observable<TrainingPlan>;
  trainingPlanSub: Subscription;
  trainingPlan: TrainingPlan = null;

  tilesState: Observable<Tile[]>;
  tilesSub: Subscription;
  tiles: Tile[];

  isOpenState: Observable<boolean>;
  isOpenSub: Subscription;
  isOpen: boolean;

  isLeftOpenState: Observable<boolean>;
  isLeftOpenSub: Subscription;
  isLeftOpen: boolean;

  answersState: Observable<Answear[]>;
  answersSub: Subscription;
  answers: Answear[];

  loadingState: Observable<boolean>;
  loadingSub: Subscription;
  loading: boolean;


  chartTitle: string;
  datesArray: any[];
  chart: Highcharts.Chart;
  xLabels: string[];
  yAxis: any[] = [];
  series: any[] = [];
  axisId: number = 0;
  answersArray: any[];
  zoom: string = null;

  numOne: number;
  numTwo: number;

  bookmark: string = 'chart'


  public options: any = {
    colors: ['#FF5D51', '#88C540', '#614EA1', '#E8A022', '#31C2E1', '#ff907e', '#bbf871', '#917ad3', '#ffd157', '#75f5ff', '#c52528', '#569400', '#312572', '#b17200', '#0091af', '#FF5D51', '#88C540', '#614EA1', '#E8A022', '#31C2E1', '#ff907e', '#bbf871', '#917ad3', '#ffd157', '#75f5ff', '#c52528', '#569400', '#312572', '#b17200', '#0091af'],
    chart: {
      type: 'spline',
      height: 430,
      width: 999,
      zoomType: 'x',
      style: {
        fontFamily: 'Raleway',
        color: 'white'
      },
      backgroundColor: 'rgba(0,0,0,0)'
    },
    title: {
      text: null,
      style: {
        fontFamily: 'Raleway',
        color: 'white'
      },
    },
    credits: {
      enabled: false
    },
    tooltip: {
      //here is text in tooltip
      shared: true,
      crosshairs: true
    },
    plotOptions: {
      series: {
          marker: {
              enabled: true
            }
        }
    },
    yAxis: [],
    xAxis: {
      categories: this.xLabels,
      lineColor: 'rgba(255,255,255,.87)',
      tickColor: 'pink',
      labels: {
        style: {
          fontFamily: 'Raleway',
          color: 'white'
          }
      },
    },
    series: [],
    legend: {
      itemStyle: {
        fontFamily: 'Raleway',
        color: 'white'
      },
      title: {
          style: {
            fontFamily: 'Raleway',
            color: 'white'
          }
      }
  },
  }

  constructor(
    private _store: Store<fromApp.AppState>,
    private _summaryService: SummaryDataService,
    private _httpService: HttpClientService
  ) {}

  ngOnInit() {
    this.loadingState = this._store.select(state => state.chart.loading);
    this.loadingSub = this.loadingState.subscribe(
      data => {
        this.loading = data
      }
    )
    

    this.answersState = this._store.select(state => state.chart.answers);
    this.answersSub = this.answersState.subscribe(
      data => { 
        this.answers = data;
        if(this.tiles && this.answers){
          this.answersArray = this.makeSeriesFromAnswers(this.answers, this.tiles)
        }
      } 
    )

    this.isOpenState = this._store.select(state => state.chart.isOpen);
    this.isOpenSub = this.isOpenState.subscribe(
      data => {
        this.isOpen = data;
        if(!this.isLeftOpen && !this.isOpen){
          this.options.chart.width = 1162;
          if(this.chart){this.chart.setSize(1162,430,false)}
        }else if(!this.isLeftOpen && this.isOpen){
          this.options.chart.width = 866;
          if(this.chart){this.chart.setSize(866,430,false)}
        }else if(this.isLeftOpen && this.isOpen){
          this.options.chart.width = 703;
          if(this.chart){this.chart.setSize(703,430,false)}
        }else if(this.isLeftOpen && !this.isOpen){
          this.options.chart.width = 999;
          if(this.chart){this.chart.setSize(999,430,false);}
        }
      }
    )

    this.isLeftOpenState = this._store.select(state => state.chart.isLeftOpen);
    this.isLeftOpenSub = this.isLeftOpenState.subscribe(
      data => {
        this.isLeftOpen = data;
        if(!this.isLeftOpen && !this.isOpen){
          this.options.chart.width = 1162;
          if(this.chart){this.chart.setSize(1162,430,false)}
        }else if(!this.isLeftOpen && this.isOpen){
          this.options.chart.width = 866;
          if(this.chart){this.chart.setSize(866,430,false)}
        }else if(this.isLeftOpen && this.isOpen){
          this.options.chart.width = 703;
          if(this.chart){this.chart.setSize(703,430,false)}
        }else if(this.isLeftOpen && !this.isOpen){
          this.options.chart.width = 999;
          if(this.chart){this.chart.setSize(999,430,false);}
        }
      }
    )
    
    this.tilesState = this._store.select(state => state.tiles.tiles);
    this.tilesSub = this.tilesState.subscribe(
      tiles => {
        if(tiles){
          this.tiles = tiles;
          if(this.tiles && this.answers){
            this.answersArray = this.makeSeriesFromAnswers(this.answers, this.tiles)
          }
        }
      }
    );
    
    this.trainingPlanState = this._store.select(state => state.tiles.trainingPlan);
    this.trainingPlanSub = this.trainingPlanState.subscribe(
      tp => {
        if(tp){

          this.summary = this.summary.map(sum => {sum.selected = false; return sum})

          this._httpService.fetchChartData(tp.id);
          this.trainingPlan = tp;
          this.options.yAxis = [];
          this.options.series = [];
          this.yAxis = [];
          this.series = [];
          this.makeXlabels(tp);

          if(!this.isLeftOpen && !this.isOpen){
            this.options.chart.width = 1162;
          }else if(!this.isLeftOpen && this.isOpen){
            this.options.chart.width = 866;
          }else if(this.isLeftOpen && this.isOpen){
            this.options.chart.width = 703;
          }else if(this.isLeftOpen && !this.isOpen){
            this.options.chart.width = 999;
          }
          
          this.options.xAxis.categories = this.xLabels;

          setTimeout(() => {
            this.makeDataArray(tp,this.tiles)
            // this.makeChart()
          }, 1);
          
        }
      }
    );
  };

  makeChart(){
    this.chart = Highcharts.chart('container', this.options);
  }

  changeBookmark(string: string){
    this.summary = this.summary.map(sum => {sum.selected = false; return sum});
    this.zoom = null;
    this.bookmark = string;
    if(string==='chart'){
      setTimeout(() => {
        this.makeChart()
      }, 1);
    }
  }

  makeSeriesFromAnswers(answers: Answear[], tiles: Tile[]){
    let array = [];

    answers.forEach(
      an => {
        if(array.length>0 && array.filter(el => el.tile_id === an.tile_id).length > 0){
          const index = array.indexOf(array.find(el => el.tile_id===an.tile_id));
          array[index].series.push({
            date: an.question_date,
            answer: an.question_answer
          })
        }else{
          array.push({
            tile_id: an.tile_id,
            question: tiles.find(tile => tile.id===an.tile_id).tile_title,
            selected: false,
            series: [
              {
                date: an.question_date,
                answer: an.question_answer
              }
            ]
          })
        }
      }
    );


    return array

  };

  makeXlabels(tp: TrainingPlan) {
    const from = moment(tp.date_from).startOf('month').format("MM-DD-YYYY");
    const to = moment(tp.date_to).endOf('month').format("MM-DD-YYYY");
    const array = [];

    for (let a = from; a !== to; a = moment(a).add(1,"day").format("MM-DD-YYYY")) {
      array.push(a)
    };

    array.push(to);

    this.xLabels = array;
  }

  makeDataArray(tp: TrainingPlan, tiles: Tile[]){
    let assoArray = [...tp.calendar_assocs]
    const datesArray = this.xLabels.map(date => {return {oDate: date,tiles: [],summary: null}});;
    
    datesArray.forEach(
      date => {
        assoArray.forEach(
          ( asso, index ) => {
            if(moment(asso.calendar_date).format("MM-DD-YYYY")===date.oDate){
              date.tiles.push(tiles.find(tile=>{return tile.id===asso.tile_id}));
            }
          })});

    datesArray.forEach(
      date => {
        if(date.tiles){
          date.summary = this._summaryService.makeSummary(date.tiles)
        }
      }
    );

    this.datesArray = datesArray
    this._store.dispatch(new ChartDataActions.Loading(false));
    setTimeout(() => {
      this.makeChart()
    }, 1);
  }

  isEven(n: number){
    return n % 2 == 0;
  }

  addNewChart(tag: string, name: string, index: number, id: string){
    

    if(!this.summary[index].selected){

      const dataArray = [];
      if(tag!=='totalTime'){
        this.datesArray.forEach(
          data => {
            dataArray.push(data.summary[tag]);
          }
        )
      }else{
        this.datesArray.forEach(
          data => {
            let num = Number(data.summary[tag].toString().replace(':', '.'));
            let hours = Math.floor(num);
            let minutes = (num - hours)*100;
            let sum = Math.round(hours*60 + minutes);
            dataArray.push(sum);
          }
        )
      }
      
      this.chart.addAxis({
        id: `id-${this.axisId}`,
        gridLineWidth: 0.2,
        title: {
          text: name,
          style: {
              color: 'white'
          }
        },
        labels: {
            format: '{value}',
            style: {
                color: 'white'
            }
        },
        opposite: this.isEven(this.options.yAxis.length)
      }, false)
      
      this.chart.addSeries({
        yAxis: `id-${this.axisId}`,
        name: name,
        data: dataArray,
        type: 'spline'
      })
  
      this.summary[index].id = `id-${this.axisId}`;

      this.axisId++
    }else{
      this.chart.get(id).remove();
    }

    this.summary[index].selected = !this.summary[index].selected;
  }

  setZoom(numOne: number, numTwo: number){
    if(numTwo===6 && this.chart.series.length>0){
      this.zoom = 'week'
    }else if(numTwo===30 && this.chart.series.length>0){
      this.zoom = 'month'
    }
    if(!this.numOne && !this.numTwo){
      this.numOne = numOne;
      this.numTwo = numTwo;
      this.chart.xAxis[0].setExtremes(this.numOne,this.numTwo);
    }else if(this.numTwo && this.numTwo-this.numOne < numTwo-numOne){
      //resize from week to month
      if(this.numOne-12 >= 0 && this.numTwo+12 <= this.xLabels.length-1){
        this.numOne = this.numOne-12;
        this.numTwo = this.numTwo+12;
        this.chart.xAxis[0].setExtremes(this.numOne,this.numTwo);
      }else if(this.numOne-12 < 0 && this.numTwo+12 <= this.xLabels.length-1){
        this.numTwo = this.numTwo+24-this.numOne;
        this.numOne = 0;
        this.chart.xAxis[0].setExtremes(this.numOne,this.numTwo);
      }else if(this.numOne-12 >= 0 && this.numTwo+12 > this.xLabels.length-1){
        this.numOne = this.numOne+(this.xLabels.length-1-this.numTwo)-24;
        this.numTwo = this.xLabels.length-1;
        this.chart.xAxis[0].setExtremes(this.numOne,this.numTwo);
      }
    }else if(this.numTwo && this.numTwo-this.numOne > numTwo-numOne){
      //resize from month to week
      this.numOne = this.numOne+12;
      this.numTwo = this.numTwo-12;
      this.chart.xAxis[0].setExtremes(this.numOne,this.numTwo);
    }
  }

  nextTimeStamp(num: number){
    if(this.numOne+num>=0 && this.numTwo+num<this.xLabels.length-1){
      this.numOne = this.numOne+num;
      this.numTwo = this.numTwo+num;
      this.chart.xAxis[0].setExtremes(this.numOne,this.numTwo);  
    }else if(this.numOne+num<0 && this.numOne!==0 && this.numTwo+num<this.xLabels.length-1){
      this.numTwo = this.numTwo-this.numOne;
      this.numOne = 0;
      this.chart.xAxis[0].setExtremes(this.numOne,this.numTwo);
    }else if(this.numOne+num>=0 && this.numTwo+num>this.xLabels.length-1){
      this.numOne = this.xLabels.length-1 - (this.numTwo-this.numOne);
      this.numTwo = this.xLabels.length-1;
      this.chart.xAxis[0].setExtremes(this.numOne,this.numTwo);
    }else if(this.numOne+num<0 && this.numTwo+num>this.xLabels.length-1){
      this.numOne = 0;
      this.numTwo = this.xLabels.length-1;
      this.chart.xAxis[0].setExtremes(this.numOne,this.numTwo);
    }
  }

  resetZoom(){
    this.zoom = null
    this.chart.zoomOut();
    this.numTwo=null;
    this.numOne=null;
  }

  ngOnDestroy(): void {
    this.trainingPlanSub.unsubscribe();
    this.tilesSub.unsubscribe();
    this.isOpenSub.unsubscribe();
    this.isLeftOpenSub.unsubscribe();
    this.answersSub.unsubscribe();
    this.loadingSub.unsubscribe();
  }
}
