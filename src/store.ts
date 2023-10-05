import { configureStore } from '@reduxjs/toolkit'
import { authReducer } from './reducers/authReducer'
import { errorReducer } from './reducers/errorReducer'
import { routerReducer } from './reducers/routerReducer'


export const store = configureStore({
    reducer: {
        router: routerReducer,
        auth: authReducer,
        error: errorReducer,
    },
})

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch