import { M } from 'imforbossjob'
import { deleteChat } from './services/conversation'
import { CommonActions } from 'app/[lang]/abstractModels/util' 

export default command =>
  command.cata({
    requestDeleteChat: chatId =>
      M(() => deleteChat(chatId).then(CommonActions.success).catch(CommonActions.error))
  })
