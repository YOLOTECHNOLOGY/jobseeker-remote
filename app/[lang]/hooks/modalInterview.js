import { IMContext } from 'components/Chat/IMProvider.client'
import { useContext, useState } from 'react'
import { scripts } from 'imforbossjob'
const {
    utils: {
        changeChatScript,
        // updateScript
    },
    interviewJobseeker: {
        modalDetailScript
    }
} = scripts

const useModalInterview = () => {
    const [loading, setLoading] = useState(false)
    const { interpreter } = useContext(IMContext)

    const showInterview = chatId => {
        setLoading(true)
        return interpreter(
            changeChatScript(chatId)
                // .andThen(updateScript())
                .andThen(modalDetailScript())
        ).finally(() => setLoading(false))
    }

    return [showInterview, loading]
}
export default useModalInterview