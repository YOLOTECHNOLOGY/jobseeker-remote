import { useEffect } from 'react'

// Vendor
import { useRouter } from 'next/router'

// Components
import Text from 'components/Text'

// Store
import { wrapper } from 'store'

const Linkedin = (code) => {
  const router = useRouter()
  const linkedinCode = router?.query?.code || code

  useEffect(() => {
    console.log(linkedinCode)
    if (linkedinCode) {
      window.opener &&
      window.opener.postMessage(
        { code: linkedinCode, from: 'LinkedIn' },
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