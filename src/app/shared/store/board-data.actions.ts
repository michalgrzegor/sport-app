import { Action } from '@ngrx/store';
import { Note } from './board-data.reducers';

export const FETCH_BOARD = 'FETCH_BOARD';
export const FETCH_BOARD_FROM_PLATFORM = 'FETCH_BOARD_FROM_PLATFORM';
export const FETCH_TRAINING_BOARD = 'FETCH_TRAINING_BOARD';
export const SET_BOARD = 'SET_BOARD';
export const ADD_NOTE = 'ADD_NOTE';
export const UPDATE_NOTE = 'UPDATE_NOTE';
export const DELETE_NOTE = 'DELETE_NOTE';
export const IS_MAX_WIDTH_TOGGLE = 'IS_MAX_WIDTH_TOGGLE';
export const SET_NOTE = 'SET_NOTE';

export class FetchBoard implements Action {
    readonly type = FETCH_BOARD;
}

export class FetchBoardFromPlatform implements Action {
    readonly type = FETCH_BOARD_FROM_PLATFORM;
}

export class FetchTrainingBoard implements Action {
    readonly type = FETCH_TRAINING_BOARD;
}

export class SetBoard implements Action {
    readonly type = SET_BOARD;

    constructor(public payload: Note[]){}
}

export class AddNote implements Action {
    readonly type = ADD_NOTE;

    constructor(public payload: Note){}
}

export class UpdateNote implements Action {
    readonly type = UPDATE_NOTE;

    constructor(public payload: {index: number, note: Note}){}
}

export class DeleteNote implements Action {
    readonly type = DELETE_NOTE;

    constructor(public payload: number){}
}

export class IsMaxWidthToggle implements Action {
    readonly type = IS_MAX_WIDTH_TOGGLE;

    constructor(public payload: boolean){}
}

export class SetNote implements Action {
    readonly type = SET_NOTE;

    constructor(public payload: Note){}
}

export type BoardDataActions = FetchBoard | FetchBoardFromPlatform | SetBoard | AddNote | UpdateNote | DeleteNote | IsMaxWidthToggle | FetchTrainingBoard | SetNote;