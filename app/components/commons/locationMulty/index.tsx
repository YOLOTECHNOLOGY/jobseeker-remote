'use client'
import { FormControl, TextField } from '@mui/material'
import { useCallback, useEffect, useMemo, useState,useContext } from 'react'
import styles from './index.module.scss'
import { useSelector } from 'react-redux'
import { isEqual } from 'lodash-es'
import JobItem from './item'
import useWindowDimensions from 'helpers/useWindowDimensions'
import Header from './header'
import classNames from 'classnames'
import MaterialButton from 'components/MaterialButton'
import Text from 'components/Text'
import { useRef } from 'react'
import { debounce } from 'lodash-es'
import { uniqBy, prop } from 'ramda'
// import { LocationContext } from 'app/[lang]/components/providers/locationProvier'
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import InputAdornment from '@mui/material/InputAdornment';
const LocationMultiSelector = (props: any) => {
  const { label, className, value, isTouched, onChange, lang, ...rest } = props
  const [showModal, setShowModal] = useState(false)
  const [firstRender, setFirstRender] = useState(true)
  const [isClosing, setIsClosing] = useState(false)
  const { width } = useWindowDimensions()
  // const { location, setLocation } = useContext(LocationContext)
  const isMobile = useMemo(() => {
    return window.screen.width < 768
  }, [width])
  // const isMobile = width < 768 ? true : false
  const [activeFirst, setActiveFirst] = useState<any>()
  const secondList = useMemo(() => {
    return activeFirst?.locations ?? []
  }, [activeFirst])
  const locationList = useSelector((store: any) => store.config.config.response?.location_lists)
  const [locations, setLocations] = useState<any[]>([])
  const locationIds = useMemo(() => {   
   // setLocation(locations)
    return locations.map(item => item?.id)
  }, [locations])

  const [height, setHeight] = useState(0)
  useEffect(() => {
    if (!isMobile) {
      document.body.style.overflow = 'auto'
      return
    }
    if (showModal) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'auto'
      setActiveFirst(null)
    }
  }, [showModal, isMobile])
  useEffect(() => {
    const convertStyle = debounce(() => {
      setHeight(window.innerHeight)
    }, 50)
    setHeight(window.innerHeight)
    window.addEventListener('resize', convertStyle)
    window.addEventListener('DOMContentLoaded', convertStyle)
    return () => {
      window.removeEventListener('resize', convertStyle)
      window.removeEventListener('DOMContentLoaded', convertStyle)
    }
  }, [])

  useEffect(() => {
    if (!isEqual(value, locations)) {
      setLocations(value?.filter(a => a) ?? [])
    }
  }, [value])
  const preShowModal = useRef(false)
  useEffect(() => {
    if (!showModal && preShowModal.current && !isMobile) {
      onChange?.(locations)
    }
    preShowModal.current = showModal
  }, [showModal])


  const textValue = useMemo(() => {
    return locationIds?.join(',')
  }, [locationIds])

  const isSecondSelected = useCallback(
    (second) => {
      return !!locations.find(item => item.id === second.id)
    },
    [locations]
  )

  const isFirstSelected = useCallback(
    (first) => {
      return !first.locations.find(item => !isSecondSelected(item))
    },
    [locationList, isSecondSelected]
  )

  const isFirstHalfSelected = useCallback(
    (first) => {
      return first.locations.find(item => isSecondSelected(item))
    },
    [locationList, isSecondSelected]
  )

  const onFirstClick = useCallback(
    (first) => {
      if (isFirstSelected(first)) {
        setLocations(locations.filter(item => !first.locations.map(item => item.id).includes(item.id)))
      } else {
        setLocations(uniqBy(prop('id'), [...locations, ...first.locations]))
      }
    },
    [isFirstSelected, locations]
  )

  const onSecondClick = useCallback(
    (second) => {
      if (locationIds.includes(second.id)) {
        setLocations(locations.filter(location => location.id !== second.id))
      } else {
        setLocations([...locations, second])
      }
    },
    [locations]
  )


  const listener = useCallback((e) => {
    if (e.target.id?.includes?.('job-item')) {
      return
    }
    setShowModal(false)
    document.removeEventListener('click', listener)
  }, [])
  useEffect(() => {
    if (!isMobile) {
      if (showModal) {
        setTimeout(() => {
          document.addEventListener('click', listener)
        }, 1000)
      } else {
        document.removeEventListener('click', listener)
      }
      return () => document.removeEventListener('click', listener)
    }
  }, [showModal])
  const onBack = useCallback(() => {
    setActiveFirst(undefined)
  }, [])
  const clear = useCallback(() => {
    setLocations([])
  }, [value])
  const animtionClose = useCallback(() => {
    setIsClosing(true)
    setTimeout(() => {
      setShowModal(false)
      setIsClosing(false)
      setFirstRender(true)
    }, 300)
  }, [])
  const onClose = useCallback(() => {
    clear()
    animtionClose()
  }, [clear, animtionClose])

  const onSave = useCallback(() => {
    onChange?.(locations)
    animtionClose()
  }, [onChange, locations, animtionClose])


  const onFirstHover = useCallback(
    (hoverSecondList) => {
      if (firstRender) {
        setFirstRender(false)
      }
      if (activeFirst?.id !== hoverSecondList.id) {
        setActiveFirst(hoverSecondList)
      }
    },
    [activeFirst]
  )
  const valueText = useMemo(() => {
    const selected = textValue.split(',').filter((a) => a)
    return `${label} ${selected?.length ? `(${selected.length})` : ''}`
  }, [textValue])
  return (
    <FormControl className={className} size='small'>
      <TextField
        value={valueText}
        autoComplete='off'
        
        label={<div style={{ position: 'relative', bottom: 7 }}>{label}</div>}
        onClick={(e) => {
          e.preventDefault()
          e.stopPropagation()
          setShowModal(true)
        }}
       
        classes={{}}
        style={{
          background: textValue.split(',').filter((a) => a)?.length ? '#E7F1FB' : '#F0F0F0',
          borderRadius:"10px"
        }}
        inputProps={{
          style: {
            color: textValue.split(',').filter((a) => a)?.length ? '#1D2129' : '#86909C',
            background: textValue.split(',').filter((a) => a)?.length ? '#fff' : '#ffff',
            textAlign:"center"
          },
        }}
        InputProps={{
          endAdornment : <InputAdornment position="end"><KeyboardArrowDownIcon style={{color:"#1D2129",position:'relative',left:'-8px'}} /></InputAdornment> 
        }}
        disabled={showModal}
        onFocus={(e) => {
          e.preventDefault()
          e.stopPropagation()
          if (!isTouched) {
            setShowModal(true)
          }
          rest?.onFocus?.(e)
          Promise.resolve().then(() => {
            e.target.blur()
          })
        }}
        {...rest}
      />
      {showModal && (
        <div
          className={styles.container}
          onClick={(e) => {
            e.preventDefault()
            e.stopPropagation()
          }}
          onScroll={(e) => {
            e.stopPropagation()
            e.preventDefault()
          }}
        >
          <div
            className={styles.column}
            onScroll={(e) => {
              e.stopPropagation()
              e.preventDefault()
            }}
          >
            {locationList.map((first) => {
              return (
                <JobItem
                  key={first.id}
                  data={{ ...first, value: first.display_name }}
                  active={activeFirst?.id === first.id}
                  checked={isFirstSelected(first)}
                  halfChecked={isFirstHalfSelected(first)}
                  onMouseOver={() => onFirstHover(first)}
                  onClick={() => onFirstClick(first)}
                  noArrow={!(first?.locations?.length > 0)}
                />
              )
            })}
          </div>
          {secondList.length > 0 && (
            <div
              className={styles.column}
              onScroll={(e) => {
                e.stopPropagation()
                e.preventDefault()
              }}
            >
              {secondList.map((second: any) => {
                return (
                  <JobItem
                    key={second.id}
                    data={second}
                    checked={isSecondSelected(second)}
                    onClick={() => {
                      onSecondClick(second)
                    }}
                    noArrow
                  />
                )
              })}
            </div>
          )}

        </div>
      )}
      {showModal && isMobile && (
        <div
          className={classNames({
            [styles.mobile]: true,
            [styles.showModal]: firstRender,
            [styles.closingModal]: isClosing
          })}
          onClick={(e) => {
            e.preventDefault()
            e.stopPropagation()
          }}
          style={{ height: height - 50 }}
        >
          <div className={styles.topContainer}>
            <div
              className={classNames({
                [styles.firstPage]: true,
                [styles.show]: !!activeFirst && !firstRender,
                [styles.hide]: !activeFirst && !firstRender
              })}
            >
              <Header title={label} onClose={animtionClose}></Header>

              <div className={styles.columnMain} style={{ height: height - 56 - 76 - 10 }}>
                {locationList.map((first) => {
                  return (
                    <JobItem
                      key={first.id}
                      data={{ ...first, value: first.display_name }}
                      active={activeFirst?.id === first.id}
                      checked={isFirstSelected(first)}
                      halfChecked={isFirstHalfSelected(first)}
                      onArrowClick={(e) => {
                        e.stopPropagation()
                        onFirstHover(first)
                      }}
                      onClick={(e) => {
                        e.stopPropagation()
                        onFirstClick(first)
                      }}
                      noArrow={false}
                    />
                  )
                })}
              </div>
            </div>
            <div
              className={classNames({
                [styles.secondPage]: true,
                [styles.show]: !!activeFirst && !firstRender,
                [styles.hide]: !activeFirst && !firstRender
              })}
            >
              <Header title={activeFirst?.display_name} onBack={onBack} onClose={onClose}></Header>
              {/* <div className={styles.subContainer} style={{ height: height - 59 - 75 }}> */}
                <div className={styles.secondContainer}>
                  {secondList.length > 0 && (
                    <div className={styles.columnSub}>
                      {secondList.map((second: any) => {
                        return (
                          <JobItem
                            key={second.id}
                            data={second}
                            checked={isSecondSelected(second)}
                            onArrowClick={(e) => {
                              e.stopPropagation()
                            }}
                            onClick={() => {
                              onSecondClick(second)
                            }}
                            noArrow
                          />
                        )
                      })}
                    </div>
                  )}
                {/* </div> */}

              </div>
            </div>
          </div>
          <div className={styles.buttonContainer}>
            <MaterialButton
              variant='outlined'
              capitalize
              onClick={clear}
              sx={{ height: '44px', width: '40%', borderRadius: 10 }}
            >
              <Text textColor='primaryBlue' bold>
                {lang?.reset2}
              </Text>
            </MaterialButton>

            <MaterialButton
              variant='contained'
              capitalize
              onClick={onSave}
              sx={{ height: '44px', width: '40%', borderRadius: 10 }}
            >
              <Text textColor='white' bold>
                {lang?.save}
              </Text>
            </MaterialButton>
          </div>
        </div>
      )}
    </FormControl>
  )
}

export default LocationMultiSelector
