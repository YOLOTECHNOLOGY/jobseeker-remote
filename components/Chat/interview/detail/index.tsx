/* eslint-disable react/prop-types */
import Modal from 'components/Modal'
import React, { useMemo, useRef, useState } from 'react'
import { assign } from 'lodash-es'
import { Timeline, TimelineConnector, TimelineContent, TimelineItem, TimelineSeparator } from '@mui/lab'
import styles from './index.module.scss'
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
// import { useDispatch } from 'react-redux'
import dayjs from 'dayjs'
import InterviewDetail from '../interviewDetail'
// import { displayNotification } from 'store/actions/notificationBar/notificationBar'
const Icon = ({ isFinish }) => {
    if (isFinish) {
        return <CheckCircleIcon color='success' fontSize='medium' />
    } else {
        return <RadioButtonUncheckedIcon color='primary' fontSize='small' />
    }
}
const DetailModal = (props: any) => {
    const [show, setShow] = useState(false)
    const { contextRef, loading, data, applicationId } = props
    const actionsRef = useRef({} as any)
    const context = {
        showDetail(actions) {
            actionsRef.current = actions
            setShow(true)
        },
        closeDetail() {
            setShow(false)
        }
    }
    // const dispatch = useDispatch()
    const [upComing, inProgress] = useMemo(() => {
        const hours = dayjs(data?.interviewed_at).diff(dayjs(), 'hours')
        console.log('hours', hours)
        return [hours < 6 && hours > 2, hours <= 2]
    }, [data?.interviewed_at])
    contextRef.current = assign(contextRef.current, context)

    const timelineItems = useMemo(() => {

        return [
            {
                title: 'Interview Confirmed',
                label: 'Your interview cannot be cancelled now',
                isFinish: true,
                actionName: 'Cancel interview',
                actionEnable: ['Interview accepted'].includes(data?.status),
                action: () => {
                    actionsRef.current?.cancel?.()
                }
            },
            {
                title: 'Checked-in',
                label: 'Check in for the interview with recruiter',
                isFinish: upComing || inProgress || data?.status === 'Interview completed',
                actionName: 'Check-in',
                actionEnable: !data?.checked_in_at,
                action: () => actionsRef.current?.checkIn?.({
                    applicationId,
                    inviteInterviewId: data.id
                })
            },
            {
                title: 'In-progress',
                label: 'You can report any issue during this stage',
                isFinish: inProgress || data?.status === 'Interview completed',
                actionName: 'Report issues',
                actionEnable: ['Interview accepted', 'Interview checked in'].includes(data?.status),
                action: () => actionsRef.current?.reportIssue?.({
                    applicationId,
                    inviteInterviewId: data.id
                })
            },
            {
                title: 'Finished',
                label: 'You can request interview result from the recruiter',
                isFinish: data?.status === 'Interview completed',
                actionName: 'Requested for results',
                actionEnable: (inProgress || data?.status === 'Interview completed') && !data?.complete_at,
                action: () => {
                    // if (data?.status !== 'In-progress') {
                    //     dispatch(
                    //         displayNotification({
                    //             open: true,
                    //             message: 'Please complete check-in for the interview with recruiter first.',
                    //             severity: 'error'
                    //         })
                    //     )
                    //     return
                    // }
                    actionsRef.current?.askResult?.()
                }
            }
        ]
    }, [data, actionsRef.current, applicationId, inProgress, upComing])

    return <Modal
        showModal={show}
        handleModal={() => actionsRef.current.close?.()}
        headerTitle={'Interview Invitation from Company name'}
        secondButtonText='Done'
        secondButtonIsClose={false}
        handleSecondButton={() => actionsRef.current.close?.({
            applicationId,
            inviteInterviewId: data.id,
        })}
        isSecondButtonLoading={loading}
        isFirstButtonLoading={loading}
    >
        <InterviewDetail data={data} />
        <Timeline position='right' classes={{ root: styles.root }}>
            {timelineItems.map((item, i) => {
                const aProps: any = {
                    disabled: !item.actionEnable,
                    onClick: () => {
                        if (item.actionEnable) {
                            item.action()
                        }
                    }
                }
                return (
                    <TimelineItem key={i} classes={{ missingOppositeContent: styles.missing }}>
                        <TimelineSeparator>
                            <Icon isFinish={item.isFinish} />
                            {i !== 3 && <TimelineConnector />}
                        </TimelineSeparator>
                        <TimelineContent sx={{ width: 400 }}>
                            <div className={styles.timelineItem}>
                                <label >{item.title}</label>
                                <p>{item.label}</p>
                                {item.actionName &&
                                    <a {...aProps}>
                                        {item.actionName}
                                    </a>}
                            </div>
                        </TimelineContent>
                    </TimelineItem>
                )
            })}
        </Timeline>
    </Modal>
}

export default DetailModal