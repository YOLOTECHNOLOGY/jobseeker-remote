
import config from 'app/models/interpreters/config'
const usedConfigProps = [
    ['location_lists'],
    ['main_job_function_lists'],
    ['country_lists']
]
export default config(usedConfigProps)