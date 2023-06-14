/* eslint-disable new-cap */
import { scripts, M } from 'imforbossjob'
import { confirm,decline } from './services/confirmLocation'
const { utils,
    //  confirmLocationJobseeker: { DetailActions } 
    } = scripts
const { RequestResult } = utils
export default command => command.cata({
    confirmRequest: () => M(context => {
        const applicationId = context.getApplicationId()
        const confirmLocationId = context.getState()?.location_confirmation?.id
        context.setLoading(true)
        return confirm(applicationId, confirmLocationId)
            .then(result => RequestResult.success(result.data))
            .catch(error => RequestResult.error(error))
            .finally(() => context.setLoading(false))
    }),
    declineRequest: () => M(context => {
        const applicationId = context.getApplicationId()
        const confirmLocationId = context.getState()?.location_confirmation?.id
        context.setLoading(true)
        return decline(applicationId, confirmLocationId)
            .then(result => RequestResult.success(result.data))
            .catch(error => RequestResult.error(error))
            .finally(() => context.setLoading(false))
    })
    // modalLocationDetail: () => M(context => new Promise(resolve => {
    //     context.showLocationDetail({
    //         close: () => {
    //             resolve(DetailActions.close)
    //         }
    //     })
    // }))
})