import { getCookie } from "./cookies";
import { getCountryKey, getLang, getLanguageCode } from "./country";


const linkToHunt = (redirect) => {
    // getCountyKey ,getLangKey 获取 county 和 lang
    const county = getCountryKey();
    const langKey = getLang()
    const lang = getLanguageCode(langKey);
    // 从cookie中获取accessToken和refreshToken
    const accessToken = getCookie('accessToken');
    // 如果accessToken和refreshToken都存在
    if (accessToken) {
        // 跳转 process.env.BOSSHUNT_URL 参数 county lang accessToken refreshToken redirect
        // process.env.BOSSHUNT_URL
        return `${'http://localhost:4000'}/keep-login?country=${county}&lang=${lang}&accessToken=${accessToken}&redirect=${redirect === 'boss' ? '' : redirect}`
    } else {
        // 跳转 process.env.BOSSHUNT_URL 参数 county lang redirect
        return `${'http://localhost:4000'}/${redirect}?country=${county}&lang=${lang}`
    }
}
export default linkToHunt;