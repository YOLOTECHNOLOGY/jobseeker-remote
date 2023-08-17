import { getCookie } from "./cookies";
import { getCountryKey, getLang, getLanguageCode } from "./country";


const linkToHunt = (redirect) => {
    // getCountyKey ,getLangKey 获取 county 和 lang
    const county = getCountryKey();
    const langKey = getLang()
    const lang = getLanguageCode(langKey);
    // 从cookie中获取accessToken和refreshToken
    const accessToken = getCookie('accessToken');
    const refreshToken = getCookie('refreshToken');
    console.log({ accessToken, refreshToken })
    // 如果accessToken和refreshToken都存在
    if (accessToken && refreshToken) {
        // 跳转 process.env.BOSSHUNT_URL 参数 county lang accessToken refreshToken redirect
        return `${process.env.BOSSHUNT_URL}/keep-login?country=${county}&lang=${lang}&accessToken=${accessToken}&refreshToken=${refreshToken}&redirect=${redirect}`
    } else {
        // 跳转 process.env.BOSSHUNT_URL 参数 county lang redirect
        return `${process.env.BOSSHUNT_URL}/${redirect}?country=${county}&lang=${lang}`
    }
}
export default linkToHunt;