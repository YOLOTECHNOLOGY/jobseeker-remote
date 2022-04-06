import React, { useState, useEffect } from 'react'

/* Vendor */
import { Radio, RadioGroup, FormControlLabel } from '@mui/material'
import { useForm } from 'react-hook-form'

/* Components */
import Modal from 'components/Modal'
import Text from 'components/Text'
import Image from 'next/image'

/* Styles */
import styles from './ModalReportJob.module.scss'

/* Images */
import { ArrowForwardIcon } from 'images'

interface ModalReportJobProps {
  isShowReportJob?: boolean
  handleShowReportJob?: Function
  reportJobReasonList?: any
  selectedJobId?: number
  handlePostReportJob?: Function
  postReportResponse?: any
  isPostingReport?: boolean
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

  const [modalReportDetail, setModalReportDetail] = useState(false)
  const [modalReportSelected, setModalReportSelected] = useState(null)
  const [modalReportSelectedItem, setModalReportSelectedItem] = useState('')

  const [isShowConfirmation, setIsShowConfirmation] = useState(false)
  const [hasReportedJob, setHasReportedJob] = useState(false)

  let reportList = [
    { category: 'spam', description: 'I think it’s spam or scam' },
    { category: 'discrimination', description: 'I think it’s discriminatory or offensive' },
    { category: 'broken', description: 'I think something is broken' }
  ]

  const { register, handleSubmit } = useForm()

  useEffect(() => {
    if (postReportResponse?.message === 'success' && hasReportedJob) setIsShowConfirmation(true)
  }, [postReportResponse])

  const onSubmit = (data) => {
    reportList = []
    setHasReportedJob(true)
    setModalReportDetail(false)
    handlePostReportJob({jobId: selectedJobId, jobReasonId: data.reportDetail})
    handleShowReportJob(true)
  }

  const handleChange = (event) => {
    setModalReportSelectedItem(event.target.value)
  }

  const handleSelectedReportJob = (category) => {
    return reportJobReasonList.filter((report) => report.category === category)
  }

  const onCloseModal = () => {
    setIsShowConfirmation(false)
    setHasReportedJob(false)
  }

  if (isShowConfirmation) {
    return (
      <Modal
        headerTitle='Report Job'
        showModal={isShowReportJob}
        handleModal={() => {
          onCloseModal()
          handleShowReportJob(false)
        }}
      >
        <div className={styles.modalReportJob}>
          <div className={styles.modalReportJobConfirmation}>
            <Text textStyle='xxl'>We have received your report about this job.</Text>
          </div>
        </div>
      </Modal>
    )
  }

  if (modalReportDetail) {
    return (
      <Modal
        headerTitle='Tell us a little more'
        showModal={modalReportDetail}
        handleModal={() => setModalReportDetail(false)}
        firstButtonText='Back'
        handleFirstButton={() => {
          handleShowReportJob(true)
          setModalReportDetail(false)
          setModalReportSelected(modalReportSelected)
        }}
        secondButtonText='Submit'
        handleSecondButton={handleSubmit(onSubmit)}
      >
        <div className={styles.modalReportJobDetail}>
          {handleSelectedReportJob(modalReportSelected.category).map((option, i) => (
            <div className={styles.modalReportJobDetailItem} key={i}>
              <RadioGroup
                aria-label="reportDetail"
                name="controlled-radio-buttons-group"
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
                      <Text textStyle='base' textColor='lightgrey'>{option.description}</Text>
                    </div>
                  } 
                />
              </RadioGroup>
            </div>
          ))}
        </div>
      </Modal>
    )
  }
  
  return (
    <Modal
      headerTitle={`${isPostingReport ? 'Report Job' : 'Why are you reporting this job?'}`}
      showModal={isShowReportJob}
      handleModal={() => {
        onCloseModal()
        handleShowReportJob(false)
      }}
    >
      <div className={styles.modalReportJob}>
        {isPostingReport && (
          <div className={styles.modalReportJobConfirmation}>
            <Text textStyle='xxl'>Submitting Report.</Text>
          </div>
        )}
        {!isPostingReport && reportList.map((report, i) => (
          <div 
            key={i}
            className={styles.modalReportJobItem} 
            onClick={() => {
              handleShowReportJob(false)
              setModalReportDetail(true)
              setModalReportSelected(report)
              setModalReportSelectedItem(handleSelectedReportJob(report.category)[0].id)
            }}
          >
            <Text>{report.description}</Text>
            <div className={styles.modalReportJobItemIcon}>
              <Image src={ArrowForwardIcon} width='20' height='20'/>
            </div>
          </div>
        ))}
      </div>
    </Modal>
  )
}

export default ModalReportJob