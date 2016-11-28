import React, { Component, PropTypes } from 'react'

import { Row, Col, Button } from 'react-bootstrap'
import { uniqueId } from 'lodash'

import Template from './banner_template/template'

class DynamicBannerDesign extends Component {
  constructor(props) {
    super(props)

    if (this.props.creative.elements) {
      this.props.creative.elements.forEach((element) => {
        element.id = this._generateId()
      })
    }

    this._handlePreviewImage = this._handlePreviewImage.bind(this)
  }

  componentWillReceiveProps(newProps) {
    newProps.creative.elements.forEach((element) => {
      element.id = this._generateId()
    })
  }

  _generateId() {
    return uniqueId('element_')
  }

  _handlePreviewImage() {
    const { creative, onSave } = this.props
    onSave(creative, '1', () => {
      window.open(`/#/creatives/${creative.id}/preview`)
    })
  }

  render() {
    const { fonts, timeFormats, onSave, addElement, updateElement, deleteElement,
      creative, selectElement, deselectElement } = this.props
    return (
      <Row>
        <Col sm={12}>
          <center className="mb15">
            <Template
              creative={creative}
              fonts={fonts}
              timeFormats={timeFormats}
              addElement={addElement}
              updateElement={updateElement}
              selectElement={selectElement}
              deleteElement={deleteElement}
              deselectElement={deselectElement}
              previewImage={this._handlePreviewImage}/>
          </center>
          <Button
            bsStyle="danger"
            bsSize="small"
            className="pull-right"
            onClick={() => onSave(creative, '2')}>
            <i className="ace-icon fa fa-check bigger-110"/>
            Continue
          </Button>
        </Col>
      </Row>
    )
  }
}

DynamicBannerDesign.propTypes = {
  addElement: PropTypes.func.isRequired,
  creative: PropTypes.object,
  deleteElement: PropTypes.func.isRequired,
  deselectElement: PropTypes.func.isRequired,
  fonts: PropTypes.array.isRequired,
  onSave: PropTypes.func,
  selectElement: PropTypes.func.isRequired,
  timeFormats: PropTypes.array.isRequired,
  updateElement: PropTypes.func.isRequired
}

export default DynamicBannerDesign
