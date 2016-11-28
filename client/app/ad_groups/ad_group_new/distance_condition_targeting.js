import React, { Component, PropTypes } from 'react'
import { FormGroup, FormControl, Table, Button, Row, Col, ControlLabel } from 'react-bootstrap'
import { reduxForm } from 'redux-form'
import { forEach, extend, includes } from 'lodash'
import Selector from 'react-select'
import Select from 'react-select'
import { uniqueId  } from 'lodash'
import validate from 'validate.js'


const fields = [
  'ad_group_distance_conditionals[].creative_id',
  'ad_group_distance_conditionals[].value1',
  'ad_group_distance_conditionals[].value2',
  'ad_group_distance_conditionals[].condition'
]

class DistanceConditionTargeting extends Component {
  constructor(props) {
    super(props)
    this.state = { indexOfBetween: [] }

  }

  componentWillReceiveProps(nextProps) {
    let indexOfBetween = []
    nextProps.values.ad_group_distance_conditionals.forEach((object, i) => {
      if (object.condition === 'between') {
        return indexOfBetween.push(i)
      }
    })
    this.setState({ indexOfBetween: indexOfBetween })
  }

  _renderInputValues(distanceCondition, index) {
    const { value1, value2 } = distanceCondition

    if(this.state.indexOfBetween.indexOf(index) > -1) {
      return(
        <Row>
          <Col sm={6}>
            <FormGroup validationState={value1.touched && value1.error ? 'error' : null}>
              From <input type="number" min="0" style={{width: '60%'}} {...value1}/>
            </FormGroup>
          </Col>
          <Col sm={6}>
            <FormGroup validationState={value2.touched && value2.error ? 'error' : null}>
              To <input type="number" min="0" style={{width: '60%'}} {...value2}/> km
            </FormGroup>
          </Col>
        </Row>
      )
    } else {
      return(
        <FormGroup validationState={value1.touched && value1.error ? 'error' : null}>
          <input type="number"  {...value1}/> km
        </FormGroup>
      )
    }
  }

  _renderRow(distanceCondition, creativeOptions, index) {
    const { fields: { ad_group_distance_conditionals },
            adGroup: { banner_distance_options } } = this.props
    const { creative_id, condition } = distanceCondition
    return (
      <tr key={`${index}`}>
        <td>
          <FormGroup validationState={creative_id.touched && creative_id.error ? 'error' : null}>
            <Selector
              clearable={false}
              valueKey="id"
              labelKey="name"
              options={creativeOptions}
              value={creative_id.value}
              onChange={creative_id.onChange} />
          </FormGroup>
        </td>
        <td>
          <Selector
            clearable={false}
            valueKey="key"
            labelKey="label"
            options={banner_distance_options}
            value={condition.value}
            onChange={condition.onChange} />
        </td>
        <td>
          {this._renderInputValues(distanceCondition, index)}
        </td>
        <td>
          {
            ad_group_distance_conditionals.length > 1 ?
            <Button
              type="button"
              bsSize="xs"
              bsStyle="danger"
              onClick={() => {
                console.log(ad_group_distance_conditionals[index])
                return ad_group_distance_conditionals.removeField(index)}}>
              <i className="fa fa-minus"/>
            </Button>
            :
            ''
          }
        </td>
      </tr>
    )
  }

  render() {
    const { fields: { ad_group_distance_conditionals },
            adGroup: { creatives, banner_distance_options, condition_type } } = this.props

    const creativeOptions = creatives.map((creative) => {
      return { name: creative.name, id: creative._id }
    })

    return (
      <form>
        <Row>
          <Col md={8}>
            <Table className="table table-bordered table-hover">
              <thead>
                <tr>
                  <th className="text-center w-200">Creative</th>
                  <th className="text-center w-200">Condition</th>
                  <th className="">Values</th>
                  <th className="actions w-30"/>
                </tr>
              </thead>
              <tbody>
                {ad_group_distance_conditionals.map((distanceCondition, index) => this._renderRow(distanceCondition, creativeOptions, index))}
                <tr>
                  <td colSpan={4}>
                    <Button
                      type="button"
                      bsSize="xs"
                      className="pull-right"
                      bsStyle="success"
                      onClick={() => ad_group_distance_conditionals.addField()}>
                      <i className="fa fa-plus"/>
                    </Button>
                  </td>
                </tr>
              </tbody>
            </Table>
          </Col>
        </Row>
      </form>
    )
  }
}

function validateParams(data, props) {
  let error = { ad_group_distance_conditionals: [] }
  forEach(data.ad_group_distance_conditionals, (e) => {
    let constraints = { value1: { presence: true } }
    if(e.condition === 'between') {
      constraints = extend({}, constraints, {
        value2: { presence: true,
                  numericality: {
                                greaterThan: e.value1
                              }
                }
      })
    }
    error.ad_group_distance_conditionals.push(validate(e, constraints))
    console.log(error)
  })
  return error
}

export default reduxForm({
  form: 'DistanceConditionTargetingForm',
  fields: fields,
  validate: validateParams
})(DistanceConditionTargeting)
