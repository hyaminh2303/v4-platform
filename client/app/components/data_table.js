import React, { PropTypes, Component } from 'react'
import { Table } from 'fixed-data-table'
import Dimensions from 'react-dimensions'

class DataTable extends Component {
  render() {
    const { children, containerWidth, headerHeight, rowHeight, rowsCount } = this.props
    return (
      <Table
        {...this.props}
        width={containerWidth}
        height={headerHeight + rowHeight * rowsCount + 2}>
        {children}
      </Table>
    )
  }
}

DataTable.propTypes = {
  children: PropTypes.array,
  containerStyle: PropTypes.object,
  containerWidth: PropTypes.number,
  headerHeight: PropTypes.number,
  refreshRate: React.PropTypes.number,
  rowHeight: PropTypes.number,
  rowsCount: PropTypes.number
}

export default Dimensions()(DataTable)