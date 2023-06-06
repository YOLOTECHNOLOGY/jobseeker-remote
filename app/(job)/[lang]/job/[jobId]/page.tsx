import { cookies } from 'next/headers'
import Index from './index'
import { getGoogleJobJSON } from 'app/[lang]/components/SEO'
import { fetchJobDetailService } from 'store/services/jobs/fetchJobDetail'
import { getDictionary } from 'get-dictionary'
import interpreter from "./intepreter"
import { serverDataScript } from "app/[lang]/abstractModels/FetchServierComponents"
import { buildComponentScript } from "app/[lang]/abstractModels/util"
import React from 'react'
const handleFetchJobDetail = async (params: any) => {
  const cookieStore = cookies()

  const accessToken = cookieStore.getAll('accessToken')
  const jobId = params.jobId?.split('-').pop()

  if (jobId && Number(jobId)) {
    const querys = {
      jobId: jobId,
      status: 'public',
      serverAccessToken: null
    }

    if (accessToken[0]) {
      querys.status = accessToken[0].value ? 'protected' : 'public'
      querys.serverAccessToken = accessToken[0].value ?? null
    }

    const data = await fetchJobDetailService(querys)
      .then(({ data: { data } }) => data)
      .catch(() => ({ error: true }))
    return { data, jobId }
  } else {
    return { data: { error: true, message: 'Error: Invalid link address' }, jobId: null }
  }
}
const Page = async (props: any) => {
  const { params, config } = props
  const { data, jobId } = await handleFetchJobDetail(params)
  const dictionary = (await getDictionary(params.lang)) as any
  const jobDetail = data

  return (
    <>
      <Index
        data={data}
        jobId={jobId}
        lang={params.lang}
        languages={dictionary.jobDetail}
        config={config}
      />

      {jobDetail && jobDetail?.status_key === 'active' && (
        <script
          defer
          async
          type='application/ld+json'
          dangerouslySetInnerHTML={{
            __html: `${getGoogleJobJSON(jobDetail)}`
          }}
        ></script>
      )}
    </>
  )
}

export default interpreter(serverDataScript().chain(props => buildComponentScript(props, Page))).run