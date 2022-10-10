import React, { useRef, useState } from 'react'
import { JobseekerChat } from 'imforbossjob'
import 'imforbossjob/dist/style.css'
import SendResumeModal from 'components/Chat/SendResume'
import interpreter from 'helpers/interpreters'
const Chat = props => {
    const [loading, setLoading] = useState(false)
    const contextRef = useRef({
        setLoading,
        hideModals(){
            contextRef.current?.closeSendResume?.()
        }
    } as any)
    return <>
        <SendResumeModal loading={loading} contextRef={contextRef} />
        <JobseekerChat loading={loading} interpreter={script=>interpreter(script).run(contextRef.current)}/>
    </>
}
export const getServerSideProps = () => {
    return { props: {} }
}
export default Chat