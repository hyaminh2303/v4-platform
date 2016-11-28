import React, { Component, PropTypes } from 'react'
import { FormGroup, FormControl, Table, Button } from 'react-bootstrap'
import { reduxForm } from 'redux-form'
import validate from 'validate.js'
import { forEach, extend, includes } from 'lodash'
import Selector from 'react-select'

const fields = [
  'locations[]._id',
  'locations[].name',
  'locations[].latitude',
  'locations[].longitude',
  'locations[].radius',
  'locations[].dest_lat',
  'locations[].dest_lng',
  'locations[].transportation',
  'locations[].message',
  'locations[].tracking_data'
]

class AdLocations extends Component {
  _validMsg(location) {
    const { name, latitude, longitude, radius, message, dest_lat, dest_lng, transportation } = location

    let fields = [name, latitude, longitude, radius, message, dest_lat, dest_lng, transportation]
    let msg = ''
    forEach(fields, (field) => {
      if (field.error)
        msg += field.error[0] + '. '
    })
    msg = msg.substr(0, msg.length - 2)
    if (msg === '')
      return <i className="fa fa-check text-success mt10"></i>
    else
      return <i className="fa fa-times text-danger mt10" title={msg}></i>
  }

  _locationHasData(locationId) {
    if(locationId === undefined)
      return false

    const { adGroup: { exist_data_location_ids } } = this.props

    if (includes(exist_data_location_ids, locationId.initialValue))
      return true
    return false
  }

  _renderRow(location, index, exist_data_location_ids) {
    const {
      fields: { locations }, isTargetDestination
    } = this.props
    const { name, latitude, longitude, radius, message, dest_lat, dest_lng, transportation } = location
    let targetFieldsValue = null

    const transportation_types = [
      { key: 'driving', value: 'driving' },
      { key: 'walking', value: 'walking' },
      { key: 'cycling', value: 'cycling' },
      { key: 'public transit', value: 'public transit' }
    ]
    if (isTargetDestination) {
      targetFieldsValue = (
        <tr key={index}>
          <td>
            <FormGroup validationState={name.touched && name.error ? 'error' : null}>
              <FormControl type="text" {...name}/>
            </FormGroup>
          </td>
          <td>
            <FormGroup validationState={latitude.touched && latitude.error ? 'error' : null}>
              <FormControl type="number" {...latitude}/>
            </FormGroup>
          </td>
          <td>
            <FormGroup validationState={longitude.touched && longitude.error ? 'error' : null}>
              <FormControl type="number" {...longitude}/>
            </FormGroup>
          </td>
          <td>
            <FormGroup validationState={radius.touched && radius.error ? 'error' : null}>
              <FormControl type="number" {...radius}/>
            </FormGroup>
          </td>
          <td>
            <FormGroup validationState={message.touched && message.error ? 'error' : null}>
              <FormControl type="text" {...message}/>
            </FormGroup>
          </td>
          <td>
            <FormGroup validationState={dest_lat.touched && dest_lat.error ? 'error' : null}>
              <FormControl type="number" {...dest_lat}/>
            </FormGroup>
          </td>
          <td>
            <FormGroup validationState={dest_lng.touched && dest_lng.error ? 'error' : null}>
              <FormControl type="number" {...dest_lng}/>
            </FormGroup>
          </td>
          <td className="w-110">
            <FormGroup validationState={transportation.touched && transportation.error ? 'error' : null}>
              <Selector
                clearable={false}
                valueKey="value"
                labelKey="key"
                options={transportation_types}
                value={transportation.value}
                onChange={transportation.onChange} />
            </FormGroup>
          </td>
          <td className="text-center">
            {this._validMsg(location)}
          </td>
          <td>
            {
              locations.length > 1 && !this._locationHasData(location.id) ?
              <Button
                type="button"
                bsSize="xs"
                bsStyle="danger"
                onClick={() => locations.removeField(index)}>
                <i className="fa fa-minus"/>
              </Button>
              :
              ''
            }
          </td>
        </tr>
      )
    } else {
      targetFieldsValue = (
        <tr key={index}>
          <td>
            <FormGroup validationState={name.touched && name.error ? 'error' : null}>
              <FormControl type="text" {...name}/>
            </FormGroup>
          </td>
          <td>
            <FormGroup validationState={latitude.touched && latitude.error ? 'error' : null}>
              <FormControl type="number" {...latitude}/>
            </FormGroup>
          </td>
          <td>
            <FormGroup validationState={longitude.touched && longitude.error ? 'error' : null}>
              <FormControl type="number" {...longitude}/>
            </FormGroup>
          </td>
          <td>
            <FormGroup validationState={radius.touched && radius.error ? 'error' : null}>
              <FormControl type="number" {...radius}/>
            </FormGroup>
          </td>
          <td>
            <FormGroup validationState={message.touched && message.error ? 'error' : null}>
              <FormControl type="text" {...message}/>
            </FormGroup>
          </td>
          <td className="text-center">
              {this._validMsg(location)}
          </td>
          <td>
            {
              locations.length > 1 && !this._locationHasData(location._id) ?
              <Button
                type="button"
                bsSize="xs"
                bsStyle="danger"
                onClick={() => locations.removeField(index)}>
                <i className="fa fa-minus"/>
              </Button>
              :
              ''
            }
          </td>
        </tr>
      )
    }
    return targetFieldsValue
  }
  _renderTitle(isTargetDestination) {
    let content = null
    if (isTargetDestination) {
      content = (
        <thead className="thin-border-bottom">
          <tr>
            <th colSpan="5" className="text-center">Location</th>
            <th colSpan="3" className="text-center">Destination</th>
            <th colSpan="2"></th>
          </tr>
          <tr>
            <th className="">Name</th>
            <th className="w-88">Lat</th>
            <th className="w-88">Long</th>
            <th className="w-88" title="Radius">Radius (km)</th>
            <th>Message</th>
            <th className="w-88">Lat</th>
            <th className="w-88">Long</th>
            <th className="w-88">Transit type</th>
            <th className="actions w-40">Valid</th>
            <th className="actions w-30"></th>
          </tr>
        </thead>
      )
    } else {
      content = (
        <thead className="thin-border-bottom">
          <tr>
            <th className="">Name</th>
            <th className="w-88">Lat</th>
            <th className="w-88">Long</th>
            <th className="w-88" title="Radius">Radius (km)</th>
            <th>Message</th>
            <th className="actions w-40">Valid</th>
            <th className="actions w-30"></th>
          </tr>
        </thead>
      )
    }
    return content
  }
  render() {
    const { isTargetDestination, fields: { locations }, adGroup } = this.props
    let klassValidLocation = (locations.length === 0 ? '' : 'hide')
    let exist_data_location_ids = adGroup.exist_data_location_ids

    return (
      <form>
        <Table className="table table-bordered table-hover locations-table">
          {this._renderTitle(isTargetDestination)}
          <tbody>
            <tr className={klassValidLocation}>
              <td colSpan={isTargetDestination ? 10 : 7}>
                <span className="help-block">You have to upload file location or add new location</span>
              </td>
            </tr>
            {locations.map((location, index) => this._renderRow(location, index, exist_data_location_ids))}
            <tr>
              <td colSpan={isTargetDestination ? 10 : 7}>
                <Button
                  type="button"
                  bsSize="xs"
                  className="pull-right"
                  bsStyle="success"
                  onClick={() => locations.addField()}>
                  <i className="fa fa-plus"/>
                </Button>
              </td>
            </tr>
          </tbody>
        </Table>
      </form>
    )
  }
}

function validateParams(data, props) {
  let error = { locations: [] }

  forEach(data.locations, (e) => {
    let constraints = {
      name: {
        presence: true
      },
      latitude: {
        presence: true,
        numericality: {
          greaterThanOrEqualTo: -90,
          lessThanOrEqualTo: 90
        }

      },
      longitude: {
        presence: true,
        numericality: {
          greaterThanOrEqualTo: -180,
          lessThanOrEqualTo: 180
        }
      },
      radius: {
        presence: true,
        numericality: {
          greaterThanOrEqualTo: 1
        }
      }
    }
    if (props.isTargetDestination === true) {
      constraints = extend({}, constraints, {
        dest_lat: { presence: true,
                                  numericality: {
                                    greaterThanOrEqualTo: -90,
                                    lessThanOrEqualTo: 90
                                  }
                                },
        dest_lng: { presence: true,
                                  numericality: {
                                    greaterThanOrEqualTo: -180,
                                    lessThanOrEqualTo: 180
                                  }
                                },
        transportation: {
          format: {
            pattern: 'driving|walking|cycling|public\ transit',
            flags: 'i',
            message: 'can only be driving|walking|cycling|public transit'
          }
        }
      })
    }
    error.locations.push(validate(e, constraints))
  })
  return error
}

AdLocations.propTypes = {
  fields: PropTypes.object,
  isTargetDestination: PropTypes.bool,
  locations: PropTypes.array
}

export default reduxForm({
  form: 'locationForm',
  fields: fields,
  validate: validateParams
})(AdLocations)
