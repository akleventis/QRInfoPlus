import { Action, ActionType } from '../actions/actionTypes';


// Define a type for the slice state
export interface Auth {
    login: string
    accessToken: string
}

interface State {
    auth: Auth;
}

// Define the initial state using that type
const initialState = {
    auth: {
        login: '',
        accessToken: '',
    }
}

export const authReducer = (state: State = initialState, action: Action): State => {
    switch (action.type) {
        case ActionType.AUTH_DISCONNECT:
            return {
                auth: {
                    login: '',
                    accessToken: '',
                }
            }
        case ActionType.AUTH_CONNECT:
            return {
                auth: {
                    login: action.payload.login,
                    accessToken: action.payload.login,
                }
            }
        default:
            return state;
    }
}