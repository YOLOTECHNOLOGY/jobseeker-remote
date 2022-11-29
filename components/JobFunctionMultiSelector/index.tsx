import { createTheme, FormControl, ThemeProvider } from "@mui/material"
import MaterialTextField from "components/MaterialTextField"
import { useCallback, useEffect, useMemo, useState } from "react"
import styles from './index.module.scss'
import { useSelector } from "react-redux"
import { keys, flatMap } from 'lodash-es'
import JobItem from "./item"
const theme = createTheme({
    components: {
        MuiInputLabel: {
            styleOverrides: {
                root: {
                    fontSize: '14px',
                    transform: 'translate(14px, 10px) scale(1)',
                    letterSpacing: '1px',
                    '&.Mui-focused': {
                        fontSize: '10px',
                        transform: 'translate(14px, -10px) scale(1)',
                    },
                    lineHeight: '26px'
                },
                shrink: {
                    fontSize: '10px',
                    transform: 'translate(14px, -10px) scale(1)',
                },
                outlined: {
                    '&.MuiInputLabel-shrink': {
                        fontSize: '10px',
                    },
                },
            },
        },
        MuiOutlinedInput: {
            styleOverrides: {
                root: {
                    fontSize: '14px',
                    height: '44px',
                    backgroundColor: 'white',
                    lineHeight: '16px',
                    alignItems: 'self-end'
                },
            },
        },
        MuiInputBase: {
            styleOverrides: {
                input: {
                    fontSize: '14px',
                    letterSpacing: '1px',
                },
            },
        },
        MuiMenuItem: {
            styleOverrides: {
                root: {
                    fontSize: '16px',
                    letterSpacing: '1px',
                    padding: '10px 16px'
                },
            },
        },
    },
})
const JobFunctionMultiSelector = (props: any) => {
    const { label, className, value, isTouched, onChange, ...rest } = props

    const [showModal, setShowModal] = useState(false)
    // const [secondList, setSecondList] = useState([])
    // const [thirdList, setThirdList] = useState([])
    const [activeFirst, setActiveFirst] = useState<any>()
    const [activeSecond, setActiveSecond] = useState<any>()
    const secondList = useMemo(() => {
        return [{ value: 'all', id: -1, parent: activeFirst }].concat(activeFirst?.children ?? [])
    }, [activeFirst])
    const thirdList = useMemo(() => {
        return [{ value: 'all', id: -1, parent: activeSecond }].concat(activeSecond?.children ?? [])
    }, [activeSecond])
    const [mainFuctions, setMainfunctions] = useState(value?.mainFunctions ?? [])
    const [functionIds, setFunctionIds] = useState(value?.jobFunctions ?? [])
    const [functionTitleIds, setFunctionTitleIds] = useState(value?.functionTitles ?? [])
    const jobFunctions = useSelector((store: any) => store.config.config.response?.inputs?.job_function_lists ?? [])
    const isThirdSelected = useCallback(third => {
        const parentSelect = functionIds.includes(third.parent.id) || mainFuctions.includes(third.parent.parent.value)
        if (third.id === -1) {
            return parentSelect
        }
        if (parentSelect) {
            return false
        }
        return functionTitleIds.includes(third.id)
    }, [functionTitleIds, functionIds, mainFuctions])

    const isSecondSelected = useCallback(second => {
        if (second.id === -1) {
            return mainFuctions.includes(second.parent.value)
        }
        if (mainFuctions.includes(second.parent.value)) {
            return false
        }
        return functionIds.includes(second.id) || (second.children ?? []).filter(isThirdSelected).length > 0
    }, [functionIds, isThirdSelected, mainFuctions])

    const isFirstSelected = useCallback(first => {
        return mainFuctions.includes(first.value) || first.children.filter(isSecondSelected).length > 0
    }, [mainFuctions, isSecondSelected])

    const onFirstClick = useCallback(first => {
        if (mainFuctions.includes(first.value)) {
            setMainfunctions(mainFuctions.filter(value => value !== first.value))
        } else {
            setMainfunctions([first.value, ...mainFuctions])
            const selectedSecondIds = first.children.map(second => second.id)
            setFunctionIds(functionIds.filter(id => !selectedSecondIds.includes(id)))
            const selectedThirdIds = flatMap(first.children, second => second.children.map(third => third.id))
            setFunctionTitleIds(functionTitleIds.filter(id => !selectedThirdIds.includes(id)))
        }
    }, [mainFuctions, functionIds, functionTitleIds])

    const onSecondClick = useCallback(second => {
        if (second.id === -1) {
            onFirstClick(second.parent)
        } else {
            if (mainFuctions.includes(second.parent.value)) {
                setMainfunctions(mainFuctions.filter(value => value !== second.parent.value))
            }
            if (functionIds.includes(second.id)) {
                setFunctionIds(functionIds.filter(id => id !== second.id))
            } else {
                const newSelected = [second.id, ...functionIds.filter(id => second.parent.children.map(item => item.id).includes(id))]
                if (newSelected.length === second.parent.children.length) {
                    onFirstClick(second.parent)
                } else {
                    setFunctionIds([second.id, ...functionIds])
                    const selectedThirdIds = second.children.map(item => item.id)
                    setFunctionTitleIds(functionTitleIds.filter(id => !selectedThirdIds.includes(id)))
                }
            }
        }
    }, [onFirstClick, functionIds, functionTitleIds, mainFuctions])

    const onThirdClick = useCallback(third => {
        if (third.id === -1) {
            onSecondClick(third.parent)
        } else {
            if (functionIds.includes(third.parent.id) || mainFuctions.includes(third.parent.parent.value)) {
                setMainfunctions(mainFuctions.filter(value => value !== third.parent.parent.value))
                setFunctionIds(functionIds.filter(id => id !== third.parent.id))
            }
            if (functionTitleIds.includes(third.id)) {
                setFunctionTitleIds(functionTitleIds.filter(id => id !== third.id))
            } else {
                const newSelected = [third.id, ...functionTitleIds.filter(id => third.parent.children.map(item => item.id).includes(id))]
                console.log({ newSelected })
                if (newSelected.length === third.parent.children.length) {
                    onSecondClick(third.parent)
                } else {
                    setFunctionTitleIds([third.id, ...functionTitleIds])
                }
            }
        }
    }, [onSecondClick, mainFuctions, functionIds, functionTitleIds])
    const formattedJobfunctions = useMemo(() => {
        return jobFunctions.map((obj, index) => {
            const key = keys(obj)[0]
            const value = obj[key]
            const firstParent = {
                value: key,
                id: index,
                children: undefined
            }
            firstParent.children = value.map(second => {
                const secondParent = {
                    id: second.id,
                    value: second.value,
                    parent: firstParent,
                    children: undefined
                }
                secondParent.children = second.job_titles.map(third => {
                    return { ...third, parent: secondParent }
                })

                return secondParent
            })
            return firstParent
        })
    }, [jobFunctions])
    useEffect(() => {
        const listener = () => {
            setShowModal(false)
        }
        document.addEventListener('click', listener)
        return () => document.removeEventListener('click', listener)
    }, [])
    useEffect(() => {
        if (value) {
            onChange(value)
            setShowModal(false)
        }
    }, [value])
    const onSecondHover = useCallback(hoverThirdList => {
        setActiveSecond(hoverThirdList)
    }, [])
    const onFirstHover = useCallback(hoverSecondList => {
        if (activeFirst?.id !== hoverSecondList.id) {
            setActiveFirst(hoverSecondList)
            setActiveSecond(undefined)
        }
    }, [activeFirst])

    return (
        <ThemeProvider theme={theme}>
            <FormControl className={className} size='small'>
                <MaterialTextField
                    value={value?.value}
                    onChange={() => onChange(value)}
                    label={label}
                    onClick={e => {
                        e.preventDefault()
                        e.stopPropagation()
                        setShowModal(true)
                    }}
                    onFocus={(e) => {
                        if (!isTouched) {
                            setShowModal(true)
                        }
                        rest?.onFocus?.(e)
                    }}
                    {...rest}
                />
                {showModal && <div className={styles.container}
                    onClick={e => {
                        e.preventDefault()
                        e.stopPropagation()
                    }}
                >
                    <div className={styles.column}>
                        {formattedJobfunctions.map(first => {
                            return <JobItem
                                key={first.value}
                                data={first}
                                active={activeFirst?.id === first.id}
                                checked={isFirstSelected(first)}
                                onMouseOver={() => onFirstHover(first)}
                                onClick={() => onFirstClick(first)}
                            />
                        })}
                    </div>
                    {secondList.length > 1 && <div className={styles.column}>
                        {secondList.map(second => {
                            return <JobItem
                                key={second.value}
                                data={second}
                                active={activeSecond?.id === second.id}
                                checked={isSecondSelected(second)}
                                onMouseOver={() => onSecondHover(second)}
                                onClick={() => onSecondClick(second)}
                                noArrow={second.id === -1}
                            />
                        })}
                    </div>}
                    {thirdList.length > 1 && <div className={styles.column}>
                        {thirdList.map(third => {
                            return <JobItem
                                key={third.value}
                                data={third}
                                checked={isThirdSelected(third)}
                                onClick={() => onThirdClick(third)}
                                noArrow
                            />
                        })}
                    </div>}
                </div>}
            </FormControl>
        </ThemeProvider>
    )
}

export default JobFunctionMultiSelector