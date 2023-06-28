import Index from './index'
import { getGoogleJobJSON } from 'app/components/SEO'
import { getDictionary } from 'get-dictionary'
import interpreter from "./intepreter"
import { serverDataScript } from "app/models/abstractModels/FetchServierComponents"
import { buildComponentScript } from "app/models/abstractModels/util"
import React from 'react'
import { handleFetchJobDetail } from  './service'
export const revalidate = 3600
const Page = async (props: any) => {
  const { params, config } = props
  const { data, jobId } = await handleFetchJobDetail(params)
  const dictionary = (await getDictionary(params.lang)) as any
  //
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