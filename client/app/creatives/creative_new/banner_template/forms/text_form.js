import React, { Component, PropTypes } from 'react'
import { Col, FormGroup, FormControl, InputGroup,
  ControlLabel, Button, DropdownButton, MenuItem } from 'react-bootstrap'
import { reduxForm } from 'redux-form'
import validate from 'validate.js'

const fields = [
  'id',
  'text'
]


class TextForm extends Component {
  constructor(props) {
    super(props)
    this._addText = this._addText.bind(this)
  }

  _addText(str) {
    const { fields: { text } } = this.props
    let newStr = (text.value !== 'Location' ? text.value : '') + str
    text.onChange(newStr)
  }

  render() {
    const { fields: { id, text } } = this.props
    return (
      <form>
        <FormGroup validationState={text.touched && text.error ? 'error' : null}>
          <Col componentClass={ControlLabel} xs={4}>
            Text
          </Col>
          <Col xs={8}>
            <InputGroup>
              <FormControl type="text" {...text}/>
              <InputGroup.Button>
                <DropdownButton
                  id={id.value}
                  className="btn-danger btn-sm fa fa-plus" title="" noCaret>
                  <MenuItem eventKey="1"
                    onClick={() => this._addText('{location}')}>Address</MenuItem>
                  <MenuItem eventKey="2"
                    onClick={() => this._addText('{distance}')}>Distance</MenuItem>
                  <MenuItem eventKey="3"
                    onClick={() => this._addText('{text_message}')}>Text Message</MenuItem>
                </DropdownButton>
              </InputGroup.Button>
            </InputGroup>
          </Col>
        </FormGroup>
      </form>
    )
  }
}

function validateParams(data) {

  let constraints = {
    text: {
      presence: true
    }
  }
  let error = validate(data, constraints)

  return error || {}
}

TextForm.propTypes = {
  fields: PropTypes.object.isRequired
}

export default reduxForm({
  form: 'textForm',
  fields: fields,
  validate: validateParams
})(TextForm)

