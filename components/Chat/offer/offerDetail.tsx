/* eslint-disable no-unused-vars */
import Modal from 'components/Modal'
import React, { useRef, useState } from 'react'
import { assign } from 'lodash-es'
import OfferView from './offerView'

const OfferDetail = (props: any) => {
    const [show, setShow] = useState(false)
    const { contextRef, loading ,lang} = props
    const [data, setData] = useState<any>({})
    const actionsRef = useRef({} as any)
    const {offerFrom,reject,accept} = lang || {}
    const context = {
        modalOfferDetail(actions) {
            actionsRef.current = actions
            setData(actions.data?.data ?? actions.data)
            setShow(true)
        },
        closeOfferDetail() {
            setShow(false)
        },
        refreshOfferDetail(data) {
            setData(data)
        }
    }
    contextRef.current = assign(contextRef.current, context)
    return <Modal
        showModal={show}
        handleModal={() => actionsRef.current.close?.()}
        headerTitle={`${offerFrom} ${data?.company_name}`}
        firstButtonText={data?.status === 'Offered' && reject}
        secondButtonText={data?.status === 'Offered' && accept}
        firstButtonIsClose={false}
        secondButtonIsClose={false}
        handleFirstButton={() => actionsRef.current.reject?.()}
        handleSecondButton={() => actionsRef.current.accept?.()}
        isSecondButtonLoading={loading}
        isFirstButtonLoading={loading}
    >
        <OfferView offerData={data} lang={lang}/>

    </Modal >
}
export default OfferDetail