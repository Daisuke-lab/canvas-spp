import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { CustomSessionType } from '../../types'


interface StateType {
    session: CustomSessionType | null
}

const initialState:StateType = {
    session: null
}

export const userSlice = createSlice({
    name: 'users',
    initialState: initialState,
    reducers: {
      updateSession: (state, action) => {
          state.session = action.payload
      }
    }
})


export const {updateSession} = userSlice.actions
export default userSlice.reducer