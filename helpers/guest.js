import { guestLogin as guestServices } from 'store/services/auth/newLogin'
import FingerprintJS from '@fingerprintjs/fingerprintjs'
import { useUserAgent } from 'next-useragent'
import { getCountryId, getLanguageId } from './country'
import { getCookie } from 'helpers/cookies'
const guestLogin = async (token) => {
    let deviceUdid = localStorage.getItem('uuid')
    if (!deviceUdid) {
        const fpPromise = FingerprintJS.load()
        const fp = await fpPromise
        const result = await fp.get()
        deviceUdid = result.visitorId
        localStorage.setItem('uuid', deviceUdid)
    }
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
        device_udid: deviceUdid,
    }).then(res => {
        console.log(res);
    }).catch(err => console.log(err))
}

export default guestLogin