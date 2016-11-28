import React, { Component, PropTypes } from 'react'
import axios from 'axios'
import Select from 'react-select'

import 'react-select/dist/react-select.css'

class RoleSelector extends Component {
  constructor(props) {
    super(props)
    this.state = { roles: [], selected: { name: props.initialText } }

    this._search = this._search.bind(this)
  }

  componentWillMount() {
    this._search()
  }

  //componentWillReceiveProps(nextProps) {
  //  let selected = this.state.selected
  //  this.setState({ selected: extend(selected, { name: nextProps.initialText }) })
  //}

  _search(callback) {
    axios.get('/roles').then((resp) => {
      this.setState({ roles: resp.data }, callback)
    })
  }

  render() {
    //const { onChange } = this.props
    return (
      <Select.Async loadOptions={this._loadData}/>
    )
  }
}

RoleSelector.propTypes = {
  initialText: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired
}

export default RoleSelector