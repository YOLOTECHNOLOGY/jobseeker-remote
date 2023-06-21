import { LinearProgress } from "@mui/material"
import classNames from "classnames"
import RegisterInfo from "components/IncreaseUserConversion/RegisterInfo"
import Modal from '@mui/material/Modal'

import Text from "components/Text"
import { getCookie } from "helpers/cookies"
import { getItem, removeItem, setItem } from "helpers/localStorage"
import moment from "moment"
import quickStyles from 'app/(quick-upload)/[lang]/quick-upload-resume/styles.module.scss'
import React, { useState, useEffect, useRef } from 'react'
import styles from './index.module.scss'
import {
    BossjobLogo,
    increaseUserConversionModelBg,
    increaseUserConversionBrush,
    CloseIcon
} from 'images'
import useRegister from "hooks/useRegister"
const RegisterModal = ({ openRegister, setOpenRegister }: any) => {
    const time = useRef(null)
    const UseHooksRegister = useRegister()
    const { isLoading } = UseHooksRegister
    const accessToken = getCookie('accessToken')
    const [closeRegisterModuleTime, setCloseRegisterModuleTime] = useState(
        getItem('notLoginShowRegisterModuleTime')
    )
    const useInterval = (callback?, dep = 6000) => {
        clearInterval(time.current)
        const isShowRegisterModule = () => {
            const nowTime = moment().format('YYYY-MM-DD HH:mm:ss')
            if (moment(closeRegisterModuleTime).isBefore(nowTime)) {
                callback?.()
            } else {
            }
        }

        time.current = setInterval(isShowRegisterModule, dep)
        return () => clearInterval(time.current)
    }

    useEffect(() => {
        if (!accessToken) {
            const notLoginShowRegisterModule = getItem('notLoginShowRegisterModuleTime')

            if (notLoginShowRegisterModule) {
                return useInterval()
            } else {
                const callBack = () => {
                    handleOpenRegisterModule()
                    clearTimeout(time)
                }
                const time = setInterval(callBack, 3000)
                return () => {
                    clearTimeout(time)
                }
            }
        }
    }, [closeRegisterModuleTime])
    const handleOpenRegisterModule = () => {
        removeItem('quickUpladResume')
        setOpenRegister(true)
    }
    const handleCloseRegisterModule = () => {
        setOpenRegister(false)
        const closeTime = moment().add(30, 'minutes').format('YYYY-MM-DD HH:mm:ss')
        setItem('notLoginShowRegisterModuleTime', closeTime)
        setCloseRegisterModuleTime(closeTime)
    }
    return <Modal
        open={openRegister as boolean}
        onClose={handleCloseRegisterModule}
        aria-labelledby='modal-modal-title'
        aria-describedby='modal-modal-description'
        keepMounted
        // hideBackdrop
        disableAutoFocus
    >
        <div className={styles.forShowRegisterModal}>
            <div className={styles.modalHeader}>
                <Text textStyle='xl' bold className={styles.modalHeaderTitle}>
                    Join Bossjob, kick-start your career!
                </Text>
                <div className={styles.modalCloseButton}>
                    <Text onClick={handleCloseRegisterModule}>
                        <img
                            src={CloseIcon}
                            title='close modal'
                            alt='close modal'
                            width='14'
                            height='14'
                        />
                    </Text>
                </div>
            </div>
            <div
                className={classNames([quickStyles.AuthWrapper, quickStyles.AuthJobDetailWrapper])}
            >
                <div className={quickStyles.AuthWrapperImage}>
                    <div
                        className={classNames([
                            quickStyles.AuthWrapperImageTitle,
                            quickStyles.AuthWrapperImage_JobDetailTitle
                        ])}
                    >
                        <div
                            className={quickStyles.AuthWrapperImageTitleLineBg}
                            style={{ backgroundImage: 'url(' + increaseUserConversionBrush + ')' }}
                        >
                            <Text
                                textColor='white'
                                textStyle='xxxl'
                                block
                                bold
                                className={quickStyles.AuthWrapperImageTitle_context}
                            >
                                Chat with
                            </Text>
                        </div>
                        <Text
                            textColor='white'
                            textStyle='xxxl'
                            block
                            bold
                            className={quickStyles.AuthWrapperImageTitle_context}
                        >
                            Boss to get
                        </Text>
                        <Text
                            textColor='white'
                            textStyle='xxxl'
                            block
                            bold
                            className={quickStyles.AuthWrapperImageTitle_context}
                        >
                            your next
                        </Text>
                        <Text
                            textColor='white'
                            textStyle='xxxl'
                            block
                            bold
                            className={quickStyles.AuthWrapperImageTitle_context}
                        >
                            offer!
                        </Text>
                    </div>
                    <div className={quickStyles.AuthWrapperImageContext}>
                        <img src={increaseUserConversionModelBg} />
                    </div>
                </div>
                <div
                    className={classNames([
                        quickStyles.AuthWrapperInfo,
                        styles.AuthWrapperInfoModuleReg
                    ])}
                >
                    {isLoading ? (
                        <div className={quickStyles.AuthWrapperLoading}>
                            <div className={quickStyles.loadingLogo}>
                                <img src={BossjobLogo} title='Bossjob logo' alt='Bossjob logo' />
                            </div>
                            <div className={quickStyles.loadingIndicator}>
                                <LinearProgress />
                            </div>
                            <Text textStyle='lg'>'Please hold on while we are parsing your resume'</Text>
                        </div>
                    ) : null}

                    <RegisterInfo register4Step {...UseHooksRegister} />
                </div>
            </div>
        </div>
    </Modal>
}

export default RegisterModal