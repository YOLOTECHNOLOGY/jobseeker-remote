/* eslint-disable @typescript-eslint/no-unused-vars */
import axios from 'axios'
const logError = error => {
    if (process.env.NODE_ENV !== 'production') {
        return
    }
    if (typeof window !== 'undefined') {
        axios.post(window.location.origin + '/errors/report', { error })
    } else {
        const log4js = require('log4js')
        const logger = log4js.getLogger('serverError')
        logger.level = 'error'
        logger.error(error)
    }
}
export const logServerInfo = info => {
    // if (process.env.NODE_ENV !== 'production') {
    //     return
    // }
    // if (typeof window !== 'undefined') {
    //     return
    // } else {
    //     const log4js = require('log4js')

    //     const logger = log4js.getLogger('serverInfo')
    //     logger.level = 'info'
    //     logger.info(info)
    // }
}
export default logError