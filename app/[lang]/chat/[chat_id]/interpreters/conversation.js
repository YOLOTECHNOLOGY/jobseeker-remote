import { scripts, M } from 'imforbossjob'
import { deleteChat } from './services/conversation'
const { utils } = scripts
const { RequestResult } = utils
export default command =>
  command.cata({
    requestDeleteChat: chatId =>
      M(() => deleteChat(chatId).then(RequestResult.success).catch(RequestResult.error))
  })
