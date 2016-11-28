import axios from 'axios'

const BASE_API_URL = 'http://dashboard-api.ap-southeast-1.elasticbeanstalk.com/api/v1'
axios.defaults.baseURL = BASE_API_URL

export { BASE_API_URL as default }