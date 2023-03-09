'use client'
import React, { Attributes, FunctionComponent, useState, useEffect, useContext } from 'react'
import { HoverableProps, hoverable, hoverableFunc } from 'components/highLevel/hoverable'
import { usePageGrouped } from './hooks'
import { LocationContext } from 'app/components/providers/locationProvier'
import styles from './index.module.scss'
import { buildQuery } from 'app/main-page/helper'
import Link from 'next/link'
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
}
const MainItem: FunctionComponent<MainProps> = hoverable((props: HoverableProps & MainProps) => {
    const { isHover, setHoverData, data, onMouseEnter, onMouseLeave } = props
    useEffect(() => {
        if (isHover) {
            setHoverData(data.children)
        }
    }, [isHover])
    return <div className={styles.mainItem} key={props.key} title={data.title} onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave}>
        {data.simpleTitle || data.title}
    </div>
})

type SectionProps = { data: SectionData } & Attributes
const SectionItem = (props: SectionProps) => {
    const { data } = props
    console.log({ data })
    return <div key={props.key}>
        <label className={styles.sectionName}>{data.title}</label>
        {
            data?.children.map(item => (
                <SubItem data={item} key={item.value} />
            ))
        }</div>
}
type SubItemProps = { data: SubData } & Attributes
const SubItem: FunctionComponent<SubItemProps> = hoverable((props: SubItemProps & HoverableProps) => {
    const { location } = useContext(LocationContext)
    const { data } = props
    return <div className={styles.subItems} key={props.key}>
        <Link className={styles.sectionName} prefetch={false} href={buildQuery(location?.value, data.value)}>{data.value}</Link>
    </div>
})

const FunctionFilter: FunctionComponent<FunctionFilterProps> = hoverable((props: FunctionFilterProps & HoverableProps) => {
    const { list, isHover, ...rest } = props
    const [isSubHover, setIsSubHover] = useState(false)
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
        if (!isHover && !isSubHover && hoverData) {
            setHoverData(null)
        }
    }, [isHover, isSubHover, hoverData])
    console.log({ list })
    return <div className={styles.container}{...rest}>
        <div className={styles.mainItems} >{pageDatas.map(main => (
            <MainItem key={main.title} setHoverData={setHoverData} data={main} />
        ))}

            <div>
                <label>{currentPage}/{totalPages}</label>
                <button disabled={!preEnable} onClick={onPre}> {'<'}</button>
                <button disabled={!nextEnable} onClick={onNext}> {'>'}</button>
            </div>
        </div>
        {hoverData && hoverableFunc(isHover => {
            if (isHover !== isSubHover) {
                setIsSubHover(isHover)
            }
            return <div className={styles.sectionItems}>
                {hoverData?.map?.(sectionData => {
                    return <SectionItem data={sectionData} key={sectionData.title} />
                })}
            </div>
        })}
    </div>
})

export default FunctionFilter

