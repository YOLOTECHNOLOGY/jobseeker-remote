import Modal from 'components/Modal'
import React, { useRef, useState,useMemo } from 'react'
import { assign } from 'lodash-es'
import styles from './index.module.scss'
import { getValueById } from 'helpers/config/getValueById'
const ViewJobModal = (props: any) => {
    const [show, setShow] = useState(false)
    const { contextRef,lang,config} = props
    const actionsRef = useRef({} as any)
    const [job, setJob] = useState(null)

    const {
        JobType,
        yearsOfExp,
        quealitification,
        workLocation,
        address,
        JobFunction,
        skills,
        salary,
        done
    } = lang ?? {};
    const context = {
        showJobDetail(actions) {
            actionsRef.current = actions
            setJob(actions.data)
            setShow(true)
        },
        closeJobDetail() {
            setShow(false)
        }
    }
    contextRef.current = assign(contextRef.current, context)
    // const job = contextRef.current.getState?.()?.job
    const details = useMemo(() => {
        return [
            [JobType, getValueById(config, job?.job_type_id, 'job_type_id')],
            [yearsOfExp,  getValueById(config, job?.xp_lvl?.id, 'xp_lvl_id')],
            [quealitification, getValueById(config, job?.degree?.id, 'degree_id')],
            [workLocation, getValueById(config, job?.location?.id, 'location_id')],
            [address, job?.full_address],
            [JobFunction, getValueById(config,job?.function_job_id,'function_job_title_id')],
            [skills,
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
            [salary, job?.salary_range_value]
        ]
    }, [job])
    return <Modal
        showModal={show}
        handleModal={() => actionsRef.current.close?.()}
        headerTitle={job?.job_title}
        secondButtonText={done}
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