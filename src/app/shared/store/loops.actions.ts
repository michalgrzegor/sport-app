import { Action } from '@ngrx/store';
import { Loops, Tags } from './loops.reducers';

export const FETCH_LOOPS_DATA = 'FETCH_LOOPS_DATA';
export const SET_LOOPS_DATA = 'SET_LOOPS_DATA';
export const MAKE_LOOPS_DAY = 'MAKE_LOOPS_DAY';
export const SET_NOTIFICATIONS = 'SET_NOTIFICATIONS';
export const SET_TAGS = 'SET_TAGS';

export class FetchLoopsData implements Action {
    readonly type = FETCH_LOOPS_DATA;
}

export class SetLoopsData implements Action {
    readonly type = SET_LOOPS_DATA;

    constructor(public payload: Loops[]){}
}

export class MakeLoopsDay implements Action {
    readonly type = MAKE_LOOPS_DAY;

    constructor(public payload: Loops[]){}
}

export class SetNotifications implements Action {
    readonly type = SET_NOTIFICATIONS;

    constructor(public payload: any[]){}
}

export class SetTags implements Action {
    readonly type = SET_TAGS;

    constructor(public payload: Tags){}
}


export type LoopsActions = FetchLoopsData | SetLoopsData | MakeLoopsDay | SetNotifications | SetTags;