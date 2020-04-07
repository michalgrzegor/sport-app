import { filter } from 'rxjs/operators';
import { CustomAthleteParameter, Athlete } from 'src/app/shared/store/athletes-data.reducers';
import { Component, OnInit, Input, ViewChild, ElementRef, OnDestroy } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { HttpClientService } from 'src/app/shared/http-client.service';

import * as moment from 'moment';
import * as _ from 'lodash';

import { BreakpointObserver, Breakpoints, BreakpointState } from '@angular/cdk/layout';
import { MatPaginator, MatSort, MatTableDataSource, MatDialog } from '@angular/material';
import { Subscription, Observable } from 'rxjs';

import { Store } from '@ngrx/store';
import * as fromApp from '../../shared/store/app.reducers';
import * as AthleteDataActions from '../../shared/store/athletes-data.actions';
import { VerifyDialogCustomParamComponent } from '../verify-dialog-custom-param/verify-dialog-custom-param.component';

import * as Highcharts from 'highcharts';

declare var require: any;
let Boost = require('highcharts/modules/boost');
let noData = require('highcharts/modules/no-data-to-display');
let More = require('highcharts/highcharts-more');

@Component({
  selector: 'app-athlete-data-and-progress',
  templateUrl: './athlete-data-and-progress.component.html',
  styleUrls: ['./athlete-data-and-progress.component.scss']
})
export class AthleteDataAndProgressComponent implements OnInit, OnDestroy {

  athleteState: Observable<Athlete>;
  athleteSub: Subscription;
  athlete: Athlete;

  isOpenState: Observable<boolean>;
  isOpenSub: Subscription;
  isOpen: boolean = null;

  isLeftOpenState: Observable<boolean>;
  isLeftOpenSub: Subscription;
  isLeftOpen: boolean = null;

  //form for custom data
  isCreatorMode: boolean = false;
  customData = new FormGroup({
    parameter_name: new FormControl('', [Validators.required, Validators.maxLength(255)]),
    parameter_description: new FormControl('', [Validators.required, Validators.maxLength(255)])
  })

  isEditCustomParamMode: boolean = false;
  customParam: CustomAthleteParameter = null;

  seriesArray: any[] = [];
  dateArray: string[];

  //responsive variables
  isHandset: boolean;
  isTablet: boolean;
  isWeb: boolean;

  //table
  filterMode: boolean = false;
  dataSource: any;
  displayedColumns: string[] = ['parameter_name', 'parameter_date', 'parameter_description', 'action'];
  sort: any;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) set content(content: ElementRef) {
    this.sort = content;
    if (this.sort){
      this.dataSource.sort = this.sort;
    }
  }
  isVerifiedSub: any;
  isVerified: any;

  //errors
  errorMaxLengthShort: string = 'this field requied only 255 characters';
  errorReq: string = 'this field is required';

  //chart
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

  public options: any = {
    colors: ['#FF5D51', '#88C540', '#614EA1', '#E8A022', '#31C2E1', '#ff907e', '#bbf871', '#917ad3', '#ffd157', '#75f5ff', '#c52528', '#569400', '#312572', '#b17200', '#0091af', '#FF5D51', '#88C540', '#614EA1', '#E8A022', '#31C2E1', '#ff907e', '#bbf871', '#917ad3', '#ffd157', '#75f5ff', '#c52528', '#569400', '#312572', '#b17200', '#0091af'],
    chart: {
      type: 'spline',
      height: 280,
      width: 700,
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
    private _httpService: HttpClientService,
    public _breakpointObserver: BreakpointObserver,
    public _dialog: MatDialog
  ) { }

  ngOnInit() {
    this._breakpointObserver
    .observe([Breakpoints.Handset])
    .subscribe((state: BreakpointState) => {
      if (state.matches) {
        this.isHandset = true;
        this.isTablet = false;
        this.isWeb = false;
      } else {
      }
    });

    this._breakpointObserver
    .observe([Breakpoints.Tablet])
    .subscribe((state: BreakpointState) => {
      if (state.matches) {
        this.isHandset = false;
        this.isTablet = true;
        this.isWeb = false;
      } else {
      }
    });

    this._breakpointObserver
    .observe([Breakpoints.Web])
    .subscribe((state: BreakpointState) => {
      if (state.matches) {
        this.isHandset = false;
        this.isTablet = false;
        this.isWeb = true;
      } else {
      }
    });

    this.isOpenState = this._store.select(state => state.chart.isOpen);
    this.isOpenSub = this.isOpenState.subscribe(
      data => {
        this.isOpen = data;
        if(this.isLeftOpen !== null && this.isOpen !== null){
          this.setSize()
        }
      }
    )

    this.isLeftOpenState = this._store.select(state => state.chart.isLeftOpen);
    this.isLeftOpenSub = this.isLeftOpenState.subscribe(
      data => {
        this.isLeftOpen = data;
        if(this.isLeftOpen !== null && this.isOpen !== null){
          this.setSize()
        }
      }
    )

    this.athleteState = this._store.select(state => state.athletes.athlete);
    this.athleteSub = this.athleteState.subscribe(
      data => {
        if(data){
          this.athlete = data;

          this.dataSource = new MatTableDataSource<CustomAthleteParameter>(data.custom_athlete_parameters);
          this.dataSource.sort = this.sort;
          this.dataSource.paginator = this.paginator;

          if(data.custom_athlete_parameters && data.custom_athlete_parameters.length>0){
            setTimeout(() => {
              this.makeSeriesChart(data.custom_athlete_parameters)
            }, 1);
            
          };
        }
        
        
      }
    )

    console.log(this.seriesArray)
  
  }

  //making data for charts
  setSize(){
    if(!this.isLeftOpen && !this.isOpen){
      this.options.chart.width = 1162;
      if(this.chart){this.chart.setSize(1162,280,false)}
    }else if(!this.isLeftOpen && this.isOpen){
      this.options.chart.width = 866;
      if(this.chart){this.chart.setSize(866,280,false)}
    }else if(this.isLeftOpen && this.isOpen){
      this.options.chart.width = 703;
      if(this.chart){this.chart.setSize(703,280,false)}
    }else if(this.isLeftOpen && !this.isOpen){
      this.options.chart.width = 999;
      if(this.chart){this.chart.setSize(999,280,false);}
    }
  }

  makeChart(){
    this.options.xAxis.categories = this.xLabels;
    this.chart = Highcharts.chart('container', this.options);
  }

  makeWidth(){

  }
  

  makeSeriesChart(array: CustomAthleteParameter[]){
    this.dataSource.paginator = this.paginator;
    const seriesArray = [];

    array.forEach(
      (param: CustomAthleteParameter) => {
        if(seriesArray.length>0 && seriesArray.filter(series=>series.name===param.parameter_name).length>0){
          const index = seriesArray.indexOf(seriesArray.find(series=>series.name===param.parameter_name));
          seriesArray[index].series.push({
            value: param.parameter_description,
            date: moment(param.parameter_date).format("MM-DD-YYYY")
          });
        }else{
          seriesArray.push({
            name: param.parameter_name,
            series: [{
              value: param.parameter_description,
              date: moment(param.parameter_date).format("MM-DD-YYYY")
            }],
            selected: false
          });
        }
      }
    );
    this.seriesArray = seriesArray;
  }

  makeXLabel(index: number): string[] {
    let xArray = [];
    
    this.seriesArray[index].series.forEach(s=>xArray.push(moment(s.date).valueOf()));
    xArray = xArray.sort();
    xArray = xArray.map(x=>moment(x).format("MM-DD-YYYY"));

    if(!this.xLabels){
      return xArray;
    }else if(this.xLabels){
      let oldXarray = [...this.xLabels];
      xArray = xArray.concat(oldXarray);
      xArray = xArray.map(x=>moment(x).valueOf());
      xArray = _.uniq(xArray.sort());
      xArray = xArray.map(x=>moment(x).format("MM-DD-YYYY"));
      
      return xArray
    }
  }

  makeSeries(index: number, xArray: string[]): number[]{
    const array = [];

    xArray.forEach(
      x => {
        if(this.seriesArray[index].series.filter(ser=>ser.date===x).length>0){
          const ind = this.seriesArray[index].series.indexOf(this.seriesArray[index].series.find(se=>se.date===x));
          array.push(Number(this.seriesArray[index].series[ind].value))
        }else{
          array.push(null)
        }
      }
    );
    return array
  }

  addToChart(name: string, array: number[], index: number){
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
      data: array,
      type: 'spline'
    })

    this.seriesArray[index].id = `id-${this.axisId}`;

    this.axisId++
  }

  selectParam(indexx: number){
    if(this.seriesArray[indexx].selected){
      this.seriesArray[indexx].selected = !this.seriesArray[indexx].selected;
      this.chart.get(this.seriesArray[indexx].id).remove();
      this.seriesArray[indexx].id = null;
      if(this.seriesArray.filter(ser=>ser.id).length===0){
        this.xLabels = null
      }
      // const array = [...this.seriesArray];
      // array.splice(0, 0, array.splice(indexx, 1)[0]);
      this.seriesArray.splice(this.seriesArray.length-1, 0, this.seriesArray.splice(indexx, 1)[0]);
    }else{
      this.seriesArray[indexx].selected = !this.seriesArray[indexx].selected;

      const xArray = this.makeXLabel(indexx);
  
      const name = this.seriesArray[indexx].name;
      
      if(!this.xLabels){
        this.xLabels = xArray;
        const array = this.makeSeries(indexx,xArray);
        this.options.xAxis.categories = xArray;
        this.chart = Highcharts.chart('container', this.options);
        this.addToChart(name,array,indexx);
      }else if(xArray.length === this.xLabels.length){
        const array = this.makeSeries(indexx,xArray);
        this.addToChart(name,array,indexx);
        this.xLabels = xArray;
      }else if(xArray.length !== this.xLabels.length){
        this.chart.xAxis[0].setCategories(xArray);
        this.seriesArray.forEach(
          (s, index) => {
            if(s.selected && s.id){
              const arrayy = this.makeSeries(index,xArray);
              let i;
              this.chart.series.forEach((se,index) => {if(se.name===s.name){i=index}});
              this.chart.series[i].setData(arrayy);
            }else if(s.selected && !s.id){
              const arrayy = this.makeSeries(index,xArray);
              this.addToChart(s.name,arrayy,index);
            }
          }
        );
        this.xLabels = xArray;
      }
      this.seriesArray.splice(0, 0, this.seriesArray.splice(indexx, 1)[0]);
    }

  }

  isEven(n: number){
    return n % 2 == 0;
  }

  //control time in chart

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

  //custom data functions

  onSubmitCustom(){
    if(this.isEditCustomParamMode){
      this._httpService.patchCustomParam(this.customParam.id, this.athlete.id, {parameter_name: this.customData.get('parameter_name').value, parameter_date: this.customParam.parameter_date ,parameter_description: this.customData.get('parameter_description').value, id: this.customParam.id});
    }else if(!this.isEditCustomParamMode){
      this._httpService.postCustomParams(this.athlete.id, {
        parameter_name: this.customData.get('parameter_name').value, 
        // parameter_date: moment().format('YYYY-MM-DD'),
        parameter_date: "2020-03-16",
      parameter_description: this.customData.get('parameter_description').value
    })
    }
    this.isCreatorMode = false;
    this.isEditCustomParamMode = false;

    console.log({parameter_name: this.customData.get('parameter_name').value, parameter_date: moment().format('YYYY-MM-DD'),
    parameter_description: this.customData.get('parameter_description').value})
  }

  searchMode(){
    this.filterMode = !this.filterMode;
  }

  creatorMode(){
    this.isCreatorMode = true;
    this.customData.reset();
    if(this.seriesArray && this.seriesArray.length>0){
      this.customData.get('parameter_name').setValue(this.seriesArray[0].name);
    }
  }

  setParam($event){
    this.customData.get('parameter_name').setValue($event);
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  closeCustom(){
    this.isCreatorMode = false;
  }

  deleteCustomData(element){
    this.isVerifiedSub = this._dialog.open(VerifyDialogCustomParamComponent, {
      width: '300px',
      autoFocus: false,
      id: 'delete-dialog-tile',
      data: {isVerified: this.isVerified}
    });
    this.isVerifiedSub.afterClosed().subscribe(result => {
      if(result){
        this._store.dispatch(new AthleteDataActions.DeleteCustomParams(element.id))
        this._httpService.deleteCustomParam(element.id, this.athlete.id);
      }
    })
  }

  editCustomData(element){
    this.isCreatorMode = true;
    this.isEditCustomParamMode = true;
    this.customParam = element;
    this.customData.patchValue(element);
  }

  ngOnDestroy(): void {
    this.athleteSub.unsubscribe();
    this.isOpenSub.unsubscribe();
    this.isLeftOpenSub.unsubscribe();
  }

}


// {parameter_name: "Vo2max", parameter_date: "2020-04-06", parameter_description: 48}