import { Tag } from './../../tile-editor/tile-editor.component';
import { Association, TpInfo, Invitation } from 'src/app/shared/store/tiles-data.reducers';
import { WeekDate } from '../calendar-data.service';
import { Tile } from './../../models/tile';
import { Action } from '@ngrx/store';
import { TrainingPlan, Star, CalendarComment } from './tiles-data.reducers';

export const FETCH_TILES = 'FETCH_TILES';
export const FETCH_TILES_FROM_PLATFORM = 'FETCH_TILES_FROM_PLATFORM';
export const SET_TILES = 'SET_TILES';
export const FETCH_TRAINING_PLAN = 'FETCH_TRAINING_PLAN';
export const FETCH_TAGS = 'FETCH_TAGS';
export const SET_TAGS = 'SET_TAGS';
export const ADD_TAG = 'ADD_TAG';
export const DELETE_TAG = 'DELETE_TAG';
export const SET_TRAINING_PLAN = 'SET_TRAINING_PLAN';
export const FETCH_TPMANAGER = 'FETCH_TPMANAGER';
export const SET_TPMANAGER = 'SET_TPMANAGER';
export const DRAG_TILE = 'DRAG_TILE';
export const MAKE_DAY = 'MAKE_DAY';
export const DELETE_TILE = 'DELETE_TILE';
export const MAKE_WEEK = 'MAKE_WEEK';
export const SUMMARY_TOGLE = 'SUMMARY_TOGLE';
export const EDIT_TILE = 'EDIT_TILE';
export const STOP_EDIT_TILE = 'STOP_EDIT_TILE';
export const ENTER_TILES_COLLECTION_MODE = 'ENTER_TILES_COLLECTION_MODE';
export const ENTER_CATEGORY_MODE = 'ENTER_CATEGORY_MODE';
export const ENTER_SEARCH_MODE = 'ENTER_SEARCH_MODE';
export const TAGS_SEARCH = 'TAGS_SEARCH';
export const TYPE_SEARCH = 'TYPE_SEARCH';
export const SEARCH_WORD = 'SEARCH_WORD';
export const FILTER_MODE_SWITCH = 'FILTER_MODE_SWITCH';
export const TP_MODE = 'TP_MODE';
export const ADD_STAR = 'ADD_STAR';
export const UPDATE_STAR = 'UPDATE_STAR';
export const DELETE_STAR = 'DELETE_STAR';
export const SET_MAIN_ROUTE = 'SET_MAIN_ROUTE';
export const POST_TRAINING_TILE = 'POST_TRAINING_TILE';
export const SET_AUTH = 'SET_AUTH';
export const OFF_AUTH = 'OFF_AUTH';
export const SET_NO_TP = 'SET_NO_TP';
export const ADD_TP_MANAGER = 'ADD_TP_MANAGER';
export const DELETE_TP_MANAGER = 'DELETE_TP_MANAGER';
export const SPINNER_START_STOP_CALENDAR = 'SPINNER_START_STOP_CALENDAR';
export const SET_INVITATIONS = 'SET_INVITATIONS';
export const IS_PAID_CHANGE = 'IS_PAID_CHANGE';
export const SPINNER_CHANGE = 'SPINNER_CHANGE';
export const PLAN_SHOW_CHANGE = 'PLAN_SHOW_CHANGE';
export const IS_MANAGE_CHANGE = 'IS_MANAGE_CHANGE';
export const CARD_PAYMENT_CHANGE = 'CARD_PAYMENT_CHANGE';
export const IS_PAID_ACCOUNT_SET = 'IS_PAID_ACCOUNT_SET';
export const ACCOUNT_LEVEL_SET = 'ACCOUNT_LEVEL_SET';
export const ACCOUNT_TRIAL_SET = 'ACCOUNT_TRIAL_SET';
export const ONE_SIGNAL_INIT = 'ONE_SIGNAL_INIT';
export const MANAGER_INIT = 'MANAGER_INIT';
export const CLOSE_DIALOG = 'CLOSE_DIALOG';
export const UPGRADE_DOWNGRADE_SET = 'UPGRADE_DOWNGRADE_SET';
export const CONFIRMATION_CHANGE_PLAN = 'CONFIRMATION_CHANGE_PLAN';
export const SET_PRICE = 'SET_PRICE';
export const UPDATE_TILES = 'UPDATE_TILES';
export const SET_ATHLETE_ACCOUNT = 'SET_ATHLETE_ACCOUNT';
export const SET_ON_PLATFORM_WITHOUT_PLAN = 'SET_ON_PLATFORM_WITHOUT_PLAN';
export const CANCEL_INVITATION = 'CANCEL_INVITATION';
export const SET_ATHLETE_ACCOUNT_ON_PAID_ACCOUNT = 'SET_ATHLETE_ACCOUNT_ON_PAID_ACCOUNT';
export const SET_PAID_ACCOUNT_FOR_DISPLAYS = 'SET_PAID_ACCOUNT_FOR_DISPLAYS';
export const SET_NO_TRIAL = 'SET_NO_TRIAL';
export const CARD_FAIL = 'CARD_FAIL';
export const SET_IN_GROUP = 'SET_IN_GROUP';
export const FIRE_CHANGE = 'FIRE_CHANGE';
export const SET_IS_AUTH = 'SET_IS_AUTH';
export const ADD_COMMENT = 'ADD_COMMENT';
export const EDIT_COMMENT = 'EDIT_COMMENT';
export const DELETE_COMMENT = 'DELETE_COMMENT';

export class FetchTiles implements Action {
    readonly type = FETCH_TILES;
}

export class FetchTilesFromPlatform implements Action {
    readonly type = FETCH_TILES_FROM_PLATFORM;
}

export class SetTiles implements Action {
    readonly type = SET_TILES;

    constructor(public payload: Tile[]){}
}

export class FetchTrainingPlan implements Action {
    readonly type = FETCH_TRAINING_PLAN;
}

export class FetchTags implements Action {
    readonly type = FETCH_TAGS;
}

export class SetTags implements Action {
    readonly type = SET_TAGS;

    constructor(public payload: Tag[]){}
}

export class AddTag implements Action {
    readonly type = ADD_TAG;

    constructor(public payload: Tag){}
}

export class DeleteTag implements Action {
    readonly type = DELETE_TAG;

    constructor(public payload: number){}
}

export class SetTrainingPlan implements Action {
    readonly type = SET_TRAINING_PLAN;

    constructor(public payload: TrainingPlan){}
}

export class FetchTpManager implements Action {
    readonly type = FETCH_TPMANAGER;
}

export class SetTpManager implements Action {
    readonly type = SET_TPMANAGER;

    constructor(public payload: TpInfo[]){}
}

export class DragTile implements Action {
    readonly type = DRAG_TILE;

    constructor(public payload: {tile: Tile, changeSession: boolean}){}
}

export class MakeDay implements Action {
    readonly type = MAKE_DAY;

    constructor(public payload: {date: string, day: WeekDate}){}
}

export class DeleteTile implements Action {
    readonly type = DELETE_TILE;

    constructor(public payload: number){}
}

export class MakeWeek implements Action {
    readonly type = MAKE_WEEK;

    constructor(public payload: Association[]){}
}

export class SummaryTogle implements Action {
    readonly type = SUMMARY_TOGLE;

    constructor(public payload: boolean){}
}

export class EditTile implements Action {
    readonly type = EDIT_TILE;

    constructor(public payload: Tile){}
}

export class StopEditTile implements Action {
    readonly type = STOP_EDIT_TILE;
}

export class EnterTilesCollectionMode implements Action {
    readonly type = ENTER_TILES_COLLECTION_MODE;

    constructor(public payload: boolean){}
}

export class EnterCategoryMode implements Action {
    readonly type = ENTER_CATEGORY_MODE;
}

export class EnterSearchMode implements Action {
    readonly type = ENTER_SEARCH_MODE;
}

export class TagsSearch implements Action {
    readonly type = TAGS_SEARCH;

    constructor(public payload: string){}
}

export class TypeSearch implements Action {
    readonly type = TYPE_SEARCH;

    constructor(public payload: string){}
}

export class SearchWord implements Action {
    readonly type = SEARCH_WORD;

    constructor(public payload: string){}
}

export class FilterModeSwitch implements Action {
    readonly type = FILTER_MODE_SWITCH;
}

export class TpMode implements Action {
    readonly type = TP_MODE;

    constructor(public payload: boolean){}
}

export class AddStar implements Action {
    readonly type = ADD_STAR;

    constructor(public payload: Star){}
}

export class UpdateStar implements Action {
    readonly type = UPDATE_STAR;

    constructor(public payload: Star){}
}

export class DeleteStar implements Action {
    readonly type = DELETE_STAR;

    constructor(public payload: number){}
}

export class SeteMainRoute implements Action {
    readonly type = SET_MAIN_ROUTE;

    constructor(public payload: string){}
}

export class PostTrainingTile implements Action {
    readonly type = POST_TRAINING_TILE;

    constructor(public payload: Tile){}
}

export class SetAuth implements Action {
    readonly type = SET_AUTH;
}

export class OffAuth implements Action {
    readonly type = OFF_AUTH;
}

export class SetNoTp implements Action {
    readonly type = SET_NO_TP;

    constructor(public payload: boolean){}
}

export class AddTpManager implements Action {
    readonly type = ADD_TP_MANAGER;

    constructor(public payload: TpInfo){}
}

export class DeleteTpManager implements Action {
    readonly type = DELETE_TP_MANAGER;

    constructor(public payload: number){}
}

export class SpinnerStartStopCalendar implements Action {
    readonly type = SPINNER_START_STOP_CALENDAR;

    constructor(public payload: boolean){}
}

export class SetInvitations implements Action {
    readonly type = SET_INVITATIONS;

    constructor(public payload: Invitation[]){}
}

export class IsPaidChange implements Action {
    readonly type = IS_PAID_CHANGE;

    constructor(public payload: boolean){}
}

export class SpinnerChange implements Action {
    readonly type = SPINNER_CHANGE;

    constructor(public payload: boolean){}
}

export class PlanShowChange implements Action {
    readonly type = PLAN_SHOW_CHANGE;

    constructor(public payload: boolean){}
}

export class IsManageChange implements Action {
    readonly type = IS_MANAGE_CHANGE;

    constructor(public payload: boolean){}
}

export class CardPaymentChange implements Action {
    readonly type = CARD_PAYMENT_CHANGE;

    constructor(public payload: boolean){}
}

export class IsPaidAccountSet implements Action {
    readonly type = IS_PAID_ACCOUNT_SET;

    constructor(public payload: boolean){}
}

export class AccountLevelSet implements Action {
    readonly type = ACCOUNT_LEVEL_SET;

    constructor(public payload: number){}
}

export class AccountTrialSet implements Action {
    readonly type = ACCOUNT_TRIAL_SET;

    constructor(public payload: boolean){}
}

export class OneSignalInit implements Action {
    readonly type = ONE_SIGNAL_INIT;

    constructor(public payload: boolean){}
}

export class ManagerInit implements Action {
    readonly type = MANAGER_INIT;

    constructor(public payload: boolean){}
}

export class UpgradeDowngradeSet implements Action {
    readonly type = UPGRADE_DOWNGRADE_SET;

    constructor(public payload: boolean){}
}

export class ConfirmationChangePlan implements Action {
    readonly type = CONFIRMATION_CHANGE_PLAN;

    constructor(public payload: boolean){}
}

export class SetPrice implements Action {
    readonly type = SET_PRICE;

    constructor(public payload: number){}
}

export class UpdateTiles implements Action {
    readonly type = UPDATE_TILES;

    constructor(public payload: Tile){}
}

export class SetAthleteAccount implements Action {
    readonly type = SET_ATHLETE_ACCOUNT;

    constructor(public payload: boolean){}
}

export class SetOnPlatformWithoutPlan implements Action {
    readonly type = SET_ON_PLATFORM_WITHOUT_PLAN;

    constructor(public payload: boolean){}
}

export class CancelInvitation implements Action {
    readonly type = CANCEL_INVITATION;

    constructor(public payload: number){}
}

export class SetAthleteAccountOnPaidAccount implements Action {
    readonly type = SET_ATHLETE_ACCOUNT_ON_PAID_ACCOUNT;

    constructor(public payload: boolean){}
}

export class SetPaidAccountForDisplays implements Action {
    readonly type = SET_PAID_ACCOUNT_FOR_DISPLAYS;

    constructor(public payload: boolean){}
}

export class SetNoTrial implements Action {
    readonly type = SET_NO_TRIAL;

    constructor(public payload: boolean){}
}

export class CardFail implements Action {
    readonly type = CARD_FAIL;

    constructor(public payload: boolean){}
}

export class SetInGroup implements Action {
    readonly type = SET_IN_GROUP;

    constructor(public payload: boolean){}
}

export class SetIsAuth implements Action {
    readonly type = SET_IS_AUTH;

    constructor(public payload: boolean){}
}

export class FireChange implements Action {
    readonly type = FIRE_CHANGE;

    constructor(public payload: string){}
}

export class AddComment implements Action {
    readonly type = ADD_COMMENT;

    constructor(public payload: CalendarComment){}
}

export class EditComment implements Action {
    readonly type = EDIT_COMMENT;

    constructor(public payload: CalendarComment){}
}

export class DeleteComment implements Action {
    readonly type = DELETE_COMMENT;

    constructor(public payload: number){}
}






export type TilesDataActions = FetchTiles | FetchTilesFromPlatform | SetTiles | DragTile | FetchTrainingPlan | SetTrainingPlan | MakeDay | DeleteTile | MakeWeek | SummaryTogle | EditTile | StopEditTile | EnterTilesCollectionMode | EnterCategoryMode | EnterSearchMode | TagsSearch | TypeSearch | SearchWord | SetTpManager | FetchTpManager | FilterModeSwitch | TpMode | AddStar | UpdateStar | SeteMainRoute | PostTrainingTile | SetAuth | OffAuth | SetNoTp | AddTpManager | DeleteTpManager | SpinnerStartStopCalendar | DeleteStar | SetInvitations | IsPaidChange | SpinnerChange | PlanShowChange | IsManageChange | CardPaymentChange | IsPaidAccountSet | AccountLevelSet | AccountTrialSet | OneSignalInit | ManagerInit | UpgradeDowngradeSet | ConfirmationChangePlan | SetPrice | UpdateTiles | SetAthleteAccount | SetOnPlatformWithoutPlan | CancelInvitation | SetAthleteAccountOnPaidAccount | SetPaidAccountForDisplays |  SetNoTrial | FetchTags | SetTags | AddTag | DeleteTag | CardFail | SetInGroup | FireChange | SetIsAuth | AddComment | EditComment | DeleteComment;