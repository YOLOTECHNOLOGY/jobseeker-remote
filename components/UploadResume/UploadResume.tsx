import React, { useContext, useEffect, useMemo, useState } from 'react'

/* Components */
import Text from 'components/Text'
import MaterialButton from 'components/MaterialButton'
import Link from 'components/Link'
import EditRename from './EditRename/EditRename'

/* Helpers */
import { maxFileSize } from 'helpers/handleInput'

/* Styles */
import styles from './UploadResume.module.scss'
import classNames from 'classnames'

/* Assets */
import { DocumentIcon } from 'images'
// import format from 'date-fns/format'

import { SnackbarTips } from './SnackbarTips'
import moment from 'moment'
import { formatTemplateString } from 'helpers/formatter'
import { languageContext } from 'app/components/providers/languageProvider'
moment.locale('en')
type resumeObject = {
  name: string
  url: string
  id: number
  updated_at: string
}

type UploadResumeProps = {
  title: string
  resumes: resumeObject[]
  handleDelete: Function
  handleUpload: Function
  buttonClassname?: string
  deleteResumeLoading?: boolean
  lang?: Record<string, any>
}

const Trash = ({
  id,
  name,
  deleteResumeLoading,
  onClick,
  lang,
  displayClear
}: {
  id: number
  deleteResumeLoading: boolean
  onClick: () => void
  name: string
  lang?: Record<string, any>
  displayClear: boolean
}) => {
  return (
    <div
      className={classNames([
        styles.trashDiv,
        deleteResumeLoading ? styles.disabledDelResume : null
      ])}
    >
      {/* <img
        className={classNames([
          styles.trashDiv_icon,
          deleteResumeLoading ? styles.disabledDelResume_icon : null
        ])}
        src={TrashIcon}
        alt='trash'
        width='14'
        height='14'
        onClick={onClick}
      /> */}

      <EditRename
        id={id}
        name={name}
        deleteResumeLoading={deleteResumeLoading}
        handleDeleteResume={onClick}
        lang={lang}
        displayClear={displayClear}
      />
    </div>
  )
}

const UploadResume = ({
  resumes,
  handleDelete,
  handleUpload,
  buttonClassname,
  deleteResumeLoading,
  lang
}: UploadResumeProps) => {
  const {
    manageProfile: {
      tab: { resume: transitions }
    }
  } = lang || (useContext(languageContext) as any)
  const [isExceedLimit, setIsExceedLimit] = useState(false)
  const handleOnFileChange = (e) => {
    const file = e.target.files[0]
    if (!maxFileSize(file, 5)) {
      setIsExceedLimit(true)
      return
    }
    handleUpload?.(file)
  }

  const handleDeleteResume = (e) => {
    handleDelete?.(e)
  }
  const displayClear = useMemo(() => resumes.length > 1, [resumes])
  return (
    <>
      <div className={styles.uploadResumeField}>
        {resumes.length ?
          resumes.map((item, index) => {
            return (
                <div key={index+'~'+ item?.id} className={styles.uploadedResume}>
                  <div className={styles.leftResume}>
                    <div className={styles.documentDiv}>
                      <img src={DocumentIcon} alt='document' width='21' height='21' />
                    </div>
                    <div>
                      <Link to={item?.url} external>
                        <Text textStyle='lg' bold className={styles.resumeName}>
                          {item?.name}
                        </Text>
                      </Link>
                      <div className={styles.resumeTime}>
                        {formatTemplateString(
                          transitions.upload.time,
                          moment(item.updated_at).format('DD MMM yyyy')
                        )}
                      </div>
                    </div>
                  </div>

                  <Trash
                    id={item.id}
                    name={item.name}
                    deleteResumeLoading={deleteResumeLoading}
                    onClick={() => handleDeleteResume(item.id)}
                    lang={lang}
                    displayClear={displayClear}
                  />
                </div>
            )
          }) : null }
        {!resumes.length && (
          <div>
            <MaterialButton
              variant='outlined'
              capitalize
              component='label'
              className={classNames([styles.buttonCTA, buttonClassname])}
            >
              <Text textStyle='base' textColor='primaryBlue' bold>
                {transitions.upload.uploadBtn}
              </Text>
              <input
                type='file'
                hidden
                accept='.pdf, .doc, .docx'
                onChange={(e) => handleOnFileChange(e)}
              />
            </MaterialButton>
          </div>
        )}
        <Text textStyle='sm' block className={styles.upToFiles}>
          {transitions.upload.upTo3files}
        </Text>
        <Text textColor='darkgrey' textStyle='sm'>
          {transitions.upload.support}
        </Text>
      </div>
      <SnackbarTips
        title={transitions.upload.error.title}
        errorMessage={transitions.upload.error.tips}
        show={isExceedLimit}
        onDismiss={() => {
          setIsExceedLimit(false)
        }}
      />
    </>
  )
}

export default UploadResume
