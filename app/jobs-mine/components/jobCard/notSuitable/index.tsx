'use client'
import React, { useState } from 'react'
import styles from './index.module.scss'
import Modal from 'components/Modal'
import {  TextareaAutosize } from 'app/components/MUIs'
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
    const [other, setOther] = useState('')
    return <>
        <Modal
            showModal={showSelectionModal}
            handleModal={hideSelection}
            headerTitle={'Why this job is not suitable?'}
            closeModalOnOutsideClick={true}

        >
            <div className={styles.description}>Please select a reason why this job is not what you are looking for. We will optimise your job recommendations.</div>
            {reasons.map(reason => {
                return <div className={styles.item} key={reason} onClick={() => request(reason)}>{reason}</div>
            })}
            <div onClick={showText} className={styles.others}>Others</div>
        </Modal>
        <Modal
            showModal={showTextModal}
            handleModal={hideText}
            headerTitle={'Others'}
            closeModalOnOutsideClick={false}
            firstButtonIsClose={true}
            handleFirstButton={hideText}
            handleSecondButton={() => request(other)}
            firstButtonText='Cancel'
            secondButtonText='Submit'
            isSecondButtonDisabled={!other.length}
        >
            <TextareaAutosize
                placeholder='Please let us know why this job is not suitable.'
                style={{
                    width: '100%',
                    minHeight: 100,
                    padding: 5,
                    borderColor: 'ddd',
                    borderWidth: 1
                }}
                onChange={e => setOther(e.target.value)}
            />
        </Modal>
    </>
}
export default NotSuitableModal