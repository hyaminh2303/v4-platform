import React, { Component, PropTypes } from 'react'
import { Modal, Button } from 'react-bootstrap'

class Confirm extends Component {
  constructor(props) {
    super(props)
  }

  render() {
    return (
      <div>
        <Modal
          show={this.props.isShow}
          onHide={() => { this.props.onResult(false) }}
          dialogClassName="confirm-modal">
          <Modal.Header closeButton>
            <Modal.Title id="confirm-modal-title-lg">{this.props.title}</Modal.Title>
          </Modal.Header>
          <Modal.Footer>
            <Button bsStyle="danger" onClick={() => { this.props.onResult(true) }}>Ok</Button>
            <Button onClick={() => { this.props.onResult(false) }}>Cancel</Button>
          </Modal.Footer>
        </Modal>
      </div>
    )
  }
}

Confirm.propTypes = {
  isShow: PropTypes.bool,
  onResult: PropTypes.func,
  title: PropTypes.string
}

export default Confirm