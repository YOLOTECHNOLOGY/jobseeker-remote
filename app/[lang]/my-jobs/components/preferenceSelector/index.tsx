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
import ArrowRightSharpIcon from '@mui/icons-material/ArrowRightSharp'
import { getValueById } from 'helpers/config/getValueById'
const PreferenceSelector = (props: any) => {
  let { preferences, preferenceId, config, lang } = props
  const allLang = lang
  lang = lang?.myJobs

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
      const url = new URLSearchParams([
        ...[...searchParams.entries()].filter(([key]) => {
          return key !== 'preferenceId'
        }),
        ['preferenceId', newId]
      ]).toString()
      push(location.pathname + '?' + url)
    }
  }, [preferences.length])
  useEffect(() => {
    setShowPreferenceId(preferenceId)
  }, [preferenceId])
  const { push, loading: pushing } = useContext(LoadingContext)
  const busy = useMemo(() => {
    return loading // || pushing
  }, [loading, pushing])
  const [showModal, setShowModal] = useState(false)
  return (
    <div className={styles.container}>
      <div className={styles.title}>{lang?.desiredJobTitle}:</div>
      <div className={styles.preferences}>
        {/* {loading && <CircularProgress size={10} style={{ marginLeft: 10 }} />} */}
        {preferences.map((preference) => {
          return (
            <div
              key={preference.id}
              title={preference.function_job_title}
              onClick={() => {
                if (+showPreferenceId === preference.id) {
                  return
                }
                setShowPreferenceId(preference.id)
                const url = new URLSearchParams([
                  ...[...searchParams.entries()].filter(([key]) => {
                    return key !== 'preferenceId'
                  }),
                  ['preferenceId', preference.id]
                ]).toString()
                push(location.pathname + '?' + url)
              }}
              className={classNames({
                [styles.preference]: true,
                [styles.selected]: +showPreferenceId === preference.id,
                [styles.disabled]: busy && +showPreferenceId !== preference.id
              })}
            >
              { getValueById(config, preference?.function_job_title_id, 'function_job_title_id') ?? ''}
            </div>
          )
        })}
      </div>
      <div className={styles.seperator} />
      {busy ? (
        <CircularProgress size={20} style={{ marginLeft: 10 }} />
      ) : (
        <div
          className={styles.action}
          onClick={() => {
            if (preferences.length === 3) {
              const selected = preferences.find((preference) => +preference.id === +preferenceId)
              setEditingPreference(selected)
            } else {
              setEditingPreference(undefined)
            }
            setShowModal(true)
          }}
        >
          {preferences.length === 3 ? lang?.edit : lang?.addNew}{' '}
          <ArrowRightSharpIcon style={{ color: '#BCBCBC', verticalAlign: 'top' }} />
        </div>
      )}
      {showModal && (
        <EditJobPreferencesModal
          lang={allLang}
          modalName={'jobPreference'}
          showModal={showModal}
          config={config}
          preference={editingPreference}
          userDetail={userDetail}
          handleModal={(name, show, refresh) => {
            setShowModal(show)
            if (refresh) {
              startTransition(() => {
                router.refresh()
              })
            }
          }}
        />
      )}
    </div>
  )
}

export default PreferenceSelector
