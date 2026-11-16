import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'

type AuthState = {
  token: string | null
  user: {
    id: string
    name: string
    email: string
    role: 'admin' | 'student'
  } | null
}

const initialState: AuthState = {
  token: localStorage.getItem('ismet_token'),
  user: (() => {
    const user = localStorage.getItem('ismet_user')
    return user ? JSON.parse(user) : null
  })(),
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (
      state,
      action: PayloadAction<{ token: string; user: AuthState['user'] }>,
    ) => {
      state.token = action.payload.token
      state.user = action.payload.user
      localStorage.setItem('ismet_token', action.payload.token)
      localStorage.setItem('ismet_user', JSON.stringify(action.payload.user))
    },
    logout: (state) => {
      state.token = null
      state.user = null
      localStorage.removeItem('ismet_token')
      localStorage.removeItem('ismet_user')
    },
  },
})

export const { setCredentials, logout } = authSlice.actions
export default authSlice.reducer
