import React, { Component, PropTypes } from 'react'
import { Modal, Row, Col, FormGroup, HelpBlock,
         ControlLabel, FormControl, Button } from 'react-bootstrap'
import { reduxForm } from 'redux-form'
import validate from 'validate.js'

const fields = ['start_date', 'end_date']

class ExportRawdataModal extends Component {
  constructor(props) {
    super(props)
  }

  render() {
    const { obj, title, isOpen, handleSubmit, fields: { start_date, end_date } } = this.props

    if (obj === null)
      return <div></div>

    return (
      <Modal
        show={isOpen} backdrop="static"
        onHide={this.props.onClose}>
        <Modal.Header closeButton>
          <Modal.Title>Export Rawdata {title}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form className="export-rawdata-form" onSubmit={handleSubmit((data) => this.props.onExport(data))}>
            <Row>
              <Col md={6}>
                <FormGroup
                  controlId="formControlsText"
                  validationState={start_date.touched && start_date.error ? 'error' : null}>
                  <Col componentClass={ControlLabel} sm={4} className="p-0">
                    From Date
                  </Col>
                  <Col sm={8}>
                    <FormControl type="text" {...start_date} placeholder="YYYY-MM-DD"/>
                    <FormControl.Feedback />
                    <HelpBlock>{start_date.touched && start_date.error ? start_date.error[0] : null}</HelpBlock>
                  </Col>
                </FormGroup>
              </Col>
              <Col md={6}>
                <FormGroup
                  controlId="formControlsText"
                  validationState={end_date.touched && end_date.error ? 'error' : null}>
                  <Col componentClass={ControlLabel} sm={4} className="p-0">
                      To Date
                  </Col>
                  <Col sm={8}>
                    <FormControl type="text" {...end_date} placeholder="YYYY-MM-DD"/>
                    <FormControl.Feedback />
                    <HelpBlock>{end_date.touched && end_date.error ? end_date.error[0] : null}</HelpBlock>
                  </Col>
                </FormGroup>
              </Col>
            </Row>
            <div className="clearfix form-actions">
              <div className="center">
                <span className="mr10">
                  <Button
                    type="submit"
                    bsStyle="danger" bsSize="small">
                    <i className="ace-icon fa fa-check bigger-110"/>
                    Export
                  </Button>
                </span>
                <Button bsStyle="default" bsSize="small" onClick={() => this.props.onClose()}>
                  <i className="ace-icon fa f bigger-110"/>
                    Cancel
                </Button>
              </div>
            </div>
          </form>
        </Modal.Body>
      </Modal>
    )
  }
}

function validateParams(data) {
  const constraints = {
    start_date: {
      presence: true
    },
    end_date: {
      presence: true
    }
  }

  return validate(data, constraints) || {}
}

ExportRawdataModal.propTypes = {
  fields: PropTypes.object,
  handleSubmit: PropTypes.func,
  isOpen: PropTypes.boolean,
  obj: PropTypes.object,
  onClose: PropTypes.func,
  onExport: PropTypes.func,
  title: PropTypes.string
}

export default reduxForm({
  form: 'export_rawdata_modal',
  fields: fields,
  validate: validateParams
})(ExportRawdataModal)

