'use client'
import classNames from 'classnames'
import React, { useContext, useState, useEffect, useRef, useTransition, useMemo } from 'react'
import styles from './index.module.scss'
import { LoadingContext } from 'app/components/providers/loadingProvider'
import EditJobPreferencesModal from 'components/EditJobPreferencesModal'
import { useSelector } from 'react-redux'
import { CircularProgress } from 'app/components/MUIs'
import { useSearchParams } from 'next/navigation'
import { useRouter } from 'next/navigation'
const PreferenceSelector = (props: any) => {
    const { preferences, preferenceId, config } = props
    const preferencesRef = useRef(preferences)
    const [showPreferenceId, setShowPreferenceId] = useState(preferenceId)
    const userDetail = useSelector((store: any) => store.users.fetchUserOwnDetail?.response ?? {})
    const searchParams = useSearchParams()
    const router = useRouter()
    const [editingPreference, setEditingPreference] = useState()
    const [loading, startTransition] = useTransition()
    useEffect(() => {
        if (preferences.length > preferencesRef.current?.length) {
            const newId = preferences[0].id
            setShowPreferenceId(newId)
            const url = new URLSearchParams([...[...searchParams.entries()].filter(([key]) => {
                return key !== 'preferenceId'
            }), ['preferenceId', newId]]).toString()
            push(location.pathname + '?' + url)
        }
    }, [preferences.length])
    useEffect(() => {
        setShowPreferenceId(preferenceId)
    }, [preferenceId])
    const { push, loading: pushing } = useContext(LoadingContext)
    const busy = useMemo(() => {
        return loading || pushing
    }, [loading, pushing])
    const [showModal, setShowModal] = useState(false)
    return <div className={styles.container}>
        <div className={styles.title}>Desired Job Title:</div>
        <div className={styles.preferences}>
            {/* {loading && <CircularProgress size={10} style={{ marginLeft: 10 }} />} */}
            {preferences.map(preference => {
                return <div
                    key={preference.id}
                    title={preference.function_job_title}
                    onClick={() => {
                        if (+showPreferenceId === preference.id) {
                            return
                        }
                        setShowPreferenceId(preference.id)
                        const url = new URLSearchParams([...[...searchParams.entries()].filter(([key, value]) => {
                            return key !== 'preferenceId'
                        }), ['preferenceId', preference.id]]).toString()
                        push(location.pathname + '?' + url)

                    }}
                    className={classNames({
                        [styles.preference]: true,
                        [styles.selected]: +showPreferenceId === preference.id,
                        [styles.disabled]: busy && (+showPreferenceId !== preference.id),
                    })}>
                    {preference.function_job_title}
                </div>
            })}
        </div>
        <div className={styles.seperator} />
        {busy ?
            <CircularProgress size={20} style={{ marginLeft: 10 }} />
            : <div className={styles.action} onClick={() => {
                if (preferences.length === 3) {
                    const selected = preferences.find(preference => +preference.id === +preferenceId)
                    console.log({ selected })
                    setEditingPreference(selected)
                } else {
                    setEditingPreference(undefined)
                }
                setShowModal(true)
            }}>
                {preferences.length === 3 ? 'Edit' : 'Add New'}
            </div>}
        {showModal && <EditJobPreferencesModal
            modalName={'jobPreference'}
            showModal={showModal}
            config={config}
            preference={editingPreference}
            userDetail={userDetail}
            handleModal={(name, show, refresh) => {
                console.log('handleModal', show)
                setShowModal(show)
                if (refresh) {
                    startTransition(() => {
                        router.refresh()
                    })
                }
            }}
        />}
    </div>
}

export default PreferenceSelector