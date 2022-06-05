import { useEffect } from 'react'

// Vendor
import { useRouter } from 'next/router'

// Components
import Text from 'components/Text'

const Linkedin = () => {
  const router = useRouter()
  const linkedinCode = router?.query?.code || null

  useEffect(() => {
    if (linkedinCode) {
      window.opener &&
      window.opener.postMessage(
        { code: linkedinCode, from: 'Linked In' },
        window.location.origin
      )
    }
  }, [])

  return <Text>Logging In...</Text>
}

export default Linkedin