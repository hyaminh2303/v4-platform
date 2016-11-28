if (process.env.NODE_ENV === 'development') {
  module.exports = require('./configure_store.prod')
} else {
  module.exports = require('./configure_store.prod')
}