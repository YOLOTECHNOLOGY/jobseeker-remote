import Modal from 'components/Modal'
import React, { useRef, useState } from 'react'
import { assign } from 'lodash-es'
import styles from './index.module.scss'
import MaterialBasicSelect from 'components/MaterialBasicSelect'
const Attend = (props: any) => {
    const [show, setShow] = useState(false)
    const { contextRef, loading, data, applicationId } = props
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
        headerTitle='Interview result'
        firstButtonText='Back'
        secondButtonText='Next'
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
        <p className={styles.mainText}>Did you attended the interview?</p>
        <MaterialBasicSelect
            className={styles.fullWidth}
            label='Interview attendance'
            value={value}
            onChange={(e) => onChange(e.target.value)}
            options={[
                {
                    value: '1',
                    label: 'Yes'
                },
                {
                    value: '0',
                    label: 'No'
                }
            ]}
        />
    </Modal>
}

export default Attend