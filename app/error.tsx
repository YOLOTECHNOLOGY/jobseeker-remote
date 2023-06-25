'use client'
import Error from './[lang]/error'

export default function Error1(props: any) {
  return (
    <html>
      <head></head>
      <body
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          height: '100vh'
        }}
      >
        <div id='root'>
          <Error {...props} />
        </div>
      </body>
    </html>
  )
}
