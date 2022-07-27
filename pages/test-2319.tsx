import { useCallback, useState, useEffect } from 'react'

/* Vendors */
import useEmblaCarousel from 'embla-carousel-react'
import classNames from 'classnames'

/* Components */
import Layout from '../components/Layout'
import Text from 'components/Text'
import MaterialButton from 'components/MaterialButton'
import ProfileLayout from '../components/ProfileLayout'
import UploadResume from 'components/UploadResume'

/* Helpers */
import useWindowDimensions from 'helpers/useWindowDimensions'

/* Assets */
import {
  ResumeTemplate1,
  ResumeTemplate2,
  DownloadWhiteIcon,
  CarouselRightRoundedBlueButton,
} from 'images'

/* Styles */
import styles from './test-2319.module.scss'

// TODO: Remove this page after testing
const ResumeTabPageTest = () => {
  const { width } = useWindowDimensions()
  const initialDownloadState = {
    creative: false,
    corporate: false,
  }
  const [resume, setResume] = useState(null)
  const [isTemplateDownloadable, setIsTemplateDownloadable] = useState(initialDownloadState)

  const [selectedIndex, setSelectedIndex] = useState(0)
  const [scrollSnaps, setScrollSnaps] = useState([])

  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: 'start',
    loop: true,
    skipSnaps: false,
    inViewThreshold: 0.7,
    slidesToScroll: width < 799 ? 1 : 2,
  })

  useEffect(() => {
    if (width < 799) {
      setIsTemplateDownloadable({ creative: true, corporate: true })
    }
  }, [])

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



  const handleDeleteResume = () => {
    setResume(null)
  }

  const handleUploadResume = (file) => {
    setResume(file)
  }

  const handleDownloadResume = (type) => {
    console.log('handleDownloadResume', type)
    switch (type) {
      case 'corporate':
        // TODO: replace this with user's corporate resume
        window.open(ResumeTemplate1, '_blank')
        break
      case 'creative':
        // TODO: replace this with user's creative resume
        window.open(ResumeTemplate2, '_blank')
        break
      default:
        break
    }
  }

  const onTemplateHover = (type, boolean) => {
    if (width > 799){
      setIsTemplateDownloadable({
        ...initialDownloadState,
        [type]: boolean,
      })
    }
  }
  console.log('triggered', isTemplateDownloadable)
  console.log('selectedIndex', selectedIndex)
  return (
    <Layout>
      <ProfileLayout
        name='John Doe'
        location='Manila Philippines'
        email='johndoe@test.com'
        contactNumber='+65 91812121'
        currentTab='profile'
      >
        <div className={styles.sectionContainer}>
          <Text textColor='primaryBlue' textStyle='xl' bold>
            Upload your own resume
          </Text>
          <Text tagName='p' textStyle='lg'>
            Resume is an essential tool to get you to the next step in your job hunting process.
            Impress recruiters with additional information from your Bossjob profile.
          </Text>
          <UploadResume
            title='resume'
            resume={resume}
            handleDelete={handleDeleteResume}
            handleUpload={handleUploadResume}
            buttonClassname={styles.buttonCTA}
          />
        </div>
        <div className={styles.sectionContainer}>
          <Text textColor='primaryBlue' textStyle='xl' bold>
            Bossjob resume
          </Text>
          <Text tagName='p' textStyle='lg'>
            As you build your profile at Bossjob, we create your resume for you. You can choose from
            the available templates and use your newly improve resume to apply for job opening at
            Bossjob.
          </Text>
          <div className={styles.resumePreview}>
            <div className={styles.embla}>
              <div className={styles.emblaViewport} ref={emblaRef}>
                <div className={styles.emblaContainer}>
                  <div
                    className={styles.emblaSlide}
                  >
                    <div
                      className={styles.emblaSlideInner}
                      onMouseEnter={() => onTemplateHover('corporate', true)}
                      onMouseLeave={() => onTemplateHover('corporate', false)}
                    >
                      <img
                        src={ResumeTemplate1}
                        alt='Corporate Template'
                        className={`${styles.resumeTemplateItem}`}
                      />
                      <MaterialButton
                        variant='contained'
                        size='medium'
                        capitalize
                        onClick={() => handleDownloadResume('corporate')}
                        className={
                          isTemplateDownloadable?.corporate
                            ? styles.downloadResumeButtonActive
                            : styles.downloadResumeButton
                        }
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
                      >
                        <img
                          src={DownloadWhiteIcon}
                          alt='Download Creative Template'
                          className={styles.downloadIcon}
                          width='24px'
                          height='24px'
                        />
                        <Text textStyle='lg' textColor='white' className={styles.downloadText}>
                          Download
                        </Text>
                      </MaterialButton>
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
      </ProfileLayout>
    </Layout>
  )
}

export default ResumeTabPageTest
