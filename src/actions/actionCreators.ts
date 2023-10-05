import { Dispatch } from 'redux';
import { ActionType, Action, RouterType } from './actionTypes';
import { getItemAsync, setItemAsync, deleteItemAsync } from 'expo-secure-store';
import { getAccessToken } from '../api/client';

export const authorize = (code: string) => {
    return async (dispatch: Dispatch<Action>) => {
        const response = await getAccessToken(code)
        const { login, access_token } = response;
        setItemAsync('access_token', access_token)
            .then(() => {
                setItemAsync('login', login)
                    .then(() => {
                        dispatch({
                            type: ActionType.AUTH_CONNECT,
                            payload: {
                                login: login,
                                accessToken: access_token,
                            }
                        })
                    })
            })
    }
}

export const loadAuth = () => {
    return async (dispatch: Dispatch<Action>) => {
        getItemAsync('access_token')
            .then((accessToken) => {
                getItemAsync('login')
                    .then((login) => {
                        dispatch({
                            type: ActionType.AUTH_CONNECT,
                            payload: {
                                login: login ? login : '',
                                accessToken: accessToken ? accessToken : '',
                            }
                        })
                    })
            })
    }
}

export const disconnect = () => {
    return async (dispatch: Dispatch<Action>) => {
        deleteItemAsync('access_token')
            .then(() => {
                deleteItemAsync('login').then(() => {
                    dispatch({
                        type: ActionType.AUTH_DISCONNECT
                    })
                })
            })
    }
}

export const setError = (message: string) => {
    return async (dispatch: Dispatch<Action>) => {
        dispatch({
            type: ActionType.ERROR_SET,
            payload: {
                message: message ? message : '',
            }
        })
        setTimeout(() => {
            dispatch({
                type: ActionType.ERROR_SET,
                payload: {
                    message: '',
                }
            })
        }, 5000)
    }
}
export const setBitlyRouter = () => {
    return async (dispatch: Dispatch<Action>) => {
        dispatch({
            type: RouterType.BITLY_V4,
        })
    }
}

export const setDefaultRouter = () => {
    return async (dispatch: Dispatch<Action>) => {
        dispatch({
            type: RouterType.DEFAULT,
        })
    }
}