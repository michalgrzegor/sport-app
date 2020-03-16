import { HttpClientService } from './../shared/http-client.service';
import { Store } from '@ngrx/store';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormControl, FormGroup, FormArray, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material';
import { NewTileTypeComponent } from './new-tile-type/new-tile-type.component';
import { DataService } from 'src/app/shared/data.service';
import { Tile } from 'src/app/models/tile';
import { Subscription, Observable } from 'rxjs';
import { Router } from '@angular/router';
import { BreakpointObserver, Breakpoints, BreakpointState } from '@angular/cdk/layout';
import { VerifyDialogEditorComponent } from './verify-dialog-day/verify-dialog-editor.component';

import * as _ from 'lodash';


import * as fromApp from '../shared/store/app.reducers';
import * as TilesDataActions from '../shared/store/tiles-data.actions';
import * as CalendarDataActions from '../shared/store/calendar-data.actions';

export interface TrainingType {
  name: string,
  type: string,
  color: string,
  selected: boolean
};

export interface Tag {
  tag_name: string,
  selected?: boolean,
  id?: number,
  user_id?: number
}

export interface CardEditor {
  open: boolean,
  animate: string
}

@Component({
  selector: 'app-tile-editor',
  templateUrl: './tile-editor.component.html',
  styleUrls: ['./tile-editor.component.scss']
})
export class TileEditorComponent implements OnInit, OnDestroy {
  tileState: Observable<Tile>;
  tileSub: Subscription;
  tile: Tile = null;
  editedTile: Tile = null;

  removedActivities: any[] = [];
  removedDiet: any[] = [];
  
  isEditedState: Observable<boolean>;
  isEditedSub: Subscription;
  isEdited: boolean = null;
  
  mainRouteState: Observable<string>;
  mainRouteSub: Subscription;
  mainRoute: string = null;

  isTutorialState: Observable<boolean>;
  isTutorialSub: Subscription;
  isTutorial: boolean;
  
  tagsState: Observable<Tag[]>;
  tagsSub: Subscription;
  tags: Tag[] = null;
  tagsE: Tag[] = null;

  jsonFromForm: {} = {};

  intensityArray: string[];
  unitsArray: string[];
  energyUnitsArray: string[];
  energyUnitsArrayNutrient: string[];

  isDescriptive: boolean = false;
  isSubmitted: boolean = false;

  removable: boolean = true;
  selectable: boolean = true;

  //errors
  errorReq: string = 'this field is required';
  errorMaxLengthShort: string = 'this field requied only 255 characters';
  errorMaxLengthLong: string = 'this field requied only 30 000 characters';

  //responsive variables
  isHandset: boolean;
  isTablet: boolean;
  isWeb: boolean;

  //variables for cards
  activityArray: CardEditor[] = [];
  dietArray: CardEditor[] = [];

  constructor( 
    private dialog: MatDialog,
    private _data: DataService,
    private _store: Store<fromApp.AppState>,
    private _httpService: HttpClientService,
    public _dialog: MatDialog,
    private _router: Router,
    public _breakpointObserver: BreakpointObserver
    ) { }

  ngOnInit() {
    this.trainingTypes = this._data.gettrainingTypes();
    this.intensityArray = this._data.getBasicUnits().intensityArray;
    this.unitsArray = this._data.getBasicUnits().unitsArray;
    this.energyUnitsArray = this._data.getBasicUnits().energyUnitsArray;
    this.energyUnitsArrayNutrient = this._data.getBasicUnits().energyUnitsArrayNutrient;
    this.removedActivities = [];

    this.activityArray = [];
    this.dietArray = [];

    this._store.dispatch(new TilesDataActions.FetchTags());

     //break points

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

    this.tileState = this._store.select(state => state.tiles.tile);
    this.tileSub = this.tileState.subscribe(
      data => {
        this.tile = data;
        if(data){
          this.editedTile = Object.assign({}, this.tile);
          if(this.mainRoute && this.isEdited && this.tags){
            this.edit();
          }
        }
      }
    );

    this.mainRouteState = this._store.select(state => state.tiles.mainRoute);
    this.mainRouteSub = this.mainRouteState.subscribe(
      data => {
        this.mainRoute = data;
        if(this.tile && this.isEdited && this.tags){
          this.edit();
        }
      }
    );

    this.tagsState = this._store.select(state => state.tiles.tags);
    this.tagsSub = this.tagsState.subscribe(
      data => {
        if(data){
          if( data.length > 0){
            const array = [];
            data.forEach(t=>array.push(Object.assign({},t)));
            const arrayE = [];
            data.forEach(t=>arrayE.push(Object.assign({},t)));
            array.forEach(
              tag => {
                tag.selected = false;
                arrayE.forEach(
                  tagE => {
                    if(tagE.id === tag.id){
                      if(tagE.selected){
                        tag.selected = true;
                      }else{
                        tag.selected = false;
                      }
                    }
                  }
                )
              }
            );
            this.tags = array;
          }else{
            this.tags = [];
          }
          if(this.mainRoute && this.tile && this.isEdited){
            this.edit();
          }
        }else{
          this.tags = [];
        }
      }
    );
    
    this.isEditedState = this._store.select(state => state.tiles.isEdited);
    this.isEditedSub = this.isEditedState.subscribe(
      data => {
        this.isEdited = data;
        if(data && this.mainRoute && this.tile && this.tags){
          this.edit();
        }
      }
    );

    this.isTutorialState = this._store.select(state => state.calendar.isTutorial);
    this.isTutorialSub = this.isTutorialState.subscribe(
      data => {
        this.isTutorial = data;
        if(data){
          this.edit();
        }
      }
    );

  }
  
  //selecting type of tile
  trainingType: TrainingType;
  trainingTypes: TrainingType[];
  actualTrainingPlan: any;
  
  
  //this function create new category and select created category
  onSelectType(i) {
    this.tile_editor_form.reset();

    this.tile_editor_form.setControl('tile_activities', new FormArray([
      this.onAddNewActivity(),
    ]))
    this.tile_editor_form.setControl('tile_diets', new FormArray([
      this.onAddNewDiet(),
    ]))

    this._store.dispatch(new TilesDataActions.StopEditTile());
    const newTrainingType: TrainingType = { name: '', type: '', color: this.getRandomColor(), selected: true };
    this.trainingTypes.forEach(function(type, value){
      if(value == i) {
        type.selected = true;
      }else{
        type.selected = false;
      }
    })
    this.actualTrainingPlan = this.trainingTypes[i].type;
    

    //open dialog to create new category
    if(this.trainingTypes[i].name == 'add') {
      const dialogRef = this.dialog.open(NewTileTypeComponent, {
        width: '408px',
        data: { data: newTrainingType }
      });
      dialogRef.afterClosed().subscribe(
        result => {
          const data = result;
          if(result){
            newTrainingType.name = data.name;
            newTrainingType.type = data.type;
            if(data.color) {
              newTrainingType.color = data.color;
            }
            this._data.getNewTrainingType(newTrainingType);
            this.trainingTypes = this._data.gettrainingTypes();
            this.actualTrainingPlan = result.type;
            this.trainingTypes[i].selected = false;
          } else {
            this.trainingTypes[i].selected = false;
          }
        }
      )
      this.trainingType = newTrainingType;
    }else {
      this.trainingType = this.trainingTypes[i]
    }
  }
  
  onSelectTypeEdit(i) {
    this.tile_editor_form.reset();
    const newTrainingType: TrainingType = { name: '', type: '', color: this.getRandomColor(), selected: true };
    this.trainingTypes.forEach(function(type, value){
      if(value == i) {
        type.selected = true;
      }else{
        type.selected = false;
      }
    })
    this.actualTrainingPlan = this.trainingTypes[i].type;
    

    //open dialog to create new category
    if(this.trainingTypes[i].name == 'add') {
      const dialogRef = this.dialog.open(NewTileTypeComponent, {
        width: '408px',
        data: { data: newTrainingType }
      });
      dialogRef.afterClosed().subscribe(
        result => {
          const data = result;
          if(result){
            newTrainingType.name = data.name;
            newTrainingType.type = data.type;
            if(data.color) {
              newTrainingType.color = data.color;
            }
            this._data.getNewTrainingType(newTrainingType);
            this.trainingTypes = this._data.gettrainingTypes();
            this.actualTrainingPlan = result.type;
            this.trainingTypes[i].selected = false;
          } else {
            this.trainingTypes[i].selected = false;
          }
        }
      )
      this.trainingType = newTrainingType;
    }else {
      this.trainingType = this.trainingTypes[i]
    }
  }


  //form controls
  public tile_editor_form = new FormGroup({
    tile_title: new FormControl('',[ Validators.maxLength(255), Validators.required ]),
    tile_id: new FormControl(''),

    //sport training sessions
    tile_activities: new FormArray([
      this.onAddNewActivity(),
    ]),

    //when diet check
    tile_diets: new FormArray([
      this.onAddNewDiet(),
    ]),

    //when motivation check
    tile_motivation: new FormGroup({
      tile_motivation_sentence: new FormControl('', Validators.maxLength(30000)),
      tile_motivation_link: new FormControl('', Validators.maxLength(255))
    }),

    //when question check
    tile_question: new FormGroup({
      tile_ask_question: new FormControl('', Validators.maxLength(255)),
      tile_answer_numeric: new FormControl(''),
      tile_answer_numeric_from: new FormControl(''),
      tile_answer_numeric_to: new FormControl(''),
      tile_answers_descriptives: new FormControl('', Validators.maxLength(255)),
    }),

    tile_activities_sets: new FormControl('', Validators.maxLength(255)),
    tile_activities_sets_rest_unit: new FormControl(''),
    tile_activities_sets_rest_ammount: new FormControl('', Validators.maxLength(255)),
    tile_activities_sets_rest_intensity_unit: new FormControl(''),
    tile_activities_sets_rest_intensity_ammount: new FormControl('', Validators.maxLength(255)),
    tile_description: new FormControl('', Validators.maxLength(30000)),
    tile_tag: new FormControl('', Validators.maxLength(255)),
    tile_tags: new FormArray([])

  })

  onAddNewActivity() {
    this.activityArray.push({open: false, animate: null});
    return new FormGroup({
      id: new FormControl(''),
      tile_activity_name: new FormControl('', Validators.maxLength(255)),
      tile_activity_reps: new FormControl('', Validators.maxLength(255)),
      tile_activity_unit: new FormControl(''),
      tile_activity_amount: new FormControl('', Validators.maxLength(255)),
      tile_activity_intensity: new FormControl(''),
      tile_activity_intensity_amount: new FormControl('', Validators.maxLength(255)),
      tile_activity_rest_unit: new FormControl(''),
      tile_activity_rest_amount: new FormControl('', Validators.maxLength(255)),
      tile_activity_rest_intensity: new FormControl(''),
      tile_activity_rest_intensity_amount: new FormControl('', Validators.maxLength(255)),
      tile_activity_note: new FormControl('', Validators.maxLength(30000)),
      tile_activity_rest_after_activity_unit: new FormControl(''),
      tile_activity_rest_after_activity_amount: new FormControl('', Validators.maxLength(255)),
      tile_activity_rest_after_activity_intensity: new FormControl(''),
      tile_activity_rest_after_activity_intensity_amount: new FormControl('', Validators.maxLength(255))
    });
  }

  addNewActivity() {
    const control = <FormArray>this.tile_editor_form.get('tile_activities');
    control.push(this.onAddNewActivity())
  }

  deleteActivity(index: number){
    const dialogRef = this._dialog.open(VerifyDialogEditorComponent, {
      width: '300px',
      autoFocus: false,
      id: 'delete-dialog-tile',
      data: {tileType: 'training'}
    });

    dialogRef.afterClosed().subscribe(result => {
      if(result){
        this.activityArray.splice(index,1);
        const control = <FormArray>this.tile_editor_form.get('tile_activities');
        control.removeAt(index);

        if(this.isEdited && this.editedTile.tile_activities[index]){
          this.removedActivities.push({
            id: this.editedTile.tile_activities[index].id, 
            _destroy: 1
          });
        }

      }
    })
  }

  onAddNewDiet() {
    this.dietArray.push({open: false, animate: null});
    return new FormGroup({
      id: new FormControl(''),
      tile_diet_meal: new FormControl('', Validators.maxLength(255)),
      tile_diet_energy_unit: new FormControl(''),
      tile_diet_energy_amount: new FormControl('', Validators.maxLength(255)),
      tile_diet_carbohydrates_unit: new FormControl(''),
      tile_diet_carbohydrates_amount: new FormControl('', Validators.maxLength(255)),
      tile_diet_protein_unit: new FormControl(''),
      tile_diet_protein_amount: new FormControl('', Validators.maxLength(255)),
      tile_diet_fat_unit: new FormControl(''),
      tile_diet_fat_amount: new FormControl('', Validators.maxLength(255)),
      tile_diet_nutrients: new FormArray([]),
      tile_diet_note: new FormControl('', Validators.maxLength(30000)),
    });
  }

  addNewDiet() {
    const control = <FormArray>this.tile_editor_form.get('tile_diets');
    control.push(this.onAddNewDiet())
  }

  deleteDiet(index: number){
    
    const dialogRef = this._dialog.open(VerifyDialogEditorComponent, {
      width: '300px',
      autoFocus: false,
      id: 'delete-dialog-tile',
      data: {tileType: 'diet'}
    });

    dialogRef.afterClosed().subscribe(result => {
      if(result){
        this.dietArray.splice(index,1);
        const control = <FormArray>this.tile_editor_form.get('tile_diets');
        control.removeAt(index);

        if(this.isEdited && this.editedTile.tile_diets[index]){
          this.removedDiet.push({
            id: this.editedTile.tile_diets[index].id, 
            _destroy: 1
          });
        };
      }
    })
  }

  onAddNutrients() {
    return new FormGroup({
      id: new FormControl(''),
      tile_diet_nutrient_name: new FormControl('', Validators.maxLength(255)),
      tile_diet_nutrient_unit: new FormControl(''),
      tile_diet_nutrient_amount: new FormControl('', Validators.maxLength(255))
    });
  }

  addNutrient(index: number) {
    const control = <FormArray>this.tile_editor_form.get('tile_diets')['controls'][index].get('tile_diet_nutrients');
    control.push(this.onAddNutrients());
  }

  deleteNutrient(index_diet: number, index_nutrient: number){
        
    const dialogRef = this._dialog.open(VerifyDialogEditorComponent, {
      width: '300px',
      autoFocus: false,
      id: 'delete-dialog-tile',
      data: {tileType: 'nutrient'}
    });

    dialogRef.afterClosed().subscribe(result => {
      if(result){
        const control = <FormArray>this.tile_editor_form.get('tile_diets')['controls'][index_diet].get('tile_diet_nutrients');
        control.removeAt(index_nutrient);

        if(this.isEdited){
          if(this.removedDiet.length>0){
            this.removedDiet.forEach(
              element => {
                if(element.id === this.editedTile.tile_diets[index_diet].id){
                  if(element.tile_diet_nutrients){
                    element.tile_diet_nutrients.push({
                      id: this.editedTile.tile_diets[index_diet].tile_diet_nutrients[index_nutrient].id, 
                      _destroy: 1
                    })
                  }else{
                    element.tile_diet_nutrients = [];
                    element.tile_diet_nutrients.push({
                      id: this.editedTile.tile_diets[index_diet].tile_diet_nutrients[index_nutrient].id, 
                      _destroy: 1
                    })
                  }
                  
                }else{
                  this.removedDiet.push({
                    id: this.editedTile.tile_diets[index_diet].id,
                    tile_diet_nutrients: [
                      {
                        id: this.editedTile.tile_diets[index_diet].tile_diet_nutrients[index_nutrient].id, 
                        _destroy: 1
                      }
                    ]
                  })
                }
              }
            )

          }else{
            if(this.editedTile.tile_diets[index_diet] && this.editedTile.tile_diets[index_diet].tile_diet_nutrients[index_nutrient]){
              this.removedDiet.push({
                id: this.editedTile.tile_diets[index_diet].id,
                tile_diet_nutrients: [
                  {
                    id: this.editedTile.tile_diets[index_diet].tile_diet_nutrients[index_nutrient].id, 
                    _destroy: 1
                  }
                ]
              })
            }
          }
        }
      }
    })
    
  }

  //random color generator

  getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  };

  getRandomColor() {
    let r = this.getRandomInt(0, 250);
    let g = this.getRandomInt(0, 250);
    let b = this.getRandomInt(0, 250);
    return "rgb(" + r + "," + g + "," + b + ")";
  };

  //tag functionality
  tagsSelected: number[] = [];

  onTagSelect(index: number){
    this.tags[index].selected = !this.tags[index].selected;
    this.tags[index] = Object.assign({}, this.tags[index])
    if(_.includes(this.tagsSelected, this.tags[index].id)){
      this.tagsSelected.splice(this.tagsSelected.indexOf(this.tags[index].id), 1)
    }else {
      this.tagsSelected.push(this.tags[index].id)
    }
  }

  onAddTag() {
    let tagSame: boolean = true;
    let tagName = this.tile_editor_form.get('tile_tag');

    if(tagName.value && tagName.value.length>0){
      if(this.tags && this.tags.length > 0){
        this.tags.forEach(function(value){
          if(tagName.value.toLowerCase() === value.tag_name){
            tagSame = false;
          } else {
            tagSame = true;
          }
        })
      }
      if(tagSame){this._httpService.postTag(tagName.value)}
    }

    tagName.reset();
  };

  removeTag(tag: Tag){
    this._store.dispatch(new TilesDataActions.DeleteTag(tag.id));
    this._httpService.deleteTag(tag.id);
  }

  onSubmit(){
    this.isSubmitted = true; 

    let obj: Tile = this.tile_editor_form.value;
    obj.tile_tags = this.tagsSelected;
    obj.tile_type = this.trainingType.type;
    obj.tile_type_name = this.trainingType.name;
    obj.tile_type_color = this.trainingType.color;
    this.jsonFromForm = obj;

    if(obj.tile_type === 'training' && this.tile_editor_form.valid){

      let array = [];
      obj.tile_activities.forEach(activity => {array.push(activity.tile_activity_name, activity.tile_activity_reps, activity.tile_activity_unit, activity.tile_activity_amount,activity.tile_activity_intensity, activity.tile_activity_intensity_amount, activity.tile_activity_rest_unit, activity.tile_activity_rest_amount, activity.tile_activity_rest_intensity, activity.tile_activity_rest_intensity_amount, activity.tile_activity_note )
        }
      );
      array = _.remove(array, null);
      if(array.length === 0){obj.tile_activities = []}
      this._httpService.createTrainingTile(obj);

    }else if(obj.tile_type === 'diet' && this.tile_editor_form.valid){

      let array = [];
      obj.tile_diets.forEach(diet => {
        array.push(diet.tile_diet_meal, diet.tile_diet_energy_unit, diet.tile_diet_energy_amount, diet.tile_diet_carbohydrates_unit, diet.tile_diet_carbohydrates_amount, diet.tile_diet_protein_unit, diet.tile_diet_protein_amount, diet.tile_diet_fat_unit, diet.tile_diet_fat_amount, diet.tile_diet_note);
        diet.tile_diet_nutrients.forEach(nut => {
          array.push(nut.tile_diet_nutrient_name, nut.tile_diet_nutrient_unit, nut.tile_diet_nutrient_amount)
        })
      });
      array = _.remove(array, null);
      if(array.length === 0){obj.tile_diets = []};
      this._httpService.createDietTile(obj);

    }else if(obj.tile_type === 'motivation' && this.tile_editor_form.valid){

      let array = [];
      array.push(obj.tile_motivation.tile_motivation_link, obj.tile_motivation.tile_motivation_sentence);
      array = _.remove(array, null);
      if(array.length === 0){delete obj.tile_motivation};
      this._httpService.createMotivationTile(obj);

    }else if(obj.tile_type === 'question' && this.tile_editor_form.valid){

      let array = [];
      array.push( obj.tile_question.tile_ask_question, obj.tile_question.tile_answer_numeric, obj.tile_question.tile_answer_numeric_from, obj.tile_question.tile_answer_numeric_to, obj.tile_question.tile_answers_descriptives );
      array = _.remove(array, null);
      if(array.length === 0){delete obj.tile_question};
      this._httpService.createQuestionTile(obj);
    };

    this.trainingTypes.forEach(
      tpt => tpt.selected = false
    );

    if(this.isWeb){
      this._router.navigate([`/${this.mainRoute}`], {queryParams: { 'right': 'tilecollection' }});
    }else if(this.isHandset || this.isTablet){
      this._router.navigate(['/tilecollection']);
      this._store.dispatch(new TilesDataActions.SeteMainRoute('tilecollection'))
    }

    this._store.dispatch(new CalendarDataActions.SetClose(true))
    this.tile_editor_form.reset();
  }

  edit(){
    this.tile_editor_form.reset();

    let tile_to_edit = null;
    if(this.isTutorial){
      tile_to_edit = {
        tile_title: "mood after workout",
        tile_type: "question",
        tile_type_color: "#E8A022",
        tile_type_name: "question",
        tile_question: {
          tile_answer_numeric: false,
          tile_answer_numeric_from: null,
          tile_answer_numeric_to: null,
          tile_answers_descriptives: "it was too easy, simple but satisfying, i feel invigorated, training was demanding, training was too hard",
          tile_ask_question: "How do you feel after training?",
        }
      };

    }else{
      tile_to_edit = this.tile;
    }

    if(this.isTutorial){
      this.actualTrainingPlan = this.trainingTypes[3].type;
      this.trainingType = this.trainingTypes[3];
      if(this.trainingTypes){
        this.trainingTypes.forEach(
          trainingType => {
            trainingType.selected = false;
            if(trainingType.type === tile_to_edit.tile_type){
              trainingType.selected = true;
            }
          }
        )
      }
      if(tile_to_edit.tile_type === 'question' && tile_to_edit.tile_question.tile_answers_descriptives){
        this.isDescriptive = true;
      }
      this.tile_editor_form.patchValue(tile_to_edit);
    }
    if(this.isEdited){
      this.trainingTypes.forEach(
        (ttype, index) => {
          if(ttype.name === tile_to_edit.tile_type_name){
            this.onSelectTypeEdit(index);
          }
        }
      )
      this.actualTrainingPlan = tile_to_edit.tile_type;
      if(tile_to_edit.tile_activities){
        let control = <FormArray>this.tile_editor_form.get('tile_activities');
        control.reset();
        control.value.forEach(val=>control.removeAt(0));
        tile_to_edit.tile_activities.forEach(
          act => {
            control.push(this.onAddNewActivity());
          }
        )
      }
      if(tile_to_edit.tile_diets){
        let control = <FormArray>this.tile_editor_form.get('tile_diets');
        control.reset();
        if(control.value.length > 0){
          control.value.forEach(val=>control.removeAt(0));
        }
        tile_to_edit.tile_diets.forEach(
          diet => {
            control.push(this.onAddNewDiet());
          }
        )
        tile_to_edit.tile_diets.forEach((diet, index)=>{
          if(diet.tile_diet_nutrients){
            const controlNut = <FormArray>this.tile_editor_form.get('tile_diets')['controls'][index].get('tile_diet_nutrients');
            controlNut.reset();
            controlNut.value.forEach(val=>control.removeAt(0));
            for(let i = 0; i < diet.tile_diet_nutrients.length; i++ ){
              controlNut.push(this.onAddNutrients());
            }
          }
        })
      };
      this.tagsSelected = [];
      if(this.tags){
        this.tags.forEach(
          tag => tag.selected = false
        )
      }
      if(tile_to_edit.tile_tags){ tile_to_edit.tile_tags.forEach(
        tag =>{
          if(this.tags){
            this.tags.forEach(
              allTag => {
                if(tag.id === allTag.id){
                  allTag.selected = true;
                  this.tagsSelected.push(allTag.id);
                }
              }
            )
          }
        }
      )}
      if(this.trainingTypes){
        this.trainingTypes.forEach(
          trainingType => {
            trainingType.selected = false;
            if(trainingType.type === tile_to_edit.tile_type){
              trainingType.selected = true;
            }
          }
        )
      }
      if(tile_to_edit.tile_type === 'question' && tile_to_edit.tile_question.tile_answers_descriptives){
        this.isDescriptive = true;
      }
      this.tile_editor_form.patchValue(tile_to_edit);
    }
  }

  updateTile(){
    const tile: Tile = this.tile_editor_form.value;
    tile.tile_tags = this.tagsSelected;
    if(this.editedTile.tile_type === 'training'){
      this.removedActivities.forEach(
        ra => {tile.tile_activities.push(ra)}
      )
      this._httpService.updateTrainingTile(this.editedTile.id, tile);
    }else if(this.editedTile.tile_type === 'diet'){
      this.removedDiet.forEach(
        element => {
          if(element._destroy === 1){
            tile.tile_diets.push(element);
          }else if(element._destroy !== 1 && element.tile_diet_nutrients){
            tile.tile_diets.forEach(
              (diet, index) => {
                if(diet.id === element.id){
                  element.tile_diet_nutrients.forEach(
                    nutrient => {
                      tile.tile_diets[index].tile_diet_nutrients.push(nutrient)
                    }
                  )
                }
              }
            )
          }
        }
      );
      this._httpService.updateDietTile(this.editedTile.id, tile);
    }else if(this.editedTile.tile_type === 'motivation'){
      this._httpService.updateMotivationTile(this.editedTile.id, tile);
    }else if(this.editedTile.tile_type === 'question'){
      this._httpService.updateQuestionTile(this.editedTile.id, tile);
    };

    this._store.dispatch(new TilesDataActions.StopEditTile());

    if(this.isWeb){
      this._router.navigate([`/${this.mainRoute}`], {queryParams: { 'right': 'tilecollection' }});
    }else if(this.isHandset || this.isTablet){
      this._router.navigate(['/tilecollection']);
      this._store.dispatch(new TilesDataActions.SeteMainRoute('tilecollection'))
    }

    this.tile_editor_form.reset();
  };

  openActivityCard(index: number){
    this.activityArray[index].open = !this.activityArray[index].open;
    if(this.activityArray[index].animate === null){
      this.activityArray[index].animate = 'averse'
    }else if(this.activityArray[index].animate === 'averse'){
      this.activityArray[index].animate = 'reverse'
    }else{
      this.activityArray[index].animate = 'averse'
    }
  }
  openDietCard(index: number){
    this.dietArray[index].open = !this.dietArray[index].open;
    if(this.dietArray[index].animate === null){
      this.dietArray[index].animate = 'averse'
    }else if(this.dietArray[index].animate === 'averse'){
      this.dietArray[index].animate = 'reverse'
    }else{
      this.dietArray[index].animate = 'averse'
    }
  }

  ngOnDestroy(){
    this.tileSub.unsubscribe();
    this.isEditedSub.unsubscribe();
    this.mainRouteSub.unsubscribe();
    this.tagsSub.unsubscribe();
    this.isTutorialSub.unsubscribe();
    this.trainingTypes.forEach(
      tpt => tpt.selected = false
    );
  }

  
}
