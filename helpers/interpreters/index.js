import { scripts } from 'imforbossjob'
import common from './common'
import responseResume from './responseResume'
import exchangeNumber from './exchangeNumber'
import notInterest from './notInterest'
import interview from './interview'
import { cond } from 'lodash-es'
const {
    utils,
    responseResumeJobseeker,
    exchangeNumberJobseeker,
    interviewJobseeker,
    notInterestJobseeker
} = scripts
const { CommonActions } = utils
const { Actions: ResponseResumeActions } = responseResumeJobseeker
const { Actions: ExchangeNumberActions } = exchangeNumberJobseeker
const { Actions: InterviewActions } = interviewJobseeker
const { Actions: NotInterestActions } = notInterestJobseeker
export default cond([
    [CommonActions.is, common],
    [ResponseResumeActions.is, responseResume],
    [ExchangeNumberActions.is, exchangeNumber],
    [InterviewActions.is, interview],
    [NotInterestActions.is, notInterest]
])
// export default script => {
//     const interpreter = command => {
//         console.log(command?.['@@tag'], command?.['@@values']?.[0] ?? '')
//         return cond([
//             [CommonActions.is, common],
//             [ResponseResumeActions.is, responseResume],
//             [ExchangeNumberActions.is, exchangeNumber],
//             [InterviewActions.is, interview],
//             [NotInterestActions.is, notInterest]
//         ])(command)
//     }
//     return Free.runFC(script, interpreter, M)
// }

