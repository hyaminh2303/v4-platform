import validate from 'validate.js'
import moment from 'moment'

validate.extend(validate.validators.datetime, {
  parse: function(value) {
    return moment(value).startOf('day')
  },
  format: function(value) {
    return moment(value).format('YYYY-MM-DD')
  }
})

if (process.env.NODE_ENV === 'production') {
  module.exports = require('./config.prod')
} else if (process.env.NODE_ENV === 'staging') {
  module.exports = require('./config.staging')
}
else {
  module.exports = require('./config.dev')
}