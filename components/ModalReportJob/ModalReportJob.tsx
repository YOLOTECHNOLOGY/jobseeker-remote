import React, { useState, useEffect, useContext } from 'react'

/* Vendor */
import { Radio, RadioGroup, FormControlLabel } from '@mui/material'
import { useForm } from 'react-hook-form'

/* Components */
import Modal from 'components/Modal'
import Text from 'components/Text'

/* Styles */
import styles from './ModalReportJob.module.scss'

/* Images */
import { ArrowForwardIcon } from 'images'
import { languageContext } from 'app/[lang]/components/providers/languageProvider'

interface ModalReportJobProps {
  isShowReportJob?: boolean
  handleShowReportJob?: Function
  reportJobReasonList?: any
  selectedJobId?: number
  handlePostReportJob?: Function
  postReportResponse: any
  isPostingReport: boolean
}

const ModalReportJob = ({
  isShowReportJob,
  handleShowReportJob,
  reportJobReasonList,
  selectedJobId,
  handlePostReportJob,
  postReportResponse,
  isPostingReport
}: ModalReportJobProps) => {
  const {
    jobDetail: { reportModal, detailModal, feedbackModal }
  } = useContext(languageContext) as any

  const [modalReportDetail, setModalReportDetail] = useState(false)
  const [modalReportSelected, setModalReportSelected] = useState(null)
  const [modalReportSelectedItem, setModalReportSelectedItem] = useState('')

  const [isShowConfirmation, setIsShowConfirmation] = useState(false)
  const [hasReportedJob, setHasReportedJob] = useState(false)

  let reportList = [
    { category: 'spam', description: reportModal.category.spam },
    { category: 'discrimination', description: reportModal.category.discrimination },
    { category: 'broken', description: reportModal.category.broken }
  ]

  const { register, handleSubmit } = useForm()

  useEffect(() => {
    if (postReportResponse?.message === 'success' && hasReportedJob) setIsShowConfirmation(true)
  }, [postReportResponse])

  const onSubmit = (data) => {
    reportList = []
    setHasReportedJob(true)
    setModalReportDetail(false)
    handlePostReportJob({ jobId: selectedJobId, jobReasonId: data.reportDetail })
  }

  const handleChange = (event) => {
    setModalReportSelectedItem(event.target.value)
  }

  const handleSelectedReportJob = (category) => {
    return reportJobReasonList.filter((report) => report.category === category)
  }

  const onCloseModal = () => {
    handleShowReportJob(false)
    setIsShowConfirmation(false)
    setModalReportDetail(false)
    setHasReportedJob(false)
  }

  const isShowInitialModal = isShowReportJob && !modalReportDetail && !isShowConfirmation
  const isShowDetailModal = isShowReportJob && modalReportDetail && !isShowConfirmation
  const isShowConfirmationModal = isShowReportJob && !modalReportDetail && isShowConfirmation

  return (
    <>
      <Modal
        headerTitle={`${isPostingReport ? reportModal.title : reportModal.notReportedTitle}`}
        showModal={isShowInitialModal}
        handleModal={() => {
          onCloseModal()
        }}
      >
        <div className={styles.modalReportJob}>
          {isPostingReport && (
            <div className={styles.modalReportJobConfirmation}>
              <Text textStyle='xxl'>{reportModal.submitting}</Text>
            </div>
          )}
          {!isPostingReport &&
            reportList.map((report, i) => (
              <div
                key={i}
                className={styles.modalReportJobItem}
                onClick={() => {
                  setModalReportDetail(true)
                  setModalReportSelected(report)
                  setModalReportSelectedItem(handleSelectedReportJob(report.category)[0].id)
                }}
              >
                <Text>{report.description}</Text>
                <div className={styles.modalReportJobItemIcon}>
                  <img src={ArrowForwardIcon} width='20' height='20' />
                </div>
              </div>
            ))}
        </div>
      </Modal>
      <Modal
        headerTitle={detailModal.title}
        showModal={isShowDetailModal}
        handleModal={() => {
          onCloseModal()
        }}
        firstButtonText={detailModal.btn1}
        handleFirstButton={() => {
          setModalReportDetail(false)
          setModalReportSelected(modalReportSelected)
        }}
        secondButtonText={detailModal.btn2}
        handleSecondButton={handleSubmit(onSubmit)}
      >
        <div className={styles.modalReportJobDetail}>
          {handleSelectedReportJob(modalReportSelected?.category).map((option, i) => (
            <div className={styles.modalReportJobDetailItem} key={i}>
              <RadioGroup
                aria-label='reportDetail'
                name='controlled-radio-buttons-group'
                value={modalReportSelectedItem}
                onChange={handleChange}
                className={styles.modalReportJobDetailRadioGroup}
              >
                <FormControlLabel
                  {...register('reportDetail')}
                  value={option.id}
                  control={<Radio />}
                  label={
                    <div className={styles.modalReportJobDetailLabel}>
                      <Text textStyle='lg'>{option.title}</Text>
                      <Text textStyle='base' textColor='lightgrey'>
                        {option.description}
                      </Text>
                    </div>
                  }
                />
              </RadioGroup>
            </div>
          ))}
        </div>
      </Modal>
      <Modal
        headerTitle={feedbackModal.title}
        showModal={isShowConfirmationModal}
        handleModal={() => {
          onCloseModal()
        }}
      >
        <div className={styles.modalReportJob}>
          <div className={styles.modalReportJobConfirmation}>
            <Text>{feedbackModal.message}</Text>
          </div>
        </div>
      </Modal>
    </>
  )
}

export default ModalReportJob
