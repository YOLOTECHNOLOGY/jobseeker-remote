import { getCountry } from 'helpers/country'
import ResetPassword from './reset-password'

export const getServerSideProps = () => {
    return {
        props: {
            seoMetaTitle: 'Reset Password - Bossjob',
            seoMetaDescription: `Bossjob - Career Platform for Professionals in ${getCountry()}`,
            canonicalUrl: '/reset-password'
        }
    }
}

export default ResetPassword