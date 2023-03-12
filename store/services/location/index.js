import axios from 'axios'

export const getLocation = params => {

    return axios.get(`${process.env.CONFIG_URL}/geo-location`, { params })
}

// import configuredAxios from 'helpers/configuredAxios'

// export default () => {
//   const axios = configuredAxios('payment', 'protected')
//   return axios.get('/braintree/token')
// }
