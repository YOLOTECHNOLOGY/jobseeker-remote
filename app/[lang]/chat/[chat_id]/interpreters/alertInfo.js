import { scripts, M } from 'imforbossjob'
import { infoAlert } from './services/chat'
const { utils } = scripts
const { RequestResult } = utils

export default command =>
  command.cata({
    hasPhone: text =>
      M(() =>
        Promise.resolve().then(() => {
          return /^\d{7,}$/.test(text.replace(/[\s()+\-.]|ext/gi, ''))
        })
      ),
    hasEmail: text =>
      M(() =>
        Promise.resolve().then(() => {
          return /^[A-Za-z\d]+([-_.][A-Za-z\d]+)*@([A-Za-z\d]+[-.])+[A-Za-z\d]{2,4}$/.test(text)
        })
      ),
    requestAlert: (chatId, hasPhone, hasEmail) =>
      M(() =>
        infoAlert(chatId, hasPhone, hasEmail)
          .then(response => RequestResult.success(response.data?.data))
          .catch(RequestResult.error)
      )
  })
