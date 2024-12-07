import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import axios from 'axios'

interface User {
  id: number
  username: string
  email: string
  address: string
  ethBalance: string
  tokenBalance: number
  gameTokens: number
  avatar: string
}

interface AuthState {
  user: User | null
  token: string | null
  isLoading: boolean
  error: string | null
}

const initialState: AuthState = {
  user: null,
  token: localStorage.getItem('token'),
  isLoading: false,
  error: null,
}

export const signup = createAsyncThunk(
  'auth/signup',
  async (
    userData: {
      username: string
      email: string
      password: string
      phoneNumber: string
    },
    { rejectWithValue }
  ) => {
    try {
      const response = await axios.post(
        'http://localhost:5002/api/auth/signup',
        userData
      )
      localStorage.setItem('token', response.data.token)
      return response.data
    } catch (error: any) {
      return rejectWithValue(error.response.data.message)
    }
  }
)

export const login = createAsyncThunk(
  'auth/login',
  async (
    userData: { email: string; password: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await axios.post(
        'http://localhost:5002/api/auth/login',
        userData
      )
      localStorage.setItem('token', response.data.token)
      return response.data
    } catch (error: any) {
      return rejectWithValue(error.response.data.message)
    }
  }
)

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null
      state.token = null
      localStorage.removeItem('token')
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(signup.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(signup.fulfilled, (state, action) => {
        state.isLoading = false
        state.user = action.payload.user
        state.token = action.payload.token
      })
      .addCase(signup.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })
      .addCase(login.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(login.fulfilled, (state, action) => {
        state.isLoading = false
        state.user = action.payload.user
        state.token = action.payload.token
      })
      .addCase(login.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })
  },
})

export const { logout } = authSlice.actions

export default authSlice.reducer
