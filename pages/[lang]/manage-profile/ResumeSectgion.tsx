import React, { useState, useEffect, useCallback } from 'react'

/* Vendors */
import { useDispatch, useSelector } from 'react-redux'
import useEmblaCarousel from 'embla-carousel-react'
import moment from 'moment'
import Snackbar from '@mui/material/Snackbar'
import Alert from '@mui/material/Alert'

/* Redux actions */
import { fetchUserOwnDetailRequest } from 'store/actions/users/fetchUserOwnDetail'

import { displayNotification } from 'store/actions/notificationBar/notificationBar'
import { uploadUserResumeService } from 'store/services/users/uploadUserResume'

/* Components */
import Text from 'components/Text'

import UploadResume from 'components/UploadResume'
import MaterialButton from 'components/MaterialButton'

/* Helpers */
import useWindowDimensions from 'helpers/useWindowDimensions'
import { getCookie } from 'helpers/cookies'
import { useFirstRender } from 'helpers/useFirstRender'
moment.locale('en')
/* Services */
import { fetchResumeDelete } from 'store/services/auth/fetchResumeDelete'

/* Assets */
import {
  ResumeTemplate1,
  ResumeTemplate2,
  DownloadWhiteIcon,
  CarouselRightRoundedBlueButton,
  AddIcon
} from 'images'

/* Styles */
import classNames from 'classnames'
import styles from './ManageProfile.module.scss'
import { Upload } from 'components/UploadResume/Upload'
import { SnackbarTips } from 'components/UploadResume/SnackbarTips'
import { maxFileSize } from 'helpers/handleInput'

const ResumeView = ({ userDetail, lang }: any) => {
  const {
    manageProfile: {
      tab: { resume: transitions }
    }
  } = lang
  const accessToken = getCookie('accessToken')
  const isFirstRender = useFirstRender()
  const dispatch = useDispatch()
  const { width } = useWindowDimensions()
  const isMobile = width < 768 ? true : false
  const isSuccessfulUpload = useSelector((store: any) => store.users.uploadUserResume.response)

  const initialDownloadState = {
    creative: false,
    corporate: false
  }
  const [showSnackbarModal, setShowSnackbarModal] = useState(false)
  const [resume, setResume] = useState(userDetail.resumes || [])
  const [isTemplateDownloadable, setIsTemplateDownloadable] = useState(initialDownloadState)
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [scrollSnaps, setScrollSnaps] = useState([])
  const [deleteResumeLoading, setDeleteResumeLoading] = useState(false)
  const [isExceedLimit, setIsExceedLimit] = useState(false)

  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: 'start',
    loop: true,
    skipSnaps: false,
    inViewThreshold: 0.7,
    slidesToScroll: width < 799 ? 1 : 2
  })

  useEffect(() => {
    if (width < 799) {
      setIsTemplateDownloadable({ creative: true, corporate: true })
    }
  }, [])

  useEffect(() => {
    if (!isFirstRender) dispatch(fetchUserOwnDetailRequest({ accessToken }))
  }, [isSuccessfulUpload])

  const scrollPrev = useCallback(() => {
    if (emblaApi) {
      emblaApi.scrollPrev()
    }
  }, [emblaApi])

  const scrollNext = useCallback(() => {
    if (emblaApi) {
      emblaApi.scrollNext()
    }
  }, [emblaApi])

  const scrollTo = useCallback((index) => emblaApi && emblaApi.scrollTo(index), [emblaApi])

  const onSelect = useCallback(() => {
    if (!emblaApi) return
    setSelectedIndex(emblaApi.selectedScrollSnap())
  }, [emblaApi, setSelectedIndex])

  useEffect(() => {
    if (!emblaApi) return
    onSelect()
    setScrollSnaps(emblaApi.scrollSnapList())
    emblaApi.on('select', onSelect)
    emblaApi.reInit()
  }, [emblaApi, setScrollSnaps, onSelect])

  const handleDeleteResume = (resumeId: number) => {
    setDeleteResumeLoading(true)
    fetchResumeDelete(resumeId)
      .then(({ status }) => {
        if (status === 200) {
          setResume((resumes) => resumes.filter((item) => item.id !== resumeId))
        }
      })
      .catch(() => {
        setShowSnackbarModal(true)
      })
      .finally(() => {
        setDeleteResumeLoading(false)
      })
  }

  const handleUploadResume = (file) => {
    uploadUserResumeService(file)
      .then((response) => {
        setResume((resumes) => [...resumes, response.data.data])
      })
      .catch((error) => {
        dispatch(
          displayNotification({
            open: true,
            severity: 'error',
            message: `Failed to upload resume with error: ${error.message}. 
        Please contact support@bossjob.com for assistance.`
          })
        )
      })
  }

  const handleDownloadResume = (type) => {
    const sourcePath = process.env.DOCUMENT_GENERATOR_URL

    switch (type) {
      case 'corporate':
        // TODO: replace this with user's corporate resume
        window.open(`${sourcePath}/resume/pro/bossjob.pdf?token=${accessToken}`, '_blank')
        break
      case 'creative':
        // TODO: replace this with user's creative resume
        window.open(`${sourcePath}/resume/creative/bossjob.pdf?token=${accessToken}`, '_blank')
        break
      default:
        break
    }
  }

  const onTemplateHover = (type, boolean) => {
    if (width > 799) {
      setIsTemplateDownloadable({
        ...initialDownloadState,
        [type]: boolean
      })
    }
  }
  return (
    <React.Fragment>
      <div className={styles.sectionContainer}>
        <div className={styles.resumeTitle}>
          <Text textColor='primaryBlue' textStyle='xl' bold>
            {/* Upload your own resume */}
            {transitions.upload.title}
          </Text>
          {resume.length < 3 && (
            <label>
              <img style={{ cursor: 'pointer' }} src={AddIcon} width={14} height={14} />
              <Upload
                onChange={(event) => {
                  const file = event.target.files[0]
                  if (!maxFileSize(file, 5)) {
                    setIsExceedLimit(true)
                    return
                  }
                  handleUploadResume(file)
                }}
              />
            </label>
          )}
        </div>
        <Text tagName='p' textStyle='lg'>
          {transitions.upload.tips}
        </Text>
        <UploadResume
          lang={lang}
          title='resume'
          resumes={resume}
          handleDelete={handleDeleteResume}
          handleUpload={handleUploadResume}
          buttonClassname={styles.buttonCTA}
          deleteResumeLoading={deleteResumeLoading}
        />
      </div>
      <div className={styles.sectionContainer}>
        <Text textColor='primaryBlue' textStyle='xl' bold>
          {transitions.bossjob.title}
        </Text>
        <Text tagName='p' textStyle='lg'>
          {transitions.bossjob.tips}
        </Text>
        <div className={styles.resumePreview}>
          <div className={styles.embla}>
            <div className={styles.emblaViewport} ref={emblaRef}>
              <div className={styles.emblaContainer}>
                <div className={styles.emblaSlide}>
                  <div
                    className={styles.emblaSlideInner}
                    onMouseEnter={(e) => {
                      if (isMobile) {
                        e.preventDefault()
                      } else {
                        onTemplateHover('corporate', true)
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (isMobile) {
                        e.preventDefault()
                      } else {
                        onTemplateHover('corporate', false)
                      }
                    }}
                  >
                    <img
                      src={ResumeTemplate1}
                      alt='Corporate Template'
                      className={`${styles.resumeTemplateItem}`}
                    />
                    {!isMobile && (
                      <MaterialButton
                        variant='contained'
                        size='medium'
                        capitalize
                        onClick={() => {
                          handleDownloadResume('corporate')
                        }}
                        className={
                          isTemplateDownloadable?.corporate
                            ? styles.downloadResumeButtonActive
                            : styles.downloadResumeButton
                        }
                        sx={{ display: isTemplateDownloadable?.corporate ? 'flex' : 'none' }}
                      >
                        <img
                          src={DownloadWhiteIcon}
                          alt='Download Corporate Template'
                          className={styles.downloadIcon}
                        />
                        <Text textStyle='lg' textColor='white' className={styles.downloadText}>
                          {transitions.bossjob.download}
                        </Text>
                      </MaterialButton>
                    )}
                  </div>
                </div>
                <div className={styles.emblaSlide}>
                  <div
                    className={styles.emblaSlideInner}
                    onMouseEnter={() => onTemplateHover('creative', true)}
                    onMouseLeave={() => onTemplateHover('creative', false)}
                  >
                    <img
                      src={ResumeTemplate2}
                      alt='Creative Template'
                      className={`${styles.resumeTemplateItem}`}
                    />
                    {!isMobile && (
                      <MaterialButton
                        variant='contained'
                        size='medium'
                        capitalize
                        onClick={() => handleDownloadResume('creative')}
                        className={
                          isTemplateDownloadable?.creative
                            ? styles.downloadResumeButtonActive
                            : styles.downloadResumeButton
                        }
                        sx={{ display: isTemplateDownloadable?.creative ? 'flex' : 'none' }}
                      >
                        <img
                          src={DownloadWhiteIcon}
                          alt='Download Creative Template'
                          className={styles.downloadIcon}
                          width='24px'
                          height='24px'
                        />
                        <Text textStyle='lg' textColor='white' className={styles.downloadText}>
                          {transitions.bossjob.download}
                        </Text>
                      </MaterialButton>
                    )}
                  </div>
                </div>
              </div>
            </div>
            <div className={styles.slidesControl}>
              {selectedIndex >= 1 && (
                <div
                  className={classNames([styles.slidesControlItem, styles.slidesControlLeft])}
                  onClick={scrollPrev}
                >
                  <img
                    src={CarouselRightRoundedBlueButton}
                    alt='previous'
                    className={styles.carouselPrev}
                  />
                </div>
              )}
              {selectedIndex < 1 && (
                <div
                  className={classNames([styles.slidesControlItem, styles.slidesControlRight])}
                  onClick={scrollNext}
                >
                  <img
                    src={CarouselRightRoundedBlueButton}
                    alt='next'
                    className={styles.carouselNext}
                  />
                </div>
              )}
            </div>
            <div className={styles.sectionContentSmallDivider}></div>
            {isMobile && (
              <MaterialButton
                variant='contained'
                size='medium'
                capitalize
                onClick={() =>
                  selectedIndex === 0
                    ? handleDownloadResume('corporate')
                    : handleDownloadResume('creative')
                }
                className={styles.downloadResumeButtonMobile}
              >
                <img
                  src={DownloadWhiteIcon}
                  alt='Download Corporate Template'
                  className={styles.downloadIcon}
                />
                <Text textStyle='lg' textColor='white' className={styles.downloadText}>
                  Download
                </Text>
              </MaterialButton>
            )}
            <div className={styles.emblaDots}>
              {scrollSnaps.map((_, index) => (
                <div
                  key={index}
                  className={index === selectedIndex ? styles.emblaDotActive : styles.emblaDot}
                  onClick={() => scrollTo(index)}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
      {/* exceed the limit */}
      <SnackbarTips
        show={isExceedLimit}
        onDismiss={() => {
          setIsExceedLimit(false)
        }}
      />
      <Snackbar
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
        open={showSnackbarModal}
        onClose={() => setShowSnackbarModal(false)}
        message='I love snacks'
        key='resumeDelete'
      >
        <Alert onClose={() => setShowSnackbarModal(false)} severity='error' sx={{ width: '100%' }}>
          Failed to delete resume
        </Alert>
      </Snackbar>
    </React.Fragment>
  )
}

export default ResumeView
