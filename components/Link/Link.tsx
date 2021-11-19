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
}

const Link = ({
  children,
  to,
  className,
  passHref,
  external,
  aTag,
  title,
}: // default Style ?
LinkProps) => {
  if (external || aTag) {
    return (
      <a
        href={to}
        className={className}
        target={external ? '_blank' : '_self'}
        rel='noopener noreferrer'
        title={title}
      >
        {children}
      </a>
    )
  }
  return (
    <NextLink href={to} passHref={passHref}>
      <a className={className}>{children}</a>
    </NextLink>
  )
}

export default Link
