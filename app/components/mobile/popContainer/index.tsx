'use client'
import React,{} from 'react'
import styles from './index.module.scss'
import { CloseIcon } from 'images'
import Image from 'next/image'
import Button from '@mui/material/Button'
const PopContainer = (props: any) => {
    // const syncHeight = () => {
    //     document.documentElement.style.setProperty('--window-inner-height', `${window.innerHeight}px`)
    // }

    // useEffect(() => {
    //     document.documentElement.style.setProperty('--window-inner-height', `${window.innerHeight}px`)
    //     window.addEventListener('resize', syncHeight)
    //     document.documentElement.classList.add('modal-active')

    // }, [])
    const { name, children, multiple, onClose, onReset, onSave } = props
    return <div className={styles.main}>
        <div className={styles.topbar}>
            <label>{name}</label>
            <Image src={CloseIcon} width={15} height={15} alt={''} onClick={onClose} />
        </div>
        <div className={styles.content}>{children}</div>
        {multiple && <div className={styles.buttonContent}>
            <Button className={styles.resetButton} onClick={onReset}>Reset</Button>
            <Button className={styles.saveButton} onClick={onSave}>Save</Button>
        </div>}
    </div>
}

export default PopContainer