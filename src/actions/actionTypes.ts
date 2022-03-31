import { Auth } from '../reducers/authReducer';
import { Error } from '../reducers/errorReducer';


export enum ActionType {
    AUTH_CONNECT = 'AUTH_CONNECT',
    AUTH_DISCONNECT = 'AUTH_DISCONNECT',
    ERROR_SET = 'ERROR_SET',
}

interface actionAuthConnect {
    type: ActionType.AUTH_CONNECT;
    payload: Auth;
}

interface actionAuthDisconnect {
    type: ActionType.AUTH_DISCONNECT;
}

interface actionErrorSet {
    type: ActionType.ERROR_SET;
    payload: Error
}

export type Action = actionAuthConnect | actionAuthDisconnect | actionErrorSet;