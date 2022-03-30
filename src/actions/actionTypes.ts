import { Auth } from '../reducers/authReducer';

export enum ActionType {
    AUTH_CONNECT = 'AUTH_CONNECT',
    AUTH_DISCONNECT = 'AUTH_DISCONNECT',
    AUTH_AUTHORIZE = 'AUTH_AUTHORIZE',
}

interface actionAuthAuthorize {
    type: ActionType.AUTH_AUTHORIZE;
    payload: string;
}

interface actionAuthConnect {
    type: ActionType.AUTH_CONNECT;
    payload: Auth;
}

interface actionAuthDisconnect {
    type: ActionType.AUTH_DISCONNECT;
}

export type Action = actionAuthConnect | actionAuthDisconnect;