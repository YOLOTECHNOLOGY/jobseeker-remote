export const getCountryKey = () => {
        if(process.env.HOST_PATH.includes('.sg')){
            return 'sg'
        } else {
            return 'ph'
        }
    // return (process.env.COUNTRY_KEY) || (process.env.HOST_PATH).split('.').pop()
}