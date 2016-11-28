import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import NationalityForm from './nationality_form'
import { closeAlert } from '../../notification/notification_action'
import { clearNationality, newNationality, editNationality,
         fetchNationality, saveNationality } from '../nationality_actions'

class NationalityNew extends Component {
  constructor(props) {
    super(props)

    this._handleSave = this._handleSave.bind(this)
  }

  componentWillMount() {
    if (this.props.id) {
      this.props.editNationality(this.props.id)
    } else {
      this.props.newNationality()
    }
  }

  componentWillUnmount() {
    this.props.closeAlert()
    this.props.clearNationality()
  }

  _handleSave(nationality) {
    this.props.saveNationality(nationality)
  }

  render() {
    return (
      <div className="nationality-new">
        <div className="breadcrumbs">
          <ul className="breadcrumb">
            <li>
              <i className="ace-icon fa fa-dashboard home-icon"/>
              <a href="#/dashboard">Dashboard</a>
            </li>
            <li>
              <a href="#/nationalities">Nationalitys</a>
            </li>
            {!this.props.id ?
              <li className="active">New Nationality</li>
              :
              <li className="active">Edit Nationality</li>
            }
          </ul>
        </div>
        <div className="page-content">
          <NationalityForm
            onSave={this._handleSave}
            nationality={this.props.nationality}
            initialValues={this.props.nationality}/>
        </div>
      </div>
    )
  }
}

NationalityNew.propTypes = {
  clearNationality: PropTypes.func,
  closeAlert: PropTypes.func,
  editNationality: PropTypes.func.isRequired,
  id: PropTypes.string,
  nationality: PropTypes.object,
  newNationality: PropTypes.func.isRequired,
  saveNationality: PropTypes.func.isRequired
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({ closeAlert, clearNationality, newNationality,
    editNationality, fetchNationality, saveNationality }, dispatch)
}

function mapStateToProps(state, ownProps) {
  return {
    id: ownProps.params.id,
    nationality: state.nationality
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(NationalityNew)
