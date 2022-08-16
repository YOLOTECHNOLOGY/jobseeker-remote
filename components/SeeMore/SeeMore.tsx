import React, { useState } from 'react'

/* Components */
import Text from 'components/Text'

/* Style */
import styles from './SeeMore.module.scss'
import classNames from 'classnames'

interface SeeMoreProps {
  // Beyond count, element will be hidden unless expanded
  count: number
  items: Array<any>
  renderElement: any
  className?: string
}

const SeeMore = ({ count, items = [], renderElement, className }: SeeMoreProps) => {
  const [viewFull, setViewFull] = useState(false)

  return (
    <div className={classNames([styles.seeMore, className])}>
      {!viewFull &&
        items.map((item, i) => {
          if (i < count) {
            return renderElement(i, item)
          }
        })}
      {viewFull &&
        items.map((item, i) => {
            return renderElement(i, item)
        })}
      {items?.length >= count && (
        <div className={styles.seeMoreAction}>
          <span
            onClick={() => {
              setViewFull(!viewFull)
            }}
          >
            <Text textStyle='lg' textColor='primaryBlue'>
              {viewFull ? 'See Less' : 'See More'}
            </Text>
          </span>
        </div>
      )}
    </div>
  )
}

export default SeeMore
