export const getCountryKey = () => {

    return (process.env.COUNTRY_KEY) || (process.env.HOST_PATH).split('.').pop()
}