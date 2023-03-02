import { scripts } from 'imforbossjob'
import common from './common'
import responseResume from './responseResume'
import exchangeNumber from './exchangeNumber'
import notInterest from './notInterest'
import interview from './interview'
import phrases from './commonPhrases'
import confirmLocation from './confirmLocation'
import imBusiness from './imBusiness'
import switchJob from './switchJob'
import jobIp from './job'
import { cond } from 'lodash-es'
const {
    utils,
    responseResumeJobseeker,
    exchangeNumber: exchangeNumberJobseeker,
    interviewJobseeker,
    notInterestJobseeker,
    commonPhrases,
    confirmLocationJobseeker,
    switchJobJobseeker,
    im,
    job
} = scripts
const { CommonActions } = utils
const { Actions: ResponseResumeActions } = responseResumeJobseeker
const { Actions: ExchangeNumberActions } = exchangeNumberJobseeker
const { Actions: InterviewActions } = interviewJobseeker
const { Actions: NotInterestActions } = notInterestJobseeker
const { Actions: CommonPhrasesActions } = commonPhrases
const { Actions: ConfirmLocationActions } = confirmLocationJobseeker
const { Actions: SwitchJobActions } = switchJobJobseeker
const { Actions: JobActions } = job
const { IMBusinessActions } = im
console.log({job})

export default cond([
    [CommonActions.is, common],
    [ResponseResumeActions.is, responseResume],
    [ExchangeNumberActions.is, exchangeNumber],
    [InterviewActions.is, interview],
    [NotInterestActions.is, notInterest],
    [CommonPhrasesActions.is, phrases],
    [ConfirmLocationActions.is, confirmLocation],
    [IMBusinessActions.is, imBusiness],
    [SwitchJobActions.is, switchJob],
    [JobActions.is, jobIp]

])


