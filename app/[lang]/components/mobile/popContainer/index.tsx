'use client'
import React,{useContext} from 'react'
import styles from './index.module.scss'
// import { CloseIcon } from 'images'
// import Image from 'next/image'
import Button from '@mui/material/Button'
import CloseSharpIcon from '@mui/icons-material/CloseSharp';
import { languageContext } from 'app/[lang]/components/providers/languageProvider'
const PopContainer = (props: any) => {
    const { search } = useContext(languageContext) as any
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
            {/* <Image src={CloseIcon} width={15} height={15} alt={''} onClick={onClose} /> */}
            <CloseSharpIcon onClick={onClose} style={{color:'#BCBCBC'}}/>
        </div>
        <div className={styles.content}>{children}</div>
        {multiple && <div className={styles.buttonContent}>
            <Button className={styles.resetButton} onClick={onReset}>{search.reset2}</Button>
            <Button className={styles.saveButton} onClick={onSave}>{search.save}</Button>
        </div>}
    </div>
}

export default PopContainer