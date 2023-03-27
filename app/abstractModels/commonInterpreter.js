import { ReaderTPromise as M } from './monads'
import { redirect } from 'next/navigation';
export default command =>
  command.cata({
    error: error => M(() => Promise.reject(error)),
    just: M.of,
    buildComponent: (props, component) => M.do(context => {
      console.log({ buildComponent: props })
      return component({ ...props, ...context })
    }),
    getAccesstoken: () => M.do(async () => {
      const { cookies } = await import('next/headers')
      return cookies().get('accessToken')?.value
    }),

    redirectLogin: () => M.do(() => {
      redirect(process.env.HOST_PATH + '/get-started')
    })
  })
