import Modal from 'components/Modal'
import React, { useRef, useState,useMemo } from 'react'
import { assign } from 'lodash-es'
import styles from './index.module.scss'
const ViewJobModal = (props: any) => {
    const [show, setShow] = useState(false)
    const { contextRef } = props
    const actionsRef = useRef({} as any)
    const context = {
        showJobDetail(actions) {
            actionsRef.current = actions
            setShow(true)
        },
        closeJobDetail() {
            setShow(false)
        }
    }
    contextRef.current = assign(contextRef.current, context)
    const job = contextRef.current.getState?.()?.job
    const details = useMemo(() => {
        return [
            ['Job Type', job?.job_type_value],
            ['Years of Exp', job?.xp_lvl?.value],
            ['Quealitification', job?.degree?.value],
            ['Work location', job?.location?.value],
            ['Address', job?.full_address],
            ['Job function', job?.function_job_title],
            [
                'Skills',
                <div key="skills" className={styles.skillContainer}>
                    {(job?.skills ?? []).map(skill => {
                        return (
                            <div className={styles.skill} key={skill.value}>
                                {skill.value}
                            </div>
                        )
                    })}
                </div>
            ],
            ['Salary', job?.salary_range_value]
        ]
    }, [job])
    return <Modal
        showModal={show}
        handleModal={() => actionsRef.current.close?.()}
        headerTitle={job?.job_title}
        secondButtonText='Done'
        secondButtonIsClose={false}
        handleSecondButton={() => actionsRef.current.close?.()}
    >
        <div className={styles.formContainer}>
            {details.map(([label, content]) => {
                return (
                    <div className={styles.detailItemContainer} key={label}>
                        <label>{label}</label>
                        {typeof content === 'string' ? <p>{content}</p> : content}
                    </div>
                )
            })}
        </div>
    </Modal>
}

export default ViewJobModal