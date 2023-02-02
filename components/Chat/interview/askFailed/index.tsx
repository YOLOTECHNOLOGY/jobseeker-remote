import Modal from 'components/Modal'
import React, { useRef, useState } from 'react'
import { assign } from 'lodash-es'
import styles from './index.module.scss'
import moment from 'moment'
const AskResultFailed = (props: any) => {
    const [show, setShow] = useState(false)
    const { contextRef, loading, data } = props
    const [description ,setDescription] = useState('')
    const actionsRef = useRef({} as any)
    const enableDate = moment(data?.interviewed_at).add(3,'hours').format('MM-DD HH:mm')
    const context = {
        showAskFailed(actions) {
            actionsRef.current = actions
            if(actions.type === 'notAttended') {
                setDescription('You are unable to request for interview result as you did not attend the interview.')
            }
            if(actions.type === 'notTime') {
                setDescription(`You can only request for result from ${enableDate} onwards.`)
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
        headerTitle='Interview result'
        secondButtonText='Close'
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