import { Action, RouterType } from '../actions/actionTypes';

// Define a type for the slice state
export interface State {
    router: string;
}

// Define the initial state using that type
const initialState = {
    router: RouterType.DEFAULT
}

export const routerReducer = (state: State = initialState, action: Action): State => {
    switch (action.type) {
        case RouterType.BITLY_V4:
            return {
                router: action.type
            }
        case RouterType.DEFAULT:
            return {
                router: action.type
            }
        default:
            return state;
    }
}