import axios from 'axios'

import * as DashboardConstants from './dashboard_constants'
import { showLoading, hideLoading } from '../loading_page/loading_page_action'


export function fetchDashboardSummary(params) {
  return (dispatch) => {
    dispatch(showLoading())
    axios.get('/dashboard', { params }).then((resp) => {
      dispatch(hideLoading())
      dispatch({ type: DashboardConstants.FETCH_SUMMARY,
        payload: resp.data })
    }).catch(() => {
      dispatch(hideLoading())
    })
  }
}