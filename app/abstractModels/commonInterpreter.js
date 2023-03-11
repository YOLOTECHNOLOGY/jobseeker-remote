import { ReaderTPromise as M } from './monads'
export default command =>
  command.cata({
    error: error => M(() => Promise.reject(error)),
    just: M.of,
    buildComponent: (props, component) => M.do(context => {
      return component({ ...props, ...context })
    })
  })
