import React, { useEffect, useState } from 'react'

/* Components */
import Text from 'components/Text'

/* Style */
import styles from './ReadMore.module.scss'

interface ReadMoreProps {
  size?: number
  text?: any
}

const ReadMore = ({
  size,
  text
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
    <div className={styles.ReadMore}>
      <div className={styles.ReadMoreDescription}>
        <Text textStyle='base'>
          <div className={styles.JobDetailSectionBody} dangerouslySetInnerHTML={{ __html: description || '' }} />  
        </Text>
      </div>
      {description?.length > size && (
        <div className={styles.ReadMoreAction}>
          <span
            onClick={() => {
              handleDescription()
              setIsFullDescription(!isFullDescription)
            }}
          >
            <Text textStyle='base' textColor='primaryBlue'>
              {isFullDescription ? '...read less' : '...read more'}
            </Text>
          </span>
        </div>
      )}
    </div>
  )
}

export default ReadMore