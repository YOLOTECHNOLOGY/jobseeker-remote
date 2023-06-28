/* eslint-disable import/no-anonymous-default-export */
import { scripts, M } from 'imforbossjob'
import { infoAlert } from './services/chat'
const { utils } = scripts
const { RequestResult } = utils

export default command =>
  command.cata({
    hasPhone: text =>
      M(() =>
        Promise.resolve().then(() => {
          return !!(text.replace(/[\s()+\-.]|ext/gi, '').match(/\d{7,}/g))
        })
      ),
    hasEmail: text =>
      M(() =>
        Promise.resolve().then(() => {
          return !!(text.match(/[A-Za-z\d]+([-_.][A-Za-z\d]+)*@([A-Za-z\d]+[-.])+[A-Za-z\d]{2,4}/g))
        })
      ),
    requestAlert: (chatId, hasPhone, hasEmail) =>
      M(() =>
        infoAlert(chatId, hasPhone, hasEmail)
          .then(response => RequestResult.success(response.data?.data))
          .catch(RequestResult.error)
      )
  })
