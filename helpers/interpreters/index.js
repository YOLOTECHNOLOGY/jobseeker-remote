import { Free } from 'fantasy-frees'
import { scripts } from 'imforbossjob'
import { ReaderTPromise as M } from './monads'
import common from './common'
import responseResume from './responseResume'
import exchangeNumber from './exchangeNumber'
import interview from './interview'
import { cond } from 'lodash-es'
const {
    utils,
    responseResumeJobseeker,
    exchangeNumberJobseeker,
    interviewJobseeker,
} = scripts
const { CommonActions } = utils
const { Actions: ResponseResumeActions } = responseResumeJobseeker
const { Actions: ExchangeNumberActions } = exchangeNumberJobseeker
const { Actions: InterviewActions } = interviewJobseeker

export default script => {
    const interpreter = command => {
        console.log(command?.['@@tag'], command?.['@@values']?.[0] ?? '')
        return cond([
            [CommonActions.is, common],
            [ResponseResumeActions.is, responseResume],
            [ExchangeNumberActions.is, exchangeNumber],
            [InterviewActions.is, interview]
        ])(command)
    }
    return Free.runFC(script, interpreter, M)
}

