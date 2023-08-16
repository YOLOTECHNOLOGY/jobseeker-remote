/* eslint-disable @next/next/no-img-element */
import React, { useState, useEffect, useCallback, useRef } from 'react'
import axios from 'axios'
/* Vendors */
import { useDispatch, useSelector } from 'react-redux'
import useEmblaCarousel from 'embla-carousel-react'
import moment from 'moment'
import Snackbar from '@mui/material/Snackbar'
import Alert from '@mui/material/Alert'
import { Download } from '@mui/icons-material';

/* Redux actions */
import { fetchUserOwnDetailRequest } from 'store/actions/users/fetchUserOwnDetail'

import { displayNotification } from 'store/actions/notificationBar/notificationBar'
import {
  uploadUserResumeService,
  uploadVideoCover,
  uploadVideoResume,
  generatePresignedUrl,
  uploadToAmazonService,
  getVideoResumesList
} from 'store/services/users/uploadUserResume'

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
import { ColorButton } from './Button';
/* Assets */
import {
  ResumeTemplate1,
  ResumeTemplate2,
  DownloadWhiteIcon,
  CarouselRightRoundedBlueButton
} from 'images'

/* Styles */
import classNames from 'classnames'
import styles from './index.module.scss'
import { Upload } from 'components/UploadResume/Upload'
import { SnackbarTips } from 'components/UploadResume/SnackbarTips'
import { maxFileSize } from 'helpers/handleInput'
import Image from 'next/image'
import { parse } from 'query-string'


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
  const tempVideoRef = useRef(null)

  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: 'start',
    loop: true,
    skipSnaps: false,
    inViewThreshold: 0.7,
    slidesToScroll: width < 799 ? 1 : 2
  })

  useEffect(() => {
    setResume(userDetail.resumes || [])
  }, [userDetail.resumes])

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

  function dataURLtoFile(dataurl, filename) {
    const arr = dataurl.split(',');
    const mime = arr[0].match(/:(.*?);/)[1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);

    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], filename, { type: mime });
  }


  const handleUploadVideoChange = async ({ target }) => {
    const file = target.files[0]
    if (!file) {
      return false
    }
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    const now = Date.now()
    tempVideoRef.current.src = URL.createObjectURL(file)
    tempVideoRef.current.setAttribute('crossOrigin', 'anonymous')
    tempVideoRef.current.currentTime = 1;
    canvas.width = tempVideoRef.current.clientWidth
    canvas.height = tempVideoRef.current.clientHeight

    tempVideoRef.current.addEventListener('loadeddata', async () => {
      ctx.drawImage(
        tempVideoRef.current,
        0,
        0,
        tempVideoRef.current.clientWidth,
        tempVideoRef.current.clientHeight
      );
      const dataURL = canvas.toDataURL('image/jpeg')
      tempVideoRef.current.setAttribute("poster", dataURL)
      const files = dataURLtoFile(dataURL, now + '.jpeg')
      try {
        const aresult = await uploadVideoCover(files).catch(err => console.log('err:', err))
        const result = await generatePresignedUrl(`${now}-${file.name}`)

        // const aws = await axios.put(result.data.data, file, {
        //   headers: {
        //     "Access-Control-Allow-Origin": "*",
        //     "Access-Control-Allow-Headers": "Content-Type",
        //     "Accept": "*/*",
        //     "Cache-Control": "no-cache",
        //     "Accept-Encoding": "gzip, deflate, br",
        //     "Content-Type": file.type,
        //   },
        // })
        const aws = await uploadToAmazonService(result.data.data, file)
        if (aws.status === 200) {
          const subUrl = `https://${result.data.data.split('?')[0].replace(/(^.*amazonaws\.com\/)/, '')}`
          console.log('subUrl:', subUrl)
          uploadVideoResume(subUrl, aresult.data.data.id).then(res => {
            console.log('res:', res)
          })
        }
      } catch (err) {
        console.log(err)
      }
    })
  }
  useEffect(() => {
    getVideoResumesList().then(res => {
      console.log('res:', res)
    })
  }, [])

  return (
    <div className={styles.tab_content_wrapper}>
      <div className={styles.sectionContainer}>
        <div className={styles.resumeTitle}>
          <Text textColor='primaryBlue' className={styles.resume_title_text}>
            {/* Upload your own resume */}
            {transitions.upload.title}
          </Text>
          {resume.length < 3 && (
            <label className={styles.add}>
              {/* <img style={{ cursor: 'pointer' }} src={AddIcon} width={14} height={14} /> */}
              <Image src={require('./add.svg').default.src} width={26} height={26} alt="add"></Image>
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
        <div style={{ height: 20 }}></div>

        <Text className={styles.resume_subtitle} textStyle='lg'>
          {transitions.upload.tips}
        </Text>
        <UploadResume
          lang={lang}
          title='resume'
          resumes={resume}
          // handleDelete={handleDeleteResume}
          handleUpload={handleUploadResume}
          buttonClassname={styles.buttonCTA}
          deleteResumeLoading={deleteResumeLoading}
        />
        <div className={styles.split}></div>
      </div>
      <input
        type="file"
        accept=".mp4"
        onChange={handleUploadVideoChange}
        style={{ opacity: 0.5 }}
      />
      <div className={styles.sectionContainer}>
        <div className={styles.preview_title}>
          {transitions.bossjob.title}
        </div>
        <div className={styles.preview_subtitle}>
          {transitions.bossjob.tips}
        </div>
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
                      className={`${styles.resumeTemplateItem} `}
                    />
                    {!isMobile && (
                      <ColorButton
                        sx={{ display: isTemplateDownloadable?.corporate ? 'flex' : 'none' }}
                        className={
                          isTemplateDownloadable?.corporate
                            ? styles.downloadResumeButtonActive
                            : styles.downloadResumeButton
                        }
                        startIcon={<Download />}
                        onClick={() => {
                          handleDownloadResume('corporate')
                        }}
                      >
                        {transitions.bossjob.download}
                      </ColorButton>
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
                      className={`${styles.resumeTemplateItem} `}
                    />
                    {!isMobile && (
                      <ColorButton
                        sx={{ display: isTemplateDownloadable?.creative ? 'flex' : 'none' }}
                        className={
                          isTemplateDownloadable?.corporate
                            ? styles.downloadResumeButtonActive
                            : styles.downloadResumeButton
                        }
                        startIcon={<Download />}
                        onClick={() => {
                          handleDownloadResume('creative')
                        }}
                      >
                        {transitions.bossjob.download}
                      </ColorButton>
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
                  {transitions.bossjob.download}
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
      <video controls muted ref={tempVideoRef} style={{ position: 'absolute', top: '-99999px' }} />
    </div>

  )
}

export default ResumeView
