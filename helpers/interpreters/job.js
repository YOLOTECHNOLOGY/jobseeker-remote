/* eslint-disable new-cap */
import { M } from 'imforbossjob'


export default command => command.cata({
    redirectJobPage: jobId => M
        (() => Promise.resolve().then(() => {
            // const router = context.getRouter()
            // router.push(`/job/${jobId}`)
            window.open(location.host + `/job/${jobId}`)
        })),


})