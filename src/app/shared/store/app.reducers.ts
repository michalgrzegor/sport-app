import { ActionReducerMap } from '@ngrx/store';

import * as fromCallendar from './calendar-data.reducers';
import * as fromTiles from './tiles-data.reducers';
import * as fromBoard from './board-data.reducers';
import * as fromChart from './chart-data.reducers';
import * as fromAthletes from './athletes-data.reducers';
import * as fromLoops from './loops.reducers';

export interface AppState {
    calendar: fromCallendar.State,
    tiles: fromTiles.State,
    board: fromBoard.State,
    chart: fromChart.State,
    athletes: fromAthletes.State,
    loops: fromLoops.State

}

export const reducers: ActionReducerMap<AppState> = {
    calendar: fromCallendar.calendarDataReducer,
    tiles: fromTiles.TilesDataReducer,
    board: fromBoard.BoardDataReducer,
    chart: fromChart.ChartDataReducer,
    athletes: fromAthletes.AthletesDataReducer,
    loops: fromLoops.LoopsReducer
}