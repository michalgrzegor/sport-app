import { Association } from 'src/app/shared/store/tiles-data.reducers';
import { Tag } from '../tile-editor/tile-editor.component';

export class Tile {
    //tile ID generated by backend
    tile_session?: number;
    tile_id?: string;
    id?: any;
    asso_id?: number;
    
    //tile setting for all types of tiles
    tile_type?: string;
    tile_type_name?: string;
    tile_type_color?: string;
    tile_title?: string;
    tile_description?: string;
    tile_tag?: string;
    tile_tags?: any[];
    
    //tile of type "training"
    tile_activities?: TileActivity[];
    tile_activities_sets?: number;
    tile_activities_sets_rest_unit?: string;
    tile_activities_sets_rest_ammount?: string; 
    tile_activities_sets_rest_intensity_unit?: string;
    tile_activities_sets_rest_intensity_ammount?: string;
    
    //tile of type "diet"
    tile_diets?: TileDiet[];
    
    //tile of type "question"
    tile_question?: TileQuestion;
    
    //tile of type "motivation"
    tile_motivation?: TileMotivation;
    
    tile_is_open?: boolean;
    
    //temporary elements 
    tile_temporary_id?: number;
    asso_index_in_array?: number;
    asso?: Association;
}


export class TileActivity {
    //api variables
    id?: number;
    _destroy?: number;
    
    //activity name
    tile_activity_name?: string;
    
    //how many reps in single activity
    tile_activity_reps?: number;
    
    //activity unit in km, miles, kg
    tile_activity_unit?: string;
    tile_activity_amount?: string;
    
    //activity intensity in hr zones, tempo, speed
    tile_activity_intensity?: string;
    tile_activity_intensity_amount?: string;
    
    //activity rest in min, sec, m, km
    tile_activity_rest_unit?: string;
    tile_activity_rest_amount?: string;
    
    //rest intensity in hr zones, tempo, speed
    tile_activity_rest_intensity?: string;
    tile_activity_rest_intensity_amount?: string;
    
    //additional notes atached to meal
    tile_activity_note?: string;

    // -------------> nowe elementy <----------------------
    tile_activity_rest_after_activity_unit?: string;
    tile_activity_rest_after_activity_amount?: string;
    tile_activity_rest_after_activity_intensity?: string;
    tile_activity_rest_after_activity_intensity_amount?: string;

}

export class TileDiet {
    //api variables
    id?: number;
    _destroy?: number;

    //meal/target name
    tile_diet_meal?: string;
    
    //how many calories do you want to consume
    tile_diet_energy_unit?: string;
    tile_diet_energy_amount?: string;
    
    //how many calories in carbs do you want to consume
    tile_diet_carbohydrates_unit?: string;
    tile_diet_carbohydrates_amount?: string;
    
    //how many calories in protein do you want to consume
    tile_diet_protein_unit?: string;
    tile_diet_protein_amount?: string;
    
    //how many calories in fats do you want to consume
    tile_diet_fat_unit?: string;
    tile_diet_fat_amount?: string;
    
    //array containing custom nutrients
    tile_diet_nutrients?: TileDietNutrient[];
    
    //additional notes atached to meal
    tile_diet_note?: string;
    
}

export class TileDietNutrient {
    //api variables
    id?: number;
    _destroy?: number;
    
    //custom nutrients created by user
    //units and amount is like carbs, fat, and protein in TileDiet
    tile_diet_nutrient_name?: string;
    tile_diet_nutrient_unit?: string;
    tile_diet_nutrient_amount?: string;
}

export class TileMotivation {
    //motivation quotes, or speach and youtube links
    tile_motivation_sentence?: string;
    tile_motivation_link?: string;
}

export class TileQuestion {
    tile_ask_question?: string;
    tile_answer_numeric?: boolean;
    tile_answer_numeric_from?: number;
    tile_answer_numeric_to?: number;
    tile_answers_descriptives?: string;
}