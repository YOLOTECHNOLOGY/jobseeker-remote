
import config from 'app/[lang]/interpreters/config'
const usedConfigProps = [
    ['location_lists'],
    ['main_functions'],
    ['degrees'],
    ['xp_lvls'],
    ['country_lists'],
    ['industry_lists'],
    ['company_financing_stage_lists'],
    ['company_sizes'],
    ['main_job_function_lists'],
    ['country_lists']
]
export default config(usedConfigProps)