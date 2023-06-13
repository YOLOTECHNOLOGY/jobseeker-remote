/* eslint-disable new-cap */
import { scripts, M } from 'imforbossjob'
import { jobDetail } from './services/jobs'
const { utils} = scripts
const { RequestResult } = utils
const {
    switchJobJobseeker: { DetailModalActions }
} = scripts
export default command => command.cata({
    modalJobDetail: data => M(
        context => new Promise(resolve =>
            context.showJobDetail({
                close: () => resolve(DetailModalActions.close),
                data
            })
        )
    ),
    isJobCurrent: jobId =>
        M(context =>
            Promise.resolve().then(() => {
                const jobData = context.getState()?.job
                if (jobData?.id == jobId) {
                    return jobData
                } else {
                    return false
                }
            })
        ),
    requestJobDetail: jobId =>
        M(context => {
            context.setLoading(true)
            return jobDetail(jobId)
                .then(result => RequestResult.success(result.data.data))
                .catch(error => RequestResult.error(error))
                .finally(() => context.setLoading(false))
        }),
})