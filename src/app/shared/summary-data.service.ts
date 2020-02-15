import { Injectable } from '@angular/core';
import { Tile, TileActivity } from '../models/tile';
import { DataService } from './data.service';

@Injectable({
  providedIn: 'root'
})
export class SummaryDataService {

  constructor(private _data: DataService) { }


  makeSummary(tile: Tile[]): Summary{
    const summary: Summary = {
      trainingSessions : 0,
      totalKilometers: 0,
      totalMiles: 0,
      totalTime: '0',
      totalMeals: 0,
      totalCaloriesKj: 0,
      totalCaloriesKcal: 0,
      totalCarbCaloriesKj: 0,
      totalCarbCaloriesKcal: 0,
      totalCarbGrams: 0,
      totalFatCaloriesKj: 0,
      totalFatCaloriesKcal: 0,
      totalFatGrams: 0,
      totalProteinCaloriesKj: 0,
      totalProteinCaloriesKcal: 0,
      totalProteinGrams: 0
    };

    //training summary:
    const trainingTilesArray: Tile[] = [];
    const dietTilesArray: Tile[] = [];

    if(tile){
      tile.forEach(
        tile => {
          if(tile.tile_type === 'training'){
            summary.trainingSessions = summary.trainingSessions + 1;
            trainingTilesArray.push(Object.assign({}, tile));
          }else if(tile.tile_type === 'diet'){
            summary.totalMeals = summary.totalMeals + tile.tile_diets.length;
            dietTilesArray.push(Object.assign({}, tile));
          }
        }
      )
    }

    let trainingUnitArray = this._data.getBasicUnits().unitsArray.map(
      unit => {
        let obj = {unit: unit, amount: 0, conversionToKm: 0, conversionToHours: 0};
        return obj
      }
    );

    trainingTilesArray.forEach(
      (tile: Tile) => {
        tile.tile_activities.forEach(
          (activity: TileActivity) => {
            trainingUnitArray.forEach(
              unit => {
                let reps = Number(activity.tile_activity_reps)  || 1;
                let sets = Number(tile.tile_activities_sets)  || 1;
                
                let activityUnit = null;
                if(activity.tile_activity_unit){
                  activityUnit = activity.tile_activity_unit;
                }
                let restActivityUnit = null;
                if(activity.tile_activity_rest_unit){
                  restActivityUnit = activity.tile_activity_rest_unit;
                }
                let restActivityAfterActivityUnit = null;
                if(activity.tile_activity_rest_after_activity_unit){
                  restActivityAfterActivityUnit = activity.tile_activity_rest_after_activity_unit;
                }
                
                let activityNumber: any = activity.tile_activity_amount;
                let intensityNumber: any = activity.tile_activity_intensity_amount;
                let restActivityNumber: any = activity.tile_activity_rest_amount;
                let restIntensityNumber: any = activity.tile_activity_rest_intensity_amount;
                let restActivityAfterActivityNumber: any = activity.tile_activity_rest_after_activity_amount;
                let restIntensityAfterActivityNumber: any = activity.tile_activity_rest_after_activity_intensity_amount;


                //conversion tu numbers from ',' to '.' if not min/km
                if(activity.tile_activity_unit !== 'min/km' && activity.tile_activity_unit !== 'min/mile'){
                  if(activityNumber && activityNumber.toString().includes(',')){
                    let stringNumber = Number(activityNumber.toString().replace(',','.'));
                    activityNumber = stringNumber;
                  }
                  if(intensityNumber && intensityNumber.toString().includes(',')){
                    let stringNumber = Number(intensityNumber.toString().replace(',','.'));
                    intensityNumber = stringNumber;
                  }
                  if(activityNumber && activityNumber.toString().includes(' ')){
                    let stringNumber = Number(activityNumber.toString().replace(' ','.'));
                    activityNumber = stringNumber;
                  }
                  if(intensityNumber && intensityNumber.toString().includes(' ')){
                    let stringNumber = Number(intensityNumber.toString().replace(' ','.'));
                    intensityNumber = stringNumber;
                  }
                }

                //conversion tu numbers from ',' to '.' if not min/km
                if(activity.tile_activity_rest_unit !== 'min/km' && activity.tile_activity_rest_unit !== 'min/mile'){
                  if(restActivityNumber && restActivityNumber.toString().includes(',')){
                    let stringNumber = Number(restActivityNumber.toString().replace(',','.'));
                    restActivityNumber = stringNumber;
                  }
                  if(restIntensityNumber && restIntensityNumber.toString().includes(',')){
                    let stringNumber = Number(restIntensityNumber.toString().replace(',','.'));
                    restIntensityNumber = stringNumber;
                  }
                  if(restActivityNumber && restActivityNumber.toString().includes(' ')){
                    let stringNumber = Number(restActivityNumber.toString().replace(' ','.'));
                    restActivityNumber = stringNumber;
                  }
                  if(restIntensityNumber && restIntensityNumber.toString().includes(' ')){
                    let stringNumber = Number(restIntensityNumber.toString().replace(' ','.'));
                    restIntensityNumber = stringNumber;
                  }
                }

                //conversion tu numbers from ',' to '.' if not min/km
                if(activity.tile_activity_rest_after_activity_unit !== 'min/km' && activity.tile_activity_rest_after_activity_unit !== 'min/mile'){
                  if(restActivityAfterActivityNumber && restActivityAfterActivityNumber.toString().includes(',')){
                    let stringNumber = Number(restActivityAfterActivityNumber.toString().replace(',','.'));
                    restActivityAfterActivityNumber = stringNumber;
                  }
                  if(restIntensityAfterActivityNumber && restIntensityAfterActivityNumber.toString().includes(',')){
                    let stringNumber = Number(restIntensityAfterActivityNumber.toString().replace(',','.'));
                    restIntensityAfterActivityNumber = stringNumber;
                  }
                  if(restActivityAfterActivityNumber && restActivityAfterActivityNumber.toString().includes(' ')){
                    let stringNumber = Number(restActivityAfterActivityNumber.toString().replace(' ','.'));
                    restActivityAfterActivityNumber = stringNumber;
                  }
                  if(restIntensityAfterActivityNumber && restIntensityAfterActivityNumber.toString().includes(' ')){
                    let stringNumber = Number(restIntensityAfterActivityNumber.toString().replace(' ','.'));
                    restIntensityAfterActivityNumber = stringNumber;
                  }
                }

                //conversion tu numbers from ',' to '.' if not min/km
                if(activity.tile_activity_intensity !== 'min/km' && activity.tile_activity_intensity !== 'min/mile'){
                  if(activityNumber && activityNumber.toString().includes(',')){
                    let stringNumber = Number(activityNumber.toString().replace(',','.'));
                    activityNumber = stringNumber;
                  }
                  if(intensityNumber && intensityNumber.toString().includes(',')){
                    let stringNumber = Number(intensityNumber.toString().replace(',','.'));
                    intensityNumber = stringNumber;
                  }
                  if(activityNumber && activityNumber.toString().includes(' ')){
                    let stringNumber = Number(activityNumber.toString().replace(' ','.'));
                    activityNumber = stringNumber;
                  }
                  if(intensityNumber && intensityNumber.toString().includes(' ')){
                    let stringNumber = Number(intensityNumber.toString().replace(' ','.'));
                    intensityNumber = stringNumber;
                  }
                }

                if(activity.tile_activity_rest_intensity !== 'min/km' && activity.tile_activity_rest_intensity !== 'min/mile'){
                  if(restActivityNumber && restActivityNumber.toString().includes(',')){
                    let stringNumber = Number(restActivityNumber.toString().replace(',','.'));
                    restActivityNumber = stringNumber;
                  }
                  if(restIntensityNumber && restIntensityNumber.toString().includes(',')){
                    let stringNumber = Number(restIntensityNumber.toString().replace(',','.'));
                    restIntensityNumber = stringNumber;
                  }
                  if(restActivityNumber && restActivityNumber.toString().includes(' ')){
                    let stringNumber = Number(restActivityNumber.toString().replace(' ','.'));
                    restActivityNumber = stringNumber;
                  }
                  if(restIntensityNumber && restIntensityNumber.toString().includes(' ')){
                    let stringNumber = Number(restIntensityNumber.toString().replace(' ','.'));
                    restIntensityNumber = stringNumber;
                  }
                }

                if(activity.tile_activity_rest_after_activity_intensity !== 'min/km' && activity.tile_activity_rest_after_activity_intensity !== 'min/mile'){
                  if(restActivityAfterActivityNumber && restActivityAfterActivityNumber.toString().includes(',')){
                    let stringNumber = Number(restActivityAfterActivityNumber.toString().replace(',','.'));
                    restActivityAfterActivityNumber = stringNumber;
                  }
                  if(restIntensityAfterActivityNumber && restIntensityAfterActivityNumber.toString().includes(',')){
                    let stringNumber = Number(restIntensityAfterActivityNumber.toString().replace(',','.'));
                    restIntensityAfterActivityNumber = stringNumber;
                  }
                  if(restActivityAfterActivityNumber && restActivityAfterActivityNumber.toString().includes(' ')){
                    let stringNumber = Number(restActivityAfterActivityNumber.toString().replace(' ','.'));
                    restActivityAfterActivityNumber = stringNumber;
                  }
                  if(restIntensityAfterActivityNumber && restIntensityAfterActivityNumber.toString().includes(' ')){
                    let stringNumber = Number(restIntensityAfterActivityNumber.toString().replace(' ','.'));
                    restIntensityAfterActivityNumber = stringNumber;
                  }
                }

                //conversion tu numbers from ',' to '.' if min/km
                if(intensityNumber && intensityNumber.toString().includes(',') && activity.tile_activity_intensity === 'min/km' || intensityNumber && intensityNumber.toString().includes(',') && activity.tile_activity_intensity === 'min/mile'){
                  let stringNumber = intensityNumber.toString();
                  const index = stringNumber.indexOf(',');
                  const firstPart = stringNumber.slice(0, index);
                  const lastPart = stringNumber.slice(index+1);
                  const afterDot = Number(lastPart)/60;
                  const number = Number(firstPart) + afterDot;
                  intensityNumber = number
                }
                if(restIntensityNumber && restIntensityNumber.toString().includes(',') && activity.tile_activity_rest_intensity === 'min/km' || restIntensityNumber && restIntensityNumber.toString().includes(',') && activity.tile_activity_rest_intensity === 'min/mile'){
                  let stringNumber = restIntensityNumber.toString();
                  const index = stringNumber.indexOf(',');
                  const firstPart = stringNumber.slice(0, index);
                  const lastPart = stringNumber.slice(index+1);
                  const afterDot = Number(lastPart)/60;
                  const number = Number(firstPart) + afterDot;
                  restIntensityNumber = number
                }
                if(restIntensityAfterActivityNumber && restIntensityAfterActivityNumber.toString().includes(',') && activity.tile_activity_rest_after_activity_intensity === 'min/km' || restIntensityAfterActivityNumber && restIntensityAfterActivityNumber.toString().includes(',') && activity.tile_activity_rest_after_activity_intensity === 'min/mile'){
                  let stringNumber = restIntensityAfterActivityNumber.toString();
                  const index = stringNumber.indexOf(',');
                  const firstPart = stringNumber.slice(0, index);
                  const lastPart = stringNumber.slice(index+1);
                  const afterDot = Number(lastPart)/60;
                  const number = Number(firstPart) + afterDot;
                  restIntensityAfterActivityNumber = number
                }

                //conversion tu numbers from '.' to '.' if min/km
                else if(intensityNumber && intensityNumber.toString().includes('.') && activity.tile_activity_intensity === 'min/km' || intensityNumber && intensityNumber.toString().includes('.') && activity.tile_activity_intensity === 'min/mile'){
                  let stringNumber = intensityNumber.toString();
                  const index = stringNumber.indexOf('.');
                  const firstPart = stringNumber.slice(0, index);
                  const lastPart = stringNumber.slice(index+1);
                  const afterDot = Number(lastPart)/60;
                  const number = Number(firstPart) + afterDot;
                  intensityNumber = number
                }
                if(restIntensityNumber && restIntensityNumber.toString().includes('.') && activity.tile_activity_rest_intensity === 'min/km' || restIntensityNumber && restIntensityNumber.toString().includes('.') && activity.tile_activity_rest_intensity === 'min/mile'){
                  let stringNumber = restIntensityNumber.toString();
                  const index = stringNumber.indexOf('.');
                  const firstPart = stringNumber.slice(0, index);
                  const lastPart = stringNumber.slice(index+1);
                  const afterDot = Number(lastPart)/60;
                  const number = Number(firstPart) + afterDot;
                  restIntensityNumber = number
                }
                if(restIntensityAfterActivityNumber && restIntensityAfterActivityNumber.toString().includes('.') && activity.tile_activity_rest_after_activity_intensity === 'min/km' || restIntensityAfterActivityNumber && restIntensityAfterActivityNumber.toString().includes('.') && activity.tile_activity_rest_after_activity_intensity === 'min/mile'){
                  let stringNumber = restIntensityAfterActivityNumber.toString();
                  const index = stringNumber.indexOf('.');
                  const firstPart = stringNumber.slice(0, index);
                  const lastPart = stringNumber.slice(index+1);
                  const afterDot = Number(lastPart)/60;
                  const number = Number(firstPart) + afterDot;
                  restIntensityAfterActivityNumber = number
                }

                //conversion tu numbers from ':' to '.'
                if(activityNumber && activityNumber.toString().includes(':')){
                  let stringNumber = activityNumber.toString();
                  const index = stringNumber.indexOf(':');
                  const firstPart = stringNumber.slice(0, index);
                  const lastPart = stringNumber.slice(index+1);
                  const afterDot = Number(lastPart)/60;
                  const number = Number(firstPart) + afterDot;
                  activityNumber = number
                }
                if(intensityNumber && intensityNumber.toString().includes(':')){
                  let stringNumber = intensityNumber.toString();
                  const index = stringNumber.indexOf(':');
                  const firstPart = stringNumber.slice(0, index);
                  const lastPart = stringNumber.slice(index+1);
                  const afterDot = Number(lastPart)/60;
                  const number = Number(firstPart) + afterDot;
                  intensityNumber = number
                }
                if(restActivityNumber && restActivityNumber.toString().includes(':')){
                  let stringNumber = restActivityNumber.toString();
                  const index = stringNumber.indexOf(':');
                  const firstPart = stringNumber.slice(0, index);
                  const lastPart = stringNumber.slice(index+1);
                  const afterDot = Number(lastPart)/60;
                  const number = Number(firstPart) + afterDot;
                  restActivityNumber = number
                }
                if(restIntensityNumber && restIntensityNumber.toString().includes(':')){
                  let stringNumber = restIntensityNumber.toString();
                  const index = stringNumber.indexOf(':');
                  const firstPart = stringNumber.slice(0, index);
                  const lastPart = stringNumber.slice(index+1);
                  const afterDot = Number(lastPart)/60;
                  const number = Number(firstPart) + afterDot;
                  restIntensityNumber = number
                }
                if(restActivityAfterActivityNumber && restActivityAfterActivityNumber.toString().includes(':')){
                  let stringNumber = restActivityAfterActivityNumber.toString();
                  const index = stringNumber.indexOf(':');
                  const firstPart = stringNumber.slice(0, index);
                  const lastPart = stringNumber.slice(index+1);
                  const afterDot = Number(lastPart)/60;
                  const number = Number(firstPart) + afterDot;
                  restActivityAfterActivityNumber = number
                }
                if(restIntensityAfterActivityNumber && restIntensityAfterActivityNumber.toString().includes(':')){
                  let stringNumber = restIntensityAfterActivityNumber.toString();
                  const index = stringNumber.indexOf(':');
                  const firstPart = stringNumber.slice(0, index);
                  const lastPart = stringNumber.slice(index+1);
                  const afterDot = Number(lastPart)/60;
                  const number = Number(firstPart) + afterDot;
                  restIntensityAfterActivityNumber = number
                }

                //conversion tu numbers from ' ' to '.'
                if(activityNumber && activityNumber.toString().includes(' ')){
                  let stringNumber = activityNumber.toString();
                  const index = stringNumber.indexOf(' ');
                  const firstPart = stringNumber.slice(0, index);
                  const lastPart = stringNumber.slice(index+1);
                  const afterDot = Number(lastPart)/60;
                  const number = Number(firstPart) + afterDot;
                  activityNumber = number
                }
                if(intensityNumber && intensityNumber.toString().includes(' ')){
                  let stringNumber = intensityNumber.toString();
                  const index = stringNumber.indexOf(' ');
                  const firstPart = stringNumber.slice(0, index);
                  const lastPart = stringNumber.slice(index+1);
                  const afterDot = Number(lastPart)/60;
                  const number = Number(firstPart) + afterDot;
                  intensityNumber = number
                }
                if(restActivityNumber && restActivityNumber.toString().includes(' ')){
                  let stringNumber = restActivityNumber.toString();
                  const index = stringNumber.indexOf(' ');
                  const firstPart = stringNumber.slice(0, index);
                  const lastPart = stringNumber.slice(index+1);
                  const afterDot = Number(lastPart)/60;
                  const number = Number(firstPart) + afterDot;
                  restActivityNumber = number
                }
                if(restIntensityNumber && restIntensityNumber.toString().includes(' ')){
                  let stringNumber = restIntensityNumber.toString();
                  const index = stringNumber.indexOf(' ');
                  const firstPart = stringNumber.slice(0, index);
                  const lastPart = stringNumber.slice(index+1);
                  const afterDot = Number(lastPart)/60;
                  const number = Number(firstPart) + afterDot;
                  restIntensityNumber = number
                }
                if(restActivityAfterActivityNumber && restActivityAfterActivityNumber.toString().includes(' ')){
                  let stringNumber = restActivityAfterActivityNumber.toString();
                  const index = stringNumber.indexOf(' ');
                  const firstPart = stringNumber.slice(0, index);
                  const lastPart = stringNumber.slice(index+1);
                  const afterDot = Number(lastPart)/60;
                  const number = Number(firstPart) + afterDot;
                  restActivityAfterActivityNumber = number
                }
                if(restIntensityAfterActivityNumber && restIntensityAfterActivityNumber.toString().includes(' ')){
                  let stringNumber = restIntensityAfterActivityNumber.toString();
                  const index = stringNumber.indexOf(' ');
                  const firstPart = stringNumber.slice(0, index);
                  const lastPart = stringNumber.slice(index+1);
                  const afterDot = Number(lastPart)/60;
                  const number = Number(firstPart) + afterDot;
                  restIntensityAfterActivityNumber = number
                }
                //jesli jest taka sama jednostka
                if(activityUnit === unit.unit){

                  const number = Number(activityNumber)*reps*sets
                  unit.amount = Number(unit.amount) + number;
                  
                  // //jesli przerwa ma taką samą jednostkę
                  // if(activity.tile_activity_rest_unit === unit.unit){
                  //   unit.amount = Number(unit.amount) + Number(activity.tile_activity_rest_amount)*(reps-1)*sets
                  // };
                
                  //jeśli metry:
                  if(activityUnit === 'metres'){
                    unit.conversionToKm = unit.conversionToKm + number/1000;
                    //jeśli km/h:
                    if(activity.tile_activity_intensity && activity.tile_activity_intensity === 'km/h' && unit.conversionToKm !== 0){
                      unit.conversionToHours = unit.conversionToHours + (number/1000)/Number(intensityNumber);
                    }

                    //jeśli min/km:
                    if(activity.tile_activity_intensity && activity.tile_activity_intensity === 'min/km' && unit.conversionToKm !== 0){
                      const kmHour = 60/Number(intensityNumber)
                      unit.conversionToHours = unit.conversionToHours + (number/1000)/kmHour;
                    }

                    //jeśli min/mile:
                    if(activity.tile_activity_intensity && activity.tile_activity_intensity === 'min/mile' && unit.conversionToKm !== 0){
                      const kmHour = 60/Number(intensityNumber)/0.621371192;
                      unit.conversionToHours = unit.conversionToHours + (number/1000)/kmHour;
                    }

                    //jeśli m/min:
                    if(activity.tile_activity_intensity && activity.tile_activity_intensity === 'm/min' && unit.conversionToKm !== 0){
                      const kmHour = Number(intensityNumber)*60/1000;
                      unit.conversionToHours = unit.conversionToHours + (number/1000)/kmHour;
                    }

                  }
                  
                  //jeśli mile:
                  if(activityUnit === 'miles'){
                    unit.conversionToKm = unit.conversionToKm + number/0.621371192;
                    //jeśli km/h:
                    if(activity.tile_activity_intensity && activity.tile_activity_intensity === 'km/h' && unit.conversionToKm !== 0){
                      unit.conversionToHours = unit.conversionToHours + (number/0.621371192)/Number(intensityNumber);
                    }

                    //jeśli min/km:
                    if(activity.tile_activity_intensity && activity.tile_activity_intensity === 'min/km' && unit.conversionToKm !== 0){
                      const kmHour = 60/Number(intensityNumber)
                      unit.conversionToHours = unit.conversionToHours + (number/0.621371192)/kmHour;
                    }

                    //jeśli min/mile:
                    if(activity.tile_activity_intensity && activity.tile_activity_intensity === 'min/mile' && unit.conversionToKm !== 0){
                      const mileHour = 60/Number(intensityNumber);
                      unit.conversionToHours = unit.conversionToHours + (number)/mileHour;
                    }

                    //jeśli m/min:
                    if(activity.tile_activity_intensity && activity.tile_activity_intensity === 'm/min' && unit.conversionToKm !== 0){
                      const kmHour = Number(intensityNumber)*60/1000;
                      unit.conversionToHours = unit.conversionToHours + (number/0.621371192)/kmHour;
                    }
                  }
                  
                  //jeśli kilometry:
                  if(activityUnit === 'kilometres'){
                    unit.conversionToKm = unit.conversionToKm + number;
                    //jeśli km/h:
                    if(activity.tile_activity_intensity && activity.tile_activity_intensity === 'km/h' && unit.conversionToKm !== 0){
                      unit.conversionToHours = unit.conversionToHours + (number)/Number(intensityNumber);
                    }

                    //jeśli min/km:
                    if(activity.tile_activity_intensity && activity.tile_activity_intensity === 'min/km' && unit.conversionToKm !== 0){
                      const kmHour = 60/Number(intensityNumber)
                      unit.conversionToHours = unit.conversionToHours + (number)/kmHour;
                    }

                    //jeśli min/mile:
                    if(activity.tile_activity_intensity && activity.tile_activity_intensity === 'min/mile' && unit.conversionToKm !== 0){
                      const kmHour = 60/Number(intensityNumber)/0.621371192;
                      unit.conversionToHours = unit.conversionToHours + (number)/kmHour;
                    }

                    //jeśli m/min:
                    if(activity.tile_activity_intensity && activity.tile_activity_intensity === 'm/min' && unit.conversionToKm !== 0){
                      const kmHour = Number(intensityNumber)*60/1000;
                      unit.conversionToHours = unit.conversionToHours + (number)/kmHour;
                    }
                  }
                  
                  //jeśli sekundy:
                  if(activityUnit === 'second'){
                    unit.conversionToHours = unit.conversionToHours + number/3600;
                    //jeśli km/h:
                    if(activity.tile_activity_intensity && activity.tile_activity_intensity === 'km/h' && unit.conversionToHours !== 0){
                      unit.conversionToKm = unit.conversionToKm + (number/3600)*Number(intensityNumber);
                    }

                    //jeśli min/mile:
                    if(activity.tile_activity_intensity && activity.tile_activity_intensity === 'min/mile' && unit.conversionToHours !== 0){
                      const kmHour = 60/Number(intensityNumber)/0.621371192;
                      unit.conversionToKm = unit.conversionToKm + (number/3600)*kmHour;
                    }

                    //jeśli min/km:
                    if(activity.tile_activity_intensity && activity.tile_activity_intensity === 'min/km' && unit.conversionToHours !== 0){
                      const kmHour = 60/Number(intensityNumber)
                      unit.conversionToKm = unit.conversionToKm + (number/3600)*kmHour;
                    }

                    //jeśli m/min:
                    if(activity.tile_activity_intensity && activity.tile_activity_intensity === 'm/min' && unit.conversionToHours !== 0){
                      const kmHour = Number(intensityNumber)*60/1000;
                      unit.conversionToKm = unit.conversionToKm + (number/3600)*kmHour;
                    }
                  }
                  
                  //jeśli minuty:
                  if(activityUnit === 'minute'){
                    unit.conversionToHours = unit.conversionToHours + number/60;
                    //jeśli km/h:
                    if(activity.tile_activity_intensity && activity.tile_activity_intensity === 'km/h' && unit.conversionToHours !== 0){
                      unit.conversionToKm = unit.conversionToKm + (number/60)*Number(intensityNumber);
                    }

                    //jeśli min/km:
                    if(activity.tile_activity_intensity && activity.tile_activity_intensity === 'min/km' && unit.conversionToHours !== 0){
                      const kmHour = 60/Number(intensityNumber)
                      unit.conversionToKm = unit.conversionToKm + (number/60)*kmHour;
                    }

                    //jeśli min/mile:
                    if(activity.tile_activity_intensity && activity.tile_activity_intensity === 'min/mile' && unit.conversionToHours !== 0){
                      const kmHour = 60/Number(intensityNumber)/0.621371192;
                      unit.conversionToKm = unit.conversionToKm + (number/60)*kmHour;
                    }

                    //jeśli m/min:
                    if(activity.tile_activity_intensity && activity.tile_activity_intensity === 'm/min' && unit.conversionToHours !== 0){
                      const kmHour = Number(intensityNumber)*60/1000;
                      unit.conversionToKm = unit.conversionToKm + (number/60)*kmHour;
                    }
                  }
                  
                  //jeśli minuty:
                  if(activityUnit === 'hour'){
                    unit.conversionToHours = unit.conversionToHours + number;
                    //jeśli km/h:
                    if(activity.tile_activity_intensity && activity.tile_activity_intensity === 'km/h' && unit.conversionToHours !== 0){
                      unit.conversionToKm = unit.conversionToKm + (number)*Number(intensityNumber);
                    }

                    //jeśli min/km:
                    if(activity.tile_activity_intensity && activity.tile_activity_intensity === 'min/km' && unit.conversionToHours !== 0){
                      const kmHour = 60/Number(intensityNumber)
                      unit.conversionToKm = unit.conversionToKm + (number)*kmHour;
                    }

                    //jeśli min/mile:
                    if(activity.tile_activity_intensity && activity.tile_activity_intensity === 'min/mile' && unit.conversionToHours !== 0){
                      const kmHour = 60/Number(intensityNumber)/0.621371192;
                      unit.conversionToKm = unit.conversionToKm + (number)*kmHour;
                    }

                    //jeśli m/min:
                    if(activity.tile_activity_intensity && activity.tile_activity_intensity === 'm/min' && unit.conversionToHours !== 0){
                      const kmHour = Number(intensityNumber)*60/1000;
                      unit.conversionToKm = unit.conversionToKm + (number)*kmHour;
                    }
                  }
                }

                //jesli jest taka sama jednostka
                if(restActivityUnit === unit.unit){

                  const number = Number(restActivityNumber)*reps*sets
                  unit.amount = Number(unit.amount) + number;

                  
                  
                  // //jesli przerwa ma taką samą jednostkę
                  // if(activity.tile_activity_rest_unit === unit.unit){
                  //   unit.amount = Number(unit.amount) + Number(activity.tile_activity_rest_amount)*(reps-1)*sets
                  // };
                
                  //jeśli metry:
                  if(restActivityUnit === 'metres'){
                    unit.conversionToKm = unit.conversionToKm + number/1000;
                    //jeśli km/h:
                    if(activity.tile_activity_rest_intensity && activity.tile_activity_rest_intensity === 'km/h' && unit.conversionToKm !== 0){
                      unit.conversionToHours = unit.conversionToHours + (number/1000)/Number(restIntensityNumber);
                    }

                    //jeśli min/km:
                    if(activity.tile_activity_rest_intensity && activity.tile_activity_rest_intensity === 'min/km' && unit.conversionToKm !== 0){
                      const kmHour = 60/Number(restIntensityNumber)
                      unit.conversionToHours = unit.conversionToHours + (number/1000)/kmHour;
                    }

                    //jeśli min/mile:
                    if(activity.tile_activity_rest_intensity && activity.tile_activity_rest_intensity === 'min/mile' && unit.conversionToKm !== 0){
                      const kmHour = 60/Number(restIntensityNumber)/0.621371192;
                      unit.conversionToHours = unit.conversionToHours + (number/1000)/kmHour;
                    }

                    //jeśli m/min:
                    if(activity.tile_activity_rest_intensity && activity.tile_activity_rest_intensity === 'm/min' && unit.conversionToKm !== 0){
                      const kmHour = Number(restIntensityNumber)*60/1000;
                      unit.conversionToHours = unit.conversionToHours + (number/1000)/kmHour;
                    }

                  }
                  
                  //jeśli mile:
                  if(restActivityUnit === 'miles'){
                    unit.conversionToKm = unit.conversionToKm + number/0.621371192;
                    //jeśli km/h:
                    if(activity.tile_activity_rest_intensity && activity.tile_activity_rest_intensity === 'km/h' && unit.conversionToKm !== 0){
                      unit.conversionToHours = unit.conversionToHours + (number/0.621371192)/Number(restIntensityNumber);
                    }

                    //jeśli min/km:
                    if(activity.tile_activity_rest_intensity && activity.tile_activity_rest_intensity === 'min/km' && unit.conversionToKm !== 0){
                      const kmHour = 60/Number(restIntensityNumber)
                      unit.conversionToHours = unit.conversionToHours + (number/0.621371192)/kmHour;
                    }

                    //jeśli min/mile:
                    if(activity.tile_activity_rest_intensity && activity.tile_activity_rest_intensity === 'min/mile' && unit.conversionToKm !== 0){
                      const mileHour = 60/Number(restIntensityNumber);
                      unit.conversionToHours = unit.conversionToHours + (number)/mileHour;
                    }

                    //jeśli m/min:
                    if(activity.tile_activity_rest_intensity && activity.tile_activity_rest_intensity === 'm/min' && unit.conversionToKm !== 0){
                      const kmHour = Number(restIntensityNumber)*60/1000;
                      unit.conversionToHours = unit.conversionToHours + (number/0.621371192)/kmHour;
                    }
                  }
                  
                  //jeśli kilometry:
                  if(restActivityUnit === 'kilometres'){
                    unit.conversionToKm = unit.conversionToKm + number;
                    //jeśli km/h:
                    if(activity.tile_activity_rest_intensity && activity.tile_activity_rest_intensity === 'km/h' && unit.conversionToKm !== 0){
                      unit.conversionToHours = unit.conversionToHours + (number)/Number(restIntensityNumber);
                    }

                    //jeśli min/km:
                    if(activity.tile_activity_rest_intensity && activity.tile_activity_rest_intensity === 'min/km' && unit.conversionToKm !== 0){
                      const kmHour = 60/Number(restIntensityNumber)
                      unit.conversionToHours = unit.conversionToHours + (number)/kmHour;
                    }

                    //jeśli min/mile:
                    if(activity.tile_activity_rest_intensity && activity.tile_activity_rest_intensity === 'min/mile' && unit.conversionToKm !== 0){
                      const kmHour = 60/Number(restIntensityNumber)/0.621371192;
                      unit.conversionToHours = unit.conversionToHours + (number)/kmHour;
                    }

                    //jeśli m/min:
                    if(activity.tile_activity_rest_intensity && activity.tile_activity_rest_intensity === 'm/min' && unit.conversionToKm !== 0){
                      const kmHour = Number(restIntensityNumber)*60/1000;
                      unit.conversionToHours = unit.conversionToHours + (number)/kmHour;
                    }
                  }
                  
                  //jeśli sekundy:
                  if(restActivityUnit === 'second'){
                    unit.conversionToHours = unit.conversionToHours + number/3600;
                    //jeśli km/h:
                    if(activity.tile_activity_rest_intensity && activity.tile_activity_rest_intensity === 'km/h' && unit.conversionToHours !== 0){
                      unit.conversionToKm = unit.conversionToKm + (number/3600)*Number(restIntensityNumber);
                    }

                    //jeśli min/mile:
                    if(activity.tile_activity_rest_intensity && activity.tile_activity_rest_intensity === 'min/mile' && unit.conversionToHours !== 0){
                      const kmHour = 60/Number(restIntensityNumber)/0.621371192;
                      unit.conversionToKm = unit.conversionToKm + (number/3600)*kmHour;
                    }

                    //jeśli min/km:
                    if(activity.tile_activity_rest_intensity && activity.tile_activity_rest_intensity === 'min/km' && unit.conversionToHours !== 0){
                      const kmHour = 60/Number(restIntensityNumber)
                      unit.conversionToKm = unit.conversionToKm + (number/3600)*kmHour;
                    }

                    //jeśli m/min:
                    if(activity.tile_activity_rest_intensity && activity.tile_activity_rest_intensity === 'm/min' && unit.conversionToHours !== 0){
                      const kmHour = Number(restIntensityNumber)*60/1000;
                      unit.conversionToKm = unit.conversionToKm + (number/3600)*kmHour;
                    }
                  }
                  
                  //jeśli minuty:
                  if(restActivityUnit === 'minute'){
                    unit.conversionToHours = unit.conversionToHours + number/60;
                    //jeśli km/h:
                    if(activity.tile_activity_rest_intensity && activity.tile_activity_rest_intensity === 'km/h' && unit.conversionToHours !== 0){
                      unit.conversionToKm = unit.conversionToKm + (number/60)*Number(restIntensityNumber);
                    }

                    //jeśli min/km:
                    if(activity.tile_activity_rest_intensity && activity.tile_activity_rest_intensity === 'min/km' && unit.conversionToHours !== 0){
                      const kmHour = 60/Number(restIntensityNumber)
                      unit.conversionToKm = unit.conversionToKm + (number/60)*kmHour;
                    }

                    //jeśli min/mile:
                    if(activity.tile_activity_rest_intensity && activity.tile_activity_rest_intensity === 'min/mile' && unit.conversionToHours !== 0){
                      const kmHour = 60/Number(restIntensityNumber)/0.621371192;
                      unit.conversionToKm = unit.conversionToKm + (number/60)*kmHour;
                    }

                    //jeśli m/min:
                    if(activity.tile_activity_rest_intensity && activity.tile_activity_rest_intensity === 'm/min' && unit.conversionToHours !== 0){
                      const kmHour = Number(restIntensityNumber)*60/1000;
                      unit.conversionToKm = unit.conversionToKm + (number/60)*kmHour;
                    }
                  }
                  
                  //jeśli minuty:
                  if(restActivityUnit === 'hour'){
                    unit.conversionToHours = unit.conversionToHours + number;
                    //jeśli km/h:
                    if(activity.tile_activity_rest_intensity && activity.tile_activity_rest_intensity === 'km/h' && unit.conversionToHours !== 0){
                      unit.conversionToKm = unit.conversionToKm + (number)*Number(restIntensityNumber);
                    }

                    //jeśli min/km:
                    if(activity.tile_activity_rest_intensity && activity.tile_activity_rest_intensity === 'min/km' && unit.conversionToHours !== 0){
                      const kmHour = 60/Number(restIntensityNumber)
                      unit.conversionToKm = unit.conversionToKm + (number)*kmHour;
                    }

                    //jeśli min/mile:
                    if(activity.tile_activity_rest_intensity && activity.tile_activity_rest_intensity === 'min/mile' && unit.conversionToHours !== 0){
                      const kmHour = 60/Number(restIntensityNumber)/0.621371192;
                      unit.conversionToKm = unit.conversionToKm + (number)*kmHour;
                    }

                    //jeśli m/min:
                    if(activity.tile_activity_rest_intensity && activity.tile_activity_rest_intensity === 'm/min' && unit.conversionToHours !== 0){
                      const kmHour = Number(restIntensityNumber)*60/1000;
                      unit.conversionToKm = unit.conversionToKm + (number)*kmHour;
                    }
                  }

                }
                
                //jesli jest taka sama jednostka
                if(restActivityAfterActivityUnit === unit.unit){
                  
                  const number = Number(restActivityAfterActivityNumber)*reps*sets
                  unit.amount = Number(unit.amount) + number;
                  
                  // //jesli przerwa ma taką samą jednostkę
                  // if(activity.tile_activity_rest_unit === unit.unit){
                  //   unit.amount = Number(unit.amount) + Number(activity.tile_activity_rest_amount)*(reps-1)*sets
                  // };
                
                  //jeśli metry:
                  if(restActivityAfterActivityUnit === 'metres'){
                    unit.conversionToKm = unit.conversionToKm + number/1000;
                    //jeśli km/h:
                    if(activity.tile_activity_rest_after_activity_intensity && activity.tile_activity_rest_after_activity_intensity === 'km/h' && unit.conversionToKm !== 0){
                      unit.conversionToHours = unit.conversionToHours + (number/1000)/Number(restIntensityAfterActivityNumber);
                    }

                    //jeśli min/km:
                    if(activity.tile_activity_rest_after_activity_intensity && activity.tile_activity_rest_after_activity_intensity === 'min/km' && unit.conversionToKm !== 0){
                      const kmHour = 60/Number(restIntensityAfterActivityNumber)
                      unit.conversionToHours = unit.conversionToHours + (number/1000)/kmHour;
                    }

                    //jeśli min/mile:
                    if(activity.tile_activity_rest_after_activity_intensity && activity.tile_activity_rest_after_activity_intensity === 'min/mile' && unit.conversionToKm !== 0){
                      const kmHour = 60/Number(restIntensityAfterActivityNumber)/0.621371192;
                      unit.conversionToHours = unit.conversionToHours + (number/1000)/kmHour;
                    }

                    //jeśli m/min:
                    if(activity.tile_activity_rest_after_activity_intensity && activity.tile_activity_rest_after_activity_intensity === 'm/min' && unit.conversionToKm !== 0){
                      const kmHour = Number(restIntensityAfterActivityNumber)*60/1000;
                      unit.conversionToHours = unit.conversionToHours + (number/1000)/kmHour;
                    }

                  }
                  
                  //jeśli mile:
                  if(restActivityAfterActivityUnit === 'miles'){
                    unit.conversionToKm = unit.conversionToKm + number/0.621371192;
                    //jeśli km/h:
                    if(activity.tile_activity_rest_after_activity_intensity && activity.tile_activity_rest_after_activity_intensity === 'km/h' && unit.conversionToKm !== 0){
                      unit.conversionToHours = unit.conversionToHours + (number/0.621371192)/Number(restIntensityAfterActivityNumber);
                    }

                    //jeśli min/km:
                    if(activity.tile_activity_rest_after_activity_intensity && activity.tile_activity_rest_after_activity_intensity === 'min/km' && unit.conversionToKm !== 0){
                      const kmHour = 60/Number(restIntensityAfterActivityNumber)
                      unit.conversionToHours = unit.conversionToHours + (number/0.621371192)/kmHour;
                    }

                    //jeśli min/mile:
                    if(activity.tile_activity_rest_after_activity_intensity && activity.tile_activity_rest_after_activity_intensity === 'min/mile' && unit.conversionToKm !== 0){
                      const mileHour = 60/Number(restIntensityAfterActivityNumber);
                      unit.conversionToHours = unit.conversionToHours + (number)/mileHour;
                    }

                    //jeśli m/min:
                    if(activity.tile_activity_rest_after_activity_intensity && activity.tile_activity_rest_after_activity_intensity === 'm/min' && unit.conversionToKm !== 0){
                      const kmHour = Number(restIntensityAfterActivityNumber)*60/1000;
                      unit.conversionToHours = unit.conversionToHours + (number/0.621371192)/kmHour;
                    }
                  }
                  
                  //jeśli kilometry:
                  if(restActivityAfterActivityUnit === 'kilometres'){
                    unit.conversionToKm = unit.conversionToKm + number;
                    //jeśli km/h:
                    if(activity.tile_activity_rest_after_activity_intensity && activity.tile_activity_rest_after_activity_intensity === 'km/h' && unit.conversionToKm !== 0){
                      unit.conversionToHours = unit.conversionToHours + (number)/Number(restIntensityAfterActivityNumber);
                    }

                    //jeśli min/km:
                    if(activity.tile_activity_rest_after_activity_intensity && activity.tile_activity_rest_after_activity_intensity === 'min/km' && unit.conversionToKm !== 0){
                      const kmHour = 60/Number(restIntensityAfterActivityNumber)
                      unit.conversionToHours = unit.conversionToHours + (number)/kmHour;
                    }

                    //jeśli min/mile:
                    if(activity.tile_activity_rest_after_activity_intensity && activity.tile_activity_rest_after_activity_intensity === 'min/mile' && unit.conversionToKm !== 0){
                      const kmHour = 60/Number(restIntensityAfterActivityNumber)/0.621371192;
                      unit.conversionToHours = unit.conversionToHours + (number)/kmHour;
                    }

                    //jeśli m/min:
                    if(activity.tile_activity_rest_after_activity_intensity && activity.tile_activity_rest_after_activity_intensity === 'm/min' && unit.conversionToKm !== 0){
                      const kmHour = Number(restIntensityAfterActivityNumber)*60/1000;
                      unit.conversionToHours = unit.conversionToHours + (number)/kmHour;
                    }
                  }
                  
                  //jeśli sekundy:
                  if(restActivityAfterActivityUnit === 'second'){
                    unit.conversionToHours = unit.conversionToHours + number/3600;
                    //jeśli km/h:
                    if(activity.tile_activity_rest_after_activity_intensity && activity.tile_activity_rest_after_activity_intensity === 'km/h' && unit.conversionToHours !== 0){
                      unit.conversionToKm = unit.conversionToKm + (number/3600)*Number(restIntensityAfterActivityNumber);
                    }

                    //jeśli min/mile:
                    if(activity.tile_activity_rest_after_activity_intensity && activity.tile_activity_rest_after_activity_intensity === 'min/mile' && unit.conversionToHours !== 0){
                      const kmHour = 60/Number(restIntensityAfterActivityNumber)/0.621371192;
                      unit.conversionToKm = unit.conversionToKm + (number/3600)*kmHour;
                    }

                    //jeśli min/km:
                    if(activity.tile_activity_rest_after_activity_intensity && activity.tile_activity_rest_after_activity_intensity === 'min/km' && unit.conversionToHours !== 0){
                      const kmHour = 60/Number(restIntensityAfterActivityNumber)
                      unit.conversionToKm = unit.conversionToKm + (number/3600)*kmHour;
                    }

                    //jeśli m/min:
                    if(activity.tile_activity_rest_after_activity_intensity && activity.tile_activity_rest_after_activity_intensity === 'm/min' && unit.conversionToHours !== 0){
                      const kmHour = Number(restIntensityAfterActivityNumber)*60/1000;
                      unit.conversionToKm = unit.conversionToKm + (number/3600)*kmHour;
                    }
                  }
                  
                  //jeśli minuty:
                  if(restActivityAfterActivityUnit === 'minute'){
                    unit.conversionToHours = unit.conversionToHours + number/60;
                    //jeśli km/h:
                    if(activity.tile_activity_rest_after_activity_intensity && activity.tile_activity_rest_after_activity_intensity === 'km/h' && unit.conversionToHours !== 0){
                      unit.conversionToKm = unit.conversionToKm + (number/60)*Number(restIntensityAfterActivityNumber);
                    }

                    //jeśli min/km:
                    if(activity.tile_activity_rest_after_activity_intensity && activity.tile_activity_rest_after_activity_intensity === 'min/km' && unit.conversionToHours !== 0){
                      const kmHour = 60/Number(restIntensityAfterActivityNumber)
                      unit.conversionToKm = unit.conversionToKm + (number/60)*kmHour;
                    }

                    //jeśli min/mile:
                    if(activity.tile_activity_rest_after_activity_intensity && activity.tile_activity_rest_after_activity_intensity === 'min/mile' && unit.conversionToHours !== 0){
                      const kmHour = 60/Number(restIntensityAfterActivityNumber)/0.621371192;
                      unit.conversionToKm = unit.conversionToKm + (number/60)*kmHour;
                    }

                    //jeśli m/min:
                    if(activity.tile_activity_rest_after_activity_intensity && activity.tile_activity_rest_after_activity_intensity === 'm/min' && unit.conversionToHours !== 0){
                      const kmHour = Number(restIntensityAfterActivityNumber)*60/1000;
                      unit.conversionToKm = unit.conversionToKm + (number/60)*kmHour;
                    }
                  }
                  
                  //jeśli minuty:
                  if(restActivityAfterActivityUnit === 'hour'){
                    unit.conversionToHours = unit.conversionToHours + number;
                    //jeśli km/h:
                    if(activity.tile_activity_rest_after_activity_intensity && activity.tile_activity_rest_after_activity_intensity === 'km/h' && unit.conversionToHours !== 0){
                      unit.conversionToKm = unit.conversionToKm + (number)*Number(restIntensityAfterActivityNumber);
                    }

                    //jeśli min/km:
                    if(activity.tile_activity_rest_after_activity_intensity && activity.tile_activity_rest_after_activity_intensity === 'min/km' && unit.conversionToHours !== 0){
                      const kmHour = 60/Number(restIntensityAfterActivityNumber)
                      unit.conversionToKm = unit.conversionToKm + (number)*kmHour;
                    }

                    //jeśli min/mile:
                    if(activity.tile_activity_rest_after_activity_intensity && activity.tile_activity_rest_after_activity_intensity === 'min/mile' && unit.conversionToHours !== 0){
                      const kmHour = 60/Number(restIntensityAfterActivityNumber)/0.621371192;
                      unit.conversionToKm = unit.conversionToKm + (number)*kmHour;
                    }

                    //jeśli m/min:
                    if(activity.tile_activity_rest_after_activity_intensity && activity.tile_activity_rest_after_activity_intensity === 'm/min' && unit.conversionToHours !== 0){
                      const kmHour = Number(restIntensityAfterActivityNumber)*60/1000;
                      unit.conversionToKm = unit.conversionToKm + (number)*kmHour;
                    }
                  }
                }



              }
            )
          }
        )
      }
    )


    let totTime: number = 0;
    let totTimeString: string = '00:00';
    trainingUnitArray.forEach(
      unit => {
        summary.totalKilometers = summary.totalKilometers + unit.conversionToKm;
        totTime = totTime + unit.conversionToHours
      }
    );
    if(totTime){
      let hours = Math.floor(Math.round(totTime*60)/60);
      let minutes = Math.round(totTime*60) - hours*60;
      if(minutes < 10){
        totTimeString = `${hours}:0${minutes}`;
      }else{
        totTimeString = `${hours}:${minutes}`;
      }
    }
    if(summary.totalKilometers){
      summary.totalMiles = summary.totalKilometers*0.621371192;
      summary.totalKilometers = Number(summary.totalKilometers.toFixed(2))
      summary.totalMiles = Number(summary.totalMiles.toFixed(2))
    }
    summary.totalTime = totTimeString;
    
    //diet summary:
    dietTilesArray.forEach(
      tile => {
        tile.tile_diets.forEach(
          meal => {
            let energyAmount: any = meal.tile_diet_energy_amount;
            //convert to number
            if(energyAmount && energyAmount.toString().includes(',')){
              let stringNumber = Number(energyAmount.toString().replace(',','.'));
              energyAmount = stringNumber;
            }else{
              energyAmount = Number(meal.tile_diet_energy_amount);
            };
            //if kcal
            if(energyAmount && meal.tile_diet_energy_unit === 'kcal'){
              summary.totalCaloriesKcal = summary.totalCaloriesKcal + energyAmount;
              summary.totalCaloriesKj = summary.totalCaloriesKj + energyAmount*4.184;
            }
            //if kJ
            if(energyAmount && meal.tile_diet_energy_unit === 'kJ'){
              summary.totalCaloriesKcal = summary.totalCaloriesKcal + energyAmount/4.184;
              summary.totalCaloriesKj = summary.totalCaloriesKj + energyAmount;
            }


            //CARBS CARBS CARBS CARBS CARBS CARBS CARBS CARBS CARBS:
            let carbEnergyAmount: any = meal.tile_diet_carbohydrates_amount;
            //convert to number
            if(carbEnergyAmount && carbEnergyAmount.toString().includes(',')){
              let stringNumber = Number(carbEnergyAmount.toString().replace(',','.'));
              carbEnergyAmount = stringNumber;
            }else{
              carbEnergyAmount = Number(meal.tile_diet_carbohydrates_amount);
            }
            //if kcal
            if(carbEnergyAmount && meal.tile_diet_carbohydrates_unit === 'kcal'){
              summary.totalCarbCaloriesKcal = summary.totalCarbCaloriesKcal + carbEnergyAmount;
              summary.totalCarbCaloriesKj = summary.totalCarbCaloriesKj + carbEnergyAmount*4.184;
              summary.totalCarbGrams = summary.totalCarbGrams + carbEnergyAmount/4;
            }
            //if kJ
            if(carbEnergyAmount && meal.tile_diet_carbohydrates_unit === 'kJ'){
              summary.totalCarbCaloriesKcal = summary.totalCarbCaloriesKcal + carbEnergyAmount/4.184;
              summary.totalCarbCaloriesKj = summary.totalCarbCaloriesKj + carbEnergyAmount;
              summary.totalCarbGrams = summary.totalCarbGrams + carbEnergyAmount/16.736;
            }
            //if g
            if(carbEnergyAmount && meal.tile_diet_carbohydrates_unit === 'g'){
              summary.totalCarbCaloriesKcal = summary.totalCarbCaloriesKcal + carbEnergyAmount*4;
              summary.totalCarbCaloriesKj = summary.totalCarbCaloriesKj + carbEnergyAmount*16.736;
              summary.totalCarbGrams = summary.totalCarbGrams + carbEnergyAmount;
            }
            //if mg
            if(carbEnergyAmount && meal.tile_diet_carbohydrates_unit === 'mg'){
              summary.totalCarbCaloriesKcal = summary.totalCarbCaloriesKcal + carbEnergyAmount*4000;
              summary.totalCarbCaloriesKj = summary.totalCarbCaloriesKj + carbEnergyAmount*16736;
              summary.totalCarbGrams = summary.totalCarbGrams + carbEnergyAmount*1000;
            }


            //PROTEIN PROTEIN PROTEIN PROTEIN PROTEIN PROTEIN PROTEIN PROTEIN PROTEIN:
            let proteinEnergyAmount: any = meal.tile_diet_protein_amount;
            //convert to number
            if(proteinEnergyAmount && proteinEnergyAmount.toString().includes(',')){
              let stringNumber = Number(proteinEnergyAmount.toString().replace(',','.'));
              proteinEnergyAmount = stringNumber;
            }else{
              proteinEnergyAmount = Number(meal.tile_diet_protein_amount);
            }
            //if kcal
            if(proteinEnergyAmount && meal.tile_diet_protein_unit === 'kcal'){
              summary.totalProteinCaloriesKcal = summary.totalProteinCaloriesKcal + proteinEnergyAmount;
              summary.totalProteinCaloriesKj = summary.totalProteinCaloriesKj + proteinEnergyAmount*4.184;
              summary.totalProteinGrams = summary.totalProteinGrams + proteinEnergyAmount/4;
            }
            //if kJ
            if(proteinEnergyAmount && meal.tile_diet_protein_unit === 'kJ'){
              summary.totalProteinCaloriesKcal = summary.totalProteinCaloriesKcal + proteinEnergyAmount/4.184;
              summary.totalProteinCaloriesKj = summary.totalProteinCaloriesKj + proteinEnergyAmount;
              summary.totalProteinGrams = summary.totalProteinGrams + proteinEnergyAmount/16.736;
            }
            //if g
            if(proteinEnergyAmount && meal.tile_diet_protein_unit === 'g'){
              summary.totalProteinCaloriesKcal = summary.totalProteinCaloriesKcal + proteinEnergyAmount*4;
              summary.totalProteinCaloriesKj = summary.totalProteinCaloriesKj + proteinEnergyAmount*16.736;
              summary.totalProteinGrams = summary.totalProteinGrams + proteinEnergyAmount;
            }
            //if mg
            if(proteinEnergyAmount && meal.tile_diet_protein_unit === 'mg'){
              summary.totalProteinCaloriesKcal = summary.totalProteinCaloriesKcal + proteinEnergyAmount*4000;
              summary.totalProteinCaloriesKj = summary.totalProteinCaloriesKj + proteinEnergyAmount*16736;
              summary.totalProteinGrams = summary.totalProteinGrams + proteinEnergyAmount*1000;
            }


            //FAT FAT FAT FAT FAT FAT FAT FAT FAT:
            let fatEnergyAmount: any = meal.tile_diet_fat_amount;
            //convert to number
            if(fatEnergyAmount && fatEnergyAmount.toString().includes(',')){
              let stringNumber = Number(fatEnergyAmount.toString().replace(',','.'));
              fatEnergyAmount = stringNumber;
            }else{
              fatEnergyAmount = Number(meal.tile_diet_fat_amount)
            }
            //if kcal
            if(fatEnergyAmount && meal.tile_diet_fat_unit === 'kcal'){
              summary.totalFatCaloriesKcal = summary.totalFatCaloriesKcal + fatEnergyAmount;
              summary.totalFatCaloriesKj = summary.totalFatCaloriesKj + fatEnergyAmount*4.184;
              summary.totalFatGrams = summary.totalFatGrams + fatEnergyAmount/9;
            }
            //if kJ
            if(fatEnergyAmount && meal.tile_diet_fat_unit === 'kJ'){
              summary.totalFatCaloriesKcal = summary.totalFatCaloriesKcal + fatEnergyAmount/4.184;
              summary.totalFatCaloriesKj = summary.totalFatCaloriesKj + fatEnergyAmount;
              summary.totalFatGrams = summary.totalFatGrams + fatEnergyAmount/16.736;
            }
            //if g
            if(fatEnergyAmount && meal.tile_diet_fat_unit === 'g'){
              summary.totalFatCaloriesKcal = summary.totalFatCaloriesKcal + fatEnergyAmount*4;
              summary.totalFatCaloriesKj = summary.totalFatCaloriesKj + fatEnergyAmount*16.736;
              summary.totalFatGrams = summary.totalFatGrams + fatEnergyAmount;
            }
            //if mg
            if(fatEnergyAmount && meal.tile_diet_fat_unit === 'mg'){
              summary.totalFatCaloriesKcal = summary.totalFatCaloriesKcal + fatEnergyAmount*4000;
              summary.totalFatCaloriesKj = summary.totalFatCaloriesKj + fatEnergyAmount*16736;
              summary.totalFatGrams = summary.totalFatGrams + fatEnergyAmount*1000;
            }


          }
        )
      }
    )

    //diet rounding
    summary.totalCaloriesKj = Number(summary.totalCaloriesKj.toFixed(2));
    summary.totalCaloriesKcal = Number(summary.totalCaloriesKcal.toFixed(2));
    summary.totalCarbCaloriesKj = Number(summary.totalCarbCaloriesKj.toFixed(2));
    summary.totalCarbCaloriesKcal = Number(summary.totalCarbCaloriesKcal.toFixed(2));
    summary.totalCarbGrams = Number(summary.totalCarbGrams.toFixed(2));
    summary.totalFatCaloriesKj = Number(summary.totalFatCaloriesKj.toFixed(2));
    summary.totalFatCaloriesKcal = Number(summary.totalFatCaloriesKcal.toFixed(2));
    summary.totalFatGrams = Number(summary.totalFatGrams.toFixed(2));
    summary.totalProteinCaloriesKj = Number(summary.totalProteinCaloriesKj.toFixed(2));
    summary.totalProteinCaloriesKcal = Number(summary.totalProteinCaloriesKcal.toFixed(2));
    summary.totalProteinGrams = Number(summary.totalProteinGrams.toFixed(2));
    
    return summary;



  }
}

export interface Summary {
  trainingSessions: number;
  totalKilometers: number;
  totalMiles: number;
  totalTime: string;
  totalMeals: number;
  totalCaloriesKj: number;
  totalCaloriesKcal: number;
  totalCarbCaloriesKj: number;
  totalCarbCaloriesKcal: number;
  totalCarbGrams: number;
  totalFatCaloriesKj: number;
  totalFatCaloriesKcal: number;
  totalFatGrams: number;
  totalProteinCaloriesKj: number;
  totalProteinCaloriesKcal: number;
  totalProteinGrams: number;
}
