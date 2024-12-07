import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface DashboardState {
  balance: number
  transactions: Array<{ id: string; amount: number; date: string }>
  loading: boolean
  error: string | null
}

const initialState: DashboardState = {
  balance: 0,
  transactions: [],
  loading: false,
  error: null,
}

const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState,
  reducers: {
    fetchDashboardStart(state) {
      state.loading = true
      state.error = null
    },
    fetchDashboardSuccess(
      state,
      action: PayloadAction<{
        balance: number
        transactions: Array<{ id: string; amount: number; date: string }>
      }>
    ) {
      state.loading = false
      state.balance = action.payload.balance
      state.transactions = action.payload.transactions
    },
    fetchDashboardFailure(state, action: PayloadAction<string>) {
      state.loading = false
      state.error = action.payload
    },
  },
})

export const {
  fetchDashboardStart,
  fetchDashboardSuccess,
  fetchDashboardFailure,
} = dashboardSlice.actions

export default dashboardSlice.reducer
