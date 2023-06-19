
import { serverDataScript } from 'app/[lang]/abstractModels/FetchServierComponents'
import { buildComponentScript } from 'app/[lang]/abstractModels/util'
import getConfigs from 'app/[lang]/interpreters/config'
import { getDictionary } from 'get-dictionary'
import interpreter from './interpreter'
import CompanyComponent from './index'
const configs = getConfigs([
    ['feature_banners'],
    ['company_sizes'],
    ['industry_lists'],
    ['company_financing_stage_lists']
])
const Company = async (props) => {
    const { lang }: any = props.params
    const dictionary = await getDictionary(lang)
    return <CompanyComponent lang={dictionary} langKey={lang} {...props} />
}
export default configs(serverDataScript()).chain((configs) =>
    interpreter(serverDataScript()
        .chain(companyData => buildComponentScript({ configs, companyData }, Company)))
).run
