import React, { useState, useRef } from 'react'
import { assign } from 'lodash-es'
import Modal from 'components/Modal'
import ContentLoader from 'react-content-loader'
import { TrashIcon, PencilIcon } from 'images'

import styles from './index.module.scss'

type IconProps = {
  onClick: () => void
  src: string
} & Partial<Pick<HTMLImageElement, 'alt' | 'width' | 'height'>>

const Icon = ({ onClick, src, width, height, ...rest }: IconProps) => {
  return (
    <div className={styles.icon} onClick={onClick}>
      <img src={src} width={width || height} height={height || width} {...rest} />
    </div>
  )
}

const CommonPhrasesEditListModal = (props: any) => {
  const { contextRef, loading, listLoading, list ,dic} = props
  const [show, setShow] = useState(false)
  const actionsRef = useRef<any>()
  const context = {
    showEditCommonPhrasesList(actions) {
      actionsRef.current = actions
      setShow(true)
    },
    closeEditCommonPhrasesList() {
      setShow(false)
    }
  }
  contextRef.current = assign(contextRef.current, context)

  return (
    <Modal
      showModal={show}
      handleModal={() => actionsRef.current?.back?.()}
      headerTitle={dic?.phraseTitle}
      secondButtonText={dic?.done}
      secondButtonIsClose={false}
      handleSecondButton={() => actionsRef.current.back?.()}
      isSecondButtonLoading={loading}
      isFirstButtonLoading={loading}
    >
      <div className={styles.modalContainer}>
        <div className={styles.formContainer}>
          {listLoading ? (
            <ContentLoader />
          ) : (
            list.map((phrase, index) => {
              return (
                <div className={styles.editItemContainer} key={phrase.id}>
                  <p>
                    {index + 1}. {phrase.message}
                  </p>
                  <div className={styles.actions}>
                    <Icon
                      src={PencilIcon}
                      width={24}
                      alt='pencil'
                      onClick={() => {
                        actionsRef.current?.editOne(phrase)
                      }}
                    />
                    <Icon
                      src={TrashIcon}
                      alt='trash'
                      width={14}
                      onClick={() => {
                        actionsRef.current?.deleteOne(phrase)
                      }}
                    />
                  </div>
                </div>
              )
            })
          )}
        </div>
      </div>
    </Modal>
  )
}

export default CommonPhrasesEditListModal
