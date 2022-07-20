// eslint-disable
import React from 'react'
import NextLink from 'next/link'
// import { UrlObject } from 'url'

interface LinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  children: React.ReactNode
  to: string
  className?: string
  // read more on when to using passHref here: https://nextjs.org/docs/api-reference/next/link
  passHref?: boolean
  // serve link as a regular html link & create a new tab to the destinated url
  external?: boolean
  // serve link as a regular html link & redirect current tab to the destinated url
  aTag?: boolean
  title?: string
  rest?: any
}

const Link = ({
  children,
  to,
  className,
  passHref,
  external,
  aTag,
  title,
  ...rest
}: // default Style ?
LinkProps) => {
  if (external || aTag) {
    // check if https is appended before the url
    if (to !== '' && to !== null && !/^(f|ht)tps?:\/\//i.test(to)) {
      to = 'https://' + to
    }
    return (
      <a
        href={to}
        className={className}
        target={external ? '_blank' : '_self'}
        rel='noopener noreferrer'
        title={title}
        {...rest}
      >
        {children}
      </a>
    )
  }
  return (
    <NextLink href={to} passHref={passHref} {...rest}>
      <a
        className={className}
        style={
          className == 'default' ? { color: '#2379ea', textDecoration: 'underline' } : undefined
        }
      >
        {children}
      </a>
    </NextLink>
  )
}

export default Link
