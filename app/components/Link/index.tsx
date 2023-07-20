import React, { useContext } from 'react'
import { LinkContext } from '../providers/linkProvider'
const Link = (props: any) => {
    const { href, children, className, style } = props
    const { push } = useContext(LinkContext)
    return <div
        className={className}
        style={{ ...style, cursor: 'pointer' }}
        onClick={() => push(href)}
    >{children}</div>
}
export default Link