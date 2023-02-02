/* eslint-disable new-cap */
import { scripts, M } from 'imforbossjob'
const { 
    switchJobJobseeker: { DetailModalActions }
} = scripts
export default command => command.cata({
    modalJobDetail: () => M(
        context => new Promise(resolve =>
            context.showJobDetail({
                close: () => resolve(DetailModalActions.close)
            })
        )
    ),
})