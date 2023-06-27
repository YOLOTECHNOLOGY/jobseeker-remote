
import { serverDataScript } from 'app/models/abstractModels/FetchServierComponents'
import { buildComponentScript } from 'app/models/abstractModels/util'
import getConfigs from 'app/models/interpreters/config'
import { getDictionary } from 'get-dictionary'
import CompanyComponent from './index'
import Footer from 'components/Footer'
const configs = getConfigs([
    ['feature_banners'],
    ['company_sizes'],
    ['industry_lists'],
    ['company_financing_stage_lists']
])
const Company = async (props) => {
    const { lang }: any = props.params
    const dictionary = await getDictionary(lang)
    return <>
        <CompanyComponent lang={dictionary} langKey={lang} {...props} />
        <Footer />
    </>
}
export default configs(serverDataScript().chain((configs) =>
    buildComponentScript({ configs }, Company))
).run
