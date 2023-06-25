
import config from 'app/models/interpreters/config'
const usedConfigProps = [
    ['location_lists'],
    ['main_functions'],
    ['degrees'],
    ['xp_lvls'],
    ['country_lists'],
    ['industry_lists'],
    ['company_financing_stage_lists'],
    ['company_sizes'],
    ['job_benefit_lists'],
    ['job_types'],
]
export default config(usedConfigProps)