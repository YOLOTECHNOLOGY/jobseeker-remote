import axios from 'axios'

const logError = error => {
    if (typeof window !== 'undefined') {
        axios.post(window.location.href + '/errors/report', { error })
    } else {
        const log4js = require('log4js')
        const logger = log4js.getLogger('serverError')
        logger.level = 'error'
        logger.error(error)
    }
}
export default logError