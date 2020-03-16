import { CalendarArray } from '../calendar-data.service';
import { Action } from '@ngrx/store';
import { Association, TrainingPlan } from './tiles-data.reducers';

export const INIT_DATA = 'INIT_DATA';
export const INIT_DATA_NO_ITTERATION = 'INIT_DATA_NO_ITTERATION';
export const ADD_ASSO = 'ADD_ASSO';
export const REPEAT_WEEKLY = 'REPEAT_WEEKLY';
export const REPEAT_DAILY = 'REPEAT_DAILY';
// export const REPEAT_INTERVAL = 'REPEAT_INTERVAL';
export const OPEN_CONTAINER = 'OPEN_CONTAINER';
export const CHANGE_SESSION = 'CHANGE_SESSION';
export const DELETE_ASSO = 'DELETE_ASSO';
export const REPEAT_WEEKLY_DAY = 'REPEAT_WEEKLY_DAY';
export const REPEAT_DAILY_DAY = 'REPEAT_DAILY_DAY';
export const CLOSE_CONTAINER = 'CLOSE_CONTAINER';
export const DELETE_ALL_DAY = 'DELETE_ALL_DAY';
export const FETCH_ALL_TP_NAMES ='FETCH_ALL_TP_NAMES';
export const SET_ALL_TP_NAMES ='SET_ALL_TP_NAMES';
export const COPY_ASSO = 'COPY_ASSO';
export const PASTE_ASSO = 'PASTE_ASSO';
export const CHANGE_ASSO_INDEX = 'CHANGE_ASSO_INDEX';
export const MOVE_WEEK = 'MOVE_WEEK';
export const UPDATE_CALENDAR = 'UPDATE_CALENDAR';
//responsive variables
export const OPEN_TP_BOARD = "OPEN_TP_BOARD";
export const CLOSE_TP_BOARD = "CLOSE_TP_BOARD";
export const SET_TUTORIAL = "SET_TUTORIAL";
export const SET_CLOSE = "SET_CLOSE";
export const SET_DAYS_TO_CHANGE = "SET_DAYS_TO_CHANGE";
export const DELETE_ALL_DAY_EFFECT = "DELETE_ALL_DAY_EFFECT";
export const DELETE_DAY_EFFECT = "DELETE_DAY_EFFECT";
export const PASTE_ASSO_EFFECT = "PASTE_ASSO_EFFECT";
export const RWA_EFFECT = "RWA_EFFECT";
export const RDA_EFFECT = "RDA_EFFECT";
export const RWDA_EFFECT = "RWDA_EFFECT";
export const RDDA_EFFECT = "RDDA_EFFECT";
export const PCA_EFFECT = "PCA_EFFECT";

export const CONSOLE_LOG = "CONSOLE_LOG";
export const RESET_ATCH = "RESET_ATCH";
export const SET_WEEK = "SET_WEEK";


export class InitData implements Action {
    readonly type = INIT_DATA;

    constructor(public payload: {calendar: CalendarArray, planName: string}){}
}

export class InitDataNoItteration implements Action {
    readonly type = INIT_DATA_NO_ITTERATION;

    constructor(public payload: {calendar: CalendarArray, planName: string}){}
}

export class AddAsso implements Action {
    readonly type = ADD_ASSO;

    constructor(public payload: {calendarIndex: number, weeksIndex: number, weekDatesIndex: number, associations: Association, newOrder: number[], sessionNumber: number}){}
}

export class RepeatWeekly implements Action {
    readonly type = REPEAT_WEEKLY;

    constructor(public payload: CalendarArray){}
}

export class RepeatDaily implements Action {
    readonly type = REPEAT_DAILY;

    constructor(public payload: CalendarArray){}
}


export class OpenContainer implements Action {
    readonly type = OPEN_CONTAINER;

    constructor(public payload: {calendarIndex: number, weeksIndex: number, weekDatesIndex: number}){}
}

export class ChangeSession implements Action {
    readonly type = CHANGE_SESSION;
    
    constructor(public payload: {calendarIndex: number, weeksIndex: number, weekDatesIndex: number, tempId: number, sessionNumber: number}){}
}

export class DeleteAsso implements Action {
    readonly type = DELETE_ASSO;
    
    constructor(public payload: {calendarIndex: number, weeksIndex: number, weekDatesIndex: number, tempId: number}){}
}

export class RepeatWeeklyDay implements Action {
    readonly type = REPEAT_WEEKLY_DAY;
    
    constructor(public payload: CalendarArray){}
}

export class RepeatDailyDay implements Action {
    readonly type = REPEAT_DAILY_DAY;
    
    constructor(public payload: CalendarArray){}
}

export class CloseContainer implements Action {
    readonly type = CLOSE_CONTAINER;

    constructor(public payload: {calendarIndex: number, weeksIndex: number, weekDatesIndex: number}){}
}

export class DeleteAllDay implements Action {
    readonly type = DELETE_ALL_DAY;

    constructor(public payload: {calendarIndex: number, weeksIndex: number, weekDatesIndex: number}){}
}

export class FetchAllTPNames implements Action {
    readonly type = FETCH_ALL_TP_NAMES
}

export class SetAllTPNames implements Action {
    readonly type = SET_ALL_TP_NAMES

    constructor(public payload: []){}
}

export class CopyAsso implements Action {
    readonly type = COPY_ASSO

    constructor(public payload: Association[]){}
}

export class PasteAsso implements Action {
    readonly type = PASTE_ASSO

    constructor(public payload: Association[]){}
}

export class ChangeAssoIndex implements Action {
    readonly type = CHANGE_ASSO_INDEX

    constructor(public payload: {sessionNumber: number, newOrder: number[]}){}
}

export class MoveWeek implements Action {
    readonly type = MOVE_WEEK;

    constructor(public payload: {calendarIndex: number, weeksIndex: number}){}
}

export class OpenTpBoard implements Action {
    readonly type = OPEN_TP_BOARD;
}

export class CloseTpBoard implements Action {
    readonly type = CLOSE_TP_BOARD;
}

export class SetTutorial implements Action {
    readonly type = SET_TUTORIAL;

    constructor(public payload: boolean){}
}

export class SetClose implements Action {
    readonly type = SET_CLOSE;

    constructor(public payload: boolean){}
}

export class SetDaysToChange implements Action {
    readonly type = SET_DAYS_TO_CHANGE;

    constructor(public payload: string[]){}
}

export class ConsoleLog implements Action {
    readonly type = CONSOLE_LOG;

    constructor(public payload: any){}
}

export class DeleteAllDayEffect implements Action {
    readonly type = DELETE_ALL_DAY_EFFECT;

    constructor(public payload: {tp_id: number, assocs: any}){}
}

export class DeleteDayEffect implements Action {
    readonly type = DELETE_DAY_EFFECT;

    constructor(public payload: {training_plan_id: number, asso_id: number}){}
}

export class PasteAssoEffect implements Action {
    readonly type = PASTE_ASSO_EFFECT;

    constructor(public payload: {tp_id: number, assocs: any}){}
}

export class UpdateCalendar implements Action {
    readonly type = UPDATE_CALENDAR;

    constructor(public payload:Association[]){}
}

export class RWAEffect implements Action {
    readonly type = RWA_EFFECT;

    constructor(public payload: {tp_id: number, assocs: any, tp: TrainingPlan}){}
}

export class RDAEffect implements Action {
    readonly type = RDA_EFFECT;

    constructor(public payload: {tp_id: number, assocs: any, tp: TrainingPlan}){}
}

export class RWDAEffect implements Action {
    readonly type = RWDA_EFFECT;

    constructor(public payload: {tp_id: number, assocs: any, tp: TrainingPlan}){}
}

export class RDDAEffect implements Action {
    readonly type = RDDA_EFFECT;

    constructor(public payload: {tp_id: number, assocs: any, tp: TrainingPlan}){}
}

export class PCAEffect implements Action {
    readonly type = PCA_EFFECT;

    constructor(public payload: {tp_id: number, assocs: any, tp: TrainingPlan}){}
}


export class ResetATCH implements Action {
    readonly type = RESET_ATCH;
}

export class SetWeek implements Action {
    readonly type = SET_WEEK;

    constructor(public payload: any[]){}
}

export type CalendarDataActions = InitData | AddAsso | RepeatWeekly | RepeatDaily | OpenContainer | ChangeSession | DeleteAsso | RepeatDailyDay | RepeatWeeklyDay | CloseContainer | DeleteAllDay | FetchAllTPNames | SetAllTPNames | CopyAsso | PasteAsso | ChangeAssoIndex | MoveWeek | OpenTpBoard | CloseTpBoard | SetTutorial | SetClose | SetDaysToChange | ConsoleLog | DeleteAllDayEffect | DeleteDayEffect | PasteAssoEffect | UpdateCalendar | RWAEffect | RDAEffect | RWDAEffect | RDDAEffect | PCAEffect | ResetATCH | InitDataNoItteration | SetWeek;