import React, { Component, PropTypes } from 'react'
import { FormControl, ControlLabel, FormGroup, Col, InputGroup, Button } from 'react-bootstrap'
import { reduxForm } from 'redux-form'

class UserSearchBar extends Component {
  constructor(props) {
    super(props)
    this.onSearchDelay = null
  }

  _handleSearch(data) {
    clearTimeout(this.onSearchDelay)
    this.onSearchDelay = setTimeout(function() {
      this.props.onSearch(data)
    }.bind(this), 500)
  }

  render() {
    const { fields: { query }, handleSubmit } = this.props
    query.initialValue = this.props.query

    return (
      <div>
        <form className="form-horizontal" onSubmit={handleSubmit((data) => this._handleSearch(data))}>
          <FormGroup controlId="formControlsText">
            <Col componentClass={ControlLabel} sm={2}>
              Search
            </Col>
            <Col sm={10}>
              <InputGroup>
                <FormControl type="text" {...query}
                  placeholder={query.initialValue || 'Name or Email'}
                  onKeyUp={handleSubmit((data) => this._handleSearch(data))} />
                <InputGroup.Button>
                  <Button bsSize="sm"bsStyle="danger"><i className="fa fa-search"/></Button>
                </InputGroup.Button>
              </InputGroup>
            </Col>
          </FormGroup>
        </form>
      </div>
    )
  }
}

UserSearchBar.propTypes = {
  fields: PropTypes.object,
  handleSubmit: PropTypes.func,
  onSearch: PropTypes.func.isRequired,
  query: PropTypes.string
}

UserSearchBar = reduxForm({
  form: 'search',
  fields: ['query']
})(UserSearchBar)

export default UserSearchBar