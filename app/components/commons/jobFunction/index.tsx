'use client'
import { FormControl, TextField } from '@mui/material'
import { useCallback, useEffect, useMemo, useState } from 'react'
import styles from './index.module.scss'
import { useSelector } from 'react-redux'
import { flatMap, identity, isEqual } from 'lodash-es'
import JobItem from './item'
import useWindowDimensions from 'helpers/useWindowDimensions'
import Header from './header'
import classNames from 'classnames'
import MaterialButton from 'components/MaterialButton'
import Text from 'components/Text'
import { useRef } from 'react'
import { debounce } from 'lodash-es'
import PlayArrowSharpIcon from '@mui/icons-material/PlayArrowSharp'
const toSeo = (value) => value?.replaceAll('/', '-')?.replaceAll(' ', '-')?.toLowerCase()

const JobFunctionMultiSelector = (props: any) => {
  const { label, className, value, isTouched, onChange, lang, ...rest } = props
  const [showModal, setShowModal] = useState(false)
  const [firstRender, setFirstRender] = useState(true)
  const [isClosing, setIsClosing] = useState(false)
  const [rotate, setRotate] = useState('90deg')
  const { width } = useWindowDimensions()
  const isMobile = useMemo(() => {
    return window.screen.width < 768
  }, [width])
  // const isMobile = width < 768 ? true : false
  const [activeFirst, setActiveFirst] = useState<any>()
  const [activeSecond, setActiveSecond] = useState<any>()
  const secondList = useMemo(() => {
    return [{ value: 'All', id: -1, parent: activeFirst }].concat(activeFirst?.children ?? [])
  }, [activeFirst])
  const thirdList = useMemo(() => {
    return [{ value: 'All', id: -1, parent: activeSecond }].concat(activeSecond?.children ?? [])
  }, [activeSecond])
  const [mainFunctions, setMainfunctions] = useState(value?.mainFunctions ?? [])
  const [functionIds, setFunctionIds] = useState(value?.jobFunctions ?? [])
  const [functionTitleIds, setFunctionTitleIds] = useState(value?.functionTitles ?? [])
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
      setActiveSecond(null)
    }

    // return () => document.body.style.overflow = 'auto'
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
    if (
      !isEqual(value, {
        mainFunctions: mainFunctions,
        jobFunctions: functionIds,
        functionTitles: functionTitleIds
      })
    ) {
      setMainfunctions(value?.mainFunctions ?? [])
      setFunctionIds(value?.jobFunctions ?? [])
      setFunctionTitleIds(value?.functionTitles ?? [])
    }
  }, [value])
  const preShowModal = useRef(false)
  useEffect(() => {
    if (!showModal && preShowModal.current && !isMobile) {
      onChange?.({
        mainFunctions: mainFunctions,
        jobFunctions: functionIds,
        functionTitles: functionTitleIds
      })
    }
    if (!showModal) {
      setRotate('90deg')
    }
    preShowModal.current = showModal
  }, [showModal])
  const jobFunctions = useSelector(
    (store: any) => store.config.config.response?.main_functions ?? []
  )

  const formattedJobfunctions = useMemo(() => {
    return jobFunctions.map((obj, index) => {
      const firstParent = {
        value: obj.value,
        id: index,
        seo_value: obj.seo_value,
        key: toSeo(obj.key),
        children: undefined
      }
      firstParent.children = obj.children.map((second) => {
        const secondParent = {
          id: second.id,
          value: second.value,
          seo_value: toSeo(second['seo-value']),
          key: toSeo(second['seo-value']),
          parent: firstParent,
          children: undefined
        }
        secondParent.children = second.job_titles.map((third) => {
          return {
            ...third,
            parent: secondParent,
            seo_value: toSeo(third['seo-value']) + '-' + third.id,
            key: toSeo(third['seo-value']) + '-' + third.id
          }
        })

        return secondParent
      })
      return firstParent
    })
  }, [jobFunctions])

  const allSeconds = useMemo(
    () => flatMap(formattedJobfunctions, (item) => item.children),
    [formattedJobfunctions]
  )
  const allThirds = useMemo(() => flatMap(allSeconds, (item) => item.children), [allSeconds])
  const textValue = useMemo(() => {
    return (
      mainFunctions
        .map((key) => formattedJobfunctions.find((item) => item.seo_value === key)?.value)
        .concat(functionIds.map((key) => allSeconds.find((item) => item.seo_value === key)?.value))
        .concat(
          functionTitleIds.map((key) => allThirds.find((item) => item.seo_value === key)?.value)
        )
        .filter(identity)
        .join(',') ?? ''
    )
  }, [mainFunctions, functionIds, functionTitleIds, allSeconds, allThirds, formattedJobfunctions])
  const isThirdSelected = useCallback(
    (third) => {
      const parentSelect =
        functionIds.includes(third.parent.seo_value) ||
        mainFunctions.includes(third.parent.parent.seo_value)
      if (third.id === -1) {
        return parentSelect
      }
      if (parentSelect) {
        return false
      }
      return functionTitleIds.includes(third.seo_value)
    },
    [functionTitleIds, functionIds, mainFunctions]
  )

  const isSecondSelected = useCallback(
    (second) => {
      if (second.id === -1) {
        return mainFunctions.includes(second.parent.seo_value)
      }
      if (mainFunctions.includes(second.parent.seo_value)) {
        return false
      }
      return (
        functionIds.includes(second.seo_value) ||
        (second.children ?? []).filter(isThirdSelected).length > 0
      )
    },
    [functionIds, isThirdSelected, mainFunctions]
  )

  const isFirstSelected = useCallback(
    (first) => {
      return (
        mainFunctions.includes(first.seo_value) ||
        first.children.filter(isSecondSelected).length > 0
      )
    },
    [mainFunctions, isSecondSelected]
  )

  const onFirstClick = useCallback(
    (first) => {
      if (mainFunctions.includes(first.seo_value)) {
        setMainfunctions(mainFunctions.filter((key) => key !== first.seo_value))
      } else {
        setMainfunctions([first.seo_value, ...mainFunctions])
        const selectedSecondIds = first.children.map((second) => second.seo_value)
        setFunctionIds(functionIds.filter((key) => !selectedSecondIds.includes(key)))
        const selectedThirdIds = flatMap(first.children, (second) =>
          second.children.map((third) => third.seo_value)
        )
        setFunctionTitleIds(functionTitleIds.filter((key) => !selectedThirdIds.includes(key)))
      }
    },
    [mainFunctions, functionIds, functionTitleIds]
  )

  const onSecondClick = useCallback(
    (second) => {
      if (second.id === -1) {
        onFirstClick(second.parent)
      } else {
        if (mainFunctions.includes(second.parent.seo_value)) {
          setMainfunctions(mainFunctions.filter((value) => value !== second.parent.seo_value))
        }
        if (functionIds.includes(second.seo_value)) {
          setFunctionIds(functionIds.filter((key) => key !== second.seo_value))
        } else {
          const newSelected = [
            second.seo_value,
            ...functionIds.filter((key) =>
              second.parent.children.map((item) => item.seo_value).includes(key)
            )
          ]
          if (newSelected.length === second.parent.children.length) {
            onFirstClick(second.parent)
          } else {
            setFunctionIds([second.seo_value, ...functionIds])
            const selectedThirdIds = second.children.map((item) => item.seo_value)
            setFunctionTitleIds(functionTitleIds.filter((key) => !selectedThirdIds.includes(key)))
          }
        }
      }
    },
    [onFirstClick, functionIds, functionTitleIds, mainFunctions]
  )

  const onThirdClick = useCallback(
    (third) => {
      if (third.id === -1) {
        onSecondClick(third.parent)
      } else {
        if (
          functionIds.includes(third.parent.seo_value) ||
          mainFunctions.includes(third.parent.parent.seo_value)
        ) {
          setMainfunctions(mainFunctions.filter((value) => value !== third.parent.parent.seo_value))
          setFunctionIds(functionIds.filter((key) => key !== third.parent.seo_value))
        }
        if (functionTitleIds.includes(third.seo_value)) {
          setFunctionTitleIds(functionTitleIds.filter((key) => key !== third.seo_value))
        } else {
          const newSelected = [
            third.seo_value,
            ...functionTitleIds.filter((key) =>
              third.parent.children.map((item) => item.seo_value).includes(key)
            )
          ]
          if (newSelected.length === third.parent.children.length) {
            onSecondClick(third.parent)
          } else {
            setFunctionTitleIds([third.seo_value, ...functionTitleIds])
          }
        }
      }
    },
    [onSecondClick, mainFunctions, functionIds, functionTitleIds]
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
    setActiveSecond(undefined)
  }, [])
  const clear = useCallback(() => {
    setMainfunctions([])
    setFunctionIds([])
    setFunctionTitleIds([])
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
    onChange?.({
      mainFunctions: mainFunctions,
      jobFunctions: functionIds,
      functionTitles: functionTitleIds
    })
    animtionClose()
  }, [onChange, mainFunctions, functionIds, functionTitleIds, animtionClose])

  const onSecondHover = useCallback((hoverThirdList) => {
    setActiveSecond(hoverThirdList)
  }, [])
  const onFirstHover = useCallback(
    (hoverSecondList) => {
      if (firstRender) {
        setFirstRender(false)
      }
      if (activeFirst?.seo_value !== hoverSecondList.seo_value) {
        setActiveFirst(hoverSecondList)
        setActiveSecond(undefined)
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
          setRotate('-90deg')
        }}
        classes={{}}
        style={{
          background: textValue.split(',').filter((a) => a)?.length ? '#E7F1FB' : '#F0F0F0'
        }}
        inputProps={{
          style: {
            color: textValue.split(',').filter((a) => a)?.length ? '#136FD3' : 'rgba(0, 0, 0, 0.6)',

            background: textValue.split(',').filter((a) => a)?.length ? '#E7F1FB' : '#F0F0F0'
          }
        }}
        InputProps={{
          endAdornment: (
            <PlayArrowSharpIcon
              style={{
                fontSize: '14px',
                transform: `rotate(${rotate})`,
                color: 'rgba(0, 0, 0, 0.54)',
                position: 'relative',
                right: '8px'
              }}
            />
          )
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
            {formattedJobfunctions.map((first) => {
              return (
                <JobItem
                  key={first.value}
                  data={first}
                  active={activeFirst?.seo_value === first.seo_value}
                  checked={isFirstSelected(first)}
                  onMouseOver={() => onFirstHover(first)}
                  onClick={() => onFirstClick(first)}
                />
              )
            })}
          </div>
          {secondList.length > 1 && (
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
                    active={activeSecond?.seo_value === second.seo_value}
                    checked={isSecondSelected(second)}
                    onMouseOver={() => onSecondHover(second)}
                    onClick={() => {
                      onSecondClick(second)
                    }}
                    noArrow={second.id === -1}
                  />
                )
              })}
            </div>
          )}
          {thirdList.length > 1 && (
            <div
              className={styles.column}
              onScroll={(e) => {
                e.stopPropagation()
                e.preventDefault()
              }}
            >
              {thirdList.map((third) => {
                return (
                  <JobItem
                    key={third.id}
                    data={third}
                    checked={isThirdSelected(third)}
                    onClick={() => onThirdClick(third)}
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
                {formattedJobfunctions.map((first) => {
                  return (
                    <JobItem
                      key={first.value}
                      data={first}
                      active={activeFirst?.seo_value === first.seo_value}
                      checked={isFirstSelected(first)}
                      onArrowClick={(e) => {
                        e.stopPropagation()
                        onFirstHover(first)
                      }}
                      onClick={(e) => {
                        e.stopPropagation()
                        onFirstClick(first)
                      }}
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
              <Header title={activeFirst?.value} onBack={onBack} onClose={onClose}></Header>
              <div className={styles.subContainer} style={{ height: height - 59 - 75 }}>
                <div className={styles.secondContainer}>
                  {secondList.length > 1 && (
                    <div className={styles.columnSub}>
                      {secondList.map((second: any) => {
                        return (
                          <JobItem
                            key={second.id}
                            data={second}
                            active={activeSecond?.seo_value === second.seo_value}
                            checked={isSecondSelected(second)}
                            onArrowClick={(e) => {
                              e.stopPropagation()
                              onSecondHover(second)
                            }}
                            onClick={() => {
                              onSecondHover(second)
                              onSecondClick(second)
                            }}
                            noArrow={second.id === -1}
                          />
                        )
                      })}
                    </div>
                  )}
                </div>
                <div className={styles.thirdContainer}>
                  {thirdList.length > 1 && (
                    <div className={styles.columnSub}>
                      {thirdList.map((third) => {
                        return (
                          <JobItem
                            key={third.id}
                            data={third}
                            checked={isThirdSelected(third)}
                            onClick={() => onThirdClick(third)}
                            noArrow
                          />
                        )
                      })}
                    </div>
                  )}
                </div>
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

export default JobFunctionMultiSelector
