import api from '../../services/api'
import {
  fetchDashboardFailure,
  fetchDashboardStart,
  fetchDashboardSuccess,
} from '../reducers/dashboardReducer'
import { AppDispatch } from '../store'

export const fetchDashboardData = () => async (dispatch: AppDispatch) => {
  try {
    dispatch(fetchDashboardStart())
    const response = await api.get('/dashboard')
    dispatch(fetchDashboardSuccess(response.data))
  } catch (error: any) {
    dispatch(fetchDashboardFailure(error.message))
  }
}
