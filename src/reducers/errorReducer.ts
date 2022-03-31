import { Action, ActionType } from '../actions/actionTypes';


// Define a type for the slice state
export interface Error {
    message: string
}

interface State {
    error: Error;
}

// Define the initial state using that type
const initialState = {
    error: {
        message: '',
    }
}

export const errorReducer = (state: State = initialState, action: Action): State => {
    switch (action.type) {
        case ActionType.ERROR_SET:
            return {
                error: {
                    message: action.payload.message,
                }
            }
        default:
            return state;
    }
}