import React, { useEffect, useState } from 'react'
import AcceptModal from './accept'
import AskResultFailed from './askFailed'
import Attend from './attend'
import ConfirmModal from './confirm'
import DetailModal from './detail'
import { getDictionary } from 'get-dictionary'

const Interview = (props: any) => {
    const { lang } = props
    const [interviewDictionary, setInterviewDictionary] = useState({})
    useEffect(() => {
        getDictionary(lang)
            .then(dic => {
                if (dic) {
                    setInterviewDictionary(dic.chatInterview)
                }
            })
    }, [lang])
    // formatTemplateString
    return <>
        <AcceptModal {...props} dic={interviewDictionary}/>
        <ConfirmModal {...props} dic={interviewDictionary}/>
        <DetailModal {...props} dic={interviewDictionary}/>
        <Attend {...props} dic={interviewDictionary} />
        <AskResultFailed {...props} dic={interviewDictionary}/>
    </>
}

export default Interview