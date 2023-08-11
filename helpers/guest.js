import { guestLogin as guestServices } from 'store/services/auth/newLogin'
import FingerprintJS from '@fingerprintjs/fingerprintjs'
import { useUserAgent } from 'next-useragent'
import { getCountryId, getLanguageId } from './country'
import { getCookie } from 'helpers/cookies'

export const getDeviceUuid = async () => {
    let deviceId = localStorage.getItem('uuid')
    if (!deviceId) {
        const fpPromise = FingerprintJS.load()
        const fp = await fpPromise
        const result = await fp.get()
        deviceId = result.visitorId
        localStorage.setItem('uuid', deviceId)
    }
    return deviceId
}

const guestLogin = async (token) => {
    const deviceId = await getDeviceUuid()
    const browser = useUserAgent?.()?.browser
    const accessToken = getCookie('accessToken')
    if (accessToken) return

    guestServices({
        guest_role: 'jobseeker',
        //  guest_id: '',
        country_id: getCountryId(),
        language_id: getLanguageId(),
        // currency_id: "",
        fcm_token_web: token,
        device_name: browser,
        device_type: "web",
        device_udid: deviceId,
    }).then(res => {
        console.log(res);
    }).catch(err => console.log(err))
}

export default guestLogin