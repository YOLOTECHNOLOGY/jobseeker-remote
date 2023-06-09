import styles from './index.module.scss'
import { KeyboardArrowLeftOutlined, Close } from "@mui/icons-material"
import classNames from 'classnames'

const Header = (props: any) => {
    const { title, onBack, onClose } = props
    return <div
        className={classNames({
            [styles.header]: true,
        })}
    >
        <div className={styles.headerContainer}>
            <div className={styles.headerLeft}>
                {onBack && <KeyboardArrowLeftOutlined style={{ color: '#707070', width: 30, height: 30 }} onClick={onBack} />}
                <label>{title}</label>
            </div>
            {onClose && <Close onClick={onClose} />}
        </div>
    </div>
}
export default Header