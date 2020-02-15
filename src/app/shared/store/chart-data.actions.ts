import { Action } from '@ngrx/store';
import { Answear } from './chart-data.reducers';
import { TrainingPlan } from './tiles-data.reducers';

export const FETCH_CHART_DATA = 'FETCH_CHART_DATA';
export const SET_CHART_DATA = 'SET_CHART_DATA';
export const MAKE_DIET_CHART_DATA = 'MAKE_DIET_CHART_DATA';
export const OPEN_CLOSE_RIGHT_PANEL = 'OPEN_CLOSE_RIGHT_PANEL';
export const SET_TP = 'SET_TP';
export const SET_OPEN = 'SET_OPEN';
export const SET_LEFT_OPEN = 'SET_LEFT_OPEN';
export const LOADING = 'LOADING';

export class FetchChartData implements Action {
    readonly type = FETCH_CHART_DATA;
}

export class SetChartData implements Action {
    readonly type = SET_CHART_DATA;

    constructor(public payload: Answear[]){}
}

export class MakeDietChartData implements Action {
    readonly type = MAKE_DIET_CHART_DATA;

    constructor(public payload: TrainingPlan){}
}

export class OpenCloseRightPanel implements Action {
    readonly type = OPEN_CLOSE_RIGHT_PANEL;

    constructor(public payload: string){}
}

export class SetTP implements Action {
    readonly type = SET_TP;

    constructor(public payload: TrainingPlan){}
}

export class SetOpen implements Action {
    readonly type = SET_OPEN;

    constructor(public payload: boolean){}
}

export class SetLeftOpen implements Action {
    readonly type = SET_LEFT_OPEN;

    constructor(public payload: boolean){}
}

export class Loading implements Action {
    readonly type = LOADING;

    constructor(public payload: boolean){}
}

export type ChartDataActions = SetChartData | FetchChartData | MakeDietChartData | OpenCloseRightPanel | SetTP | SetOpen | SetLeftOpen | Loading;