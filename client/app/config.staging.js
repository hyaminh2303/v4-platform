import axios from 'axios'

const BASE_API_URL = 'http://52.77.126.39:80/api/v1'
axios.defaults.baseURL = BASE_API_URL

export { BASE_API_URL as default }