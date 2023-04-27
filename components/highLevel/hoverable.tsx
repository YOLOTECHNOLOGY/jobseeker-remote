/* eslint-disable react/prop-types */
/* eslint-disable react/display-name */
import React, { FunctionComponent, useState, ReactElement, MouseEventHandler } from "react";
import styles from './index.module.scss'
export interface HoverableProps {
    isHover: boolean
    onMouseEnter?: MouseEventHandler
    onMouseLeave?: MouseEventHandler
}
export interface Hoverable {
    <P extends HoverableProps>(Component: FunctionComponent<P>, lastHover?: Boolean): FunctionComponent<Exclude<P, { isHover }>>
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

export const hoverable: Hoverable = (SubComponent, lastHover = false) => {

    return (props) => {
        const [isHover, setIsHover] = useState(lastHover)
        const { onMouseEnter, onMouseLeave } = props
        return <SubComponent
            {...props}
            onMouseEnter={e => {
                e.stopPropagation()
                onMouseEnter?.(e)
                setIsHover(true)
            }}
            onMouseLeave={e => {
                e.stopPropagation()
                onMouseLeave?.(e)
                setIsHover(false)
            }}
            isHover={isHover ?? false}
        />
    }
}

/*
<div>
...
 hoverableFunc((isHover) => (
    <div className={isHover?hoverClass:normalClass}>
     ...
    </div>))
...
 </div>
*/

export const hoverableFunc = (
    hoverFunc: (isHover: boolean) => ReactElement,
    wrapperProps: { [key: string]: any } = {},
    lastHover = false
): ReactElement => {
    const Component: FunctionComponent<{}> = hoverable((props: HoverableProps) => {
        const { isHover, onMouseEnter, onMouseLeave } = props
        const children = hoverFunc(isHover)
        return <div
            className={styles.wrapper}
            onMouseEnter={onMouseEnter}
            onMouseLeave={onMouseLeave}
            {...wrapperProps}
        >{children}</div>
    }, lastHover)
    return <Component />
}
