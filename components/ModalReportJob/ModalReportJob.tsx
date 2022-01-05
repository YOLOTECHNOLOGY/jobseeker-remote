import React, { useState } from 'react'

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
}

const ModalReportJob = ({
  isShowReportJob,
  handleShowReportJob,
  reportJobReasonList,
  selectedJobId,
  handlePostReportJob
}: ModalReportJobProps) => {
  const [modalReportDetail, setModalReportDetail] = useState(false)
  const [modalReportSelected, setModalReportSelected] = useState(null)
  const [modalReportSelectedItem, setModalReportSelectedItem] = useState('')

  const reportList = [
    { category: 'spam', description: 'I think it’s spam or scam' },
    { category: 'discrimination', description: 'I think it’s discriminatory or offensive' },
    { category: 'broken', description: 'I think something is broken' }
  ]

  const { register, handleSubmit } = useForm()
  const onSubmit = (data) => {
    handlePostReportJob({jobId: selectedJobId, jobReasonId: data.reportDetail})
    setModalReportDetail(false)
  }

  const handleChange = (event) => {
    setModalReportSelectedItem(event.target.value)
  }

  const handleSelectedReportJob = (category) => {
    return reportJobReasonList.filter((report) => report.category === category)
  }

  if (modalReportDetail) {
    return (
      <Modal
        headerTitle='Tell us a little more'
        showModal={modalReportDetail}
        handleModal={() => setModalReportDetail(false)}
        firstButtonText='Back'
        handleFirstButton={() => {
          setModalReportDetail(false)
          handleShowReportJob(true)
          setModalReportSelected(modalReportSelected)
        }}
        secondButtonText='Submit'
        handleSecondButton={handleSubmit(onSubmit)}
      >
        <div className={styles.ModalReportJobDetail}>
          {handleSelectedReportJob(modalReportSelected.category).map((option, i) => (
            <div className={styles.ModalReportJobDetailItem} key={i}>
              <RadioGroup
                aria-label="reportDetail"
                name="controlled-radio-buttons-group"
                value={modalReportSelectedItem}
                onChange={handleChange}
                className={styles.ModalReportJobDetailRadioGroup}
              >
                <FormControlLabel 
                  {...register('reportDetail')}
                  value={option.id} 
                  control={<Radio />} 
                  label={
                    <div className={styles.ModalReportJobDetailLabel}>
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
      headerTitle='Why are you reporting this job?'
      showModal={isShowReportJob}
      handleModal={() => handleShowReportJob(false)}
    >
      <div className={styles.ModalReportJob}>
        {reportList.map((report, i) => (
          <div 
            key={i}
            className={styles.ModalReportJobItem} 
            onClick={() => {
              handleShowReportJob(false)
              setModalReportDetail(true)
              setModalReportSelected(report)
              setModalReportSelectedItem(handleSelectedReportJob(report.category)[0].id)
            }}
          >
            <Text>{report.description}</Text>
            <div className={styles.ModalReportJobItemIcon}>
              <Image src={ArrowForwardIcon} width='20' height='20'/>
            </div>
          </div>
        ))}
      </div>
    </Modal>
  )
}

export default ModalReportJob