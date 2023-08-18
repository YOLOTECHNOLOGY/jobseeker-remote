/* eslint-disable @next/next/no-img-element */
import React, { useState, useEffect, useCallback, useRef, forwardRef } from 'react'
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
  uploadVideoToAmazonService,
  getVideoResumeList,
  deleteVideoResume
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
  CarouselRightRoundedBlueButton,
  delVideoResume,
  playVideoResume,
  AddIcon,
  CloseIcon
} from 'images'

/* Styles */
import classNames from 'classnames'
import styles from './index.module.scss'
import { Upload } from 'components/UploadResume/Upload'
import { SnackbarTips } from 'components/UploadResume/SnackbarTips'
import { maxFileSize } from 'helpers/handleInput'
import Image from 'next/image'
import Modal from 'components/Modal'

const VideoResumeList = ({ data, handleDeleteVideo, handlePlayVideo }) => {
  if (!data.length) return null
  return data.map(item =>
    <div
      key={item.id}
      className={styles.item}
      onClick={() => handlePlayVideo(item.url)}
    >
      <img
        src={delVideoResume}
        className={styles.imageDel}
        alt=""
        width="24"
        height='24'
        onClick={(e) => handleDeleteVideo(item.id, e)} />
      <img
        src={playVideoResume}
        className={styles.imagePlay}
        width="50"
        height="50"
        alt="" />
      <img
        src={item.video_cover}
        alt={item.video_cover}
        className={styles.imageCover} />
    </div >
  )
}

const UploadVideoResumeButton = ({ uploading, uploadInputRef, handleUploadVideoChange }) => (
  <div className={`${styles.uploadVideoButton} ${styles.item}`}>
    {
      !uploading ? <img src={AddIcon} width='32' height='32' alt="" /> :
        <div className={styles.uploading}></div>
    }
    <input
      ref={uploadInputRef}
      type="file"
      accept=".mp4"
      disabled={uploading}
      onChange={handleUploadVideoChange}
    />
  </div>
)

const CoverVideoResumePlay = ({ handleCloseVideo, playVideoRef }) => {
  return (
    <div className={styles.videoCoverWrap}>
      <img src={CloseIcon} alt="" width="20" height="20" onClick={handleCloseVideo} />
      <div className={styles.videoCover}>
        <video ref={playVideoRef} width="900" height="570" controls />
      </div>
    </div>
  )
}


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
  const uploadInputRef = useRef(null)
  const [videoResumeList, setVideoResumeList] = useState([])
  const [showConfirm, setShowConfirm] = useState(false)
  const [playVideo, setPlayVideo] = useState(false)
  const videoUrlRef = useRef('')
  const currentVideoId = useRef(null)
  const [uploading, setUploading] = useState(false)

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

    const now = Date.now()

    const video = document.createElement('video')
    video.style.cssText += ';position:absolute; top: -99999px'
    video.muted = true
    video.src = URL.createObjectURL(file)
    video.setAttribute('crossOrigin', 'anonymous')
    video.currentTime = 1
    document.body.appendChild(video)

    let canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    canvas.width = video.clientWidth
    canvas.height = video.clientHeight

    video.addEventListener('loadeddata', async () => {
      setUploading(true)
      ctx.drawImage(video, 0, 0, video.clientWidth, video.clientHeight);
      const dataURL = canvas.toDataURL('image/jpeg')
      video.setAttribute("poster", dataURL)
      const files = dataURLtoFile(dataURL, now + '.jpeg')
      try {
        const aresult = await uploadVideoCover(files).catch(err => console.log('xxx'))
        const result = await generatePresignedUrl(`${now}-${file.name}`)
        const aws = await uploadVideoToAmazonService(result.data.data, file)
        if (aws.status === 200) {
          const subUrl = `https://${result.data.data.split('?')[0].replace(/(^.*amazonaws\.com\/)/, '')}`
          uploadVideoResume(subUrl, aresult.data.data.id).then(res => {
            videoResumesList()
            uploadInputRef.current.value = ''
            video && document.body.removeChild(video)
            canvas = null
            setUploading(false)
          })
        }
      } catch (err) {
        console.log(err)
      }
    })
  }

  const videoResumesList = async () => {
    const result = await getVideoResumeList().catch(err => { })
    if (result.data.data) {
      setVideoResumeList(result.data.data)
    }
    // getVideoResumeList().then(res => {
    //   if (res.data.data) {

    //   }
    // }).catch(err => {
    //   console.log(err)
    // })
  }
  const handleDeleteVideo = (id, e) => {
    e.stopPropagation()
    setShowConfirm(true)
    currentVideoId.current = id
  }
  const handlePlayVideo = (url) => {
    setPlayVideo(true)
    videoUrlRef.current = url
  }
  const handleCloseVideo = () => {
    setPlayVideo(false)
  }
  useEffect(() => {
    videoResumesList()
  }, [])

  const playVideoRef = useCallback(el => {
    const handleVideoPlayEnded = () => {
      el.currentTime = 0;
    }
    if (el) {
      if (playVideo) {
        el.src = videoUrlRef.current
        el.addEventListener('ended', handleVideoPlayEnded)
        // node.play()
      }
      else {
        el.src = ''
        el.removeEventListener('ended', handleVideoPlayEnded)
      }
    }
  }, [playVideo])

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
      <div className={styles.sectionContainer}>
        <div className={styles.preview_title}>
          Self - introduction Videos
        </div>
        <p style={{ color: '#7d7d7d' }}>视频格式MP4，时间控制在30S内，视频大小不超过5M</p>
        <div className={styles.videoResumeContainer}>
          <VideoResumeList
            data={videoResumeList}
            handlePlayVideo={handlePlayVideo}
            handleDeleteVideo={handleDeleteVideo}
          />
          {videoResumeList.length < 3 && <UploadVideoResumeButton
            uploading={uploading}
            uploadInputRef={uploadInputRef}
            handleUploadVideoChange={handleUploadVideoChange}
          />}
        </div>
        <div className={styles.split}></div>
      </div>

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

      <Modal
        showModal={showConfirm}
        handleModal={() => {
          setShowConfirm(false)
          currentVideoId.current = null
        }}
        headerTitle="删除简历视频"
        firstButtonText="取消"
        secondButtonText="确认"
        isSecondButtonLoading={null}
        firstButtonIsClose
        handleFirstButton={() => {
          setShowConfirm(false)
          currentVideoId.current = null
        }}
        handleSecondButton={() => {
          deleteVideoResume(currentVideoId.current).then(res => {
            console.log('res:', res)
            setShowConfirm(false)
            videoResumesList()
          }).catch(err => console.log(err))
        }}
        fullScreen
      >
        删除视频简历后不可找回，您确认删除吗？
      </Modal>
      {playVideo && <CoverVideoResumePlay handleCloseVideo={handleCloseVideo} playVideoRef={playVideoRef} />}
    </div>

  )
}



export default ResumeView
