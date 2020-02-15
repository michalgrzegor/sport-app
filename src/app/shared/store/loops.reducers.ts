import * as LoopsActions from './loops.actions';
import * as _ from 'lodash';

export interface Loops {
    calendar_date: string;
    tile_id: string;
    training_sesion: number;
    calendar_assoc_id: number;
}

export interface LoopsDays {
    date: string;
    sessions: LoopSession[];
}

export interface LoopSession {
    training_sesion: number;
    questions: string[];
    calendar_asocs: number[];
}

export interface Tags {
    firstTSTag?: number;
    secondTSTag?: number;
    thirdTSTag?: number;
}

export interface State {
    loops: Loops[];
    loopsDay: LoopsDays[];
    notifications: any[];
    tags: Tags;
}

const InitialState: State = {
    loops: null,
    loopsDay: null,
    notifications: null,
    tags: null
}

export function LoopsReducer(state = InitialState, action: LoopsActions.LoopsActions) {
    switch(action.type){
        
        case LoopsActions.SET_LOOPS_DATA:
            console.log(`loops: `, action.payload)
            return {
                ...state,
                loops: action.payload
            }

        case LoopsActions.MAKE_LOOPS_DAY:
            const loopsDayMLD = [];
            let dateArrayMLD = [];
            action.payload.forEach((loop)=>dateArrayMLD.push(loop.calendar_date));
            console.log(dateArrayMLD);
            dateArrayMLD = _.uniq(dateArrayMLD);
            dateArrayMLD.forEach(date => {
                const day: LoopsDays = {
                    date: date,
                    sessions: [{training_sesion: 1, questions: [], calendar_asocs: []},{training_sesion: 2, questions: [], calendar_asocs: []},{training_sesion: 3, questions: [], calendar_asocs: []}]
                }
                action.payload.forEach(loop => {
                    if(date === loop.calendar_date){
                        day.sessions.forEach(ses=>{
                            if(ses.training_sesion === loop.training_sesion){
                                ses.questions.push(loop.tile_id);
                                ses.calendar_asocs.push(loop.calendar_assoc_id)
                            }
                        })
                    }
                });
                loopsDayMLD.push(day);
            });
            return {
                ...state,
                loopsDay: loopsDayMLD
            }

        case LoopsActions.SET_NOTIFICATIONS:
            
            return {
                ...state,
                notifications: action.payload
            }

        case LoopsActions.SET_TAGS:
            console.log(action.payload)
            return {
                ...state,
                tags: action.payload
            }

        default:
            return state;

    }
}