/* eslint-disable no-unused-vars */
import Modal from 'components/Modal'
import React, { useRef, useState } from 'react'
import { assign } from 'lodash-es'

const OfferMessage = (props: any) => {
    const [show, setShow] = useState(false)
    const { contextRef, loading } = props
    const actionsRef = useRef({} as any)
    const context = {
        showOfferMessage(actions) {
            actionsRef.current = actions
            setShow(true)
        },
        closeOfferMessage() {
            setShow(false)
        }

    }
    contextRef.current = assign(contextRef.current, context)
    return <Modal
        showModal={show}
        handleModal={() => actionsRef.current.close?.()}
        headerTitle='CONGRATULATIONS!'
        firstButtonText='View now'
        secondButtonText='View later'
        firstButtonIsClose={false}
        secondButtonIsClose={false}
        handleFirstButton={() => actionsRef.current.close?.()}
        handleSecondButton={() => actionsRef.current.view?.()}
        isSecondButtonLoading={loading}
        isFirstButtonLoading={loading}
    >
    </Modal>
}
export default OfferMessage