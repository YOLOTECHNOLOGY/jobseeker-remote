import React, { useContext } from 'react'
import { LinkContext } from '../providers/linkProvider'
const Link = (props: any) => {
    const { href, children, ...rest } = props
    const { push } = useContext(LinkContext)
    return <div
        {...rest}
        style={{ cursor: 'pointer' }}
        onClick={() => push(href)}
    >{children}</div>
}
export default Link