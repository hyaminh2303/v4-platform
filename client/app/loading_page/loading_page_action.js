import * as LoadingPageConstants from './loading_page_constants'

export function showLoading() {
  return { type: LoadingPageConstants.LOADING_PAGE,
           payload: { loaded: false } }
}

export function hideLoading() {
  return { type: LoadingPageConstants.LOADED_PAGE,
           payload: { loaded: true } }
}
