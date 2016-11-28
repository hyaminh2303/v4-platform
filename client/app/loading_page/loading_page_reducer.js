import * as LoadingPageConstants from './loading_page_constants'

export function loadingPageReducer(state = { loaded: true }, action) {
  switch (action.type) {
    case LoadingPageConstants.LOADING_PAGE:
    case LoadingPageConstants.LOADED_PAGE:
      return action.payload
    default:
      return state
  }
}
