import { useState, useEffect } from 'react'
import { fetchUserSetting } from 'store/services/swtichCountry/userSetting'

import { getCountryId, getLanguageId } from 'helpers/country'

import { getCookie } from 'helpers/cookies'
import { useRouter, useSearchParams } from 'next/navigation'

const useGetStartedClient = () => {
  const [defaultRedirectPage, setDefaultRedirectPage] = useState<string>(null)
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirect = searchParams.get('redirect')

  useEffect(() => {
    if (Array.isArray(redirect)) {
      setDefaultRedirectPage(redirect[0])
    } else {
      setDefaultRedirectPage(redirect)
    }
  }, [redirect])


  const removeServiceCache = async () => {
    const token = getCookie('accessToken')
    const countryId = getCountryId()
    const languageId = getLanguageId()

    if (token) {
      await fetchUserSetting({ country_id: countryId, language_id: languageId }, token)
        .then((response) => console.log(response))
        .catch(({ response, request }) => console.log(response, request))
    }
  }

  const defaultLoginCallBack = async (data: any) => {
    await removeServiceCache()
    const isChatRedirect = localStorage.getItem('isChatRedirect')
    if (data.is_profile_update_required || !data.is_profile_completed) {
      router.push('/jobseeker-complete-profile/1')
    } else if (isChatRedirect) {
      localStorage.removeItem('isChatRedirect')
      router.push(isChatRedirect)
    } else if (defaultRedirectPage) {
      router.push(defaultRedirectPage)
    } else {
      router.push('/')
    }
  }

  return [defaultLoginCallBack]
}

export default useGetStartedClient
