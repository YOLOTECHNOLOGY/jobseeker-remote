/* eslint-disable new-cap */
import { M, scripts } from 'imforbossjob'
import { requestFirstService } from './services/imBusiness'
const { utils } = scripts
const { RequestResult } = utils
export default command => command.cata({
    isFirstMessage: () => M(context => new Promise(resolve => {
        const imState = context.getState()
        resolve(imState?.chatStatus === 'New' && imState?.initiated_role === 'recruiter')
    })),
    requestFirst: () => M(context => {
        context.setLoading(true)
        const chatId = context.getChatId()
        return requestFirstService(chatId)
            .then(result => RequestResult.success(result.data))
            .catch(error => RequestResult.error(error))
            .finally(() => context.setLoading(false))
    }),

})