import styles from './index.module.scss'
import { KeyboardArrowRightOutlined } from "@mui/icons-material"
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import classNames from 'classnames'

const JobItem = (props: any) => {
    const { data, checked, active, noArrow, onArrowClick, halfChecked, ...rest } = props
    return <div
        className={classNames({
            [styles.item]: true,
            [styles.active]: active
        })}
        id={'job-item-' + data.value + data?.id}
        {...rest}
    >

        <label id={'job-item-label' + data.value + data?.id} contentEditable={false}>{data?.value}</label>
        <div id={'job-item-container' + data.value + data?.id} className={styles.rightContainer} style={{ marginRight: noArrow ? 10 : 0 }}>
            <div className={styles.icon}>{(checked || halfChecked) && <CheckCircleIcon
                style={{ opacity: checked ? 1 : 0.5 }}
                id={'job-item-icon' + data.value + data?.id}
                fill='red'
                height='16' width='16' />}</div>
            {!noArrow && <div id={'job-item-no-arrow' + data.value + data?.id} className={styles.arrow} onClick={onArrowClick} style={{ width: 40 }}>
                <KeyboardArrowRightOutlined style={{ color: '#707070', margin: 'auto' }} />
            </div>}
        </div>

    </div>
}
export default JobItem