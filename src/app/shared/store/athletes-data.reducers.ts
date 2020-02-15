import * as AthletesDataActions from './athletes-data.actions';

export interface Athlete {
    id?: number;
    athlete_name?: string;
    athlete_phone_number?: string;
    athlete_email?: string;
    athlete_sport_discipline?: string;
    athlete_age?: string;
    athlete_height?: string;
    athlete_weight?: string;
    athlete_arm?: string;
    athlete_chest?: string;
    athlete_waist?: string;
    athlete_hips?: string;
    athlete_tigh?: string;
    fitness_level?: number;
    custom_athlete_parameters?: CustomAthleteParameter[];
    platform_notes?: PlatformNote[];
    plan_appends?: TrainingPlanApend[];
    attendant_membership?: MinAthleteInvitation;
    invitation?: MinAthleteInvitation;
    pending_user_invitation?: MinAthleteInvitation;
}

export interface TrainingPlanApend {
    id?: number;
    training_plan_id?: number;
    athlete_platform_id?: number;
    plan_activity_status?: string;
}

export interface MinAthleteInvitation {
    id?: number;
    athlete_email?: string;
}

export interface CustomAthleteParameter{
    parameter_name?: string;
    parameter_date?: string;
    parameter_description?: number;
    id?: number;
}

export interface PlatformNote{
    platform_note_name?: string;
    platform_note_link?: string;
    platform_note_description?: string;
    id?: number;
}

export interface AthleteMin{
    id?: number;
    athlete_name?: string;
    activated_training_plan?: {
        training_plan_id?: number;
        training_plan_name?: string;
    }
}

export interface State {
    athlete: Athlete;
    athletes: AthleteMin[];
    athleteCardMode: boolean;
    noData: boolean;
    spinnerAthlete: boolean;
    isValid: boolean;
    spinnerInvite: boolean;
    responsEmail: number;
    responseId: number;
    userID: string;
    usersByEmail: [];
    invitationSucces: boolean;
    isInPlatform: boolean;
}

const InitialState: State = {
    athlete: null,
    athletes: [],
    athleteCardMode: false,
    noData: true,
    spinnerAthlete: true,
    isValid: false,
    spinnerInvite: false,
    responsEmail: 1,
    responseId: null,
    userID: null,
    usersByEmail: null,
    invitationSucces: false,
    isInPlatform: false
}

export function AthletesDataReducer(state = InitialState, action: AthletesDataActions.AthletesDataActions) {
    switch(action.type){
        
        case AthletesDataActions.SET_ATHLETE_DATA:
            const athleteSAD = Object.assign({}, action.payload);
            if(!athleteSAD.athlete_name){athleteSAD.athlete_name = '';}
            if(!athleteSAD.athlete_phone_number){athleteSAD.athlete_phone_number = '';}
            if(!athleteSAD.athlete_email){athleteSAD.athlete_email = '';}
            if(!athleteSAD.athlete_sport_discipline){athleteSAD.athlete_sport_discipline = '';}
            if(!athleteSAD.athlete_age){athleteSAD.athlete_age = '';}
            if(!athleteSAD.athlete_height ){athleteSAD.athlete_height = '';}
            if(!athleteSAD.athlete_weight){athleteSAD.athlete_weight = '';}
            if(!athleteSAD.athlete_arm){athleteSAD.athlete_arm = '';}
            if(!athleteSAD.athlete_chest){athleteSAD.athlete_chest = '';}
            if(!athleteSAD.athlete_waist){athleteSAD.athlete_waist = '';}
            if(!athleteSAD.athlete_hips){athleteSAD.athlete_hips = '';}
            if(!athleteSAD.athlete_tigh){athleteSAD.athlete_tigh = '';}
            if(!athleteSAD.fitness_level){athleteSAD.fitness_level = 1;}
            if(!athleteSAD.custom_athlete_parameters){athleteSAD.custom_athlete_parameters = [];}
            if(!athleteSAD.platform_notes){athleteSAD.platform_notes = [];};
            console.log(athleteSAD)
            return {
                ...state,
                athlete: athleteSAD,
                spinnerAthlete: false,
                noData: false
            }
        
        case AthletesDataActions.SET_ATHLETES_DATA:
            console.log(action.payload)
            const athletesSAD = [...action.payload];
            athletesSAD.forEach(
                athlete => {
                    if(!athlete.activated_training_plan || athlete.activated_training_plan === null){
                        athlete.activated_training_plan = {
                            training_plan_id: null,
                            training_plan_name: null,
                        }
                    }
                }
            )
            return {
                ...state,
                athletes: athletesSAD
            }
        
        case AthletesDataActions.UPDATE_ATHLETES_DATA:
            const athletesUAD = [...state.athletes];
            const athleteUAD = Object.assign({}, action.payload);
            athletesUAD.unshift(athleteUAD);
            return {
                ...state,
                athletes: athletesUAD
            }
        
        case AthletesDataActions.DELETE_ATHLETE_FROM_ATHLETES:
            const athletesDAFA = [...state.athletes];
            const athleteDAFA = Object.assign({}, action.payload);
            athletesDAFA.forEach(
                (athlete, index) => {
                    if(athlete.id === athleteDAFA.id){
                        athletesDAFA.splice(index,1);
                    }
                }
            )
            console.log(athletesSAD)
            return {
                ...state,
                athletes: athletesDAFA
            }
        
        case AthletesDataActions.ON_AC_MODE:
            return {
                ...state,
                athleteCardMode: true
            }
        
        case AthletesDataActions.OFF_AC_MODE:
            return {
                ...state,
                athleteCardMode: false
            }
        
        case AthletesDataActions.NO_DATA_LOADING:
            return {
                ...state,
                noData: action.payload
            }
        
        case AthletesDataActions.SPINNER_ON_OFF_ATHLETE:
            return {
                ...state,
                spinnerAthlete: action.payload
            }
        
        case AthletesDataActions.SPINNER_ON_OFF_INVITE:
            return {
                ...state,
                spinnerInvite: action.payload
            }
        
        case AthletesDataActions.IS_VALID_ON_OFF:
            return {
                ...state,
                isValid: action.payload
            }
        
        case AthletesDataActions.RESPONSE_EMAIL_STATUS:
            return {
                ...state,
                responsEmail: action.payload.status,
                userID: action.payload.id
            }
        
        case AthletesDataActions.SET_USER_ID:
            return {
                ...state,
                userID: action.payload
            }
        
        case AthletesDataActions.ADD_CUSTOM_PARAMS:
            const athleteACP = Object.assign({}, state.athlete);
            athleteACP.custom_athlete_parameters.push(action.payload);
            return {
                ...state,
                athlete: athleteACP
            }
        
        case AthletesDataActions.DELETE_CUSTOM_PARAMS:
            const athleteDCP = Object.assign({}, state.athlete);
            athleteDCP.custom_athlete_parameters.forEach((param,index)=>{if(param.id === action.payload){athleteDCP.custom_athlete_parameters.splice(index,1);}});
            return {
                ...state,
                athlete: athleteDCP
            }
        
        case AthletesDataActions.EDIT_CUSTOM_PARAMS:
            const athleteECP = Object.assign({}, state.athlete);
            athleteECP.custom_athlete_parameters.forEach((param,index)=>{if(param.id === action.payload.id){athleteECP.custom_athlete_parameters[index] = action.payload;}});
            return {
                ...state,
                athlete: athleteECP
            }
        
        case AthletesDataActions.UPDATE_ATHLETE:
            console.log(action.payload)
            const athleteUA = Object.assign({}, state.athlete);
            const minInvUA: MinAthleteInvitation = {id: action.payload.id, athlete_email: action.payload.email}
            if(action.payload.status===2){athleteUA.invitation = minInvUA};
            if(action.payload.status===3){athleteUA.pending_user_invitation = minInvUA};
            if(action.payload.status===4){delete athleteUA.attendant_membership};
            return {
                ...state,
                athlete: athleteUA
            }
        
        case AthletesDataActions.UPDATE_ATHLETE_DATA:
            console.log(action.payload)
            const oldAthleteUAD = Object.assign({}, state.athlete);
            const newAthleteUAD = Object.assign({}, action.payload);
            oldAthleteUAD.athlete_name = newAthleteUAD.athlete_name
            oldAthleteUAD.athlete_phone_number = newAthleteUAD.athlete_phone_number
            oldAthleteUAD.athlete_email = newAthleteUAD.athlete_email
            oldAthleteUAD.athlete_sport_discipline = newAthleteUAD.athlete_sport_discipline
            oldAthleteUAD.athlete_age = newAthleteUAD.athlete_age
            oldAthleteUAD.athlete_height = newAthleteUAD.athlete_height
            oldAthleteUAD.athlete_weight = newAthleteUAD.athlete_weight
            oldAthleteUAD.athlete_arm = newAthleteUAD.athlete_arm
            oldAthleteUAD.athlete_chest = newAthleteUAD.athlete_chest
            oldAthleteUAD.athlete_waist = newAthleteUAD.athlete_waist
            oldAthleteUAD.athlete_hips = newAthleteUAD.athlete_hips
            oldAthleteUAD.athlete_tigh = newAthleteUAD.athlete_tigh
            oldAthleteUAD.fitness_level = newAthleteUAD.fitness_level
            return {
                ...state,
                athlete: oldAthleteUAD
            }
        
        case AthletesDataActions.UPDATE_ATHLETE_NOTES:
            const athleteUAN = Object.assign({}, state.athlete);
            athleteUAN.platform_notes.unshift(action.payload);
            return {
                ...state,
                athlete: athleteUAN
            }
        
        case AthletesDataActions.UPDATE_ATHLETE_NOTE:
            const athleteUANone = Object.assign({}, state.athlete);
            athleteUANone.platform_notes.forEach((note,index)=>{if(note.id===action.payload.id){athleteUANone.platform_notes[index]=action.payload}})
            return {
                ...state,
                athlete: athleteUANone
            }
        
        case AthletesDataActions.DELETE_ATHLETE_NOTE:
            const athleteDAN = Object.assign({}, state.athlete);
            athleteDAN.platform_notes.forEach((note,index)=>{if(note.id===action.payload.id){athleteDAN.platform_notes.splice(index,1)}})
            return {
                ...state,
                athlete: athleteDAN
            }
        
        case AthletesDataActions.DELETE_INVITATIONS:
            const athleteDI = Object.assign({}, state.athlete);
            athleteDI.invitation = null;
            athleteDI.pending_user_invitation = null;
            return {
                ...state,
                athlete: athleteDI
            }
        
        case AthletesDataActions.SET_USERS_BY_EMAIL:
            return {
                ...state,
                usersByEmail: action.payload
            }
        
        case AthletesDataActions.SET_INVITE_ID:
            return {
                ...state,
                userID: action.payload
            }
        
        case AthletesDataActions.SET_INVITATION_SUCCES:
            return {
                ...state,
                invitationSucces: action.payload
            }
        
        case AthletesDataActions.SET_IS_IN_PLATFORM:
            console.log(action.payload)
            return {
                ...state,
                isInPlatform: action.payload
            }

        default:
            return state;

    }
}