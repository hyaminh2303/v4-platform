import React, { Component, PropTypes } from 'react'
// import axios from 'axios'
import Selector from 'react-select'
import 'react-select/dist/react-select.css'

class CampaignSelector extends Component {
  constructor(props) {
    super(props)
    this.onSearchDelay = null
    // this._getOptions = this._getOptions.bind(this)
  }

  // _getOptions(input, callback) {
  //   clearTimeout(this.onSearchDelay)
  //   this.onSearchDelay = setTimeout(() => {
  //     let params = {'start_date': this.props.startDate, 'end_date': this.props.endDate}
  //     axios.get('/campaigns/options', {params}).then((resp) => {
  //       callback(null, {
  //         options: resp.data,
  //         complete: true,
  //         isLoading: false
  //       })
  //     })
  //   }, 500)
  // }


  render() {
    const { options } = this.props

    return (
      <Selector
        valueKey="id"
        labelKey="name"
        options={options}
        // asyncOptions={this._getOptions}
        value={options.length > 0 ? this.props.value : ''}
        onChange={this.props.onSelectCampaign}
        cacheAsyncResults={true} autoload={true} cache={true}
        searchPromptText="All" />
    )
  }
}

CampaignSelector.propTypes = {
  onSelectCampaign: PropTypes.func,
  options: PropTypes.array,
  value: PropTypes.string

}

export default CampaignSelector