import axios from 'axios'
const baseURL = 'http://localhost:8001/'

const axiosInstance = axios.create({
  baseURL,
})

export default axiosInstance
