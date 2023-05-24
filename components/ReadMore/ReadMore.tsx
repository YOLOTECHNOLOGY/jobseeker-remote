import React, { useEffect, useState } from 'react'

/* Components */
import Text from 'components/Text'

/* Style */
import styles from './ReadMore.module.scss'
import classNames from 'classnames'

interface ReadMoreProps {
  size?: number
  text?: any
  expandText?: string
  shirkText?: string
  className?: string
}

const ReadMore = ({
  size,
  text,
  className,
  shirkText = 'Read Less',
  expandText = 'Read More'
}: ReadMoreProps) => {
  const [description, setDescription] = useState(null)
  const [isFullDescription, setIsFullDescription] = useState(false)

  useEffect(() => {
    handleDescription()
  }, [text, isFullDescription])

  const handleDescription = () => {
    if (!isFullDescription && text?.length > size) {
      setDescription(`${text.slice(0, size)}...`)
      return
    }
    setDescription(text)
  }

  return (
    <div className={classNames([styles.readMore, className])}>
      <div className={styles.readMoreDescription}>
        <Text textStyle='base'>
          <div
            className={styles.JobDetailSectionBody}
            dangerouslySetInnerHTML={{ __html: description || '' }}
          />
        </Text>
      </div>
      {description?.length > size && (
        <div className={styles.readMoreAction}>
          <span
            onClick={() => {
              handleDescription()
              setIsFullDescription(!isFullDescription)
            }}
          >
            <Text textStyle='lg' textColor='primaryBlue'>
              {isFullDescription ? shirkText : expandText}
            </Text>
          </span>
        </div>
      )}
    </div>
  )
}

export default ReadMore
