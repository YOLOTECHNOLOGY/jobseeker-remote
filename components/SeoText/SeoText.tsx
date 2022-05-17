import Text from '../Text'

// Styles
import styles from './SeoText.module.scss'

type SeoTextProps = {
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

const SeoText = ({ children, ...others }: SeoTextProps) => {
  return (
    <Text className={styles.metaTag} {...others}>
      {children}
    </Text>
  )
}

export default SeoText
