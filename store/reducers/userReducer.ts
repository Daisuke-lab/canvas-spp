import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { CustomSessionType } from '../../types'
import { UserType } from '../../types/UserType'

let currentUser:UserType | null = null;

if (typeof localStorage !== "undefined") {
    const stringifiedCurrentUser:string | null = localStorage.getItem("currentUser")
    console.log(stringifiedCurrentUser)
    currentUser = (stringifiedCurrentUser?.includes("{")? JSON.parse(stringifiedCurrentUser): null) as null | UserType
}


interface StateType {
    session: CustomSessionType | null,
    currentUser: UserType | null
}

const initialState:StateType = {
    session: null,
    currentUser
}

export const userSlice = createSlice({
    name: 'users',
    initialState: initialState,
    reducers: {
      updateSession: (state, action) => {
          state.session = action.payload
      },
      setCurrentUser: (state, action) => {
        localStorage.setItem('currentUser', JSON.stringify(action.payload));
        state.currentUser = action.payload
      }
    }
})


export const {updateSession, setCurrentUser} = userSlice.actions
export default userSlice.reducer