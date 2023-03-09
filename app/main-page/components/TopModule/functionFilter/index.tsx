'use client'
import React, { Attributes, FunctionComponent, useState, useEffect, useContext } from 'react'
import { HoverableProps, hoverable } from 'components/highLevel/hoverable'
import { usePageGrouped } from './hooks'
import { LocationContext } from 'app/components/providers/locationProvier'
import styles from './index.module.scss'
import { buildQuery } from 'app/main-page/helper'
import Link from 'next/link'
import classNames from 'classnames'
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
}

type MainProps = Attributes & {
    setHoverData: (data: SectionData[]) => void,
    data: MainData
    hoverTitle: string
    setHoverTitle: (string) => void
}
type SectionProps = { data: SectionData } & Attributes
type SubItemProps = { data: SubData } & Attributes

const MainItem: FunctionComponent<MainProps> = hoverable((props: HoverableProps & MainProps) => {
    const { isHover, setHoverData, data, onMouseEnter, onMouseLeave, setHoverTitle, hoverTitle } = props
    useEffect(() => {
        if (isHover) {
            setHoverData(data.children)
            setHoverTitle(data.title)
        }
    }, [isHover])
    
    return <div
        className={classNames({
            [styles.mainItem]:true,
            [styles.isHover]:isHover || hoverTitle === data.title
        }) }
        key={props.key}
        title={data.title}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}>
        <div className={styles.mainTitle}>{data.simpleTitle || data.title}</div>
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
        <div className={styles.linkText}>{data.label}</div>
    </Link>

})

const FunctionFilter: FunctionComponent<FunctionFilterProps> = hoverable((props: FunctionFilterProps & HoverableProps) => {
    const { list, isHover, ...rest } = props
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
    }, [isHover,  hoverData])
    return <div className={styles.container}{...rest}>
        <div className={styles.mainItems} >{pageDatas.map(main => (
            <MainItem
                key={main.title}
                hoverTitle={hoverTitle}
                setHoverData={setHoverData}
                data={main}
                setHoverTitle={setHoverTitle}
            />
        ))}

            <div>
                <label>{currentPage}/{totalPages}</label>
                <button disabled={!preEnable} onClick={onPre}> {'<'}</button>
                <button disabled={!nextEnable} onClick={onNext}> {'>'}</button>
            </div>
        </div>
        {hoverData &&<div className={styles.sectionContainer}>
                {hoverData?.map?.(sectionData => {
                    return <SectionItem data={sectionData} key={sectionData.title} />
                })}
            </div>
       }
    </div>
})

export default FunctionFilter

