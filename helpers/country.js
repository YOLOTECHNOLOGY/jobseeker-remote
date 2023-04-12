export const getCountryKey = () => {
        const path = typeof window === 'undefined'? process.env.NEXT_PUBLIC_HOST_PATH : window.location.href
        if(path?.includes?.('.sg')){
            return 'sg'
        } else {
            return 'ph'
        }
    // return (process.env.COUNTRY_KEY) || (process.env.HOST_PATH).split('.').pop()
}