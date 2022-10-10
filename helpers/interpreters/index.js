import { Free } from 'fantasy-frees'
import { scripts } from 'imforbossjob'
import { ReaderTPromise as M } from './monads'
import common from './common'
import responseResume from './responseResume'
import { cond } from 'lodash-es'
const {
    utils,
    responseResumeJobseeker
} = scripts
const { CommonActions } = utils
const { Actions: ResponseResumeActions } = responseResumeJobseeker

export default script => {
    const interpreter = command => {
        console.log(command['@@tag'], command['@@values'][0] ?? '')
        return cond([
            [CommonActions.is, common],
            [ResponseResumeActions.is,responseResume]
        ])(command)
    }
    return Free.runFC(script, interpreter, M)
}

