import Modal from 'components/Modal'
import React, { useRef, useState } from 'react'
import { assign } from 'lodash-es'
import styles from './index.module.scss'
import MaterialBasicSelect from 'components/MaterialBasicSelect'
const Attend = (props: any) => {
    const [show, setShow] = useState(false)
    const { contextRef, loading, data, applicationId,dic } = props
    const actionsRef = useRef({} as any)
    const context = {
        showAttend(actions) {
            actionsRef.current = actions
            setShow(true)
        },
        closeAttend() {
            setShow(false)
        }
    }
    const [value, onChange] = useState('')
    contextRef.current = assign(contextRef.current, context)
    return <Modal
        showModal={show}
        handleModal={() => actionsRef.current.close?.()}
        headerTitle={dic.resultTitle}
        firstButtonText={dic.back}
        secondButtonText={dic.next}
        firstButtonIsClose={false}
        secondButtonIsClose={false}
        handleFirstButton={() => actionsRef.current.back?.()}
        handleSecondButton={() => actionsRef.current.send?.({
            applicationId,
            inviteInterviewId: data.id,
            params: {
                is_attended: value
            }
        })}
        isSecondButtonDisabled={!value}
        isSecondButtonLoading={loading}
        isFirstButtonLoading={loading}
    >
        <p className={styles.mainText}>{dic.resultText}</p>
        <MaterialBasicSelect
            className={styles.fullWidth}
            label={dic.attendancelabel}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            options={[
                {
                    value: '1',
                    label: dic.yes
                },
                {
                    value: '0',
                    label: dic.no
                }
            ]}
        />
    </Modal>
}

export default Attend