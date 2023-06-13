import Modal from 'components/Modal'
import React, { useEffect, useRef, useState } from 'react'
import { assign } from 'lodash-es'
import InterviewDetail from '../interviewDetail'
import { getDictionary } from 'get-dictionary'
const CancelDetailModal = (props: any) => {
    const [show, setShow] = useState(false)
    const { contextRef, data, lang } = props
    const actionsRef = useRef({} as any)
    const context = {
        showCancelDetail(actions) {
            actionsRef.current = actions
            setShow(true)
        },
        closeCancelDetail() {
            setShow(false)
        }
    }
    const [dic, setDic] = useState<any>({})
    useEffect(() => {
        getDictionary(lang)
            .then(dic => {
                if (dic) {
                    setDic(dic.chatInterview)
                }
            })
    }, [lang])
    contextRef.current = assign(contextRef.current, context)
    return <Modal
        showModal={show}
        handleModal={() => actionsRef.current.close?.()}
        headerTitle={dic.cancelTitle}
        secondButtonText={dic.buttonText}
        secondButtonIsClose={false}
        handleSecondButton={() => actionsRef.current.close?.()}
    >
        <InterviewDetail dic={dic} data={data} />
    </Modal>
}

export default CancelDetailModal