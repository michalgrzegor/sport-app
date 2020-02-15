import { Note } from './board-data.reducers';
import { Action } from '@ngrx/store';
import { Athlete, AthleteMin, CustomAthleteParameter } from './athletes-data.reducers';

export const FETCH_ATHLETE_DATA = 'FETCH_ATHLETE_DATA';
export const SET_ATHLETE_DATA = 'SET_ATHLETE_DATA';
export const FETCH_ATHLETES_DATA = 'FETCH_ATHLETES_DATA';
export const SET_ATHLETES_DATA = 'SET_ATHLETES_DATA';
export const ON_AC_MODE = 'ON_AC_MODE';
export const OFF_AC_MODE = 'OFF_AC_MODE';
export const NO_DATA_LOADING = 'NO_DATA_LOADING';
export const SPINNER_ON_OFF_ATHLETE = 'SPINNER_ON_OFF_ATHLETE';
export const UPDATE_ATHLETES_DATA = 'UPDATE_ATHLETES_DATA';
export const SPINNER_ON_OFF_INVITE = 'SPINNER_ON_OFF_INVITE';
export const IS_VALID_ON_OFF = 'IS_VALID_ON_OFF';
export const RESPONSE_EMAIL_STATUS = 'RESPONSE_EMAIL_STATUS';
export const SET_USER_ID = 'SET_USER_ID';
export const DELETE_ATHLETE_FROM_ATHLETES = 'DELETE_ATHLETE_FROM_ATHLETES';
export const ADD_CUSTOM_PARAMS = 'ADD_CUSTOM_PARAMS';
export const DELETE_CUSTOM_PARAMS = 'DELETE_CUSTOM_PARAMS';
export const EDIT_CUSTOM_PARAMS = 'EDIT_CUSTOM_PARAMS';
export const UPDATE_ATHLETE = 'UPDATE_ATHLETE';
export const UPDATE_ATHLETE_DATA = 'UPDATE_ATHLETE_DATA';
export const UPDATE_ATHLETE_NOTES = 'UPDATE_ATHLETE_NOTES';
export const UPDATE_ATHLETE_NOTE = 'UPDATE_ATHLETE_NOTE';
export const DELETE_ATHLETE_NOTE = 'DELETE_ATHLETE_NOTE';
export const DELETE_INVITATIONS = 'DELETE_INVITATIONS';
export const SET_USERS_BY_EMAIL = 'SET_USERS_BY_EMAIL';
export const SET_INVITE_ID = 'SET_INVITE_ID';
export const SET_INVITATION_SUCCES = 'SET_INVITATION_SUCCES';
export const SET_IS_IN_PLATFORM = 'SET_IS_IN_PLATFORM';

export class FetchAthleteData implements Action {
    readonly type = FETCH_ATHLETE_DATA;
}

export class SetAthleteData implements Action {
    readonly type = SET_ATHLETE_DATA;

    constructor(public payload: Athlete){}
}

export class FetchAthletesData implements Action {
    readonly type = FETCH_ATHLETES_DATA;
}

export class SetAthletesData implements Action {
    readonly type = SET_ATHLETES_DATA;

    constructor(public payload: AthleteMin[]){}
}

export class OnACMode implements Action {
    readonly type = ON_AC_MODE;
}

export class OffACMode implements Action {
    readonly type = OFF_AC_MODE;
}

export class NoDataLoading implements Action {
    readonly type = NO_DATA_LOADING;

    constructor(public payload: boolean){}
}

export class SpinnerOnOffAthlete implements Action {
    readonly type = SPINNER_ON_OFF_ATHLETE;

    constructor(public payload: boolean){}
}

export class SpinnerOnOffInvite implements Action {
    readonly type = SPINNER_ON_OFF_INVITE;

    constructor(public payload: boolean){}
}

export class IsValidOnOff implements Action {
    readonly type = IS_VALID_ON_OFF;

    constructor(public payload: boolean){}
}

export class UpdateAthletesData implements Action {
    readonly type = UPDATE_ATHLETES_DATA;

    constructor(public payload: AthleteMin){}
}

export class ResponseEmailStatus implements Action {
    readonly type = RESPONSE_EMAIL_STATUS;

    constructor(public payload: {status: number, id: string}){}
}

export class SetUserId implements Action {
    readonly type = SET_USER_ID;

    constructor(public payload: string){}
}

export class DeleteAthleteFromAthletes implements Action {
    readonly type = DELETE_ATHLETE_FROM_ATHLETES;

    constructor(public payload: Athlete){}
}

export class AddCustomParams implements Action {
    readonly type = ADD_CUSTOM_PARAMS;

    constructor(public payload: CustomAthleteParameter){}
}

export class DeleteCustomParams implements Action {
    readonly type = DELETE_CUSTOM_PARAMS;

    constructor(public payload: number){}
}

export class EditCustomParams implements Action {
    readonly type = EDIT_CUSTOM_PARAMS;

    constructor(public payload: CustomAthleteParameter){}
}

export class UpdateAthlete implements Action {
    readonly type = UPDATE_ATHLETE;

    constructor(public payload: {id: number, email: string, status: number}){}
}

export class UpdateAthleteData implements Action {
    readonly type = UPDATE_ATHLETE_DATA;

    constructor(public payload: Athlete){}
}

export class UpdateAthleteNotes implements Action {
    readonly type = UPDATE_ATHLETE_NOTES;

    constructor(public payload: Note){}
}

export class UpdateAthleteNote implements Action {
    readonly type = UPDATE_ATHLETE_NOTE;

    constructor(public payload: Note){}
}

export class DeleteAthleteNote implements Action {
    readonly type = DELETE_ATHLETE_NOTE;

    constructor(public payload: Note){}
}

export class DeleteInvitations implements Action {
    readonly type = DELETE_INVITATIONS;
}

export class SetUsersByEmail implements Action {
    readonly type = SET_USERS_BY_EMAIL;

    constructor(public payload: []){}
}

export class SetInviteId implements Action {
    readonly type = SET_INVITE_ID;

    constructor(public payload: string){}
}

export class SetInvitationSucces implements Action {
    readonly type = SET_INVITATION_SUCCES;

    constructor(public payload: boolean){}
}

export class SetIsInPlatform implements Action {
    readonly type = SET_IS_IN_PLATFORM;

    constructor(public payload: boolean){}
}

export type AthletesDataActions = FetchAthletesData | SetAthletesData | FetchAthleteData | SetAthleteData | OnACMode | OffACMode | NoDataLoading | SpinnerOnOffAthlete | UpdateAthletesData | SpinnerOnOffInvite | IsValidOnOff | ResponseEmailStatus | SetUserId | DeleteAthleteFromAthletes | AddCustomParams | DeleteCustomParams | EditCustomParams | UpdateAthlete | UpdateAthleteNotes | UpdateAthleteNote | DeleteAthleteNote | DeleteInvitations | SetUsersByEmail | SetInviteId | SetInvitationSucces | SetIsInPlatform | UpdateAthleteData; 