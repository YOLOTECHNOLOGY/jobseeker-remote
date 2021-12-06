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
}

const ModalReportJob = ({
  isShowReportJob,
  handleShowReportJob
}: ModalReportJobProps) => {
  const [modalReportDetail, setModalReportDetail] = useState(false)
  const [modalReportSelected, setModalReportSelected] = useState(null)
  const [modalReportSelectedItem, setModalReportSelectedItem] = useState('')


  const { register, handleSubmit } = useForm()
  const onSubmit = (data) => {
    console.log(data)
    setModalReportDetail(false)
  }

  const handleChange = (event) => {
    setModalReportSelectedItem(event.target.value)
  }

  const reportOptions = [
    [
      {
        label: 'I think it\'s a scam, phishing or malware',
        subLabel: 'Ex: someone asks for personal information or money or posts suspicious links',
        value: 'scam_1'
      },
      {
        
        label: 'I think it\'s promotional or spam',
        subLabel: 'Ex: someone advertises a product for monetary gain or posts irrelevant content for high visibility',
        value: 'scam_2'
      },
    ],
    [
      {
        label: 'I think it\'s discriminatory, or advocates, or supports discrimination',
        subLabel: 'Ex: discriminates based off of age or sex',
        value: 'discrimination_1'
      },
      {
        label: 'I think it\'s offensive or harassing',
        subLabel: 'Ex: threats of violence or unwelcome advances',
        value: 'discrimination_2'
      },
      {
        label: 'I think it shows or promotes extreme violence or terrorism',
        subLabel: 'Ex: torture, rape or abuse, terrorist acts, or recruitment for terrorism',
        value: 'discrimination_3'
      },
    ],
    [
      {
        label: 'The job is closed',
        subLabel: 'Ex: it’s no longer accepting applicants',
        value: 'broken_1'
      },
      {
        label: 'The job has an incorrect company',
        subLabel: 'Ex: the job has the wrong company name or page display',
        value: 'broken_2'
      },
      {
        label: 'This job has an incorrect location',
        subLabel: 'Ex: the city, state, province or country is incorrect',
        value: 'broken_3'
      },
      {
        label: 'The job has incorrect formatting',
        subLabel: 'Ex: its job details has missing text, gramatical errors, or other formatting mistakes',
        value: 'broken_4'
      },
      {
        label: 'This job does not belong on Bossjob',
        subLabel: 'Ex: the job from this page should not be posted on Bossjob',
        value: 'broken_5'
      },
    ]
  ]
  const reportList = [
    'I think it’s spam or scam',
    'I think it’s discriminatory or offensive',
    'I think something is broken'
  ]

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
          setModalReportSelected(0)
        }}
        secondButtonText='Submit'
        handleSecondButton={handleSubmit(onSubmit)}
      >
        <div className={styles.ModalReportJobDetail}>
          {reportOptions[modalReportSelected]?.map((option, i) => (
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
                  value={option.value} 
                  control={<Radio />} 
                  label={
                    <div className={styles.ModalReportJobDetailLabel}>
                      <Text textStyle='lg'>{option.label}</Text>
                      <Text textStyle='base' textColor='lightgrey'>{option.subLabel}</Text>
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
              setModalReportSelected(i)
              setModalReportSelectedItem(reportOptions[i][0].value)
            }}
          >
            <Text>{report}</Text>
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