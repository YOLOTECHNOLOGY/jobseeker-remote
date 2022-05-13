/* Vendor */
import classNames from 'classnames/bind'
import classNamesCombined from 'classnames'

/* Component */
import styles from './JobTag.module.scss'

/* Styles */
import Text from 'components/Text'

type JobTagProps = {
  tag: string
  tagType?: string
}

const JobTag = ({ tag, tagType=null }: JobTagProps) => {

  const cx = classNames.bind(styles)
  const tagClass = cx(tagType)

  return (
    <div className={classNamesCombined([styles.JobTag, tagClass])}>
      <Text textStyle='lg' bold>{tag}</Text>
    </div>
  )
}

export default JobTag