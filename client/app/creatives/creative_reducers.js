import * as CreativeConstants from './creative_constants'
import * as elementConstants from './creative_new/banner_template/element_constants'
import { extend } from 'lodash'
import update from 'react/lib/update'

export function creativesReducer(state = { data: null, summary: {} }, action) {
  switch (action.type) {
    case CreativeConstants.FETCH_CREATIVES_SUCCESS:
      return extend({}, state, action.payload)
    default:
      return state
  }
}

export function creativeReducer(state = { data_tracking: {}, coordinates: [], elements: [] }, action) {
  let creative
  switch (action.type) {
    case CreativeConstants.NEW_CREATIVE:
      return { adGroupId: action.payload.adGroupId, elements: [] }
    case CreativeConstants.EDIT_CREATIVE:
      return action.payload.creative
    case CreativeConstants.SAVE_CREATIVE_SUCCESS:
    case CreativeConstants.FETCH_CREATIVE_SUCCESS:
      return action.payload
    case CreativeConstants.ADD_ELEMENT:
      let dataCondition = initCondition(action.payload.elementType)
      creative = update(action.payload.creative, {
        elements: {
          '$push': dataCondition
        }
      })
      creative.selectedElementIndex = creative.elements.length - 1
      return creative
    case CreativeConstants.UPDATE_ELEMENT:
      creative = update(action.payload.creative,
        { elements: { [action.payload.index]: { '$merge': action.payload.element } } })
      if (action.payload.needClosePopup) {
        creative.selectedElementIndex = null
      }
      return creative
    case CreativeConstants.DELETE_ELEMENT:
      creative = update(action.payload.creative, { elements: { '$splice': [[action.payload.index, 1]] } } )
      creative.selectedElementIndex = null
      return extend({}, state, creative)
    case CreativeConstants.OPEN_ELEMENT_FORM:
      creative = action.payload.creative
      creative.selectedElementIndex = action.payload.index
      return extend({}, state, creative)
    case CreativeConstants.CLOSE_ELEMENT_FORM:
      creative = action.payload.creative
      creative.selectedElementIndex = null
      return extend({}, state, creative)
    default:
      return state
  }
}

export function fontsReducer(state = { fonts: [] }, action) {
  switch (action.type) {
    case CreativeConstants.FETCH_FONTS_SUCCESS:
      return action.payload
    default:
      return state
  }
}

export function timeFormatsReducer(state = { time_formats: [] }, action) {
  switch (action.type) {
    case CreativeConstants.FETCH_TIME_FORMATS_SUCCESS:
      return action.payload
    default:
      return state
  }
}

function initCondition(type) {
  let info = [{ x: 0, y: 0,
                text: 'Location',
                color: '#ffffff',
                font_size: 13,
                font: 'Arial',
                font_weight: 'normal',
                font_style: 'normal',
                element_type: type,
                text_align: 'left',
                box_width: '',
                weather_conditions: []
              }]
  switch (type) {
    case elementConstants.TIME:
      info[0].text = 'DD/MM/YYYY'
      info[0].time_format = '02-01-2006'
      return info
    case elementConstants.WEATHER:
      info[0].text = elementConstants.NEW_WEATHER
      return info
    case elementConstants.TRANSPORTATION:
      info[0].text = elementConstants.NEW_TRANSPORTATION
      return info
    default:
      return info
  }
}
