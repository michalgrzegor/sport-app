import * as BoardDataActions from './board-data.actions'
import { SafeResourceUrl } from '@angular/platform-browser';

export interface Note {
    id?: number;
    board_note_name?: string;
    board_note_link?: string;
    board_note_description?: string;
    board_note_safe_link?: SafeResourceUrl;
    platform_note_name?: string;
    platform_note_link?: string;
    platform_note_description?: string;
    platform_note_safe_link?: SafeResourceUrl;
}

export interface State {
    boardNotes: Note[];
    boardNote: Note;
    isMaxWidth: boolean;
}

const InitialState: State = {
    boardNotes: null,
    boardNote: null,
    isMaxWidth: false
}

export function BoardDataReducer(state = InitialState, action: BoardDataActions.BoardDataActions) {
    switch(action.type){
        case BoardDataActions.SET_BOARD:
            return {
                ...state,
                boardNotes: action.payload
            }

        case BoardDataActions.ADD_NOTE:
            const boardNotesAN = state.boardNotes;
            boardNotesAN.unshift(Object.assign({}, action.payload));
            return {
                ...state,
                boardNotes: boardNotesAN
            }

        case BoardDataActions.UPDATE_NOTE:
            const boardNotesUN = state.boardNotes;
            boardNotesUN[action.payload.index] = action.payload.note;
            return {
                ...state,
                boardNotes: boardNotesUN
            }

        case BoardDataActions.DELETE_NOTE:
            const boardNotesDN = state.boardNotes;
            boardNotesDN.splice(action.payload, 1);
            return {
                ...state,
                boardNotes: boardNotesDN
            }

        case BoardDataActions.IS_MAX_WIDTH_TOGGLE:
            return {
                ...state,
                isMaxWidth: action.payload
            }

        case BoardDataActions.SET_NOTE:
            return {
                ...state,
                boardNote: action.payload
            }
        
        default:
            return state;

    }
}