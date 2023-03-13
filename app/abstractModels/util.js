import { taggedSum } from 'daggy'
import { cond, T } from 'ramda'
import { Free } from 'fantasy-frees'
import commonInterpreter from './commonInterpreter'
import { ReaderTPromise } from './monads'
const { liftFC: DO } = Free
export const CommonActions = taggedSum('CommonActions', {
  error: ['error'],
  just: ['just'],
  buildComponent: ['props', 'component']
})

export const DataSource = taggedSum('DataSource', {
  update: ['data'],
  getData: []
})

export const Result = taggedSum('Result', {
  success: ['data'],
  error: ['error']
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
    .catch(e => console.log('monad error', e))

}
