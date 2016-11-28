import React, { PropTypes, Component } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { replace } from 'react-router-redux'
import NationalityTable from './nationality_table'
import { fetchNationalityList, clearNationalities, deleteNationality } from '../nationality_actions'
import { Button, InputGroup, FormControl, Row, Col } from 'react-bootstrap'
import Notification from '../../notification/'
const queryString = require('query-string')


class NationalityList extends Component {
  constructor(props) {
    super(props)

    this._handleDeleteNationality = this._handleDeleteNationality.bind(this)
    this._handlePageChange = this._handlePageChange.bind(this)
    this._handleSortChange = this._handleSortChange.bind(this)
  }

  componentWillMount() {
    const { initParams } = this.props
    this._refresh(initParams)
  }

  componentWillUnmount() {
    this.props.clearNationalities()
  }

  _refresh(params) {
    const { initParams, replace, fetchNationalityList } = this.props

    if (params.query === undefined) {
      params.query = initParams.query || ''
    }
    params.page = params.page || initParams.page || 1
    params.sort_by = params.sort_by || initParams.sort_by
    params.sort_dir = params.sort_dir || initParams.sort_dir

    const params_str = queryString.stringify(params)

    replace(`/nationalities?${params_str}`)

    fetchNationalityList(params)
  }

  _handleDeleteNationality(nationality_id) {
    this.props.deleteNationality(nationality_id, () => {
      this._refresh(this.props.initParams)
    })
  }

  _handlePageChange(page) {
    this._refresh({ page: page })
  }

  _handleSortChange(columnKey, sortDir) {
    this._refresh({ page: 1, sort_by: columnKey, sort_dir: sortDir })
  }

  _handleSearch(query) {
    clearTimeout(this.onSearchDelay)
    this.onSearchDelay = setTimeout(function() {
      this._refresh({ page: 1, query: query })
    }.bind(this), 500)
  }
  render() {
    const { nationalities, initParams, session } = this.props

    return (
      <div className="nationality-list">
        <div className="breadcrumbs">
          <ul className="breadcrumb">
            <li>
              <i className="ace-icon fa fa-dashboard home-icon"/>
              <a href="#/dashboard">Dashboard</a>
            </li>
            <li className="active">Nationality</li>
          </ul>
        </div>
        <div className="page-content">
          <div className="page-header text-danger">
            <h1>Nationality</h1>
          </div>
          <Row>
            <Col md={3}>
              <Button bsStyle="danger" bsSize="sm" href="#/nationalities/new">
                <i className="fa fa-plus-circle" /> New Nationality
              </Button>
            </Col>
            <Col md={5} mdOffset={4}>
              <InputGroup>
                <FormControl type="text"
                  defaultValue={this.props.location.query.query}
                  placeholder="Search nationality"
                  onChange={(e) => this._handleSearch(e.target.value)} />
                <InputGroup.Button>
                  <Button bsSize="sm"bsStyle="danger"><i className="fa fa-search"/></Button>
                </InputGroup.Button>
              </InputGroup>
            </Col>
          </Row>
          <div className="clearfix"></div>
          <br />
          <Notification/>
          <NationalityTable
            nationalities={nationalities.data}
            page={nationalities.page}
            per_page={nationalities.per_page}
            total={nationalities.total}
            sortBy={initParams.sort_by}
            sortDir={initParams.sort_dir}
            token={session.auth_token}
            onPageChange={this._handlePageChange}
            onSortChange={this._handleSortChange}
            onDeleteNationality={this._handleDeleteNationality}/>
          <div className="clearfix"></div>
        </div>
      </div>
    )
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({ fetchNationalityList, clearNationalities, deleteNationality, replace }, dispatch)
}


function mapStateToProps(state, ownProps) {
  const { query } = ownProps.location
  return {
    nationalities: state.nationalities,
    session: state.session,
    initParams: {
      page: (query.page ? parseInt(query.page) : 1),
      sort_by: query.sort_by || '',
      sort_dir: query.sort_dir || '',
      query: query.query || ''
    }
  }
}

NationalityList.propTypes = {
  clearNationalities: PropTypes.func,
  deleteNationality: PropTypes.func,
  fetchNationalityList: PropTypes.func.isRequired,
  initParams: PropTypes.object,
  location: PropTypes.object,
  nationalities: PropTypes.object,
  page: PropTypes.number,
  replace: PropTypes.func,
  session: PropTypes.object,
  sortBy: PropTypes.string
}

export default connect(mapStateToProps, mapDispatchToProps)(NationalityList)


