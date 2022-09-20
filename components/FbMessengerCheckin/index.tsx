import React, { memo, useEffect } from 'react'
import PropTypes from 'prop-types'

// user_ref == userId
const FbMessengerCheckin = ({ userRef }) => {
  let hostName = ''

  switch (process.env.NODE_ENV) {
    case 'development':
      hostName = 'dev.bossjob.ph'
      break
    case 'production':
      hostName = 'bossjob.ph'
      break
    default:
      hostName = ''
  }

  useEffect(() => {
    if (typeof window !== undefined) {
      // Make sure the facebook plugin is rendered properly
      ;(window as any).FB?.XFBML.parse()
    }
  }, [])

  return (
    <div
      className='fb-messenger-checkbox'
      // @ts-ignore #
      origin={hostName}
      page_id={process.env.CUSTOM_NODE_ENV === 'production' ? '307776753021449' : '638091659945858'}
      messenger_app_id={
        process.env.CUSTOM_NODE_ENV === 'production' ? '2026042927653653' : '2111002932479859'
      }
      user_ref={userRef}
      // allow_login='<true>'
      // size='<small>'
      // skin='light'
      // center_align='<true>'

      allow_login='true'
      size='small'
      skin='light'
      center_align='<true>'
    />
  )
}

FbMessengerCheckin.propTypes = {
  userRef: PropTypes.string.isRequired
}

export default memo(FbMessengerCheckin)
