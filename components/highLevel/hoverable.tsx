/* eslint-disable react/prop-types */
/* eslint-disable react/display-name */
import React, { FunctionComponent, useState } from "react";
interface HoverableProps {
    isHover: boolean
    onMouseEnter?: Function
    onMouseLeave?: Function
}
interface Hoverable {
    <P extends HoverableProps>(Component: FunctionComponent<P>): FunctionComponent<Exclude<P, { isHover }>>
}
const hoverable: Hoverable = (SubComponent) => {

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

export default hoverable