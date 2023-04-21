import React from 'react'
import NextLink from 'next/link'

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

/*
 * If using for external link without external | aTag, it is required to append "http/https" in front of the URL.
 * If using for internal link with external | aTag, make sure to append hostpath in front 
 */
const Link = ({
  children,
  to: propTo,
  className,
  passHref,
  external,
  aTag,
  ...rest
}: LinkProps) => {
  let to = propTo
  console.log(external,aTag, to)
  if (external || aTag) {
    // check if https is appended before the url
    if (to !== '' && to !== null && !/^(f|ht)tps?:\/\//i.test(to)) {
      console.log(to,111111)
      to = 'https://' + to
    }
    // return (
    //   <a
    //     href={to}
    //     className={className}
    //     target={external ? '_blank' : '_self'}
    //     rel='noopener noreferrer'
    //     title={title}
    //     {...rest}
    //   >
    //     {children}
    //   </a>
    // )
  }
  
  return (
    <NextLink
      href={to}
      passHref={passHref}
      target={external ? '_blank' : '_self'}
      rel='noopener noreferrer'
      className={className}
      style={
        className == 'default' ? { color: '#2379ea', textDecoration: 'underline' } : undefined
      } {...rest}>

      {children}

    </NextLink>
  )
}

export default Link
