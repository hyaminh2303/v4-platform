import React, { Component, PropTypes } from 'react'
import { FormattedNumber } from 'react-intl'

import SortHeader from '../../components/sort_header/'

class AdGroupLanguages extends Component {
  constructor(props) {
    super(props)

    this._handleSortChange = this._handleSortChange.bind(this)
  }

  _handleSortChange(columnKey, sortDir) {
    this.props.onSortLanguagesChange(this.props.languages, columnKey, sortDir)
  }

  _renderTotal() {
    const { languages, totalLanguages } = this.props
    if (languages.length > 0) {
      return (
        <tfoot>
          <tr>
            <td width="20%" className="text-right"><b>Total:</b></td>
            <td width="15%"><b><FormattedNumber value={totalLanguages.views} /></b></td>
            <td width="15%"><b><FormattedNumber value={totalLanguages.clicks} /></b></td>
            <td width="15%"><b><FormattedNumber value={totalLanguages.ctr} style="percent"
              minimumFractionDigits={2} maximumFractionDigits={2} /></b></td>
            <td width="15%"><b><FormattedNumber value={totalLanguages.landed} /></b></td>
            <td width="10%"><b><FormattedNumber value={totalLanguages.drop_out} style="percent"
              minimumFractionDigits={2} maximumFractionDigits={2} /></b></td>
          </tr>
        </tfoot>
      )
    }
  }

  _renderRow(language) {
    return (
      <tr key={language.name}>
        <td>
          {language.name}
        </td>
        <td>
          <FormattedNumber value={language.views} />
        </td>
        <td>
          <FormattedNumber value={language.clicks} />
        </td>
        <td>
          <FormattedNumber value={language.ctr} style="percent"
            minimumFractionDigits={2} maximumFractionDigits={2}/>
        </td>
        <td>
          <FormattedNumber value={language.landed} />
        </td>
        <td>
          <FormattedNumber value={language.drop_out} style="percent"
            minimumFractionDigits={2} maximumFractionDigits={2} />
        </td>
      </tr>
    )
  }

  render() {
    const { languages, sortDir, sortBy } = this.props
    const sortDirs = { [sortBy]: sortDir }

    if (languages === null)
      return (<div></div>)

    return (
      <div>
        <table className="table table-bordered table-striped">
          <thead className="thin-border-bottom">
          <tr>
            <th width="20%">
              <SortHeader
                onSortChange={this._handleSortChange}
                columnKey="name"
                sortDir={sortDirs.name}>Name
              </SortHeader>
            </th>
            <th width="15%">
              <SortHeader
                onSortChange={this._handleSortChange}
                columnKey="views"
                sortDir={sortDirs.views}>Views
              </SortHeader>
            </th>
            <th width="15%">
              <SortHeader
                onSortChange={this._handleSortChange}
                columnKey="clicks"
                sortDir={sortDirs.clicks}>Clicks
              </SortHeader>
            </th>
            <th width="15%">
              <SortHeader
                onSortChange={this._handleSortChange}
                columnKey="ctr"
                sortDir={sortDirs.ctr}>CTR
              </SortHeader>
            </th>
            <th width="15%">
              <SortHeader
                onSortChange={this._handleSortChange}
                columnKey="landed"
                sortDir={sortDirs.landed}>Landed
              </SortHeader>
            </th>
            <th width="10%">
              <SortHeader
                onSortChange={this._handleSortChange}
                columnKey="drop_out"
                sortDir={sortDirs.drop_out}>DropOut
              </SortHeader>
            </th>
            </tr>
          </thead>
          <tbody>
          {languages.length === 0 ? (
            <tr>
              <td colSpan="6" className="center">No tracking data available</td>
            </tr>) :
            languages.map((language) => this._renderRow(language))
          }
          </tbody>
          {this._renderTotal()}
        </table>
      </div>
    )
  }
}

AdGroupLanguages.propTypes = {
  languages: PropTypes.array,
  onSortLanguagesChange: PropTypes.func,
  sortBy: PropTypes.string,
  sortDir: PropTypes.string,
  totalLanguages: PropTypes.object
}

export default AdGroupLanguages