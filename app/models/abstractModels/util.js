import { taggedSum } from 'daggy'
import { cond, T } from 'ramda'
import { Free } from 'fantasy-frees'
import commonInterpreter from './commonInterpreter'
import { ReaderTPromise } from './monads'
import Redirect from '../../components/Redirect'
import { getURLFromRedirectError, isRedirectError } from 'next/dist/client/components/redirect'
// import Redirect from 'app/[lang]/components/Redirect'
// import { isRedirectError, getURLFromRedirectError } from 'next/dist/client/components/redirect'
const { liftFC: DO } = Free
export const CommonActions = taggedSum('CommonActions', {
  error: ['error'],
  just: ['just'],
  buildComponent: ['props', 'component'],
  getAccesstoken: [],
  redirectLogin: ['path']
})

export const DataSource = taggedSum('DataSource', {
  update: ['data'],
  getData: []
})

export const Result = taggedSum('Result', {
  success: ['data'],
  error: ['error']
})

export const needLogin = (businessScript, redirectPath) => DO(CommonActions.getAccesstoken)
  .chain(accessToken => {
    if (accessToken) {
      return businessScript
    } else {
      return DO(CommonActions.redirectLogin(redirectPath))
    }
  })

export const buildComponentScript = (props, componrnt) => DO(CommonActions.buildComponent(props, componrnt))

export const dispatchMatches = cond

// 组装抽象逻辑和业务逻辑的函数。 或者是说Free.runFC是将抽象逻辑和业务逻辑合并的汗水
export const registInterpreter = interpreter => {
  // interpreter 业务逻辑
  const merged = command =>
    dispatchMatches([
      [CommonActions.is, commonInterpreter],
      [T, interpreter]
    ])(command).log(command)
  // command 抽象逻辑
  return script => Free.runFC(script, merged, ReaderTPromise)
    .catch(error => {
      if (isRedirectError(error)) {
        const redirectUrl = getURLFromRedirectError(error)
        if (redirectUrl) {
          return <Redirect url={redirectUrl} />
        }
      }
      // if (error?.response?.status === 401) {
      //   return <Redirect url='/get-started' />
      // }

      return Promise.reject(error)
    })

}
