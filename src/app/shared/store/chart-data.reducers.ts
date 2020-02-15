import { Summary } from './../summary-data.service';
import * as ChartDataActions from './chart-data.actions';
import * as _ from 'lodash';
import * as moment from 'moment';
import { TrainingPlan } from './tiles-data.reducers';

export interface Answear {
    question_date?: string;
    question_answer?: string;
    tile_id?: string;
    answer_comment?: string;
    id?: number;
}
export interface TpAnswear {
    date: string;
    answear: Summary;
    tile_id: string[];
    comment: string;
}

export interface State {
    trainingPlan: TrainingPlan,
    answears: Answear[];
    tilesId: string[];

    //summary chart
    dietChartData: TpAnswear[];

    //responsive data
    isRightPanelOpen: string;
    isOpen: boolean;
    isLeftOpen: boolean;
    loading: boolean;
}

const InitialState: State = {
    trainingPlan: null,
    answears: null,
    tilesId: null,

    //summary chart
    dietChartData: null,
    isRightPanelOpen: null,
    isOpen: null,
    isLeftOpen: true,
    loading: false
}

export function ChartDataReducer(state = InitialState, action: ChartDataActions.ChartDataActions) {
    switch(action.type){
        
        case ChartDataActions.SET_CHART_DATA:
            let tilesIdSCD = [];
            action.payload.forEach(
                ans => {
                    tilesIdSCD.push(ans.tile_id)
                }
            );
            tilesIdSCD = _.uniq(tilesIdSCD);
            return {
                ...state,
                answears: action.payload,
                tilesId: tilesIdSCD
            }

        case ChartDataActions.MAKE_DIET_CHART_DATA:
            const dietAnsArray = [];
            let dates = []
            action.payload.calendar_assocs.forEach(
                asso => {
                    dates.push(asso.calendar_date)
                }
            )
            dates = _.uniq(dates);
            dates.forEach(
                date => {
                    let tpAns: TpAnswear = {
                        date: date,
                        answear: null,
                        tile_id: [],
                        comment: null
                    };
                    action.payload.calendar_assocs.forEach(
                        asso => {
                            if(moment(asso.calendar_date).format() === moment(date).format()){
                                tpAns.tile_id.push(asso.tile_id)
                            }
                        }
                    );
                    dietAnsArray.push(tpAns);
                }
            )
            return {
                ...state,
                dietChartData: dietAnsArray
            }

        case ChartDataActions.OPEN_CLOSE_RIGHT_PANEL:
            const booleanOCRP = action.payload;
            return {
                ...state,
                isRightPanelOpen: booleanOCRP
            }

        case ChartDataActions.SET_TP:
            return {
                ...state,
                trainingPlan: action.payload
            }

        case ChartDataActions.SET_OPEN:
            return {
                ...state,
                isOpen: action.payload
            }

        case ChartDataActions.SET_LEFT_OPEN:
            return {
                ...state,
                isLeftOpen: action.payload
            }

        case ChartDataActions.LOADING:
            return {
                ...state,
                loading: action.payload
            }

        default:
            return state;

    }
}