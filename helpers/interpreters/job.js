/* eslint-disable new-cap */
import { M } from 'imforbossjob'


export default command => command.cata({
    redirectJobPage: jobId => M
        (context => Promise.resolve().then(() => {
            const router = context.getRouter()
            router.push(`/job/${jobId}`)
        })),


})