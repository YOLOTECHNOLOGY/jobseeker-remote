import React from 'react'

type IContextComposerProps = {
  contexts: React.JSX.Element[]
}

const ContextComposer = ({ contexts, children }: React.PropsWithChildren<IContextComposerProps>) => {
  return (
    <>
      {contexts.reduceRight((child, parent) => {
        return React.cloneElement(parent, {}, child)
      }, children)}
    </>
  )
}

ContextComposer.displayName = 'ContextComposerProvider'

export default ContextComposer
