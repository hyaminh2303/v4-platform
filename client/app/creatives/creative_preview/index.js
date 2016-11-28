import React, { Component, PropTypes } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { fetchCreative } from '../creative_actions'
import { chunk, replace } from 'lodash'
import { Row, Col } from 'react-bootstrap'
import classNames from 'classnames'
import * as ElementConstants from '../creative_new/banner_template/element_constants'
import moment from 'moment'
import 'moment-timezone'
import './style.css'

let distance = ['10m', '100m', '1km', '10km', '100km', '10m', '100m', '1km']

class CreativePreview extends Component {

  componentWillMount() {
    const { fetchCreative, creativeId } = this.props
    fetchCreative(creativeId)
  }

  _renderText(text, coordinate) {
    let newText = replace(text, new RegExp('{location}', 'g'), coordinate.location_name)
    newText = replace(newText, new RegExp('{distance}', 'g'), distance[Math.floor((Math.random() * 8))])
    newText = replace(newText, new RegExp('{text_message}', 'g'), coordinate.message)
    newText = replace(newText, new RegExp('{transportation_type}', 'g'), coordinate.transportation_type)
    newText = replace(newText, new RegExp('{transportation_distance}', 'g'), coordinate.transportation_distance)
    newText = replace(newText, new RegExp('{transportation_duration}', 'g'), coordinate.transportation_duration)
    return (
      newText
    )
  }

  _renderWeatherText(element, coordinate) {
    let temp_c = `${Math.round(coordinate.temperature)}°C`
    let temp_f = `${Math.round(coordinate.temperature * 1.8 + 32)}°F`
    let weatherText = replace(element.text, new RegExp('{weather_condition}', 'g'), coordinate.weather_condition)
    weatherText = replace(weatherText, new RegExp('{temperature_c}', 'g'), temp_c)
    weatherText = replace(weatherText, new RegExp('{temperature_f}', 'g'), temp_f)
    return weatherText
  }

  _renderTime(element, coordinate) {
    let timeText = moment.tz(coordinate.time_zone).format(element.text)
    return replace(timeText, new RegExp(`${element.text}`, 'g'), timeText)
  }

  _renderElement(element, coordinate) {
    let borderSize = 1
    let style = {
      position: 'absolute',
      top: `${element.y + borderSize}px`,
      left: `${element.x + borderSize}px`,
      fontSize: `${element.font_size}px`,
      fontWeight: element.font_weight,
      fontStyle: element.font_style,
      fontFamily: element.font,
      color: element.color,
      lineHeight: '1.2'
    }
    let boxStyle = { textAlign: element.text_align }
    if ( !!element.box_width ) {
      boxStyle.width = `${element.box_width}px`
    }
    let text
    switch (element.element_type) {
      case ElementConstants.WEATHER:
        text = this._renderWeatherText(element, coordinate)
        break
      case ElementConstants.TIME:
        text = this._renderTime(element, coordinate)
        break
      default:
        text = this._renderText(element.text, coordinate)
    }
    return (
      <div style={style} key={element._id}>
        <div style={boxStyle} >
          {text}
        </div>
      </div>
    )
  }

  _renderImage(coordinate, index, needPullRight = false) {
    const { creative } = this.props
    let colBanner = classNames({ 'pull-right': index % 2 === 0 && needPullRight })
    let style = {
      width: creative.width,
      height: creative.height,
      position: 'relative',
      textAlign: 'left'
    }
    return (
      <div className={colBanner} style={style} key={index} >
        {creative.elements.map((element) => this._renderElement(element, coordinate))}
        <img src={`${creative.banner_url}?_key${Math.random()}`}/>
      </div>
    )
  }

  _renderCol(coordinate, index) {
    const { creative } = this.props
    let col = creative.width > 500 ? 12 : 6

    return (
      <Col sm={col} className="mb10" key={coordinate._id}>
        {col === 12 ?
            <center>
              {this._renderImage(coordinate, index)}
            </center>
          :
          this._renderImage(coordinate, index, true)
        }
      </Col>
    )
  }

  _renderRow(coordinates) {
    return (
      <Row key={coordinates[0]._id}>
        {coordinates.map((coordinate, index) => this._renderCol(coordinate, index))}
      </Row>
    )
  }

  render() {
    const { creative } = this.props
    let chunkElements = chunk(creative.coordinates.slice(0, 8), 2)

    return (
      <div className="ad-group-detail">
        <div className="breadcrumbs">
          <ul className="breadcrumb">
            <li>
              <i className="ace-icon fa fa-dashboard home-icon"/>
              <a href="#/dashboard">Dashboard</a>
            </li>
            <li>
              Campaign: <a href={`#/campaigns/${creative.campaign_id}`}>{creative.campaign_name}</a>
            </li>
            <li> Ad Group: <a href={`#/ad_groups/${creative.ad_group_id}`}>{creative.ad_group_name}</a></li>
            <li> Preview Creative: {creative.name}</li>
          </ul>
        </div>
        <div className="page-content">
          <div >
            {chunkElements.map((chunkElement) => this._renderRow(chunkElement))}
          </div>
        </div>
      </div>
    )
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({ fetchCreative }, dispatch)
}

function mapStateToProps(state, ownState) {
  return {
    creative: state.creative,
    session: state.session,
    creativeId: ownState.params.id
  }
}

CreativePreview.propTypes = {
  creative: PropTypes.object,
  creativeId: PropTypes.string,
  fetchCreative: PropTypes.func
}

export default connect(mapStateToProps, mapDispatchToProps)(CreativePreview)
