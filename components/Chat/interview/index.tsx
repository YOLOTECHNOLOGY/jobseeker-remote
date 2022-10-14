import React from 'react'
import AcceptModal from './accept'
import ConfirmModal from './confirm'
import DetailModal from './detail'

const Interview = (props: any) => {
    return <>
        <AcceptModal {...props} />
        <ConfirmModal {...props} />
        <DetailModal {...props} />
    </>
}

export default Interview