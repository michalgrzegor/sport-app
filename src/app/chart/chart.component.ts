import { SummaryDataService } from './../shared/summary-data.service';
import { Component, OnInit, OnDestroy } from '@angular/core';

import { Store } from '@ngrx/store';
import * as ChartDataActions from '../shared/store/chart-data.actions';
import * as fromApp from '../shared/store/app.reducers';
import { Observable, Subscription } from 'rxjs';
import { TrainingPlan } from '../shared/store/tiles-data.reducers';

import { Tile } from '../models/tile';

import * as moment from 'moment';
import * as _ from 'lodash';
import * as Highcharts from 'highcharts';
import { Answear } from '../shared/store/chart-data.reducers';
import { stringify } from 'querystring';
import { HttpClientService } from '../shared/http-client.service';

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
  styleUrls: ['./chart.component.css']
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

  labels = ['dupa', 'dupsko', 'kupa', 'członek', 'pupka'];

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
        console.log(`appcomponent ================>`,data)
      }
    )
    

    this.answersState = this._store.select(state => state.chart.answears);
    this.answersSub = this.answersState.subscribe(
      data => { 
        console.log(data);
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
          console.log(`isOpen: 1`)
          this.options.chart.width = 1162;
          if(this.chart){this.chart.setSize(1162,430,false)}
        }else if(!this.isLeftOpen && this.isOpen){
          console.log(`isOpen: 2`)
          this.options.chart.width = 866;
          if(this.chart){this.chart.setSize(866,430,false)}
        }else if(this.isLeftOpen && this.isOpen){
          console.log(`isOpen: 3`)
          this.options.chart.width = 703;
          if(this.chart){this.chart.setSize(703,430,false)}
        }else if(this.isLeftOpen && !this.isOpen){
          console.log(`isOpen: 4`)
          this.options.chart.width = 999;
          if(this.chart){this.chart.setSize(999,430,false);}
        }
      }
    )

    this.isLeftOpenState = this._store.select(state => state.chart.isLeftOpen);
    this.isLeftOpenSub = this.isLeftOpenState.subscribe(
      data => {
        this.isLeftOpen = data;
        console.log(data, this.isOpen);
        if(!this.isLeftOpen && !this.isOpen){
          console.log(`isLeftOpen: 1`)
          this.options.chart.width = 1162;
          if(this.chart){this.chart.setSize(1162,430,false)}
        }else if(!this.isLeftOpen && this.isOpen){
          console.log(`isLeftOpen: 2`)
          this.options.chart.width = 866;
          if(this.chart){this.chart.setSize(866,430,false)}
        }else if(this.isLeftOpen && this.isOpen){
          console.log(`isLeftOpen: 3`)
          this.options.chart.width = 703;
          if(this.chart){this.chart.setSize(703,430,false)}
        }else if(this.isLeftOpen && !this.isOpen){
          console.log(`isLeftOpen: 4`)
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

    console.log(array);

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











































// this.yAxis.push(
      //   { 
      //     gridLineWidth: 0,
      //     title: {
      //         text: name,
      //         style: {
      //             color: this.options.colors[this.options.yAxis.length]
      //         }
      //     },
      //     labels: {
      //         format: '{value}',
      //         style: {
      //             color: this.options.colors[this.options.yAxis.length]
      //         }
      //     },
      //     opposite: this.isEven(this.options.yAxis.length)
      //   }
      // );
      // this.series.push(
      //   {
      //     name: name,
      //     yAxis: this.options.series.length,
      //     data: dataArray
      //   }
      // );

// // this.yAxis = [...this.yAxis.splice(this.yAxis.indexOf(this.findInArray(this.yAxis,name)),1)];
      // // this.series = [...this.series.splice(this.series.indexOf(this.findInArrayTwo(this.series,name)),1)];
      // this.yAxis.splice(this.yAxis.indexOf(this.findInArray(this.yAxis,name)),1);
  	  // this.series.splice(this.series.indexOf(this.findInArrayTwo(this.series,name)),1);
      // this.options.yAxis = [];
      // this.options.series = [];
      // if(this.yAxis.length !== 0){
      //   let op = this.yAxis[0].opposite;
      //   this.yAxis.forEach(
      //     axis => {
      //       axis.opposite = op;
      //       this.options.yAxis.push(axis);
      //       op = !op
      //     }
      //   )
      //   let a = 0;
      //   this.series.forEach(
      //     serie => {
      //       serie.yAxis = a
      //       this.options.series.push(serie);
      //       a++
      //     }
      //   )
      // }
      // console.log(this.options);
      // this.chart = Highcharts.chart('container', this.options);










// public options: any = {
//   chart: {
//     type: 'spline',
//     height: 700,
//     zoomType: 'x'
//   },
//   title: {
//     text: 'Sample Scatter Plot'
//   },
//   credits: {
//     enabled: false
//   },
//   tooltip: {
//     //here is text in tooltip
//     formatter: function() {
//       return 'oś x: ' + this.x +' oś y: ' + this.y.toFixed(2);
//     }
//   },
//   plotOptions: {
//     series: {
//         marker: {
//             enabled: true
//           }
//       }
//   },
//   yAxis: [
//     { // Primary yAxis
//       labels: {
//           format: '{value}°C',
//           style: {
//               color: Highcharts.getOptions().colors[0]
//           }
//       },
//       title: {
//           text: 'Temperature',
//           style: {
//               color: Highcharts.getOptions().colors[0]
//           }
//       },
//       opposite: true

//     }, 
//     { // Secondary yAxis
//         gridLineWidth: 0,
//         title: {
//             text: 'Rainfall',
//             style: {
//                 color: Highcharts.getOptions().colors[1]
//             }
//         },
//         labels: {
//             format: '{value} mm',
//             style: {
//                 color: Highcharts.getOptions().colors[1]
//             }
//         }

//     }, 
//     { // Tertiary yAxis
//         gridLineWidth: 0,
//         title: {
//             text: 'Sea-Level Pressure',
//             style: {
//                 color: Highcharts.getOptions().colors[2]
//             }
//         },
//         labels: {
//             format: '{value} mb',
//             style: {
//                 color: Highcharts.getOptions().colors[2]
//             }
//         },
//         opposite: true
//     }, 
//     { 
//         gridLineWidth: 0,
//         categories: this.labels,
//         title: {
//             text: 'dupy',
//             style: {
//                 color: Highcharts.getOptions().colors[3]
//             }
//         },
//         labels: {
//           format: '{value}',
//           style: {
//             color: Highcharts.getOptions().colors[3]
//         }
//         },
//         opposite: false
//     }
// ],
//   xAxis: {
//     categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul']
//   },
//   series: [
//     {
//     name: 'Installation',
//     yAxis: 0,
//     data: [1, 4, 5, null, null, null, 3, 9, 6, 3, 9, 4, 5, 3, 1]
//     }, 
//     {
//     name: 'Manufacturing',
//     yAxis: 1,
//     data: [123, 324, 234, 263, 347, 478, 543, 455, 123, null, null, 789, 232, 344, 345]
//     }, 
//     {
//     name: 'Sales & Distribution',
//     yAxis: 2,
//     data: [11744, 17722, 16005, 19771, null, null, null, 39387, 17722, 16005, 19771, 20185, 24377, 32147, 39387]
//     }, 
//     {
//     name: 'dupa',
//     yAxis: 3,
//     data: [0,1,2,1,2,1,2,3,2,3,2,3,1,1,0]
//     // data: ['dupa', 'dupsko', 'kupa', 'członek', 'pupka', 'dupsko', 'kupa', 'członek', 'pupka', 'dupsko', 'kupa', 'członek', 'pupka', 'dupsko', 'kupa']
//     }
//   ],
// }













// import { Answear, TpAnswear } from './../shared/store/chart-data.reducers';
// import { Component, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
// import { Chart } from 'chart.js';
// import { Observable, Subscription } from 'rxjs';

// import { Store } from '@ngrx/store';
// import * as ChartDataActions from '../shared/store/chart-data.actions';
// import * as fromApp from '../shared/store/app.reducers';

// import { Tile } from '../models/tile';

// import * as moment from 'moment';
// import * as _ from 'lodash';
// import { SummaryDataService } from '../shared/summary-data.service';
// import { MatPaginator, MatTableDataSource, MatSort, MatSnackBar } from '@angular/material';

// import { trigger, state, style, transition, animate } from '@angular/animations';
// import { HttpClientService } from '../shared/http-client.service';

// export interface AnswerDataTimeline {
//   tileName: number;
//   answer: string;
//   date: string;
//   comment: string;
// }

// @Component({
//   selector: 'app-chart',
//   templateUrl: './chart.component.html',
//   styleUrls: ['./chart.component.css'],
//   animations: [
//     trigger('hideShow', [
//       state('show', style({minHeight: '150px'})),
//       state('hide', style({minHeight: '0px', height: '0px'})),
//       transition('show => hide', animate('0.2s ease-in')),
//       transition('hide => show', animate('0.2s ease-out'))
//     ]),
//     trigger('an_hideShow', [
//       state('an_show', style({minHeight: '48px'})),
//       state('an_hide', style({minHeight: '0px', height: '0px'})),
//       transition('an_show => an_hide', animate('0.1s ease-in')),
//       transition('an_hide => an_show', animate('0.1s ease-out'))
//     ]),
//     trigger('fade', [
//       transition('* => void', [style({opacity: 1}), animate('0.001s ease-in')])
//     ]),
//     trigger('rotate', [
//       state('show', style({transform: 'rotate(0deg)'})),
//       state('hide', style({transform: 'rotate(180deg)'})),
//       transition('show => hide', animate('0.4s ease-in')),
//       transition('hide => show', animate('0.4s ease-out'))
//     ]),
//     trigger('an_rotate', [
//       state('an_show', style({transform: 'rotate(0deg)'})),
//       state('an_hide', style({transform: 'rotate(180deg)'})),
//       transition('an_show => an_hide', animate('0.4s ease-in')),
//       transition('an_hide => an_show', animate('0.4s ease-out'))
//     ])
//   ],
// })
// @Component({
//   selector: 'app-chart',
//   templateUrl: './chart.component.html',
//   styleUrls: ['./chart.component.css'],
//   animations: [
//     trigger('hideShow', [
//       state('show', style({minHeight: '150px'})),
//       state('hide', style({minHeight: '0px', height: '0px'})),
//       transition('show => hide', animate('0.2s ease-in')),
//       transition('hide => show', animate('0.2s ease-out'))
//     ]),
//     trigger('an_hideShow', [
//       state('an_show', style({minHeight: '48px'})),
//       state('an_hide', style({minHeight: '0px', height: '0px'})),
//       transition('an_show => an_hide', animate('0.1s ease-in')),
//       transition('an_hide => an_show', animate('0.1s ease-out'))
//     ]),
//     trigger('fade', [
//       transition('* => void', [style({opacity: 1}), animate('0.001s ease-in')])
//     ]),
//     trigger('rotate', [
//       state('show', style({transform: 'rotate(0deg)'})),
//       state('hide', style({transform: 'rotate(180deg)'})),
//       transition('show => hide', animate('0.4s ease-in')),
//       transition('hide => show', animate('0.4s ease-out'))
//     ]),
//     trigger('an_rotate', [
//       state('an_show', style({transform: 'rotate(0deg)'})),
//       state('an_hide', style({transform: 'rotate(180deg)'})),
//       transition('an_show => an_hide', animate('0.4s ease-in')),
//       transition('an_hide => an_show', animate('0.4s ease-out'))
//     ])
//   ],
// })
// export class ChartComponent implements OnInit, OnDestroy {
  
//   //animations
//   summaryClose: boolean = true;
//   answerClose: boolean = true;
//   get stateName() {
//     return this.summaryClose ? 'show' : 'hide'
//   }
  
//   get answerName() {
//     return this.answerClose ? 'an_show' : 'an_hide'
//   }
  
//   toggleTpData(){
//     this.summaryClose = !this.summaryClose
//   }
  
//   toggleAnswers(){
//     this.answerClose = !this.answerClose
//   }
  
//   filter: boolean = false;
  
//   chart: Chart = null;
//   summary = [
//     {tag: 'trainingSessions', name: 'training sessions'}, {tag: 'totalKilometers', name: 'total km'}, {tag: 'totalMiles', name: 'total miles'}, {tag: 'totalTime', name: 'training time min'}, {tag: 'totalMeals', name: 'number of meals'}, {tag: 'totalCaloriesKj', name: 'total Kj'}, {tag: 'totalCaloriesKcal', name: 'total Kcal'}, {tag: 'totalCarbCaloriesKj', name: 'total carbohydrates kj'}, {tag: 'totalCarbCaloriesKcal', name: 'total carbohydrates Kcal'}, {tag: 'totalCarbGrams', name: 'total carbohydrates g'}, {tag: 'totalFatCaloriesKj', name: 'total fat kj'}, {tag: 'totalFatCaloriesKcal', name: 'total fat Kcal'}, {tag: 'totalFatGrams', name: 'total fat g'}, {tag: 'totalProteinCaloriesKj', name: 'total proteins kj'}, {tag: 'totalProteinCaloriesKcal', name: 'total proteins Kcal'}, {tag: 'totalProteinGrams', name: 'total proteins g'}]
//     ;
  

//   //y axis labels and data
//   checkedTiles: number = 0;
//   dataLeft = [];
//   slicedDataLeft = [];
//   dataRight = [];
//   slicedDataRight = [];
//   yLeftLabels = [];
//   yRightLabels = [];
//   labelLeft: string = 'label left';
//   labelRight: string = 'label right';
  
//   //x axis labels
//   showWeeksNumber: number = 1;
//   showNextDays: number = 0;
//   xLabels: string[] = [];
//   slicedXLabels: string[] = [];

//   //data from redux
//   stateState: Observable<any>;
//   stateSub: Subscription;
//   answears: Answear[] = null;
//   tilesId: string[] = null;
//   state: any = null;
//   tiles: Tile[] = null;
//   dateFrom: string = null;
//   dateTo: string = null;
//   planName: string = '';

//   tpState: Observable<any>;
//   tpSub: Subscription;

//   allTilesState: Observable<Tile[]>;
//   allTilesSub: Subscription;
//   allTiles: Tile[];

//   answersState: Observable<Answear[]>;
//   answersSub: Subscription;
//   answers: Answear[];

//   tpDataState: Observable<TpAnswear[]>;
//   tpDataSub: Subscription;
//   tpData: TpAnswear[] = null;
//   tpDataSummary: TpAnswear[] = null;
  
//   isRightPanelOpenState: Observable<boolean>;
//   isRightPanelOpenSub: Subscription;
//   isRightPanelOpen: boolean;
  
//   leftType: string;
//   rightType: string;
  
//   minLeft: number;
//   maxLeft: number;
//   minRight: number;
//   maxRight: number;

//   //table variables
//   dataSource;
//   displayedColumns: string[] = ['tileName', 'answer', 'date', 'comment'];
//   @ViewChild(MatPaginator) paginator: MatPaginator;
//   sort;
//   @ViewChild(MatSort) set content(content: ElementRef) {
//   this.sort = content;
//   if (this.sort){
//      this.dataSource.sort = this.sort;
//   }}

//   applyFilter(filterValue: string) {
//     this.dataSource.filter = filterValue.trim().toLowerCase();
//   }
  

//   constructor(
//     private _store: Store<fromApp.AppState>,
//     private _summaryData: SummaryDataService,
//     private _snackBar: MatSnackBar,
//     private _httpService: HttpClientService
//   ) { }

//   ngOnInit() {

//     this.isRightPanelOpenState = this._store.select(state => state.chart.isRightPanelOpen);
//     this.isRightPanelOpenSub = this.isRightPanelOpenState.subscribe(
//       data => {
//         if(data && this.chart){
//           this.chart.canvas.parentNode.style.width = '38vw';
//         }else if(!data && this.chart){
//           this.chart.canvas.parentNode.style.width = '52vw';
//         }
//       }
//     )
    

//     this.tpState = this._store.select(state => state.chart.trainingPlan);
//     this.tpSub = this.tpState.subscribe(
//       data => {
//         console.log(data)
//         //y axis labels and data
//         this.checkedTiles = 0;
//         this.dataLeft = [];
//         this.slicedDataLeft = [];
//         this.dataRight = [];
//         this.slicedDataRight = [];
//         this.yLeftLabels = [];
//         this.yRightLabels = [];
//         this.labelLeft = 'label left';
//         this.labelRight = 'label right';
        
//         //x axis labels
//         this.showWeeksNumber = 1;
//         this.showNextDays = 0;
//         this.xLabels = [];
//         this.slicedXLabels = [];
//         this.getSlices();
//         this.makeChart();
//         if(data){
          // this._httpService.fetchChartData(data.id);
//           this._store.dispatch(new ChartDataActions.MakeDietChartData(data));
//           if(this.tpData && this.allTiles){
//             this.makeTpData(this.tpData, this.allTiles);
//           };
//           if(this.answers && this.allTiles){
//             this.makeDataSource(this.answers, this.allTiles)
//           };
//         }
//       } 
//     )

//     this.answersState = this._store.select(state => state.chart.answears);
//     this.answersSub = this.answersState.subscribe(
//       data => { 
//         this.answers = data;
//         if(this.allTiles && data){
//           this.makeDataSource(data, this.allTiles);
//         }
//       } 
//     )

    

//     this.allTilesState = this._store.select(state => state.tiles.tiles);
//     this.allTilesSub = this.allTilesState.subscribe(
//       data => { 
//         this.allTiles = data;
//         if(this.tpData && data){
//           this.makeTpData(this.tpData, data);
//         }
//         if(this.answers && data){
//           this.makeDataSource(this.answers, data)
//         }
//       } 
//     )

    

//     this.tpDataState = this._store.select(state => state.chart.dietChartData);
//     this.tpDataSub = this.tpDataState.subscribe(
//       data => { 
//         this.tpData = data;
//         if(data && this.allTiles){
//           this.makeTpData(data, this.allTiles);
//         }
//       } 
//     )

//     this.stateState = this._store.select(state => state);
//     this.stateSub = this.stateState.subscribe(
//       data => {
//         this.state = data;
//         this.answears = data.chart.answears;
//         this.tilesId = data.chart.tilesId;
//         this.planName = data.callendar.planName;
//         if(data && data.tiles && data.chart.trainingPlan){
//           this.dateFrom = data.chart.trainingPlan.date_from;
//           this.dateTo = data.chart.trainingPlan.date_to;
//           this.getXLabels();
//           this.getSlices();
//           //
//         }
//         const tiles = [];
//         if(data.tiles.tiles){
//           data.tiles.tiles.forEach(
//             (tile: Tile) => {
//               if(this.tilesId){
//                 this.tilesId.forEach(
//                   tileid => {
//                     if(tileid === tile.tile_id){
//                       if((tile.tile_question.tile_answear_numeric_from && tile.tile_question.tile_answear_numeric_to) || tile.tile_question.tile_answears_descriptives){
//                         tiles.push(Object.assign({}, tile))
//                       }
//                     }
//                   }
//                 )
//               }
//             }
//           )
//         }
//         this.tiles = tiles;
//         console.log(this.tiles)
//         if(!this.chart && this.tiles.length > 0){
//           if(this.tiles && this.answears){
//             this.showTile(this.tiles[0]);
//             if(this.tiles[1]){
//               this.showTile(this.tiles[1]);
//             }
//             this.getSlices();
//             this.makeChart();
//           }
//         }else{
//           if(this.chart){
//             this.chart.destroy()
//           }
//           this.makeChart();
//         }
//       }
//     );

//   }

//   makeDataSource(data: Answear[], alltiles: Tile[]): void{
//     console.log(`makeDataSource`,data,alltiles)
//     const dataSource = [];
//     data.forEach(
//       ans => {
//         let name;
//         alltiles.forEach(
//           tile => {
//             if(tile.tile_id === ans.tile_id){
//               name = tile.tile_title;
//             }
//           }
//         )
//         const dS: AnswerDataTimeline = {
//           tileName: name,
//           answer: ans.question_answer,
//           date: ans.question_date,
//           comment: ans.answer_comment
//         }
//         dataSource.push(dS);
//       }
//     );
//     console.log(dataSource)
//     this.dataSource = new MatTableDataSource<AnswerDataTimeline>(dataSource);
//     this.dataSource.sort = this.sort;
//     this.dataSource.paginator = this.paginator;
//   }

//   makeTpData(data: TpAnswear[], alltiles: Tile[]){
//     let array = data.map(
//       (ans: TpAnswear) => {
//         const answ = ans;
//         const tiles = [];
//         alltiles.forEach(
//           tile => {
//             ans.tile_id.forEach(
//               id => {
//                 if(id === tile.tile_id){
//                   tiles.push(Object.assign({}, tile))
//                 }
//               }
//             )
//           }
//         )
//         answ.answear = this._summaryData.makeSummary(tiles);
//         return ans;
//       }
//     )
//     this.tpDataSummary = array;
//   }

//   makeSummaryData(summary: string, name: string){
//     if(this.tpDataSummary){
//       const summaryData = [];
  
//       //makes summary dataset
//       let dates = [];
//       this.tpDataSummary.forEach(
//         tp => {
//           dates.push(tp.date);
//         }
//       )
//       dates = dates.map(
//         date => {
//           return moment(date).format("YYYY-MM-DD")
//         }
//       )
//       this.xLabels.forEach(
//         label => {
//           let tpSummary = null;
//           this.tpDataSummary.forEach(
//             tp => {
//               if(moment(tp.date).format() === moment(label).format()){
//                 tpSummary = tp
//               }
//             }
//           )
//           if(dates.includes(label) && tpSummary.answear[summary] !== 0){
//             if(summary === 'totalTime'){
//               let num = Number(tpSummary.answear[summary].toString().replace(':', '.'));
//               let hours = Math.floor(num);
//               let minutes = (num - hours)*100;
//               let sum = Math.round(hours*60 + minutes);
//               summaryData.push(sum)
//             }else{
//               summaryData.push(tpSummary.answear[summary])
//             }
//           }else{
//             summaryData.push(null)
//           }
//         }
//       );
  
//       //make summary x labels
//       const summaryAnsw = [];
//       const summaryXlabels = [];
//       this.tpDataSummary.forEach(
//         (tp: TpAnswear) => {
//           if(tp.answear[summary] !== 0 && summary !== 'totalTime'){
//             summaryAnsw.push(Number(tp.answear[summary]))
//           }else if(tp.answear[summary] !== 0 && summary === 'totalTime'){
//             let num = Number(tp.answear[summary].toString().replace(':', '.'));
//             let hours = Math.floor(num);
//             let minutes = (num - hours)*100;
//             let sum = hours*60 + minutes;
//             summaryAnsw.push(Number(sum))
//           }
//         }
//       )
//       summaryAnsw.sort(function(a, b){return a-b});
//       let from = Math.floor(summaryAnsw[0]);
//       let to = Math.ceil(summaryAnsw[summaryAnsw.length-1]);
//       if(summary === 'totalKilometers' || summary === 'totalMiles'){
//         from = from - 2;
//         to = to + 2;
//       }else if(summary === 'trainingSessions' || summary === 'totalMeals'){
//         from = from - 1;
//         to = to + 1;
//       }else if(summary === 'totalCaloriesKj' || summary === 'totalCarbCaloriesKj' || summary === 'totalFatCaloriesKj' || summary === 'totalProteinCaloriesKj'){
//         from = from - 500;
//         to = to + 500;
//       }else if(summary === 'totalCaloriesKcal' || summary === 'totalCarbCaloriesKcal' || summary === 'totalFatCaloriesKcal' || summary === 'totalProteinCaloriesKcal'){
//         from = from - 500;
//         to = to + 500;
//       }else if(summary === 'totalCarbGrams' || summary === 'totalFatGrams' || summary === 'totalProteinGrams'){
//         from = from - 200;
//         to = to + 200;
//       }
//       if(from < 0){
//         from = 0;
//       }
  
//       const labels = {
//         label: name,
//         labels: summaryData,
//         from: from,
//         to: to,
//         nil: null
//       };
//       this.showSummaryTile(labels);

//     }else{
//       this.openSnackBar(`Your plan does not have any data yet`);
//     }
//   }

//   openSnackBar(message: string){
//     this._snackBar.open(message, null, {
//       duration: 2000
//     })
//   }

//   makeChart(){
//     if(this.chart){this.chart.destroy()}
//     this.chart = new Chart('canvas', {
//       type: 'line',
//       data: {
//         xLabels: this.slicedXLabels,
//         datasets: [
//           { 
//             data: this.slicedDataLeft,
//             borderColor: "#E8A022",
//             lineTension: 0.3,
//             pointRadius: 4,
//             pointBackgroundColor: "#E8A022",
//             yAxisID: 'Y1',
//             backgroundColor: "rgba(232,160,34,0.2)",
//             fill: true,
//             label: this.labelLeft
//           },
//           { 
//             data: this.slicedDataRight,
//             borderColor: "#88C540",
//             lineTension: 0.3,
//             pointRadius: 4,
//             pointBackgroundColor: "#88C540",
//             yAxisID: 'Y2',
//             backgroundColor: "rgba(136,197,64,0.2)",
//             fill: true,
//             label: this.labelRight
//           },
//         ]
//       },
//       options: {
//         responsive: true,
//         maintainAspectRatio: false,
//         tooltips: {
//           enabled: true,
//           mode: 'point',
//           backgroundColor: '#052E39',
//           titleFontFamily: 'Lato',
//           titleFontColor: "rgba(255, 255, 255, 0.57)",
//           bodyFontFamily: 'Lato',
//           bodyFontColor: "rgba(255, 255, 255, 0.57)",
//           callbacks: {
//             label: function(tooltipItem, data) {
//                 var label = data.datasets[tooltipItem.datasetIndex].data[tooltipItem.index];
//                 return label;
//             }
//         }
//         },
//         animation: {
//           easing: 'easeInExpo',
//           duration: 0
//         },
//         legend: {
//           display: true,
//           labels: {
//             fontColor: "rgba(255, 255, 255, 0.57)",
//             fontFamily: "Lato",
//             boxWidth: 24
//           }
//         },
//         title:{
//           display: true
//         },
//         scales: {
//           xAxes: [{
//             display: true,
//             scaleLabel: {
//               display: true
//             },
//             ticks: {
//               fontColor: "rgba(255, 255, 255, 0.57)",
//               fontFamily: "Lato",
//               fontSize: "12"
//             },
//             gridLines: {
//               display: true,
//               color: "rgba(255, 255, 255, 0.57)",
//             }
//           }],
//           yAxes: [{
//             type: this.leftType,
//             position: 'left',
//             id: 'Y1',
//             labels: this.yLeftLabels,
//             display: true,
//             ticks: {
//               fontColor: "rgba(255, 255, 255, 0.57)",
//               fontFamily: "Lato",
//               fontSize: "12",
//               min: this.minLeft,
//               max: this.maxLeft
//             },
//             gridLines: {
//                 display: true,
//                 color: "rgba(255, 255, 255, 0.57)",
//             }
//           },
//           {
//             type: this.rightType,
//             position: 'right',
//             id: 'Y2',
//             labels: this.yRightLabels,
//             display: true,
//             ticks: {
//               fontColor: "rgba(255, 255, 255, 0.57)",
//               fontFamily: "Lato",
//               fontSize: "12",
//               min: this.minRight,
//               max: this.maxRight
//             },
//             gridLines: {
//               display: true,
//               color: "rgba(255, 255, 255, 0.57)",
//               borderDash: [5,5]
//             }
//           },
//         ]
//         }
//       }
//     });
//   }

//   getXLabels(){
//     const labels = [];
//     let date: string = moment(this.dateFrom).startOf('month').format();
//     for(let i = 0; date !== moment(this.dateTo).format(); i++){
//       labels.push(date);
//       date = moment(date).add(1, 'day').format();
//     }
//     labels.push(moment(this.dateTo).format());
//     const newLabels = labels.map(lab => {return moment(lab).format("YYYY-MM-DD")});
//     this.xLabels = newLabels;
//   }

//   getSlices(){
//     this.slicedXLabels = this.xLabels.slice(0+this.showNextDays, this.showWeeksNumber*7+this.showNextDays)
//     this.slicedDataLeft = this.dataLeft.slice(0+this.showNextDays, this.showWeeksNumber*7+this.showNextDays)
//     this.slicedDataRight = this.dataRight.slice(0+this.showNextDays, this.showWeeksNumber*7+this.showNextDays)
//   }

//   nextDay(number: number){
//     if(this.showNextDays >= 0){
//       this.showNextDays = this.showNextDays + number;
//     }
//     this.getSlices();
//     this.makeChart();
//   }

//   makeYLabels(tile: Tile): any {
//     const labels = {
//       label: tile.tile_title,
//       labels: [],
//       from: null,
//       to: null
//     };
//     if(tile.tile_question.tile_answear_numeric){
//       labels.from = Number(tile.tile_question.tile_answear_numeric_from);
//       labels.to = Number(tile.tile_question.tile_answear_numeric_to);
//       labels.labels = null;
//     }else if(!tile.tile_question.tile_answear_numeric){
//       const string = _.split(tile.tile_question.tile_answears_descriptives, ',');
//       string.forEach(
//         string => {
//           labels.labels.push(_.trim(string)) ;
//         }
//       )
//     }
//     console.log(labels)
//     return labels
//   }

//   makeData(tile: Tile): any[] {
//     console.log(tile, this.answears)
//     const data = [];
//     const dates = [];
//     const answers = [];
//     this.answears.forEach(
//       ans => {
//         if(!dates.includes(moment(ans.question_date).format()) && tile.tile_id === ans.tile_id){
//           dates.push(moment(ans.question_date).format())
//         }
//         if(tile.tile_id === ans.tile_id){
//           answers.push(ans);
//         }
//       }
//     )
//     console.log(dates, answers, this.xLabels)
//     this.xLabels.forEach(
//       label => {
//         if(dates.includes(moment(label).format())){
//           answers.forEach(
//             ans => {
//               if(moment(ans.question_date).format()===moment(label).format()){
//                 if(tile.tile_question.tile_answear_numeric){
//                   data.push(Number(ans.question_answer));
//                 }else{
//                   data.push(ans.question_answer.trim());
//                 }
//               }
//             }
//           )
//         }else{
//           data.push(null);
//         }
//       }
//     )
//     console.log(`make data `,data)
//     return data
//   }

//   showTile(tile: Tile){
//     if(this.checkedTiles === 0){
//       this.checkedTiles = 1;

//       const data = this.makeYLabels(tile);

//       this.labelLeft = data.label;
//       this.yLeftLabels = data.labels;
//       this.minLeft = data.from;
//       this.maxLeft = data.to;

//       if(data.labels == null){
//         this.leftType = undefined
//       }else{
//         this.leftType = "category"
//       }
//       this.dataLeft = this.makeData(tile);
//     }else if(this.checkedTiles === 1){
//       this.checkedTiles = 2;

//       const data = this.makeYLabels(tile);

//       this.labelRight = data.label;
//       this.yRightLabels = data.labels;
//       this.minRight = data.from;
//       this.maxRight = data.to;

//       if(data.labels == null){
//         this.rightType = undefined
//       }else{
//         this.rightType = "category"
//       }
//       this.dataRight = this.makeData(tile);
//     }else if(this.checkedTiles === 2){
//       this.yLeftLabels = this.yRightLabels
//       this.dataLeft = this.dataRight;
//       this.labelLeft = this.labelRight;
//       this.minLeft = this.minRight;
//       this.maxLeft = this.maxRight;
//       this.leftType = this.rightType;
      
//       const data = this.makeYLabels(tile);

//       this.labelRight = data.label;
//       this.yRightLabels = data.labels;
//       this.minRight = data.from;
//       this.maxRight = data.to;

//       if(data.labels == null){
//         this.rightType = undefined
//       }else{
//         this.rightType = "category"
//       }
//       this.dataRight = this.makeData(tile);
      
//     }
//     this.getSlices();
//     this.makeChart();
//   }

//   showSummaryTile(summaryData){
//     if(this.checkedTiles === 0){
//       this.checkedTiles = 1;

//       const data = summaryData;

//       this.labelLeft = data.label;
//       this.yLeftLabels = data.nil;
//       this.minLeft = data.from;
//       this.maxLeft = data.to;

//       this.leftType = undefined
      
//       this.dataLeft = data.labels;
//     }else if(this.checkedTiles === 1){
//       this.checkedTiles = 2;

//       const data = summaryData;

//       this.labelRight = data.label;
//       this.yRightLabels = data.nil;
//       this.minRight = data.from;
//       this.maxRight = data.to;

//       this.rightType = undefined
      
//       this.dataRight = data.labels;
//     }else if(this.checkedTiles === 2){
//       this.yLeftLabels = this.yRightLabels
//       this.dataLeft = this.dataRight;
//       this.labelLeft = this.labelRight;
//       this.minLeft = this.minRight;
//       this.maxLeft = this.maxRight;
//       this.leftType = this.rightType;

//       const data = summaryData;

//       this.labelRight = data.label;
//       this.yRightLabels = data.nil;
//       this.minRight = data.from;
//       this.maxRight = data.to;

//       this.rightType = undefined
      
//       this.dataRight = data.labels;
      
//     }
//     this.getSlices();
//     this.makeChart();
//   }

//   newTimeline(num: number): void {
//     this.showWeeksNumber = num;
//     this.getSlices();
//     this.makeChart();
//   }

//   toggleFilter(){
//     this.filter = !this.filter
//   }

//   ngOnDestroy(): void {
//     this.stateSub.unsubscribe();
//     this.tpSub.unsubscribe();
//     this.tpDataSub.unsubscribe();
//     this.allTilesSub.unsubscribe();
//     this.answersSub.unsubscribe();
//     this.isRightPanelOpenSub.unsubscribe();
//   }
// }