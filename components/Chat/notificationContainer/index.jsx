import classNames from 'classnames'
import { CloseIcon } from 'images'
import React, { useState, useCallback, useEffect, useRef } from 'react'
import styles from './index.module.scss'
import PropTypes from 'prop-types'
const animationDuration = 0.5
const removeAfter = 5
export const usePushNotification = onClick => {
    const [noteList, setNoteList] = useState([])
    const [isAnimating, setIsAnimating] = useState(false)
    const [newAdding, setNewAdding] = useState()
    const [showingStack, setShowingStack] = useState([])

    const postNote = useCallback(note => {
        setShowingStack([note, ...showingStack])
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
        console.log('showNote', note)
        setNewAdding(note)
        setIsAnimating(true)
        setNoteList([note].concat(noteList))
        setTimeout(() => {
            setIsAnimating(false)
            setNewAdding(null)
        }, animationDuration * 1000)
        setTimeout(() => {
            removeRef.current?.(note)
        }, removeAfter * 1000)
    }, [noteList, removeNote])

    useEffect(() => {
        if (showingStack.length && !isAnimating) {
            const [note, ...rest] = showingStack
            showNote(note)
            setShowingStack(rest)
        }
    }, [showingStack, isAnimating, showNote])

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
    console.log({ noteList, newAdding })
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
                    <img src={CloseIcon} alt='logo' width='13' height='13' />
                </div>
                <div className={styles.title}>
                    {note.title}
                </div>
                <div className={styles.content}>
                    {note.content}
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