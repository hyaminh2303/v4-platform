import axios from 'axios'
import * as VastConstants from './vast_constants'
import { showLoading, hideLoading } from '../loading_page/loading_page_action'
import { showNotif, closeAlert } from '../notification/notification_action'
import { forEach } from 'lodash'

export function createVast(vastData, commitToS3 = false, fileName = '') {
  return (dispatch) => {
    dispatch(showLoading())
    let newForm = appendData(vastData, commitToS3, fileName)
    axios.post('/vast_generator', newForm).then((resp) => {
      if (commitToS3) {
        vastData.vast_url = resp.data
      } else {
        vastData.vast_url = ''
        vastData.vast_xml = resp.data
      }
      dispatch({ type: VastConstants.CREATE_VAST_SUCCESS, payload: vastData })
      dispatch(hideLoading())
      dispatch(closeAlert())
    }).catch(() => {
      dispatch(showNotif({ message: 'Please check your input data again!', style: 'danger' }))
      dispatch(hideLoading())
    })
  }
}

export function loadVastFromFile(file, callback) {
  return (dispatch) => {
    dispatch(showLoading())
    let formData = new FormData()
    formData.append('vast_file', file)
    axios.post('/vast_generator', formData).then((resp) => {
      callback(resp.data.vast)
      dispatch({ type: VastConstants.LOAD_VAST_SUCCESS, payload: resp.data })
      dispatch(hideLoading())
      dispatch(closeAlert())
    }).catch(() => {
      dispatch(showNotif({ message: 'Vast file is invalid!', style: 'danger' }))
      dispatch(hideLoading())
    })
  }
}

export function fetchVastData() {
  return (dispatch) => {
    dispatch(showLoading())
    axios.get('/vast_data').then((resp) => {
      dispatch({ type: VastConstants.FETCH_VAST_DATA_SUCCESS, payload: resp.data })
      dispatch(hideLoading())
    })
  }
}

export function clearOldVast() {
  return { type: VastConstants.CLEAR_OLD_VAST, payload: {} }
}

function appendData(vast, commitToS3, fileName) {
  let formData = new FormData()
  forEach(vast, (value, key) => {
    if (!!value && key !== 'file_name' && key !== 'media_files_attributes') {
      formData.append(key, value)
    }
  })
  if (vast.media_files_attributes) {
    forEach(vast.media_files_attributes, (value, key) => {
      forEach(vast.media_files_attributes[key], (mValue, mKey) => {
        if (mKey !== 'file_name') {
          formData.append(`media_files_attributes[]${key}[]${mKey}`, mValue || null)
        }
      })
    })
  }
  formData.append('file_name', formatXMLName(fileName, vast))
  formData.append('need_commit_to_s3', commitToS3)
  return formData
}

function formatXMLName(fileName, vast) {
  let ext = fileName.slice(-4).trim()
  if (fileName === '') {
    fileName = `${vast.ad_system}.xml`
  } else if (ext !== '.xml') {
    fileName = `${fileName}.xml`
  }
  return fileName
}
