'use client'
import React, { Attributes, FunctionComponent, useState, useEffect, useContext } from 'react'
import { HoverableProps, hoverable } from 'components/highLevel/hoverable'
import { usePageGrouped } from './hooks'
import { LocationContext } from 'app/components/providers/locationProvier'
import styles from 'app/index.module.scss'
import { buildQuery } from 'app/(main-page)/helper'
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
    contentWidths: number[]
    langKey: string
}

type MainProps = Attributes & {
    setHoverData: (data: SectionData[]) => void,
    data: MainData
    hoverTitle: string
    subTitles: string[]
    setHoverTitle: (string) => void
    contentWidth: number
    langKey: string
}
type SectionProps = { data: SectionData, langKey: string } & Attributes
type SubItemProps = { data: SubData, langKey: string } & Attributes

const MainItem: FunctionComponent<MainProps> = hoverable((props: HoverableProps & MainProps) => {
    const { isHover, setHoverData, data, onMouseEnter, onMouseLeave, setHoverTitle, contentWidth, hoverTitle, subTitles = [] } = props
    const { location } = useContext(LocationContext)
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
                {subTitles.map((subTitle, index) => (
                    <Link prefetch={false} key={subTitle + index} href={'/' + props.langKey + buildQuery(location?.seo_value, subTitle)}>
                        <div key={subTitle + index} title={subTitle} style={{ maxWidth: contentWidth }} className={styles.mainTitleSub}>
                            {subTitle}
                        </div>
                    </Link>
                ))}
            </div>
            <ArrowForwardIosIcon className={styles.more} />
        </div>
    </div>
})

const SectionItem = (props: SectionProps) => {
    const { data }: any = props
    return <div className={styles.sectionItems} key={data?.id + data['seo-value']}>
        <label className={styles.sectionName}>{data.title}</label>
        <div className={styles.subItems}>
            {
                data?.children.map((item, index) => (
                    <SubItem data={item} langKey={props.langKey} key={item.value + index} />
                ))
            }
        </div>
    </div>
}
const SubItem: FunctionComponent<SubItemProps> = hoverable((props: SubItemProps & HoverableProps) => {
    const { location } = useContext(LocationContext)
    const { data } = props
    return <Link className={styles.subItem} prefetch={false} href={'/' + props.langKey + buildQuery(location?.seo_value, data?.label)}>
        <Tooltip title={data.label} placement="top-start">
            <div className={styles.linkText}> {data.label}</div>
        </Tooltip>
    </Link>

})

const FunctionFilter: FunctionComponent<FunctionFilterProps> = hoverable((props: FunctionFilterProps & HoverableProps) => {
    const { list, isHover, subTitlesList, contentWidths, langKey, ...rest } = props
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
    return <div className={styles.functionFilter}{...rest}>
        <div className={styles.mainItems} >{pageDatas.map((main, index) => (
            <MainItem
                key={main.title}
                hoverTitle={hoverTitle}
                setHoverData={setHoverData}
                data={main}
                subTitles={subTitlesList[(currentPage - 1) * 5 + index]}
                setHoverTitle={setHoverTitle}
                contentWidth={contentWidths[index]}
                langKey={langKey}
            />
        ))}

            <div className={styles.pagination}>
                <label>{currentPage}/<span>{totalPages}</span></label>
                <div>
                    <button type='button' disabled={!preEnable} className={styles.prePage} style={{ paddingLeft: '6px' }} onClick={onPre}>
                        <ArrowBackIosIcon className={styles.icon} />
                    </button>
                    <button type='button' disabled={!nextEnable} onClick={onNext}>
                        <ArrowForwardIosIcon className={styles.icon} />
                    </button>
                </div>
            </div>
        </div>
        {hoverData && <div className={styles.sectionContainer}>
            {hoverData?.map?.((sectionData, index) => {
                return <SectionItem langKey={langKey} data={sectionData} key={sectionData.title + index} />
            })}
        </div>
        }
    </div>
})

export default FunctionFilter

