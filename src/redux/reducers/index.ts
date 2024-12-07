import { combineReducers } from '@reduxjs/toolkit'

import dashboardReducer from './dashboardReducer'
import authReducer from '../slices/authSlice'

const rootReducer = combineReducers({
  dashboard: dashboardReducer,
  auth: authReducer,
})

export type RootState = ReturnType<typeof rootReducer>
export default rootReducer
