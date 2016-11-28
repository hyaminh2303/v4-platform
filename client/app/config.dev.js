import axios from 'axios'

const BASE_API_URL = 'http://localhost:3000/api/v1'

axios.defaults.baseURL = BASE_API_URL

export { BASE_API_URL as default }