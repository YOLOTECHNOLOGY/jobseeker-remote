import Modal from 'components/Modal'
import React, { useRef, useState } from 'react'
import { assign } from 'lodash-es'
import styles from './index.module.scss'
import moment from 'moment'
import { formatTemplateString } from 'helpers/formatter'
const AskResultFailed = (props: any) => {
    const [show, setShow] = useState(false)
    const { contextRef, loading, data, dic } = props
    const [description, setDescription] = useState('')
    const actionsRef = useRef({} as any)
    const enableDate = moment(data?.interviewed_at).add(3, 'hours').format('MM-DD HH:mm')
    const context = {
        showAskFailed(actions) {
            actionsRef.current = actions
            if (actions.type === 'notAttended') {
                setDescription(dic.askResultText1)
            }
            if (actions.type === 'notTime') {
                setDescription(formatTemplateString(dic.askResultText2, enableDate))
            }
            setShow(true)
        },
        closeAskFailed() {
            setShow(false)
        }
    }
    contextRef.current = assign(contextRef.current, context)
    return <Modal
        showModal={show}
        handleModal={() => actionsRef.current.close?.()}
        headerTitle={dic.resultTitle}
        secondButtonText={dic.close}
        firstButtonIsClose={false}
        secondButtonIsClose={false}
        handleSecondButton={() => actionsRef.current.close?.()}
        isSecondButtonLoading={loading}
        isFirstButtonLoading={loading}
    >
        <p className={styles.mainText}>{description}</p>

    </Modal>
}

export default AskResultFailed