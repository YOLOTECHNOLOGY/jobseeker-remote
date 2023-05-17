import { FormControl, MenuList, Paper } from '@mui/material'
import MaterialTextField from 'components/MaterialTextField'
import Modal from '@mui/material/Modal'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import styles from './index.module.scss'
import TopBar from './topBar'
import { useSelector } from 'react-redux'
import { flatMapDeep, values, groupBy } from 'lodash-es'
import { Plus, Minus } from 'images'
import Text from 'components/Text'
import classNames from 'classnames'
const formatMenuText = (value) => {
  const text = value.replaceAll('\n', '')
  if (text.length <= 16) {
    return text
  }
  const lastIndex = text.lastIndexOf('/') + 1
  if (lastIndex !== -1) {
    const newText = text.slice(0, lastIndex) + '\n' + text.slice(lastIndex, text.length + lastIndex)
    return newText
  }
  return text
}
const JobFunctionSelector = (props: any) => {
  const { value, jobTitle = '', className, title, onChange, isTouched, onBlur,lang, ...rest } = props
  const menuRef = useRef(null)

  const [showModal, setShowModal] = useState(false)
  const [selectedSubItem, setSelectedSubItem] = useState<any>({})
  const [expandeds, setExpandeds] = useState([])
  const jobFunctions = useSelector(
    (store: any) => store.config.config.response?.main_job_function_lists ?? []
  )
  const jobFunctionsKeys = jobFunctions

  const jobFunctionsObject = useMemo(() => {
    const newObject = {}
    jobFunctions.map(e => (newObject[e.id] = e))
    return newObject
  }, [jobFunctions])

  const [selectedKey, setSelectedKey] = useState<any>(jobFunctionsKeys?.[0])
  const [init, setInit] = useState(false)

  useEffect(() => {
    if (jobTitle && !value) {
      const allTitles = flatMapDeep(values(jobFunctionsObject), (group) =>
        group.map((item) => item.job_titles)
      )
      const title = allTitles.find((item) => item.value === jobTitle)
      onChange(title)
    }
  }, [])

  useEffect(() => {
    if (jobFunctionsKeys.length > 0) {
      setInit(true)
    }
  }, [jobFunctionsKeys])

  useEffect(() => {
    if (init) {
      setSelectedKey(jobFunctionsKeys[0]?.id)
    }
  }, [init])

  const selectedItem = useMemo(() => {
    if (selectedKey) {
      return jobFunctionsObject[selectedKey]?.sub_function_list
    }
  }, [selectedKey])
  const groupedSelected = useMemo(() => {
    return values(
      groupBy(selectedItem, (o) => {
        return Math.floor(selectedItem.indexOf(o) / 3)
      })
    )
  }, [selectedItem])
  const selectedGroupIndex = useMemo(() => {
    const group = (groupedSelected ?? []).find((group) => {
      return group.filter((subItem) => subItem.id === selectedSubItem?.id).length
    })
    return groupedSelected?.indexOf(group) ?? -1
  }, [groupedSelected, selectedSubItem])

  useEffect(() => {
    if (value) {
      onChange(value)
      setShowModal(false)
    }

    if (value?.value) {
      initDefaultJobFunctionSelect()
    }
  }, [value])

  useEffect(() => {
    ;(async () => {
      if (showModal) {
        const t = await setTimeout(() => {
          clearTimeout(t)
        })

        const selectTabNode = menuRef.current.querySelector(`[name="${selectedKey}"]`)
        menuRef.current.scrollTop = selectTabNode?.offsetTop - 75
      }
    })()
  }, [showModal]) // menuRef.current,

  const isExpanded = useCallback(
    (id) => {
      return expandeds.includes(id)
    },
    [expandeds]
  )

  const expand = useCallback(
    (id) => {
      if (!expandeds.includes(id)) {
        setExpandeds([...expandeds, id])
      }
    },
    [expandeds]
  )
  const unExpands = useCallback(
    (id) => {
      if (expandeds.includes(id)) {
        setExpandeds(expandeds.filter((item) => item !== id))
      }
    },
    [expandeds]
  )
  console.log(jobFunctions,value,'jobFunctions')
  const initDefaultJobFunctionSelect = () => {
   console.log(jobFunctions,value,'jobFunctions')
     
    if (jobFunctions?.length) {
      jobFunctions.map(e=>{
        e.sub_function_list.map(job=>{
          job.job_titles.forEach((item) => {
            if (item?.value === value.value) {      
              console.log(item)            
              onChange(item)
              setSelectedKey(job?.id)
              setSelectedSubItem(job)
               }
          })
        })
       })
      // jobFunctions.forEach((jobFunction) =>
      //   //
      //   Object.keys(jobFunction).forEach((key: any) =>
      //     //
      //     jobFunction[key].forEach((job) =>
      //       //
      //       job.job_titles.forEach((item) => {
      //         //
      //         if (item?.value === value.value) {
      //           const key = Object.keys(jobFunction)[0]
      //           //
      //           onChange(item)
      //           setSelectedKey(key)
      //           setSelectedSubItem(job)
      //         }
      //       })
      //     )
      //   )
      // )
    }
  }

  return (
    <FormControl className={className} size='small'>
      <MaterialTextField
        value={value?.value}
        onChange={() => onChange(value)}
        onClick={() => {
          setShowModal(true)
        }}
        onFocus={(e) => {
          if (!isTouched) {
            setShowModal(true)
          }
          rest?.onFocus?.(e)
        }}
        onBlur={onBlur}
        {...rest}
      />
      <Modal
        open={showModal}
        onClose={() => {
          setShowModal(false)
        }}
      >
        <div>
          <Paper className={styles.webPC}>
            <TopBar
              title={title}
              onChange={(title) => onChange(title)}
              value={value}
              onClose={setShowModal}
              lang={lang}
            />
            <div className={styles.container}>
              <MenuList classes={{ root: styles.menu }} id='menuParentNode' ref={menuRef}>
                {jobFunctionsKeys.map((key) => {
                  return (
                    <div
                      role='cell'
                      key={key}
                      // @ts-ignore
                      name={key}
                      className={classNames({
                        [styles.menuItem]: true,
                        [styles.selected]: key === selectedKey
                      })}
                      onClick={() => {
                        setSelectedKey(key.id)
                      }}
                    >
                      <label className={styles.itemText}>{formatMenuText(key.value)}</label>
                    </div>
                  )
                })}
              </MenuList>
              <div className={styles.rightContainer}>
                {(selectedItem ?? []).map((group) => {
                  const isItemExpand = isExpanded(group.id)
                  const subItems = isItemExpand
                    ? group.job_titles
                    : group.job_titles.filter((_, index) => index < 5)
                  return (
                    <div className={styles.mobileGroup} key={group.value}>
                      <div className={styles.groupTitle}>{group.value}</div>
                      {subItems.map((titleItem) => {
                        return (
                          <div
                            key={titleItem.id}
                            className={classNames({
                              [styles.groupItem]: true,
                              [styles.isSelected]: value?.id === titleItem.id
                            })}
                            onClick={() => onChange(titleItem)}
                          >
                            {titleItem.value}
                          </div>
                        )
                      })}
                      <div className={styles.groupAction}>
                        {group.job_titles.length > 5 &&
                          (!isItemExpand ? (
                            <div onClick={() => expand(group.id)}>see more</div>
                          ) : (
                            <div onClick={() => unExpands(group.id)}>see less</div>
                          ))}
                      </div>
                    </div>
                  )
                })}
                {groupedSelected.map((group, index) => {
                  return (
                    <div className={styles.rowContainer} key={index}>
                      <div className={styles.rowItemContainer}>
                        {group.map((subItem) => {
                          return (
                            <div
                              key={subItem.id}
                              className={styles.rowItem}
                              onClick={() => {
                                if (subItem.id === (selectedSubItem as any)?.id) {
                                  setSelectedSubItem(undefined)
                                } else {
                                  console.log(subItem,'subItem')
                                  setSelectedSubItem(subItem)
                                }
                              }}
                            >
                              <div className={styles.icon}>
                                <img
                                  src={subItem.id === (selectedSubItem as any)?.id ? Minus : Plus}
                                  height={10}
                                  width={10}
                                />
                              </div>
                              {subItem.value}
                            </div>
                          )
                        })}
                      </div>
                      {index === selectedGroupIndex && (
                        <div className={styles.titleContainer}>
                          {selectedSubItem?.job_titles?.map((title) => {
                            return (
                              <div
                                key={title.id}
                                title={title.value}
                                className={classNames({
                                  [styles.titleItem]: true,
                                  [styles.hightlighted]: title?.id === value?.id
                                })}
                                onClick={() => onChange(title)}
                              >
                                <Text className={styles.text}>{title.value}</Text>
                              </div>
                            )
                          })}
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>
          </Paper>
        </div>
      </Modal>
    </FormControl>
  )
}
export default JobFunctionSelector
