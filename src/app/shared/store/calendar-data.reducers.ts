import { CalendarArray } from '../calendar-data.service';
import * as CalendarDataActions from './calendar-data.actions';
import * as _ from 'lodash';
import { Association } from './tiles-data.reducers';

export interface State {
    calendar: CalendarArray;
    lastContainer: LastContainer;
    day: Association[];
    dayDate: string;
    openedDay: OpenedDay;
    planName: string;
    copiedAsso: Association[];
    pasted: number;
    //all training plan names
    allTPNames: [];
    //cdk drag and drop 
    idArray: string[];
    allMomentDateArray: string[];
    //responsive variables
    isOpenTpBoard: boolean;

    //tutorial
    isTutorial: boolean;
    tileClose: boolean;

    //change detection
    daysToChange: string[];
    tilesToChange: Association[];

    //week summary data
    week: any[];
}

const initialState: State = {
   calendar: null,
   lastContainer: null,
   day: null,
   dayDate: null,
   openedDay: null,
   planName: null,
   copiedAsso: null,
   pasted: 1,
   allTPNames: null,
   idArray: ['session-1', 'session-2','session-3', 'tiles-collection'],
   allMomentDateArray: null,
   isOpenTpBoard: false,
   isTutorial: false,
   tileClose: false,
   daysToChange: null,
   tilesToChange: [],
   week: null
}

export function calendarDataReducer(state = initialState, action: CalendarDataActions.CalendarDataActions){
    switch(action.type) {
        case CalendarDataActions.INIT_DATA:
            const allMomentDateArrayID = [];
            action.payload.calendar.calendar.forEach(
                months => {
                    months.weeks.forEach(
                        week => {
                            week.weekDates.forEach(
                                day => {
                                    allMomentDateArrayID.push(day.momentDate)
                                }
                            )
                        }
                    )
                }
            );
            let arrayID;
            if(state.planName === action.payload.planName){
                arrayID = state.tilesToChange
            }else if(state.planName !== action.payload.planName){
                arrayID = []
            }
            return {
                ...state,
                calendar: action.payload.calendar,
                planName: action.payload.planName,
                allMomentDateArray: allMomentDateArrayID,
                tilesToChange: arrayID
            }

        case CalendarDataActions.INIT_DATA_NO_ITTERATION:
            let arrayIDNI;
            if(state.planName === action.payload.planName){
                arrayIDNI = state.tilesToChange
            }else if(state.planName !== action.payload.planName){
                arrayIDNI = []
            }
            return {
                ...state,
                calendar: action.payload.calendar,
                planName: action.payload.planName,
                tilesToChange: arrayIDNI
            }

        case CalendarDataActions.ADD_ASSO:
            let assArray = state.calendar.calendar[action.payload.calendarIndex].weeks[action.payload.weeksIndex].weekDates[action.payload.weekDatesIndex].association;
            assArray.push(Object.assign({}, action.payload.associations));
            assArray.forEach(
                asso => {
                    if(asso.training_sesion === action.payload.sessionNumber && action.payload.newOrder !== null){
                        action.payload.newOrder.forEach(
                            id => {
                                if(id === asso.asso_temporary_id){
                                    asso.asso_index_in_array = action.payload.newOrder.indexOf(id) + 1;
                                }
                            }
                        )
                    }
                }
            )
            return {
                ...state,
                calendar: _.set(state.calendar, 'state.calendar.calendar[action.payload.calendarIndex].weeks[action.payload.weeksIndex].weekDates[action.payload.weekDatesIndex].association', assArray)
            }

        case CalendarDataActions.REPEAT_WEEKLY:
            return {
                ...state,
                calendar: action.payload
            }

        case CalendarDataActions.REPEAT_DAILY:
            return {
                ...state,
                calendar: action.payload
            }


        case CalendarDataActions.OPEN_CONTAINER:
            const calendarOC = Object.assign({}, state.calendar);
            const dayOC = [];
            const dayDateOC = state.calendar.calendar[action.payload.calendarIndex].weeks[action.payload.weeksIndex].weekDates[action.payload.weekDatesIndex].momentDate;
            let openedDayOC = {
                calendarIndex: action.payload.calendarIndex,
                weeksIndex: action.payload.weeksIndex,
                weekDatesIndex: action.payload.weekDatesIndex
            }

            //adding temporary id to all asso to identyfying tiles
            let temporaryId = 1;
            calendarOC.calendar[action.payload.calendarIndex].weeks[action.payload.weeksIndex].weekDates[action.payload.weekDatesIndex].association.forEach(
                asso => {
                    asso.asso_temporary_id = temporaryId;
                    dayOC.push(asso);
                    temporaryId = temporaryId + 1;
                    return asso;
                }
            )

            if(state.lastContainer && state.lastContainer.calendarIndex == action.payload.calendarIndex && state.lastContainer.weeksIndex == action.payload.weeksIndex && state.lastContainer.weekIndex == action.payload.weekDatesIndex && calendarOC.calendar[state.lastContainer.calendarIndex].weeks[state.lastContainer.weeksIndex].container[0].expanded){
                calendarOC.calendar[state.lastContainer.calendarIndex].weeks[state.lastContainer.weeksIndex].container[0].expanded = false;
                openedDayOC = null;
            } else if(state.lastContainer) {
                calendarOC.calendar[state.lastContainer.calendarIndex].weeks[state.lastContainer.weeksIndex].container[0].expanded = false;
                calendarOC.calendar[action.payload.calendarIndex].weeks[action.payload.weeksIndex].container[0].expanded = true;
            } else {
                calendarOC.calendar[action.payload.calendarIndex].weeks[action.payload.weeksIndex].container[0].expanded = true;
            }
            let lastContainerOC: LastContainer = null;
            if(!state.lastContainer){
                lastContainerOC = { calendarIndex: null, weeksIndex: null, weekIndex: null };
            } else {
                lastContainerOC = state.lastContainer;
            }
            lastContainerOC.calendarIndex = action.payload.calendarIndex;
            lastContainerOC.weeksIndex = action.payload.weeksIndex;
            lastContainerOC.weekIndex = action.payload.weekDatesIndex;

            const firstIdArray = ['session-1', 'session-2','session-3', 'tiles-collection'];
            const secondIdArray = ['session-4', 'session-5','session-6', 'tiles-collection'];
            let idArrayOC = null;
            if(state.idArray[0] === firstIdArray[0]){
                idArrayOC = secondIdArray;
            }else if(state.idArray[0] === secondIdArray[0]){
                idArrayOC = firstIdArray
            }
            return {
                ...state,
                calendar: calendarOC,
                lastContainer: lastContainerOC,
                dayDate: dayDateOC,
                openedDay: openedDayOC,
                day: dayOC,
                idArray: idArrayOC
            }
        
        case CalendarDataActions.CHANGE_SESSION:
            const calendarCS = Object.assign({},state.calendar);
            const dayCS = [...state.day];
            calendarCS.calendar[action.payload.calendarIndex].weeks[action.payload.weeksIndex].weekDates[action.payload.weekDatesIndex].association.forEach(
                asso => {
                    if(action.payload.tempId === asso.asso_temporary_id){
                        asso.training_sesion = action.payload.sessionNumber;
                    }
                }
            );
            dayCS.forEach(
                day => {
                    if(day.asso_temporary_id === action.payload.tempId){
                        day.training_sesion = action.payload.sessionNumber
                    }
                }
            )         
            return {
                ...state,
                calendar: calendarCS,
                day: dayCS
            }

        case CalendarDataActions.DELETE_ASSO:
            const calendarDA = state.calendar;
            let assoToDeleteDA = null;
            calendarDA.calendar[action.payload.calendarIndex].weeks[action.payload.weeksIndex].weekDates[action.payload.weekDatesIndex].association.forEach(
                asso => {
                    if(action.payload.tempId === asso.asso_temporary_id){
                        assoToDeleteDA = asso;
                    }
                }
            );
            const indexDA = calendarDA.calendar[action.payload.calendarIndex].weeks[action.payload.weeksIndex].weekDates[action.payload.weekDatesIndex].association.indexOf(assoToDeleteDA);
            calendarDA.calendar[action.payload.calendarIndex].weeks[action.payload.weeksIndex].weekDates[action.payload.weekDatesIndex].association.splice(indexDA, 1);
            return {
                ...state,
                calendar: calendarDA
            }
        
        case CalendarDataActions.REPEAT_WEEKLY_DAY:
            return {
                ...state,
                calendar: action.payload
            }

        case CalendarDataActions.REPEAT_DAILY_DAY:
            return {
                ...state,
                calendar: action.payload
            }

        case CalendarDataActions.CLOSE_CONTAINER:
            const calendarCC = Object.assign({}, state.calendar);
            calendarCC.calendar[action.payload.calendarIndex].weeks[action.payload.weeksIndex].container[0].expanded = false;
            calendarCC.calendar[action.payload.calendarIndex].weeks[action.payload.weeksIndex].container[0].container = false;
            return {
                ...state,
                calendar: calendarCC,
                openedDay: null
            }

        case CalendarDataActions.DELETE_ALL_DAY:
            const calendarDAD = state.calendar;
            calendarDAD.calendar[action.payload.calendarIndex].weeks[action.payload.weeksIndex].weekDates[action.payload.weekDatesIndex].association = [];
            return {
                ...state,
                calendar: calendarDAD
            }

        case CalendarDataActions.SET_ALL_TP_NAMES:
            return {
                ...state,
                allTPNames: action.payload
            }

        case CalendarDataActions.COPY_ASSO:
            return {
                ...state,
                copiedAsso: action.payload
            }

        case CalendarDataActions.PASTE_ASSO:
            const calendarCA = state.calendar;
            let tempIDPA = calendarCA.calendar[state.openedDay.calendarIndex].weeks[state.openedDay.weeksIndex].weekDates[state.openedDay.weekDatesIndex].association.length + 1;
            let indexOnePA = 1;
            let indexTwoPA = 1;
            let indexThreePA = 1;
            calendarCA.calendar[state.openedDay.calendarIndex].weeks[state.openedDay.weeksIndex].weekDates[state.openedDay.weekDatesIndex].association.forEach(
                asso => {
                    if(asso.training_sesion === 1){
                        indexOnePA = indexOnePA + 1;
                    }else if(asso.training_sesion === 2){
                        indexTwoPA = indexTwoPA + 1;
                    }else if(asso.training_sesion === 3){
                        indexThreePA = indexThreePA + 1;
                    }
                }
            );
            state.copiedAsso.forEach(asso => {
                let newAsso = Object.assign({}, asso);
                newAsso.asso_temporary_id = tempIDPA;
                if(newAsso.training_sesion === 1){
                    newAsso.asso_index_in_array = indexOnePA;
                    indexOnePA = indexOnePA + 1;
                }else if(newAsso.training_sesion === 2){
                    newAsso.asso_index_in_array = indexTwoPA;
                    indexTwoPA = indexTwoPA + 1;
                }else if(newAsso.training_sesion === 3){
                    newAsso.asso_index_in_array = indexThreePA;
                    indexThreePA = indexThreePA + 1;
                }
                tempIDPA = tempIDPA + 1;
                calendarCA.calendar[state.openedDay.calendarIndex].weeks[state.openedDay.weeksIndex].weekDates[state.openedDay.weekDatesIndex].association.push(Object.assign({}, newAsso));
            });
            return {
                ...state,
                calendar: calendarCA,
                pasted: state.pasted+1
            }

        case CalendarDataActions.CHANGE_ASSO_INDEX:
            const calendarCAI = state.calendar;
            calendarCAI.calendar[state.openedDay.calendarIndex].weeks[state.openedDay.weeksIndex].weekDates[state.openedDay.weekDatesIndex].association.forEach(
                asso => {
                    if(asso.training_sesion === action.payload.sessionNumber){
                        action.payload.newOrder.forEach(
                            id => {
                                if(id === asso.asso_temporary_id){
                                    asso.asso_index_in_array = action.payload.newOrder.indexOf(id) + 1;
                                }
                            }
                        )
                    }
                }
            )
            return {
                ...state,
                calendar: calendarCAI
            }

        case CalendarDataActions.MOVE_WEEK:
            const calendarMW = _.cloneDeep(state.calendar);
            const calendarMWC = _.cloneDeep(state.calendar);
            calendarMWC.calendar.forEach(
                month => {
                    const monthIndex = calendarMWC.calendar.indexOf(month)
                    if(monthIndex === action.payload.calendarIndex){
                        month.weeks.forEach(
                            week => {
                                const weekIndex = calendarMWC.calendar[monthIndex].weeks.indexOf(week);
                                if(weekIndex === action.payload.weeksIndex){
                                    calendarMW.calendar[monthIndex].weeks[weekIndex].weekDates.forEach(
                                        day => {
                                            day.association = []
                                        }
                                    )
                                }else if(weekIndex > action.payload.weeksIndex){
                                    if(weekIndex === 0){
                                        week.weekDates.forEach(
                                            day => {
                                                const dayIndex = calendarMWC.calendar[monthIndex].weeks[weekIndex].weekDates.indexOf(day)
                                                calendarMW.calendar[monthIndex].weeks[weekIndex].weekDates[dayIndex].association = calendarMWC.calendar[monthIndex-1].weeks[calendarMWC.calendar[monthIndex-1].weeks.length-2].weekDates[dayIndex].association
                                            }
                                        )
                                    }else if(weekIndex === calendarMWC.calendar[monthIndex].weeks.length-1&& (calendarMWC.calendar[monthIndex].weeks[weekIndex].weekDates[0].available || calendarMWC.calendar[monthIndex].weeks[weekIndex].weekDates[6].available)){
                                        week.weekDates.forEach(
                                            day => {
                                                const dayIndex = calendarMWC.calendar[monthIndex].weeks[weekIndex].weekDates.indexOf(day);
                                                calendarMW.calendar[monthIndex].weeks[weekIndex].weekDates[dayIndex].association = calendarMWC.calendar[monthIndex].weeks[weekIndex-1].weekDates[dayIndex].association
                                            }
                                        );
                                    }else{
                                        week.weekDates.forEach(
                                            day => {
                                                const dayIndex = calendarMWC.calendar[monthIndex].weeks[weekIndex].weekDates.indexOf(day)
                                                calendarMW.calendar[monthIndex].weeks[weekIndex].weekDates[dayIndex].association = calendarMWC.calendar[monthIndex].weeks[weekIndex - 1].weekDates[dayIndex].association;
                                            }
                                        )
                                    }
                                }
                            }
                        )
                    }else if(monthIndex > action.payload.calendarIndex){
                        month.weeks.forEach(
                            week => {
                                const weekIndex = calendarMWC.calendar[monthIndex].weeks.indexOf(week);
                                if(weekIndex === 0 && !calendarMWC.calendar[monthIndex-1].weeks[5].weekDates[0].available && !calendarMWC.calendar[monthIndex-1].weeks[5].weekDates[6].available){
                                    week.weekDates.forEach(
                                        day => {
                                            const dayIndex = calendarMWC.calendar[monthIndex].weeks[weekIndex].weekDates.indexOf(day);
                                            calendarMW.calendar[monthIndex].weeks[weekIndex].weekDates[dayIndex].association = calendarMWC.calendar[monthIndex-1].weeks[calendarMWC.calendar[monthIndex-1].weeks.length-3].weekDates[dayIndex].association
                                        }
                                    )
                                }else if(weekIndex === 0 && (calendarMWC.calendar[monthIndex-1].weeks[5].weekDates[0].available || calendarMWC.calendar[monthIndex-1].weeks[5].weekDates[6].available)){
                                    week.weekDates.forEach(
                                        day => {
                                            const dayIndex = calendarMWC.calendar[monthIndex].weeks[weekIndex].weekDates.indexOf(day);
                                            calendarMW.calendar[monthIndex].weeks[weekIndex].weekDates[dayIndex].association = calendarMWC.calendar[monthIndex-1].weeks[calendarMWC.calendar[monthIndex-1].weeks.length-2].weekDates[dayIndex].association
                                        }
                                    )
                                }else if(weekIndex === calendarMWC.calendar[monthIndex].weeks.length-1 && (calendarMWC.calendar[monthIndex].weeks[weekIndex].weekDates[0].available || calendarMWC.calendar[monthIndex].weeks[weekIndex].weekDates[6].available)){
                                    week.weekDates.forEach(
                                        day => {
                                            const dayIndex = calendarMWC.calendar[monthIndex].weeks[weekIndex].weekDates.indexOf(day);
                                            calendarMW.calendar[monthIndex].weeks[weekIndex].weekDates[dayIndex].association = calendarMWC.calendar[monthIndex].weeks[weekIndex-1].weekDates[dayIndex].association
                                        }
                                    );
                                }else if(weekIndex === calendarMWC.calendar[monthIndex].weeks.length-1 && !calendarMWC.calendar[monthIndex].weeks[weekIndex].weekDates[0].available && !calendarMWC.calendar[monthIndex].weeks[weekIndex].weekDates[6].available){
                                    return
                                }else{
                                    week.weekDates.forEach(
                                        day => {
                                            const dayIndex = calendarMWC.calendar[monthIndex].weeks[weekIndex].weekDates.indexOf(day);
                                            calendarMW.calendar[monthIndex].weeks[weekIndex].weekDates[dayIndex].association = calendarMWC.calendar[monthIndex].weeks[weekIndex-1].weekDates[dayIndex].association
                                        }
                                    )
                                }
                            }
                        )
                    }
                }
            )
            return {
                ...state,
                calendar: calendarMW
            }
        
        case CalendarDataActions.OPEN_TP_BOARD:
            return {
                ...state,
                isOpenTpBoard: true
            }
        
        case CalendarDataActions.CLOSE_TP_BOARD:
            return {
                ...state,
                isOpenTpBoard: false
            }
        
        case CalendarDataActions.SET_TUTORIAL:
            return {
                ...state,
                isTutorial: action.payload
            }
        
        case CalendarDataActions.SET_CLOSE:
            return {
                ...state,
                tileClose: action.payload
            }
        
        case CalendarDataActions.SET_DAYS_TO_CHANGE:
            return {
                ...state,
                daysToChange: action.payload
            }
        
        case CalendarDataActions.CONSOLE_LOG:
            return {
                ...state
            }
        
        case CalendarDataActions.UPDATE_CALENDAR:
            const arrayUC = [];
            if(state.tilesToChange.length > 0){state.tilesToChange.forEach(t=>arrayUC.push(Object.assign({},t)))};
            if(action.payload.length > 0){action.payload.forEach(t=>arrayUC.push(Object.assign({},t)))};
            return {
                ...state,
                tilesToChange: arrayUC
            }
        
        case CalendarDataActions.RESET_ATCH:
            return {
                ...state,
                tilesToChange: []
            }
        
        case CalendarDataActions.SET_WEEK:
            const weekSW = [];
            action.payload.forEach(d=>weekSW.push(Object.assign({},d)));
            return {
                ...state,
                week: weekSW
            }


        default:
        return state;
    }
}

export interface LastContainer {
    calendarIndex: number;
    weeksIndex: number;
    weekIndex: number;
}

export interface OpenedDay {
    calendarIndex: number;
    weeksIndex: number;
    weekDatesIndex: number;
}