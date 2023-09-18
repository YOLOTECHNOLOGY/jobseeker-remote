/* eslint-disable import/no-anonymous-default-export */
import { redirectUrlKey } from 'helpers/globalKey';
import { ReaderTPromise as M } from './monads'
import { redirect } from 'next/navigation';
export default command =>
  command.cata({
    error: error => M(() => Promise.reject(error)),
    just: M.of,
    buildComponent: (props, component) => M.do(context => {
      return component({ ...props, ...context })
    }),
    getAccesstoken: () => M.do(async () => {
      const { cookies } = await import('next/headers')
      return cookies().get('accessToken')?.value
    }),

    redirectLogin: (path) => M.do(() => {
      redirect('/get-started' + (path ? `?${redirectUrlKey}=${path}` : ''))
    })
  })
