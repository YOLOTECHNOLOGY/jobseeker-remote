import React, { useState, useRef } from 'react'
import { assign } from 'lodash-es'
import styles from './index.module.scss'
import Modal from 'components/Modal'
import ContentLoader from 'react-content-loader'
import { TrashIcon, PencilIcon } from 'images'

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
                                 <img src={PencilIcon} width='24' height='24' />
                            </div>
                            <div
                                className={styles.icon}
                                onClick={() => {
                                    actionsRef.current?.deleteOne(phrase)
                                }}>
                                <img
                                    src={TrashIcon}
                                    alt='trash'
                                    width='14'
                                    height='14'
                                />
                            </div>
                        </div>
                    </div>
                })}
            </div>
        </div>
    </Modal>

}


export default CommonPhrasesEditListModal