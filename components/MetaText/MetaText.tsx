import Text from '../Text'

// Styles
import styles from './MetaText.module.scss'

type MetaTextProps = {
  children: React.ReactNode
  // children:  string | React.ReactElement |React.ReactElement []
  // children:  string | JSX.Element | JSX.Element[];
  style?: React.CSSProperties
  className?: string
  tagName?: keyof JSX.IntrinsicElements
  bold?: boolean
  italic?: boolean
  textColor?: string
  textStyle?: string
  block?: boolean
  onClick?: () => void
  underline?: boolean
}

const MetaText = ({ children, ...others }: MetaTextProps) => {
  return (
    <Text className={styles.metaTag} {...others}>
      {children}
    </Text>
  )
}

export default MetaText
