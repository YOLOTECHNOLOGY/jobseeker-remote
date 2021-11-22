/* Vendor */
import classNames from 'classnames/bind'
import classNamesCombined from 'classnames'

/* Component */
import styles from './JobTag.module.scss'

/* Styles */
import Text from 'components/Text'

type JobTagProps = {
  tag: string
}

const JobTag = ({ tag }: JobTagProps) => {
  const text = tag === 'fullTime' ? 'Full-time' : tag.charAt(0).toUpperCase() + tag.slice(1)

  const cx = classNames.bind(styles)
  const tagClass = cx(tag)

  return (
    <div className={classNamesCombined([styles.JobTag, tagClass])}>
      <Text textStyle='base' bold>{text}</Text>
    </div>
  )
}

export default JobTag