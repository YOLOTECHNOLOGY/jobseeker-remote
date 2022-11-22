/* eslint-disable valid-jsdoc */
/* eslint-disable react/prop-types */
import Modal from 'components/Modal'
import React, { useMemo, useRef, useState } from 'react'
import { assign } from 'lodash-es'
import { Timeline, TimelineConnector, TimelineContent, TimelineItem, TimelineSeparator } from '@mui/lab'
import styles from './index.module.scss'
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import dayjs from 'dayjs'
import InterviewDetail from '../interviewDetail'
import classNames from 'classnames'
/**
1	Pending interview approval
2	Interview accepted
3	Interview declined
5	Interview completed
6	Interview cancelled
7	Interview not accepted
 */
const Icon = ({ isFinish, active, ...rest }: any) => {
    if (isFinish) {
        return <CheckCircleIcon {...rest} color='success' fontSize='medium' />
    } else {
        return <RadioButtonUncheckedIcon {...rest} color={active ? 'primary' : 'disabled'} fontSize='small' />
    }
}
const DetailModal = (props: any) => {
    const [show, setShow] = useState(false)
    const { contextRef, loading, data, applicationId } = props
    const actionsRef = useRef({} as any)

    // const dispatch = useDispatch()
    const [farFromBegin, upComing, inProgress, canCheckedIn, timeout, showReport, askEnable] = useMemo(() => {
        const hours = (() => {
            const hours = dayjs(data?.interviewed_at).diff(dayjs(), 'hours')
            const minutes = dayjs(data?.interviewed_at).diff(dayjs(), 'minutes')
            return hours + minutes / 60
        })()
        console.log('hours', hours)
        return [
            hours >= 6,
            hours < 6 && hours > 2,
            hours <= 2,
            hours < 2 && hours >= -0.5,
            hours < -0.5,
            hours < 0 && hours >= -3,
            hours < -3
        ]
    }, [data?.interviewed_at])
    const context = {
        showDetail(actions) {
            actionsRef.current = actions
            setShow(true)
        },
        closeDetail() {
            setShow(false)
        },
        canAskResult() {
            return askEnable
        }
    }
    contextRef.current = assign(contextRef.current, context)
    const isAttended = data?.jobseeker_mark_jobseeker_attended
    console.log({ showReport })
    const timelineItems = useMemo(() => {

        return [
            {
                title: 'Interview Confirmed',
                label: 'Your interview cannot be cancelled now',
                isFinish: true,
                active: true,
                show: true,
                actionName: farFromBegin ? 'Cancel interview' : 'Your interview cannot be cancelled now',
                actionEnable: ['Interview accepted'].includes(data?.status) && farFromBegin,
                action: () => {
                    actionsRef.current?.cancel?.()
                }
            },
            {
                title: 'Checked-in',
                label: 'Check in for the interview with recruiter',
                isFinish: !!data?.checked_in_at,
                actionName: (() => {
                    if (data?.checked_in_at) {
                        return 'Checked-in'
                    }
                    if (canCheckedIn) {
                        return 'Check-in now'
                    }
                    if (timeout) {
                        return 'You cannot check in now.'
                    }
                })(),
                active: !timeout,
                show: true,
                actionEnable: !data?.checked_in_at && canCheckedIn,
                action: () => actionsRef.current?.checkIn?.({
                    applicationId,
                    inviteInterviewId: data.id
                })
            },
            {
                title: 'In-progress',
                label: 'You can report any issue during this stage',
                isFinish: inProgress || data?.status === 'Interview completed',
                active: true,
                show: showReport && (isAttended === 'True' || !!data.checked_in_at),
                actionName: 'Report issues',
                actionEnable: true,
                action: () => actionsRef.current?.reportIssue?.({
                    applicationId,
                    inviteInterviewId: data.id
                })
            },
            {
                title: 'Finished',
                label: 'You can request interview result from the recruiter',
                isFinish: data?.status === 'Interview completed',
                active: true,
                show: true,
                actionName: data?.requested_result_at ? 'Requested for results' : 'Request for results',
                actionEnable: !data?.requested_result_at,
                action: () => actionsRef.current?.askResult?.()
            }
        ].filter(item => item.show)
    }, [data, actionsRef.current, applicationId, inProgress, upComing])
    const sureNotCheck = useMemo(() => {
        return !data?.checked_in_at && data?.jobseeker_mark_jobseeker_attended === false
    }, [data?.checked_in_at, data?.jobseeker_mark_jobseeker_attended])
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
        <InterviewDetail data={data} status={sureNotCheck && 'You did not attend the interview.'} />
        {!sureNotCheck && <Timeline position='right' classes={{ root: styles.root }}>
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
                            <div className={styles.separatorContainer}>
                                <Icon className={styles.icon} isFinish={item.isFinish} active={item.active} />
                            </div>
                            {i !== timelineItems.length - 1 && <TimelineConnector />}
                        </TimelineSeparator>
                        <TimelineContent sx={{ width: 400 }}>
                            <div className={classNames({
                                [styles.timelineItem]: true,
                                [styles.isFinished]: item.isFinish
                            })}>
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
        </Timeline>}
    </Modal>
}

export default DetailModal