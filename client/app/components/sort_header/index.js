import React, { PropTypes } from 'react'
import './style.css'

const SortTypes = {
  ASC: 'asc',
  DESC: 'desc'
}

function reverseSortDirection(sortDir) {
  return sortDir === SortTypes.DESC ? SortTypes.ASC : SortTypes.DESC
}

class SortHeader extends React.Component {
  constructor(props) {
    super(props)

    this._handleSortChange = this._handleSortChange.bind(this)
  }

  _handleSortChange(e) {
    e.preventDefault()

    if (this.props.onSortChange) {
      this.props.onSortChange(
        this.props.columnKey,
        this.props.sortDir ?
          reverseSortDirection(this.props.sortDir) :
          SortTypes.DESC
      )
    }
  }

  render() {
    const { sortDir, children } = this.props

    return (
      <a className="sorted-header" onClick={this._handleSortChange}>
        {children} {sortDir ? (sortDir === SortTypes.DESC ?
          <i className="fa fa-caret-down"/> : <i className="fa fa-caret-up"/>) : ''}
      </a>
    )
  }
}

SortHeader.propTypes = {
  children: PropTypes.string,
  columnKey: PropTypes.string,
  onSortChange: PropTypes.func,
  sortDir: PropTypes.string
}

export default SortHeader