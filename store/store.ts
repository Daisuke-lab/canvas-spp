import { configureStore } from '@reduxjs/toolkit'
import canvasReducer from './reducers/canvasReducer'
const store =  configureStore({
  reducer: {
    canvases: canvasReducer}
})
export default store
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch