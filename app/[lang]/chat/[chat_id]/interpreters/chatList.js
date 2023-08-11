/* eslint-disable import/no-anonymous-default-export */
import { scripts, M } from 'imforbossjob'
import { userInfo } from './services/userInfo'
const { utils } = scripts
const { RequestResult } = utils
export default command =>
  command.cata({
    getUserInfoRequest: auids =>
      M(() =>
        userInfo(auids)
          .then(result => {
            const infos = result.data?.data?.map?.(userInfo => ({
              auid: '' + userInfo.id + '_r',
              item: {
                avatar: userInfo?.avatar ?? '',
                name: userInfo.full_name
              }
            }))
            return RequestResult.success(infos)
          })
          .catch(error => RequestResult.error(error))
      )
  })
