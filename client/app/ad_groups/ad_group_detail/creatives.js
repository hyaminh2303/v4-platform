import React, { Component, PropTypes } from 'react'
import { Table, DropdownButton, MenuItem, Button,
  OverlayTrigger, Popover } from 'react-bootstrap'
import { FormattedNumber } from 'react-intl'

import CreativeNew from '../../creatives/creative_new/creative_new'
import { TRACKING_TYPES } from '../../app_constants'
import Confirm from '../../confirm/confirm'
import SortHeader from '../../components/sort_header/'
import BASE_API_URL from '../../config'
import './style.css'
import ExportRawdataModal from './../../components/export_rawdata_modal'
const moment = require('moment')

class Creatives extends Component {
  constructor(props) {
    super(props)
    this.state = { isShow: false, creative: { elements: [] }, activeKey: '1',
                   currentTracker: TRACKING_TYPES.tracking_link,
                   showConfirm: false, titleConfirm: '',
                   currentCreative: null, isOpenExport: false, exportTitle: null }

    this._handleNew = this._handleNew.bind(this)
    this._handleClose = this._handleClose.bind(this)
    this._renderRow = this._renderRow.bind(this)
    this._handleCreative = this._handleCreative.bind(this)
    this._handleOnChangePanel = this._handleOnChangePanel.bind(this)
    this._handleChangeTracker = this._handleChangeTracker.bind(this)
    this._handleConfirm = this._handleConfirm.bind(this)
    this._handleSortChange = this._handleSortChange.bind(this)

    this._handleExportRawdata = this._handleExportRawdata.bind(this)
    this._handleCloseExportRawDataModal = this._handleCloseExportRawDataModal.bind(this)
    this._handleSubmitExportRawData = this._handleSubmitExportRawData.bind(this)
  }

  _handleSubmitExportRawData(data) {
    const token = this.props.session.auth_token
    window.open(`${BASE_API_URL}/creatives/${this.state.currentCreative.id}/export_raw_data?token=${token}&start_date=${data.start_date}&end_date=${data.end_date}`)
    this.setState({ isOpenExport: false, currentCreative: null, exportTitle: null })
  }

  _handleExportRawdata(creative) {
    this.setState({ isOpenExport: true, currentCreative: creative,
                    exportTitle: `Creative: ${creative.name}` })
  }

  _handleCloseExportRawDataModal() {
    this.setState({ isOpenExport: false })
  }

  _handleSortChange(columnKey, sortDir) {
    this.props.onSortChange(this.props.creatives, columnKey, sortDir)
  }

  _handleConfirm(status) {
    if (status)
      this.props.deleteCreative(this.state.currentCreative)

    this.setState({ showConfirm: false,
      titleConfirm: '' })
  }
  _openConfirm(creative) {
    this.setState({ showConfirm: true,
      titleConfirm: `Are you sure you want to delete the Creative ${creative.name} ?`,
      currentCreative: creative })
  }
  _handleCreative(creative, activeKey = '1') {
    this.props.editCreative(creative)
    this.setState({ isShow: true, activeKey: activeKey })
  }

  _handleNew() {
    this.props.newCreative(this.props.adGroupId)
    this.setState({ isShow: true, activeKey: '1' })
  }

  _handleClose() {
    this.setState({ isShow: false })
    this.props.closeAlert()
  }

  _handleOnChangePanel(activeKey) {
    this.setState({ activeKey: activeKey })
  }

  _getStatus(creative) {
    if (creative.total_banners === 0 && creative.processed_banners === 0)
      return 'Enqueue'
    if (creative.processed_banners >= creative.total_banners)
      return 'Success'
    else
      return 'Processing'
  }

  _renderRow(creative, token) {
    return (
      <tr key={creative.id}>
        <td>{creative.name}</td>
        <td className="capitialize">
          {creative.creative_type}
        </td>
        <td>
          <div className = "creative-thumbnail">
            <OverlayTrigger trigger="click" rootClose
              placement="right"
              overlay={<Popover id={creative.id}>
                <img src={`${creative.banner_url}?k=${Math.random()}`} className="popover-img"/>
                </Popover>}>
              <img src={`${creative.banner_url}?k=${Math.random()}`} className="small-img"/>
            </OverlayTrigger>
          </div>
        </td>
        <td>
          <div className="creative-landing-url">{creative.landing_url}</div>
        </td>
        <td><FormattedNumber value={creative.views || 0} /></td>
        <td><FormattedNumber value={creative.clicks || 0} /></td>
        <td><FormattedNumber value={creative.ctr || 0} style="percent"
          minimumFractionDigits={2} maximumFractionDigits={2} /></td>
        <td><FormattedNumber value={creative.landed || 0} /></td>
        <td><FormattedNumber value={creative.drop_out || 0} style="percent"
          minimumFractionDigits={2} maximumFractionDigits={2} /></td>
        <td>
          <DropdownButton
            bsStyle="default" bsSize="xs"
            title={<i className="fa fa-cogs"/>}
            id="banner_actions" pullRight>
            <MenuItem eventKey="1" onSelect={() => this._handleCreative(creative, '1')}>Edit</MenuItem>
            <li>
              <a onClick={() => this._handleExportRawdata(creative)}>
                Export Raw Data
              </a>
            </li>
            <MenuItem eventKey="2" onSelect={() => this._handleCreative(creative, '3')}>Generate Ad Tag</MenuItem>
            <MenuItem eventKey="3" onSelect={() => { this._openConfirm(creative) }}>Delete</MenuItem>
          </DropdownButton>
        </td>
      </tr>
    )
  }

  _handleChangeTracker(tracker) {
    this.setState({ currentTracker: tracker })
  }

  _renderTotal() {
    const { creatives, summaryCreatives } = this.props
    if (creatives.length > 0) {

      return (
        <tfoot>
          <tr>
            <td colSpan="4" className="text-right"><b>Total:</b></td>
            <td><b><FormattedNumber value={summaryCreatives.views || 0} /></b></td>
            <td><b><FormattedNumber value={summaryCreatives.clicks || 0} /></b></td>
            <td><b><FormattedNumber value={summaryCreatives.ctr || 0} style="percent"
              minimumFractionDigits={2} maximumFractionDigits={2} /></b></td>
            <td><b><FormattedNumber value={summaryCreatives.landed || 0} /></b></td>
            <td><b><FormattedNumber value={summaryCreatives.drop_out || 0} style="percent"
              minimumFractionDigits={2} maximumFractionDigits={2} /></b></td>
            <td></td>
          </tr>
        </tfoot>
      )
    }
  }

  render() {
    const { adGroupId, creatives, sortBy, sortDir, session } = this.props
    const sortDirs = { [sortBy]: sortDir }
    if (creatives === null)
      return (
        <div>
          <Button bsStyle="danger" bsSize="sm" onClick={this._handleNew}>
            <i className="fa fa-plus-circle"/> New Creative
          </Button>
        </div>
      )

    let initialValuesExportRawData = {}
    if (this.state.currentCreative !== null) {
      const { start_date, end_date } = this.props.adGroup
      initialValuesExportRawData = {
        start_date: moment(start_date).format('YYYY-MM-D'),
        end_date:  moment(end_date).format('YYYY-MM-D')
      }
    }

    return (
      <div>
        <Button bsStyle="danger" bsSize="sm" onClick={this._handleNew}>
          <i className="fa fa-plus-circle"/> New Creative
        </Button>
        <Confirm isShow={this.state.showConfirm}
          title={this.state.titleConfirm}
          onResult={this._handleConfirm}/>
        <div className="creative-clearfix"></div>
        <Table className="table-bordered table-striped">
          <thead>
            <tr>
              <th>
                <SortHeader
                  onSortChange={this._handleSortChange}
                  columnKey="name"
                  sortDir={sortDirs.name}>Name</SortHeader>
              </th>
              <th>
                <SortHeader
                  onSortChange={this._handleSortChange}
                  columnKey="creative_type"
                  sortDir={sortDirs.creative_type}>Creative Type</SortHeader>
              </th>
              <th className="text-center">Banner</th>
              <th>
                <SortHeader
                  onSortChange={this._handleSortChange}
                  columnKey="landing_url"
                  sortDir={sortDirs.landing_url}>Landing URL</SortHeader>
              </th>
              <th>
                <SortHeader
                  onSortChange={this._handleSortChange}
                  columnKey="views"
                  sortDir={sortDirs.views}>Views</SortHeader>
              </th>
              <th>
                <SortHeader
                  onSortChange={this._handleSortChange}
                  columnKey="clicks"
                  sortDir={sortDirs.clicks}>Clicks</SortHeader>
              </th>
              <th>
                <SortHeader
                  onSortChange={this._handleSortChange}
                  columnKey="ctr"
                  sortDir={sortDirs.ctr}>CTR</SortHeader>
              </th>
              <th>
                <SortHeader
                  onSortChange={this._handleSortChange}
                  columnKey="landed"
                  sortDir={sortDirs.landed}>Landed</SortHeader>
              </th>
              <th>
                <SortHeader
                  onSortChange={this._handleSortChange}
                  columnKey="drop_out"
                  sortDir={sortDirs.drop_out}>DropOut</SortHeader>
              </th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {creatives.length === 0 ? (
              <tr>
                <td colSpan="10" className="center">No creative available</td>
              </tr>) :
              creatives.map((creative) => this._renderRow(creative, session.auth_token))
            }
          </tbody>
          {this._renderTotal()}
        </Table>

        <CreativeNew
          isOpen={this.state.isShow}
          onClose={this._handleClose}
          adGroupId={adGroupId}
          activeKey={this.state.activeKey}
          onChangePanel={this._handleOnChangePanel}
          onHandleCreative={this._handleCreative}
          currentTracker={this.state.currentTracker}
          onChangeTracker={this._handleChangeTracker}
          session={session}/>

          <ExportRawdataModal isOpen={this.state.isOpenExport}
            title={this.state.exportTitle}
            obj={this.state.currentCreative}
            onExport={this._handleSubmitExportRawData}
            onClose={this._handleCloseExportRawDataModal}
            initialValues={initialValuesExportRawData}/>
      </div>
    )
  }
}

Creatives.propTypes = {
  adGroup: PropTypes.object,
  adGroupId: PropTypes.string,
  closeAlert: PropTypes.func,
  creatives: PropTypes.array,
  deleteCreative: PropTypes.func,
  editCreative: PropTypes.func,
  newCreative: PropTypes.func,
  onSortChange: PropTypes.func,
  session: PropTypes.object,
  sortBy: PropTypes.string,
  sortDir: PropTypes.string,
  summaryCreatives: PropTypes.object
}

export default Creatives
