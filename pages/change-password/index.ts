import { getCountry } from 'helpers/country'
import ChangePassword from './change-password'

export const getServerSideProps = () => {
    return {
        props: {
            seoMetaTitle: 'Change Password - Bossjob',
            seoMetaDescription: `Bossjob - Career Platform for Professionals in ${getCountry()}`,
            canonicalUrl: '/change-password'
        }
    }
}

export default ChangePassword