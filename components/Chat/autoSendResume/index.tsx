import React, { useEffect, useState } from 'react'
import EnableAutoSendResumeModal from './enabled'
import DisableAutoSendResumeModal from './disabled'
import { getDictionary } from 'get-dictionary'

const AutoSendResumeModal = (props: any) => {
    const [dic, setDic] = useState({})
    const { lang } = props
    useEffect(() => {
        getDictionary(lang)
            .then(dic => {
                if (dic) {
                    setDic(dic.chatAutoSendResume)
                }
            })
    }, [lang])
    return <>
        <EnableAutoSendResumeModal {...props} dic={dic} />
        <DisableAutoSendResumeModal {...props} dic={dic} />
    </>
}

export default AutoSendResumeModal