import { FormControl, MenuItem, MenuList, Paper } from "@mui/material"
import MaterialTextField from "components/MaterialTextField"
import Modal from '@mui/material/Modal';
import { useEffect, useMemo, useRef, useState } from "react"
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
    const textRef = useRef<any>()
    const jobFunctions = useSelector((store: any) => store.config.config.response?.inputs?.job_function_lists ?? [])
    const jobFunctionsKeys = useMemo(() => flatMap(jobFunctions, keys), [jobFunctions])
    const jobFunctionsObject = useMemo(() => jobFunctions?.reduce(assign), [jobFunctions])
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
    useEffect(()=>{
        if(title){
            onChange(selectedTitle?.value)
            setShowModal(false)
        }
        
    },[selectedTitle])
    console.log('selectedTitle', selectedTitle)

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
            <Paper className={styles.webPC}>
                <TopBar title={title} />
                <div className={styles.container}>
                    <MenuList classes={{ root: styles.menu }} >
                        {jobFunctionsKeys.map(key => {
                            return <MenuItem
                                role='cell'
                                key={key}
                                selected={key === selectedKey}
                                classes={{ root: styles.menuItem, selected: styles.selected }}
                                onClick={() => {
                                    setSelectedKey(key)
                                }}
                            >
                                <p className={styles.itemText} >{key}</p>
                            </MenuItem>
                        })}

                    </MenuList>
                    <div style={{ flex: 1 }}>
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
                                            <img src={subItem.id === (selectedSubItem as any)?.id ? Minus : Plus} height={13} width={13} />
                                            {subItem.value}
                                        </div>

                                    })}
                                </div>
                                {index === selectedGroupIndex &&
                                    <div className={styles.titleContainer} >
                                        {selectedSubItem?.job_titles?.map(title => {
                                            return <Text
                                                onClick={() => setSelectedTitle(title)}
                                                className={classNames({
                                                    [styles.titleItem]: true,
                                                    [styles.hightlighted]: title?.id === selectedTitle?.id
                                                })}
                                                key={title.id}>{title.value}</Text>
                                        })}

                                    </div>
                                }
                            </div>
                        })}
                    </div>
                </div>

            </Paper>
        </Modal>
    </FormControl>

}
export default JobFunctionSelector