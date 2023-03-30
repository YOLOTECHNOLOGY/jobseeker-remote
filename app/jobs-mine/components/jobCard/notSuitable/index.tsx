import React from 'react'
// import styles from './index.module.scss'
import Modal from 'components/Modal'
import { TextField } from 'app/components/MUIs'
const NotSuitableModal = (props: any) => {

    const {
        // showSelection,
        hideSelection,
        showText,
        hideText,
        request,
        showSelectionModal,
        showTextModal,
        // refreshing
    } = props
    const reasons = [
        'Does not match my job preference',
        'Working location is too far',
        'Salary is below my expectation',
        'Education qualification mismatch',
        'Industry mismatch',
        'Not interested in this company',
    ]
    return <>
        <Modal
            showModal={showSelectionModal}
            handleModal={hideSelection}
            headerTitle={'Why this job is not suitable?'}
            closeModalOnOutsideClick={true}

        >
            {reasons.map(reason => {
                return <div key={reason} onClick={() => request(reason)}>{reason}</div>
            })}
            <div onClick={showText}>Others</div>
        </Modal>
        <Modal
            showModal={showTextModal}
            handleModal={hideText}
            headerTitle={'Others'}
            closeModalOnOutsideClick={true}
        >
            <TextField></TextField>
        </Modal>
    </>
}
export default NotSuitableModal