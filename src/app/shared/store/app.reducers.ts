import { ActionReducerMap } from '@ngrx/store';

import * as fromCallendar from './callendar-data.reducers';
import * as fromTiles from './tiles-data.reducers';
import * as fromBoard from './board-data.reducers';
import * as fromChart from './chart-data.reducers';
import * as fromAthletes from './athletes-data.reducers';
import * as fromLoops from './loops.reducers';
import * as fromChat from './chat.reducers';

export interface AppState {
    callendar: fromCallendar.State,
    tiles: fromTiles.State,
    board: fromBoard.State,
    chart: fromChart.State,
    athletes: fromAthletes.State,
    loops: fromLoops.State,
    chat: fromChat.State

}

export const reducers: ActionReducerMap<AppState> = {
    callendar: fromCallendar.callendarDataReducer,
    tiles: fromTiles.TilesDataReducer,
    board: fromBoard.BoardDataReducer,
    chart: fromChart.ChartDataReducer,
    athletes: fromAthletes.AthletesDataReducer,
    loops: fromLoops.LoopsReducer,
    chat: fromChat.ChatReducer
}