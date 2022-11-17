import { FormControl, MenuList, Paper } from "@mui/material"
import MaterialTextField from "components/MaterialTextField"
import Modal from '@mui/material/Modal';
import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import styles from './index.module.scss'
import TopBar from './topBar'
import { useSelector } from "react-redux";
import { flatMap, keys, assign, values, groupBy } from 'lodash-es'
import { Plus, Minus } from "images";
import Text from "components/Text";
import classNames from "classnames";
const JobFunctionSelector = (props: any) => {
    const { value = '', className, title, onChange, isTouched, onBlur, ...rest } = props
    const [showModal, setShowModal] = useState(false)
    const [selectedKey, setSelectedKey] = useState<any>()
    const [selectedSubItem, setSelectedSubItem] = useState<any>({})
    const [expandeds, setExpandeds] = useState([])
    const textRef = useRef<any>()
    const jobFunctions = useSelector((store: any) => store.config.config.response?.inputs?.job_function_lists ?? [])

    const jobFunctionsKeys = useMemo(() => flatMap(jobFunctions, keys), [jobFunctions])
    const jobFunctionsObject = useMemo(() => jobFunctions?.reduce(assign, {}), [jobFunctions])
    const [selectedTitle, setSelectedTitle] = useState<any>()
    const selectedItem = useMemo(() => {
        if (selectedKey) {
            return jobFunctionsObject[selectedKey]
        }
    }, [selectedKey])
    const groupedSelected = useMemo(() => {
        return values(groupBy(selectedItem, o => {
            return Math.floor(selectedItem.indexOf(o) / 3)
        }))
    }, [selectedItem])
    const selectedGroupIndex = useMemo(() => {
        const group = (groupedSelected ?? []).find(group => {
            return group.filter(subItem => subItem.id === selectedSubItem?.id).length
        })
        return groupedSelected?.indexOf(group) ?? -1
    }, [groupedSelected, selectedSubItem])

    useEffect(() => {
        if (title) {
            onChange(selectedTitle?.value)
            setShowModal(false)
        }

    }, [selectedTitle])
    const isExpanded = useCallback(id => {
        return expandeds.includes(id)
    }, [expandeds])
    const expand = useCallback(id => {
        if (!expandeds.includes(id)) {
            setExpandeds([...expandeds, id])
        }
    }, [expandeds])
    const unExpands = useCallback(id => {
        if (expandeds.includes(id)) {
            setExpandeds(expandeds.filter(item => item !== id))
        }
    }, [expandeds])

    return <FormControl className={className} size='small'>
        <MaterialTextField
            ref={(ref) => textRef.current = ref}
            value={value}
            onChange={e => {
                e.preventDefault()
                e.stopPropagation()
            }}
            onClick={() => {
                setShowModal(true)
            }}
            onFocus={() => {
                if (!isTouched) {
                    setShowModal(true)
                }
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
                    <TopBar title={title} onChange={title => setSelectedTitle(title)} />
                    <div className={styles.container}>
                        <MenuList classes={{ root: styles.menu }} >
                            {jobFunctionsKeys.map(key => {
                                return <div
                                    role='cell'
                                    key={key}
                                    className={classNames({
                                        [styles.menuItem]: true,
                                        [styles.selected]: key === selectedKey
                                    })}
                                    onClick={() => {
                                        setSelectedKey(key)
                                    }}
                                >
                                    <div className={styles.itemText}>{key}</div>
                                </div>
                            })}

                        </MenuList>
                        <div className={styles.rightContainer}>
                            {(selectedItem ?? []).map(group => {
                                const isItemExpand = isExpanded(group.id)
                                const subItems = isItemExpand ? group.job_titles : group.job_titles.filter((_, index) => index < 5)
                                return <div className={styles.mobileGroup} key={group.value} >
                                    <div className={styles.groupTitle}>
                                        {group.value}
                                    </div>
                                    {subItems.map(titleItem => {
                                        return <div
                                            key={titleItem.id}
                                            className={classNames(
                                                {
                                                    [styles.groupItem]:true,
                                                    [styles.isSelected]:selectedTitle?.id === titleItem.id
                                                }
                                            ) }
                                            onClick={()=>setSelectedTitle(titleItem)}
                                        >
                                            {titleItem.value}
                                        </div>
                                    })}
                                    <div className={styles.groupAction}>{group.job_titles.length > 5 && (!isItemExpand
                                        ?
                                        <div onClick={() => expand(group.id)}>see more</div>
                                        :
                                        <div onClick={() => unExpands(group.id)}>see less</div>)}
                                    </div>
                                </div>
                            })}
                            {groupedSelected.map((group, index) => {
                                return <div className={styles.rowContainer} key={index}>
                                    <div className={styles.rowItemContainer}>
                                        {group.map(subItem => {
                                            return <div
                                                key={subItem.id}
                                                className={styles.rowItem}
                                                onClick={() => {
                                                    if (subItem.id === (selectedSubItem as any)?.id) {
                                                        setSelectedSubItem(undefined)
                                                    } else {
                                                        setSelectedSubItem(subItem)
                                                    }
                                                }}
                                            >
                                                <div className={styles.icon} >
                                                    <img src={subItem.id === (selectedSubItem as any)?.id ? Minus : Plus} height={10} width={10} />
                                                </div>
                                                {subItem.value}
                                            </div>

                                        })}
                                    </div>
                                    {index === selectedGroupIndex &&
                                        <div className={styles.titleContainer} >
                                            {selectedSubItem?.job_titles?.map(title => {
                                                return <div
                                                    key={title.id}
                                                    title={title.value}
                                                    className={classNames({
                                                        [styles.titleItem]: true,
                                                        [styles.hightlighted]: title?.id === selectedTitle?.id
                                                    })}
                                                    onClick={() => setSelectedTitle(title)}
                                                >
                                                    <Text className={styles.text}>
                                                        {title.value}
                                                    </Text>
                                                </div>

                                            })}

                                        </div>
                                    }
                                </div>
                            })}
                        </div>
                    </div>
                </Paper>
            </div>
        </Modal>
    </FormControl >

}
export default JobFunctionSelector