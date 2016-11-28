import React, { Component, PropTypes } from 'react'
import HTML5Backend from 'react-dnd-html5-backend'
import { Button, Popover, Overlay, Tooltip, OverlayTrigger } from 'react-bootstrap'
import { DropTarget, DragDropContext } from 'react-dnd'
import Element from './element'
import ElementForm from './element_form'
import { findDOMNode } from 'react-dom'
import * as ElementConstants from './element_constants'

const styles = {
  position: 'relative'
}

const boxTarget = {
  drop(props, monitor, component) {
    const item = monitor.getItem()
    const delta = monitor.getDifferenceFromInitialOffset()
    const x = Math.round(item.x + delta.x)
    const y = Math.round(item.y + delta.y)
    component._moveBox(item.index, x, y)
  }
}

function collect(connect) {
  return {
    connectDropTarget: connect.dropTarget()
  }
}

class Template extends Component {
  constructor(props) {
    super(props)
    this._handleChangeElement = this._handleChangeElement.bind(this)
    this._handleRemoveElement = this._handleRemoveElement.bind(this)
    this._renderPopover = this._renderPopover.bind(this)
    this._closePopover = this._closePopover.bind(this)
  }

  _moveBox(index, x, y) {
    let element = this.props.creative.elements[index]
    element.x = x
    element.y = y

    this._handleChangeElement(element, index)
  }

  _handleChangeElement(element, index, needClosePopup = true) {
    this.props.updateElement(this.props.creative, index, element, needClosePopup)
  }

  _handleRemoveElement(index) {
    this.props.deleteElement(this.props.creative, index)
  }

  _closePopover() {
    const { creative, deselectElement } = this.props
    deselectElement(creative)
  }

  _renderPopover() {
    const { creative: { elements, selectedElementIndex }, fonts, timeFormats } = this.props
    let isOpen = selectedElementIndex != null ? true : false
    if (isOpen) {
      let selectedElement = elements[selectedElementIndex]
      let elementSize = elements.length
      return (
        <Overlay
          show={isOpen}
          target={() => findDOMNode(this.refs[selectedElementIndex])}
          placement="bottom"
          container={this}
          rootClose
          onHide={() => this._closePopover()}
          containerPadding={20}>
          <Popover id="element-popover" className="element-popover">
            <ElementForm
              index={selectedElementIndex}
              onChangeElement={this._handleChangeElement}
              onRemoveElement={this._handleRemoveElement}
              fonts={fonts}
              timeFormats={timeFormats}
              elementSize={elementSize}
              element={selectedElement} />
          </Popover>
        </Overlay>
      )
    }
  }

  render() {
    const { connectDropTarget, addElement, previewImage, creative,
      selectElement, creative: { elements } } = this.props
    styles.width = creative.width
    styles.height = creative.height
    return connectDropTarget(
      <div style={styles} className="banner-template">
        <img className="banner-preview"
          src={`${creative.banner_url}?${Math.random()}`}/>
        <div className="list-btn">
          <OverlayTrigger placement="top" overlay={<Tooltip id="cp-ad-tag">Location Element</Tooltip>}>
            <Button
              bsStyle="success"
              bsSize="xsmall"
              className="btn-add-element"
              onClick={() => addElement(this.props.creative)}>
              <i className="ace-icon fa fa-map-marker bigger-110"/>
            </Button>
          </OverlayTrigger>
          <OverlayTrigger placement="top" overlay={<Tooltip id="cp-ad-tag">Transportation Element</Tooltip>}>
            <Button
              bsStyle="success"
              bsSize="xsmall"
              className="btn-transportation"
              onClick={() => addElement(this.props.creative, ElementConstants.TRANSPORTATION)}>
              <i className="ace-icon fa fa-car bigger-110"/>
            </Button>
          </OverlayTrigger>
          <OverlayTrigger placement="top" overlay={<Tooltip id="cp-ad-tag">Time Element</Tooltip>}>
            <Button
              bsStyle="success"
              bsSize="xsmall"
              className="btn-add-time-element"
              onClick={() => addElement(creative, ElementConstants.TIME)}>
              <i className="ace-icon fa fa-clock-o bigger-110"/>
            </Button>
          </OverlayTrigger>
          <OverlayTrigger placement="top" overlay={<Tooltip id="cp-ad-tag">Weather Element</Tooltip>}>
            <Button
              bsStyle="success"
              bsSize="xsmall"
              className="btn-weather"
              onClick={() => {
                return addElement(creative, ElementConstants.WEATHER)
              }}>
              <i className="ace-icon fa fa-cloud bigger-110"/>
            </Button>
          </OverlayTrigger>
          <OverlayTrigger placement="top" overlay={<Tooltip id="cp-ad-tag">Preview</Tooltip>}>
            <Button
              bsStyle="danger"
              bsSize="xsmall"
              className="btn-preview"
              onClick={() => previewImage()}>
              <i className="ace-icon fa fa-eye bigger-110"/>
            </Button>
          </OverlayTrigger>
        </div>
        {elements.map((element, index) => {
          const { id, text } = element
          return (
            <Element
              key={id}
              ref={index}
              index={index}
              element={element}
              creative={creative}
              selectElement={selectElement}
              closePopover={this._closePopover}>
              {text}
            </Element>
          )
        })}
        {this._renderPopover()}
      </div>
    )
  }
}

Template.propTypes = {
  addElement: PropTypes.func.isRequired,
  connectDropTarget: PropTypes.func.isRequired,
  creative: PropTypes.object.isRequired,
  deleteElement: PropTypes.func.isRequired,
  deselectElement: PropTypes.func.isRequired,
  fonts: PropTypes.array.isRequired,
  previewImage: PropTypes.func,
  selectElement: PropTypes.func.isRequired,
  timeFormats: PropTypes.array.isRequired,
  updateElement: PropTypes.func.isRequired
}

export default DragDropContext(HTML5Backend)(DropTarget('box', boxTarget, collect)(Template))
