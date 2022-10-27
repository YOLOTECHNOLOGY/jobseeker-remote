import { scripts } from 'imforbossjob'
import common from './common'
import responseResume from './responseResume'
import exchangeNumber from './exchangeNumber'
import notInterest from './notInterest'
import interview from './interview'
import phrases from './commonPhrases'
import { cond } from 'lodash-es'
const {
    utils,
    responseResumeJobseeker,
    exchangeNumberJobseeker,
    interviewJobseeker,
    notInterestJobseeker,
    commonPhrases
} = scripts
const { CommonActions } = utils
const { Actions: ResponseResumeActions } = responseResumeJobseeker
const { Actions: ExchangeNumberActions } = exchangeNumberJobseeker
const { Actions: InterviewActions } = interviewJobseeker
const { Actions: NotInterestActions } = notInterestJobseeker
const { Actions: CommonPhrasesActions } = commonPhrases

export default cond([
    [CommonActions.is, common],
    [ResponseResumeActions.is, responseResume],
    [ExchangeNumberActions.is, exchangeNumber],
    [InterviewActions.is, interview],
    [NotInterestActions.is, notInterest],
    [CommonPhrasesActions.is, phrases]

])


