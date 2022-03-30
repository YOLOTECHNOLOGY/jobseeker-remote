import {
  POST_REPORT_REQUEST,
  POST_REPORT_SUCCESS,
  POST_REPORT_FAILED
} from 'store/types/reports/postReport'

const postReportRequest = (payload) => ({
  type: POST_REPORT_REQUEST,
  payload,
})

const postReportSuccess = (payload) => ({
  type: POST_REPORT_SUCCESS,
  payload,
})

const postReportFailed = (error) => ({
  type: POST_REPORT_FAILED,
  error,
})

export { postReportRequest, postReportSuccess, postReportFailed }
