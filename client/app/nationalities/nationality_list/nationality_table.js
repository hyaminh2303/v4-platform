import React, { Component, PropTypes } from 'react'
import { Pagination, DropdownButton } from 'react-bootstrap'
import { Link } from 'react-router'

import Confirm from '../../confirm/confirm'
import SortHeader from '../../components/sort_header/'

class NationalityTable extends Component {
  constructor(props) {
    super(props)

    this.state = { showConfirm: false,
      titleConfirm: '',
      currentNationality: null }

    this._handlePageChange = this._handlePageChange.bind(this)
    this._handleSortChange = this._handleSortChange.bind(this)
    this._handleConfirm = this._handleConfirm.bind(this)
  }

  _handleConfirm(status) {
    if (status) {
      this.props.onDeleteNationality(this.state.currentNationality.id)
    }
    this.setState({ showConfirm: false,
      titleConfirm: '' })
  }

  _handlePageChange(page) {
    this.props.onPageChange(page)
  }

  _handleSortChange(columnKey, sortDir) {
    this.props.onSortChange(columnKey, sortDir)
  }

  _openConfirm(nationality) {
    this.setState({ showConfirm: true,
      titleConfirm: `Are you sure you want to delete the nationality: ${nationality.name} ?`,
      currentNationality: nationality })
  }

  _renderRow(nationality) {
    return (
      <tr key={nationality.id}>
        <td>
          {nationality.name}
        </td>
        <td>
          {JSON.stringify(nationality.locales)}
        </td>
        <td>
          <DropdownButton
            bsStyle="default"
            bsSize="xs"
            title={<i className="fa fa-cogs"/>}
            id="nationality_actions"
            pullRight>
            <li>
              <Link to={`/nationalities/${nationality.id}/edit`}>
                <i className="fa fa-edit"/> Edit
              </Link>
            </li>
            <li>
              <a onClick={() => { this._openConfirm(nationality) }}>
                <i className="fa fa-trash"/> Delete
              </a>
            </li>
          </DropdownButton>
        </td>
      </tr>
    )
  }

  render() {
    const { nationalities, page, total, sortBy, sortDir, per_page } = this.props
    const sortDirs = { [sortBy]: sortDir }
    let total_page = Math.ceil(total / per_page)

    return (
      <div>
        <Confirm isShow={this.state.showConfirm}
          title={this.state.titleConfirm}
          onResult={this._handleConfirm}/>
        <table className="table table-bordered table-striped">
          <thead className="thin-border-bottom">
            <tr>
              <th>
                <SortHeader
                  onSortChange={this._handleSortChange}
                  columnKey="name"
                  sortDir={sortDirs.name}>Name</SortHeader>
              </th>
              <th>
                Locales
              </th>
              <th className="actions"/>
            </tr>
          </thead>
          <tbody>
            {nationalities.length === 0 ? (
              <tr>
                <td colSpan="2" className="center">No nationality available</td>
              </tr>) :
              nationalities.map((nationality) => this._renderRow(nationality))
            }
          </tbody>
        </table>
        <div id="react-paginate" className="pull-right">
          <Pagination
            prev="<"
            next=">"
            first="<<"
            last=">>"
            ellipsis="..."
            boundaryLinks
            items={total_page}
            maxButtons={5}
            activePage={page}
            onSelect={this._handlePageChange} />
        </div>
      </div>
    )
  }
}

NationalityTable.propTypes = {
  nationalities: PropTypes.array,
  onDeleteNationality: PropTypes.func,
  onPageChange: PropTypes.func,
  onSortChange: PropTypes.func,
  page: PropTypes.number,
  per_page: PropTypes.number,
  sortBy: PropTypes.string,
  sortDir: PropTypes.string,
  total: PropTypes.number
}

export default NationalityTable