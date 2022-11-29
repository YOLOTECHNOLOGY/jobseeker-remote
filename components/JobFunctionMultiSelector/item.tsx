import styles from './index.module.scss'
import { KeyboardArrowRightOutlined } from "@mui/icons-material"
import { CarouselRightRoundedBlueButton } from 'images'
import classNames from 'classnames'

const JobItem = (props: any) => {
    const { data, checked, active, noArrow, ...rest } = props
    return <div
        className={classNames({
            [styles.item]: true,
            [styles.active]:active
        })}
        {...rest}
    >
        <label>{data?.value}</label>
        {!noArrow && <KeyboardArrowRightOutlined style={{ color: '#707070' }} />}
        {checked && <img
            style={{ display: checked }}
            src={CarouselRightRoundedBlueButton}
            title='minus' alt='minus' height='16' width='16' />}

    </div>
}
export default JobItem