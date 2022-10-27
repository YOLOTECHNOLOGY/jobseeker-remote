import React, { useState, useRef } from 'react'
import 'imforbossjob/dist/style.css'
import { assign } from 'lodash-es'
import styles from './index.module.scss'
import { Edit, Delete } from '@mui/icons-material'
import Modal from 'components/Modal'
import ContentLoader from 'react-content-loader'
const CommonPhrasesEditListModal = (props: any) => {
    const { contextRef, loading, listLoading, list } = props
    const [show, setShow] = useState(false)
    const actionsRef = useRef<any>()
    const context = {
        showEditCommonPhrasesList(actions) {
            actionsRef.current = actions
            setShow(true)
        },
        closeEditCommonPhrasesList() {
            setShow(false)
        },

    }
    contextRef.current = assign(contextRef.current, context)

    return <Modal
        showModal={show}
        handleModal={() => actionsRef.current?.back?.()}
        headerTitle={'Common Phrases'}
        secondButtonText='Done'
        secondButtonIsClose={false}
        handleSecondButton={() => actionsRef.current.back?.()}
        isSecondButtonLoading={loading}
        isFirstButtonLoading={loading}
    >
        <div className={styles.modalContainer}>
            <div className={styles.formContainer}>
                {listLoading ? <ContentLoader /> : list.map(phrase => {
                    return <div className={styles.editItemContainer} key={phrase.id}>
                        <p>{phrase.message}</p>
                        <div className={styles.actions}>
                            <div
                                className={styles.icon}
                                onClick={() => {
                                    actionsRef.current?.editOne(phrase)
                                }}
                            >
                                <Edit />
                            </div>
                            <div
                                className={styles.icon}
                                onClick={() => {
                                    actionsRef.current?.deleteOne(phrase)
                                }}>
                                <Delete />
                            </div>
                        </div>
                    </div>
                })}
            </div>
        </div>
    </Modal>

}


export default CommonPhrasesEditListModal