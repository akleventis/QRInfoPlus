import { Auth } from '../reducers/authReducer';
import { Error } from '../reducers/errorReducer';


export enum ActionType {
    AUTH_CONNECT = 'AUTH_CONNECT',
    AUTH_DISCONNECT = 'AUTH_DISCONNECT',
    ERROR_SET = 'ERROR_SET',
}

export enum RouterType {
    BITLY_V4 = 'BITLY_V4',
    DEFAULT = 'DEFAULT',
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

interface routerV4 {
    type: RouterType.BITLY_V4
}
interface routerDefault {
    type: RouterType.DEFAULT
}

export type Action = actionAuthConnect | actionAuthDisconnect | actionErrorSet | routerV4 | routerDefault;