import React, { Component, PropTypes } from 'react'
import DateRangePicker from 'react-bootstrap-daterangepicker'
import moment from 'moment'
import { Button } from 'react-bootstrap'

import 'react-bootstrap-daterangepicker/css/daterangepicker.css'

class DateRangeSelect extends Component {
  constructor(props) {
    super(props)

    const startDate = this.props.startDate ?
      moment(this.props.startDate, 'DD MMM YY')
      : moment().subtract(29, 'days')
    const endDate = this.props.endDate ?
      moment(this.props.endDate, 'DD MMM YY')
      : moment()

    this.state = {
      ranges: {
        'Today': [moment(), moment()],
        'Yesterday': [moment().subtract(1, 'days'), moment().subtract(1, 'days')],
        'Last 7 Days': [moment().subtract(6, 'days'), moment()],
        'Last 30 Days': [moment().subtract(29, 'days'), moment()],
        'This Month': [moment().startOf('month'), moment().endOf('month')],
        'Last Month': [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')]
      },
      startDate: startDate,
      endDate: endDate
    }
    this._handleEvent = this._handleEvent.bind(this)
  }

  _handleEvent(event, picker) {
    this.setState({
      startDate: picker.startDate,
      endDate: picker.endDate
    })
    this.props.onSelect(picker.startDate.format('DD MMM YY'),
      picker.endDate.format('DD MMM YY'))
  }

  render() {
    let start = this.state.startDate.format('DD MMM YY')
    let end = this.state.endDate.format('DD MMM YY')
    let label = start + ' - ' + end
    if (start === end) {
      label = start
    }
    return (
      <DateRangePicker
        startDate={this.state.startDate} endDate={this.state.endDate}
        ranges={this.state.ranges} onApply={this._handleEvent}>
        <Button bsStyle="danger" bsSize="sm">
          <div className="pull-left"><i className="fa fa-calendar" /></div>
          <div className="pull-right">
            <span>
              {label}
            </span>
            <span className="caret"/>
          </div>
        </Button>
      </DateRangePicker>
    )
  }
}

DateRangeSelect.propTypes = {
  endDate: PropTypes.string,
  onSelect: PropTypes.func,
  startDate: PropTypes.string
}

export default DateRangeSelect