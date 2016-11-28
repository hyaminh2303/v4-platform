import * as DashboardConstants from './dashboard_constants'

export function dashboardSummaryReducer(state = {}, action) {
  switch (action.type) {
    case DashboardConstants.FETCH_SUMMARY:
      return action.payload
    default:
      return state
  }
}
