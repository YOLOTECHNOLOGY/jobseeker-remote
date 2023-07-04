import classNames from 'classnames'
// import { CloseIcon } from 'images'
import CloseIcon from '@mui/icons-material/Close';
import React, { useState, useCallback, useEffect, useRef } from 'react'
import styles from './index.module.scss'
import PropTypes from 'prop-types'
import Image from 'next/image'

const animationDuration = 0.5
const removeAfter = 5
const showNextAfter = 5
export const usePushNotification = onClick => {
    const [noteList, setNoteList] = useState([])
    const [isAnimating, setIsAnimating] = useState(false)
    const [canShowNext, setCanShowNext] = useState(true)
    const [newAdding, setNewAdding] = useState()
    const [showingStack, setShowingStack] = useState([])

    const postNote = useCallback(note => {
        setShowingStack([...showingStack, note])
    }, [showingStack])

    const removeNote = useCallback(note => {
        if (noteList.find(item => item.id === note.id)) {
            const filterResult = noteList.filter(item => item.id !== note.id)
            setNoteList(filterResult)
        }
    }, [noteList])
    const removeRef = useRef(removeNote)
    useEffect(() => {
        removeRef.current = removeNote
    }, [removeNote])
    const showNote = useCallback(note => {
        setNewAdding(note)
        setIsAnimating(true)
        setNoteList([note].concat(noteList))
        setCanShowNext(false)
        setTimeout(() => {
            setIsAnimating(false)
            setNewAdding(null)
        }, animationDuration * 1000)
        setTimeout(() => {
            setCanShowNext(true)
        }, showNextAfter * 1000)
        setTimeout(() => {
            removeRef.current?.(note)
        }, removeAfter * 1000)
    }, [noteList, removeNote])

    useEffect(() => {
        if (showingStack.length && !isAnimating && canShowNext) {
            const [note, ...rest] = showingStack
            showNote(note)
            setShowingStack(rest)
        }
    }, [showingStack, isAnimating, showNote, canShowNext])

    return {
        postNote, props: {
            newAdding,
            noteList,
            isAnimating,
            remove: removeRef.current,
            onClick
        }
    }
}

const NotificationContainer = props => {
    const { newAdding, noteList = [], isAnimating, remove, onClick } = props

    if(noteList.length == 0) return null

    return <div className={styles.container}>
        {noteList.map(note => {
            return <div key={note.id}
                onClick={() => {
                    remove(note)
                    onClick?.(note)
                }}
                className={classNames({
                    [styles.note]: true,
                    [styles.newAddingAnimation]: isAnimating && note.id === newAdding?.id,
                    [styles.otherAnimation]: isAnimating && note.id !== newAdding?.id,
                })}
            >
                <div className={styles.close} onClick={e => {
                    e.stopPropagation()
                    remove?.(note)
                }}>
                </div>
                <div className={styles.mainWrapper} >
                    <Image src={note.avatar} alt="avatar" width={50} height={50} />

                    <div className={styles.contentWrapper} >
                        <div className={styles.title}>
                           <span className={styles.title_content} > {note.title}</span>
                           <CloseIcon alt='logo' width='13' height='13' sx={{color: "rgb(3, 59, 95)"}} />
                        </div>
                        <div className={styles.content}>
                            {note.content}
                        </div>
                    </div>
                </div>
            </div>
        })}

    </div>
}
NotificationContainer.propTypes = {
    newAdding: PropTypes.object,
    noteList: PropTypes.array,
    isAnimating: PropTypes.bool,
    remove: PropTypes.func,
    onClick: PropTypes.func
}

export default NotificationContainer