'use client'
import React, { useState } from 'react'
import styles from './index.module.scss'
import Modal from 'components/Modal'
import {  TextareaAutosize } from 'app/[lang]/components/MUIs'
const NotSuitableModal = (props: any) => {
    const translateLang = props?.lang?.notSuitable || {}
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
        translateLang.reason1,
        translateLang.reason2,
        translateLang.reason3,
        translateLang.reason4,
        translateLang.reason5,
        translateLang.reason6
    ]

    const [other, setOther] = useState('')
    return <>
        <Modal
            showModal={showSelectionModal}
            handleModal={hideSelection}
            headerTitle={translateLang.title}
            closeModalOnOutsideClick={true}

        >
            <div className={styles.description}>{translateLang.description}</div>
            {reasons.map(reason => {
                return <div className={styles.item} key={reason} onClick={() => request(reason)}>{reason}</div>
            })}
            <div onClick={showText} className={styles.others}>{translateLang.others}</div>
        </Modal>
        <Modal
            showModal={showTextModal}
            handleModal={hideText}
            headerTitle={translateLang.others}
            closeModalOnOutsideClick={false}
            firstButtonIsClose={true}
            handleFirstButton={hideText}
            handleSecondButton={() => request(other)}
            firstButtonText={translateLang.cancel}
            secondButtonText={translateLang.submit}
            isSecondButtonDisabled={!other.length}
        >
            <TextareaAutosize
                placeholder={translateLang.reasons}
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