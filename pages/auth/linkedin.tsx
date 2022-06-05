import { useEffect } from 'react'

// Components
import Text from 'components/Text'

// Store
import { wrapper } from 'store'

const Linkedin = (code) => {
  useEffect(() => {
    if (code) {
      window.opener &&
      window.opener.postMessage(
        { code: code, from: 'LinkedIn' },
        window.location.origin
      )
    }
  }, [])

  return <Text>Logging In...</Text>
}

export const getServerSideProps = wrapper.getServerSideProps(() => async (ctx) => {
  const { query } = ctx

  const code = query.code
  
  return { 
    props: {
      code
    },
  }
})

export default Linkedin