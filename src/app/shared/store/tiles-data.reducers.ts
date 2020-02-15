import { Tag } from './../../tile-editor/tile-editor.component';
import { state } from '@angular/animations';
import { Tile } from 'src/app/models/tile';
import * as TilesDataActions from './tiles-data.actions';
import * as moment from 'moment';

export interface State {
    tiles: Tile[];
    dragTile: Tile;
    isChangeSession: boolean;
    trainingPlan: TrainingPlan;
    //summary data
    day: Tile[];
    week: Tile[];
    summaryClose: boolean;
    //editing tile data
    tile: Tile;
    isEdited: boolean;
    //search and category data
    isTilesCollectionMode: boolean;
    isCategoryMode: boolean;
    isSearchMode: boolean;
    tags: Tag[];

    tagName: string;
    typeName: string;
    wordName: string;
    //training plan data manager
    tPManagaer: TpInfo[];
    isTpCollectionMode: boolean;
    filterMode: boolean;

    //route var
    mainRoute: string;

    //http var
    isAuthenticated: boolean;
    noTP: boolean;
    spinnerCalendar: boolean;
    athleteAccount: boolean;
    onPlatformWithoutPlan: boolean;
    athleteAccountonPaidAccount: boolean;

    //invitations
    invitations: Invitation[];

    //payments
    isPaid: boolean;
    spinner: boolean;
    planShow: boolean;
    isManage: boolean;
    cardPayment: boolean;
    isPaidAccount: boolean;
    accountLevel: number;
    accountLimit: number;
    isTrial: boolean;
    manager: boolean;
    close: number;
    upgradeDowngrade: boolean;
    confirmation: boolean;
    price: number;
    paidAccountForDisplays: boolean;
    cardFail: boolean;

    //notifications
    oneSignalInit: boolean;

    //variable for first time log
    noTrial: boolean;

    //VARIABLE  polling
    isInGroup: boolean;
    isAuth: boolean;

    //variable check for changes
    fireChange: string;

    //comments
    comments: CalendarComment[];
}

const InitialState: State = {
    tiles: [],
    dragTile: null,
    isChangeSession: false,
    trainingPlan: null,
    day: null,
    week: null,
    summaryClose: true,
    tile: null,
    isEdited: false,
    isTilesCollectionMode: false,
    isCategoryMode: false,
    isSearchMode: false,
    tags: null,
    tagName: '',
    typeName: '',
    wordName: '',
    tPManagaer: [],
    isTpCollectionMode: false,
    filterMode: false,
    mainRoute: 'calendar',
    isAuthenticated: false,
    noTP: true,
    spinnerCalendar: true,
    invitations: [],
    isPaid: false,
    spinner: false,
    planShow: true,
    isManage: false,
    cardPayment: false,
    isPaidAccount: false,
    accountLevel: 0,
    accountLimit: 0,
    isTrial: false,
    manager: false,
    close: 0,
    upgradeDowngrade: false,
    confirmation: false,
    price: 0,
    oneSignalInit: false,
    athleteAccount: false,
    onPlatformWithoutPlan: false,
    athleteAccountonPaidAccount: false,
    paidAccountForDisplays: false,
    noTrial: true,
    cardFail: false,
    isInGroup: false,
    fireChange: null,
    isAuth: false,
    comments: []
}

export function TilesDataReducer(state = InitialState, action: TilesDataActions.TilesDataActions) {
    switch(action.type){
        case TilesDataActions.SET_TILES:
            const tilesST: Tile[] = action.payload
            const newTileST = [];
            tilesST.forEach(
                tile => {
                    let newTile = tile;
                    newTile.tile_id = tile.id;
                    newTileST.push(Object.assign({}, newTile))
                }
            )
            newTileST.forEach(
                (tile: Tile) => {
                    if(tile.tile_type === 'diet'){
                        tile.tile_diets.reverse()
                    }
                }
            );
            return {
                ...state,
                tiles: newTileST
            }

        case TilesDataActions.SET_TRAINING_PLAN:
            let tpSTP = Object.assign({}, action.payload);
            let commentsSTP = null
            if(tpSTP && !tpSTP.calendar_assocs){
                tpSTP.calendar_assocs = []
            }
            if(tpSTP && !tpSTP.calendar_stars){
                tpSTP.calendar_stars = []
            }
            if(tpSTP && tpSTP.calendar_comments){
                commentsSTP = tpSTP.calendar_comments
            }
            return {
                ...state,
                trainingPlan: tpSTP,
                noTP: false,
                comments: commentsSTP
            }

        case TilesDataActions.SET_TPMANAGER:
            let tPManagaerST = null;
            if(action.payload){
                tPManagaerST = [...action.payload]
            }else if(action.payload === null){
                tPManagaerST = null
            }
            return {
                ...state,
                tPManagaer: tPManagaerST
            }

        case TilesDataActions.DRAG_TILE:
            return {
                ...state,
                dragTile: action.payload.tile,
                isChangeSession: action.payload.changeSession
            }

        case TilesDataActions.MAKE_DAY:
            let idArrayMD = action.payload.day.association; 
            let tileArrayMD: Tile[] = [];
            if(idArrayMD && idArrayMD.length !== 0){
                tileArrayMD = []
                idArrayMD.forEach(
                    asso => {
                        state.tiles.forEach(
                            tile => {
                                if(tile.tile_id === asso.tile_id){
                                    let til = Object.assign({}, tile);
                                    til.tile_temporary_id = asso.asso_temporary_id;
                                    til.asso_index_in_array = asso.asso_index_in_array;
                                    til.tile_session = asso.training_sesion;
                                    til.asso_id = asso.id;
                                    til.asso = asso;
                                    tileArrayMD.push(til)
                                }
                            }
                        )
                    }
                )
            }else{
                idArrayMD = [];
            }
            return {
                ...state,
                day: tileArrayMD
            }

        case TilesDataActions.DELETE_TILE:
            const tilesDT = state.tiles;
            tilesDT.splice(action.payload, 1);
            return {
                ...state,
                tiles: tilesDT
            }

        case TilesDataActions.MAKE_WEEK:
            const weekArrayMW = [];
            action.payload.forEach(
                asso => {
                    state.tiles.forEach(
                        tile => {
                            if(tile.tile_id === asso.tile_id){
                                let til = Object.assign({}, tile);
                                weekArrayMW.push(til);
                            }
                        }
                    )
                }
            );
            return{
                ...state,
                week: weekArrayMW
            }

        case TilesDataActions.SUMMARY_TOGLE:
            return {
                ...state,
                summaryClose: action.payload
            }

        case TilesDataActions.EDIT_TILE:
            return {
                ...state,
                tile: action.payload,
                isEdited: true
            }

        case TilesDataActions.STOP_EDIT_TILE:
            return {
                ...state,
                tile: null,
                isEdited: false
            }

        case TilesDataActions.ENTER_TILES_COLLECTION_MODE:
            return {
                ...state,
                isTilesCollectionMode: action.payload
            }

        case TilesDataActions.ENTER_CATEGORY_MODE:
            return {
                ...state,
                isCategoryMode: !state.isCategoryMode
            }

        case TilesDataActions.ENTER_SEARCH_MODE:
            return {
                ...state,
                isSearchMode: !state.isSearchMode
            }

        case TilesDataActions.TAGS_SEARCH:
            return {
                ...state,
                tagName: action.payload
            }

        case TilesDataActions.TYPE_SEARCH:
            return {
                ...state,
                typeName: action.payload
            }

        case TilesDataActions.SEARCH_WORD:
            return {
                ...state,
                wordName: action.payload
            }

        case TilesDataActions.FILTER_MODE_SWITCH:
            return {
                ...state,
                filterMode: !state.filterMode
            }

        case TilesDataActions.TP_MODE:
            return {
                ...state,
                isTpCollectionMode: action.payload
            }

        case TilesDataActions.ADD_STAR:
            const TpAS = Object.assign({}, state.trainingPlan);
            TpAS.calendar_stars.push(action.payload);
            return {
                ...state,
                trainingPlan: TpAS
            }

        case TilesDataActions.UPDATE_STAR:
            const TpUS = state.trainingPlan;
            TpAS.calendar_stars.forEach(
                star => {
                    if(moment(star.star_date).format() === moment(action.payload.star_date).format()){
                        star.star_color = action.payload.star_color;
                        star.star_date = action.payload.star_date;
                        star.star_description = action.payload.star_description;
                    }
                }
            );
            return {
                ...state,
                trainingPlan: TpUS
            }

        case TilesDataActions.DELETE_STAR:
            const TpDS = Object.assign({}, state.trainingPlan) ;
            TpDS.calendar_stars.forEach((star, index) => {if(star.id === action.payload){TpDS.calendar_stars.splice(index,1)}});
            return {
                ...state,
                trainingPlan: TpDS
            }

        case TilesDataActions.SET_MAIN_ROUTE:
            return {
                ...state,
                mainRoute: action.payload
            }

        case TilesDataActions.SET_AUTH:
            return {
                ...state,
                isAuthenticated: true
            }

        case TilesDataActions.OFF_AUTH:
            return {
                ...state,
                isAuthenticated: false
            }

        case TilesDataActions.POST_TRAINING_TILE:
            const tilesPTT = state.tiles;
            const tilePTT = action.payload;
            tilePTT.tile_id = tilePTT.id;
            tilesPTT.unshift(tilePTT);
            return {
                ...state,
                tiles: tilesPTT
            }

        case TilesDataActions.SET_NO_TP:
            return {
                ...state,
                noTP: action.payload
            }

        case TilesDataActions.ADD_TP_MANAGER:
            const tpManagerATM = [...state.tPManagaer];
            tpManagerATM.unshift(action.payload);
            return {
                ...state,
                tPManagaer: tpManagerATM
            }

        case TilesDataActions.DELETE_TP_MANAGER:
            let tpManagerDTM = [...state.tPManagaer];
            let indexDTM = null;
            tpManagerDTM.forEach( (el, index) => {
                if(el.id === action.payload){
                    indexDTM = index;
                }
            });
            tpManagerDTM.splice(indexDTM,1);
            return {
                ...state,
                tPManagaer: tpManagerDTM,
            }

        case TilesDataActions.SPINNER_START_STOP_CALENDAR:
            return {
                ...state,
                spinnerCalendar: action.payload,
            }

        case TilesDataActions.SET_INVITATIONS:
            let invitationsSI = []
            if(action.payload){
                invitationsSI = [...action.payload]
            }
            return {
                ...state,
                invitations: invitationsSI
            }

        case TilesDataActions.IS_PAID_CHANGE:
            return {
                ...state,
                isPaid: action.payload
            }

        case TilesDataActions.SPINNER_CHANGE:
            return {
                ...state,
                spinner: action.payload
            }

        case TilesDataActions.PLAN_SHOW_CHANGE:
            return {
                ...state,
                planShow: action.payload
            }

        case TilesDataActions.IS_MANAGE_CHANGE:
            return {
                ...state,
                isManage: action.payload
            }

        case TilesDataActions.CARD_PAYMENT_CHANGE:
            return {
                ...state,
                cardPayment: action.payload
            }

        case TilesDataActions.IS_PAID_ACCOUNT_SET:
            return {
                ...state,
                isPaidAccount: action.payload
            }

        case TilesDataActions.ACCOUNT_LEVEL_SET:
            const levelALS = action.payload;
            const accountLimitALS = (levelALS-1)*4 + 6;
            return {
                ...state,
                accountLevel: action.payload,
                accountLimit: accountLimitALS
            }

        case TilesDataActions.ACCOUNT_TRIAL_SET:
            return {
                ...state,
                isTrial: action.payload
            }

        case TilesDataActions.ONE_SIGNAL_INIT:
            return {
                ...state,
                oneSignalInit: action.payload
            }

        case TilesDataActions.MANAGER_INIT:
            return {
                ...state,
                manager: action.payload
            }

        case TilesDataActions.CONFIRMATION_CHANGE_PLAN:
            return {
                ...state,
                confirmation: action.payload
            }

        case TilesDataActions.UPGRADE_DOWNGRADE_SET:
            return {
                ...state,
                upgradeDowngrade: action.payload
            }

        case TilesDataActions.SET_PRICE:
            return {
                ...state,
                price: action.payload
            }

        case TilesDataActions.SET_ATHLETE_ACCOUNT:
            return {
                ...state,
                athleteAccount: action.payload
            }

        case TilesDataActions.SET_ON_PLATFORM_WITHOUT_PLAN:
            return {
                ...state,
                onPlatformWithoutPlan: action.payload
            }

        case TilesDataActions.UPDATE_TILES:
            const tilesUT = [...state.tiles];
            tilesUT.forEach(
                (tile: Tile, index)=>{
                    if(tile.id === action.payload.id){
                        const tile = action.payload;
                        tile.tile_id = tile.id;
                        tilesUT[index] = tile;
                    }
                }
            )
            return {
                ...state,
                tiles: tilesUT
            }

        case TilesDataActions.CANCEL_INVITATION:
            const invitationsCI = [...state.invitations];
            invitationsCI.splice(action.payload,1);
            return {
                ...state,
                invitations: invitationsCI
            }

        case TilesDataActions.SET_ATHLETE_ACCOUNT_ON_PAID_ACCOUNT:
            return {
                ...state,
                athleteAccountonPaidAccount: action.payload
            }

        case TilesDataActions.SET_PAID_ACCOUNT_FOR_DISPLAYS:
            return {
                ...state,
                paidAccountForDisplays: action.payload
            }

        case TilesDataActions.SET_NO_TRIAL:
            return {
                ...state,
                noTrial: action.payload
            }

        case TilesDataActions.SET_TAGS:
            return {
                ...state,
                tags: action.payload
            }

        case TilesDataActions.ADD_TAG:
            const tagsAT = [...state.tags];
            tagsAT.push(Object.assign({}, action.payload));
            return {
                ...state,
                tags: tagsAT
            }

        case TilesDataActions.DELETE_TAG:
            const tagsDT = [...state.tags];
            tagsDT.forEach(
                (tag, index)=>{
                    if(tag.id === action.payload){
                        tagsDT.splice(index,1);
                    }
                }
            );
            return {
                ...state,
                tags: tagsDT
            }

        case TilesDataActions.CARD_FAIL:
            return {
                ...state,
                cardFail: action.payload
            }

        case TilesDataActions.SET_IN_GROUP:
            return {
                ...state,
                isInGroup: action.payload
            }

        case TilesDataActions.FIRE_CHANGE:
            return {
                ...state,
                fireChange: action.payload
            }

        case TilesDataActions.ADD_COMMENT:
            const commentsAC = [...state.comments];
            commentsAC.push(action.payload);
            return {
                ...state,
                comments: commentsAC
            }

        case TilesDataActions.EDIT_COMMENT:
            const commentsEC = [...state.comments];
            commentsEC.forEach((c,index)=>{if(c.id===action.payload.id){commentsEC[index]=action.payload}})
            return {
                ...state,
                comments: commentsEC
            }

        case TilesDataActions.DELETE_COMMENT:
            const commentsDC = [...state.comments];
            commentsDC.forEach((c,index)=>{if(c.id===action.payload){commentsDC.splice(index,1)}})
            return {
                ...state,
                comments: commentsDC
            }

        default:
            return state;
    }
}

export interface Association {
    tile_id?: string;
    calendar_date?: string;
    training_plan?: string;
    training_plan_id?: number;
    tile_color?: string;
    training_sesion?: number;
    tile_type?: string;
    asso_index_in_array?: number;
    asso_temporary_id?: number;
    id?: number;
  }

export interface TrainingPlan {
    training_plan_name?: string;
    date_from?: string;
    date_to?: string;
    training_sesion_number?: number;
    calendar_assocs?: Association[];
    calendar_stars?: Star[];
    calendar_comments?: CalendarComment[];
    id?: number
    }

export interface CalendarComment {
    comment_user?: string;
    comment_data?: string;
    comment_day?: string;
    comment_body?: string;
    comment_is_edited?: boolean;
    comment_user_role?: string;
    id?: number;
}

export interface TpInfo {
    training_plan_name?: string;
    training_plan_active?: boolean;
    training_plan_athlete?: string;
    training_plan_id?: number;
    id?: number
}

export interface Star {
    id?: number;
    star_date?: string;
    star_color?: string;
    star_description?: string
}

export interface Invitation {
    platform_token?: string;
    trainer_email?: string;
    trainer_nick?: string;
}

