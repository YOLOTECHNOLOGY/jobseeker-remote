/* eslint-disable new-cap */
import { scripts,M } from 'imforbossjob'
import { create } from './services/notInterest'
const { utils,
    notInterestJobseeker: {
        ModalActions
    }
} = scripts
const { RequestResult } = utils

export default command => command.cata({
    modalNotInterest: () => M(context => new Promise(resolve => {
        context.showNotInterest({
            close: () => resolve(ModalActions.close),
            send: payload => resolve(ModalActions.send(payload))
        })
    })),
    requestNotInterest: payload => M(context => {
        context.setLoading(true)
        return create(payload.applicationId,payload.params)
            .then(result => RequestResult.success(result.data))
            .catch(error => RequestResult.error(error))
            .finally(() => context.setLoading(false))
    }),
})