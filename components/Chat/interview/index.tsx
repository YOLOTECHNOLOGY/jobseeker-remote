import React from 'react'
import AcceptModal from './accept'
import AskResultFailed from './askFailed'
import Attend from './attend'
import ConfirmModal from './confirm'
import DetailModal from './detail'

const Interview = (props: any) => {
    return <>
        <AcceptModal {...props} />
        <ConfirmModal {...props} />
        <DetailModal {...props} />
        <Attend {...props} />
        <AskResultFailed {...props}/>
    </>
}

export default Interview