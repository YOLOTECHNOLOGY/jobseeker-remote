'use client'
import React, { Attributes, FunctionComponent, useState, useEffect, useContext } from 'react'
import { HoverableProps, hoverable } from 'components/highLevel/hoverable'
import { usePageGrouped } from './hooks'
import { LocationContext } from 'app/components/providers/locationProvier'
import styles from './index.module.scss'
import { buildQuery } from 'app/main-page/helper'
import Link from 'next/link'
import classNames from 'classnames'
import Tooltip from '@mui/material/Tooltip';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
interface MainData {
    title: string
    simpleTitle?: string
    descripttions: string[]
    children: SectionData[]
}

interface SubData {
    label: string
    value: string
}

interface SectionData {
    title: string
    children: SubData[]
}
interface FunctionFilterProps {
    list: MainData[]
    subTitlesList: string[][]
}

type MainProps = Attributes & {
    setHoverData: (data: SectionData[]) => void,
    data: MainData
    hoverTitle: string
    subTitles: string[]
    setHoverTitle: (string) => void
}
type SectionProps = { data: SectionData } & Attributes
type SubItemProps = { data: SubData } & Attributes

const MainItem: FunctionComponent<MainProps> = hoverable((props: HoverableProps & MainProps) => {
    const { isHover, setHoverData, data, onMouseEnter, onMouseLeave, setHoverTitle, hoverTitle, subTitles = [] } = props
    console.log(subTitles,7777)
    useEffect(() => {
        if (isHover) {
            setHoverData(data.children)
            setHoverTitle(data.title)
        }
    }, [isHover])

    return <div
        className={classNames({
            [styles.mainItem]: true,
            [styles.isHover]: isHover || hoverTitle === data.title
        })}
        key={props.key}
        title={data.title}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}>
        <div className={styles.mainTitle}>
            <div className={styles.mainTitleFirst}>{data.simpleTitle || data.title}</div>
            <div className={styles.subContainer}>
            {subTitles.map(subTitle => (
                <div key={subTitle} title={subTitle} className={styles.mainTitleSub}>
                    {subTitle}
                </div>
            ))}
            </div>
           <ArrowForwardIosIcon className={styles.more}/>
        </div>
    </div>
})

const SectionItem = (props: SectionProps) => {
    const { data } = props
    return <div className={styles.sectionItems} key={props.key}>
        <label className={styles.sectionName}>{data.title}</label>
        <div className={styles.subItems}>
            {
                data?.children.map(item => (
                    <SubItem data={item} key={item.value} />
                ))
            }
        </div>
    </div>
}
const SubItem: FunctionComponent<SubItemProps> = hoverable((props: SubItemProps & HoverableProps) => {
    const { location } = useContext(LocationContext)
    const { data } = props
    return <Link className={styles.subItem} prefetch={false} href={buildQuery(location?.value, data.value)}>
        <Tooltip title={data.label} placement="top-start">
          <div className={styles.linkText}> {data.label}</div>
        </Tooltip>
    </Link>

})

const FunctionFilter: FunctionComponent<FunctionFilterProps> = hoverable((props: FunctionFilterProps & HoverableProps) => {
    const { list, isHover, subTitlesList, ...rest } = props
    const [hoverTitle, setHoverTitle] = useState('')
    const {
        currentPage,
        totalPages,
        pageDatas,
        nextEnable,
        preEnable,
        onNext,
        onPre
    } = usePageGrouped(list)
    const [hoverData, setHoverData] = useState<SectionData[] | null>(null)
    useEffect(() => {
        if (!isHover && hoverData) {
            setHoverData(null)
            setHoverTitle('')
        }
    }, [isHover, hoverData])
    return <div className={styles.container}{...rest}>
        <div className={styles.mainItems} >{pageDatas.map((main, index) => (
            <MainItem
                key={main.title}
                hoverTitle={hoverTitle}
                setHoverData={setHoverData}
                data={main}
                subTitles={subTitlesList[(currentPage - 1) * 5 + index]}
                setHoverTitle={setHoverTitle}
            />
        ))}

            <div className={styles.pagination}>
                <label>{currentPage}/{totalPages}</label>
                <button type='button' disabled={!preEnable} className={styles.prePage} style={{paddingLeft:'6px'}} onClick={onPre}> 
                   <ArrowBackIosIcon className={styles.icon}/>
                </button>
                <button type='button' disabled={!nextEnable} onClick={onNext}>
                  <ArrowForwardIosIcon className={styles.icon}/>
                </button>
            </div>
        </div>
        {hoverData && <div className={styles.sectionContainer}>
            {hoverData?.map?.(sectionData => {
                return <SectionItem data={sectionData} key={sectionData.title} />
            })}
        </div>
        }
    </div>
})

export default FunctionFilter

