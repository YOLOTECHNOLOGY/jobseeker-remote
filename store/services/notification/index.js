import axios from 'axios'
import { getCookie } from 'helpers/cookies'

export const pushNotification = params => {
    const accessToken = getCookie('accessToken')
    const headers = {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'multipart/form-data'
    }
    const formData = new FormData()
    Object.keys(params).forEach(key => {
        const value = params[key]
        formData.set(key, value)
    })

    return axios.post(`${process.env.NOTIFICTION_URL}/offline-push/send`, formData, {
        headers: headers
    })
}

// import configuredAxios from 'helpers/configuredAxios'

// export default () => {
//   const axios = configuredAxios('payment', 'protected')
//   return axios.get('/braintree/token')
// }
