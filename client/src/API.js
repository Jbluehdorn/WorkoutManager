import axios from 'axios'

export default axios.create({
	baseURL: `http://178.128.1.84:3000/api/`,
	responseType: 'json'
})
