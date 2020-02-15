import * as ChatActions from './chat.actions';

export interface State {
    isChatOn: boolean;
}

const InitialState: State = {
    isChatOn: false,
}

export function ChatReducer(state = InitialState, action: ChatActions.ChatActions) {
    switch(action.type){

        case ChatActions.IS_ON_CHAT:
            return {
                ...state,
                isChatOn: action.payload
            }


        default:
            return state;
    }
}
