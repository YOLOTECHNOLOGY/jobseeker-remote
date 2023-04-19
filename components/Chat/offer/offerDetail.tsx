/* eslint-disable no-unused-vars */
import Modal from 'components/Modal'
import React, { useRef, useState } from 'react'
import { assign } from 'lodash-es'
import OfferView from './offerView'

const OfferDetail = (props: any) => {
    const [show, setShow] = useState(false)
    const { contextRef, loading } = props
    const [data, setData] = useState<any>({})
    const actionsRef = useRef({} as any)
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
            console.log({ refreshOfferDetail: data })
            setData(data)
        }
    }
    console.log({ offerData: data })
    contextRef.current = assign(contextRef.current, context)
    return <Modal
        showModal={show}
        handleModal={() => actionsRef.current.close?.()}
        headerTitle={`Offer from ${data?.company_name}`}
        firstButtonText={data?.status === 'Offered' && 'Reject'}
        secondButtonText={data?.status === 'Offered' && 'Accept'}
        firstButtonIsClose={false}
        secondButtonIsClose={false}
        handleFirstButton={() => actionsRef.current.reject?.()}
        handleSecondButton={() => actionsRef.current.accept?.()}
        isSecondButtonLoading={loading}
        isFirstButtonLoading={loading}
    >
        <OfferView offerData={data} />

    </Modal >
}
export default OfferDetail