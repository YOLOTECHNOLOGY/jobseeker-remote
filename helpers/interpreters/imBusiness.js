/* eslint-disable new-cap */
import { M } from 'imforbossjob'
import { requestFirstService } from './services/imBusiness'

export default command => command.cata({
    isFirstMessage: () => M(context => new Promise(resolve => {
        const imState = context.getState()
        resolve(imState?.status === 'New' && imState?.initiated_role === 'recruiter')
    })),
    requestFirst: () => M(context => {
        context.setLoading(true)
        const applicationId = context.getApplicationId()
        return requestFirstService(applicationId)
            .then(result => RequestResult.success(result.data))
            .catch(error => RequestResult.error(error))
            .finally(() => context.setLoading(false))
    }),

})