/* eslint-disable react/prop-types */
/* eslint-disable react/display-name */
import React, { FunctionComponent, useState, ReactElement, MouseEventHandler } from "react";
import styles from './index.module.scss'
interface HoverableProps {
    isHover: boolean
    onMouseEnter?: MouseEventHandler
    onMouseLeave?: MouseEventHandler
}
interface Hoverable {
    <P extends HoverableProps>(Component: FunctionComponent<P>): FunctionComponent<Exclude<P, { isHover }>>
}

/*
const ComA = props => {
     const {isHover,onMouseLeave,onMouseEnter} =props
     return <div onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave}>
                ...
            </div>
}

export default hoverable(ComA)

*/

export const hoverable: Hoverable = (SubComponent) => {

    return (props) => {
        const [isHover, setIsHover] = useState(false)
        const { onMouseEnter, onMouseLeave } = props
        return <SubComponent
            {...props}
            onMouseEnter={e => {
                onMouseEnter?.(e)
                setIsHover(true)
            }}
            onMouseLeave={e => {
                onMouseLeave?.(e)
                setIsHover(false)
            }}
            isHover={isHover}
        />
    }
}

/*
<div>
...
 hoverableFunc(({isHover}) => (
    <div className={isHover?hoverClass:normalClass}>
     ...
    </div>))
...
 </div>
*/

export const hoverableFunc = (hoverFunc: (isHover: boolean) => ReactElement, wrapperProps: { [key: string]: any } = {}): ReactElement => {
    const Component: FunctionComponent<{}> = hoverable((props: HoverableProps) => {
        const { isHover, onMouseEnter, onMouseLeave } = props
        const children = hoverFunc(isHover)
        return <div
            className={styles.wrapper}
            onMouseEnter={onMouseEnter}
            onMouseLeave={onMouseLeave}
            {...wrapperProps}
        >{children}</div>
    })
    return <Component />
}
