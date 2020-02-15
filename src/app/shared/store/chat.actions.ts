import { Action } from '@ngrx/store';

export const FETCH_CONTACTS = 'FETCH_CONTACTS';
export const IS_ON_CHAT = 'IS_ON_CHAT';

export class IsOnChat implements Action {
    readonly type = IS_ON_CHAT;

    constructor(public payload: boolean){}
}

export type ChatActions = IsOnChat;