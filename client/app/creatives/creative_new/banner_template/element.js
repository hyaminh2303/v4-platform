import React, { Component, PropTypes } from 'react'
import { DragSource } from 'react-dnd'

let style = {
  position: 'absolute',
  border: '1px dotted white',
  lineHeight: '1.2',
  background: 'rgba(0,0,0,0)',
  cursor: 'move'
}

const boxSource = {
  beginDrag(props) {
    const { index, element:{ x, y } } = props
    return { index, x, y }
  }
}

function collect(connect, monitor) {
  return {
    connectDragSource: connect.dragSource(),
    connectDragPreview: connect.dragPreview(),
    isDragging: monitor.isDragging()
  }
}

class Element extends Component {
  constructor(props) {
    super(props)
  }

  render() {
    const { element, connectDragSource, isDragging, children, selectElement, creative, index } = this.props
    if (isDragging) {
      return null
    }
    style.left = `${element.x}px`
    style.top = `${element.y}px`
    style.fontSize = `${element.font_size}px`
    style.color = element.color
    style.fontWeight = element.font_weight
    style.fontFamily = element.font
    style.fontStyle = element.font_style

    let boxStyle = { textAlign: element.text_align }
    if ( !!element.box_width ) {
      boxStyle.width = `${element.box_width}px`
    }

    return connectDragSource(
      <div style={style} onClick={() => selectElement(creative, index)}>
        <div style={boxStyle} >
          {children}
        </div>
      </div>
    )
  }
}

Element.propTypes = {
  children: PropTypes.node,
  closePopover: PropTypes.func.isRequired,
  connectDragSource: PropTypes.func.isRequired,
  creative: PropTypes.object,
  element: PropTypes.object.isRequired,
  index: PropTypes.any.isRequired,
  isDragging: PropTypes.bool.isRequired,
  selectElement: PropTypes.func.isRequired
}

export default DragSource('box', boxSource, collect)(Element)