import React from 'react'
import FunctionFilter from "."
import interpreter from "app/main-page/intepreter"
import { serverDataScript } from "app/abstractModels/FetchServierComponents"
import { buildComponentScript } from "app/abstractModels/util"
import { flatMap } from 'lodash-es'
import { fetchJobsPreferences } from "store/services/jobs/fetchJobsForYouLogin"
import { cookies } from "next/headers"
import { ReaderTPromise as M } from "app/abstractModels/monads"

// eslint-disable-next-line react/display-name
const LiftClient = Client => props => <Client {...props} />

const getSimpleTitle = item => {
  const title = item.title
  const map = {
    'Information Technology': 'IT',
    'Customer Service/Operations': 'CSR/Ops',
    'Finance/Audit/Tax': 'Finance',
    'Product Management': 'PM'
  }
  return { ...item, simpleTitle: map[title] || title }
}



const getFunctionTitles = list => list.map(
  mainTitle => flatMap(mainTitle.children, item => item.children)
)

const fillTo3 = popularList => filledList => sourceList => {
  if (filledList.length >= Math.min(3, sourceList.length)) {
    return filledList
  } else {
    const one = sourceList.find(
      item => !filledList.includes(item.label) && popularList.includes(item.label)
    ) || sourceList.find(item => !filledList.includes(item.label))
    return fillTo3(popularList)([...filledList, one.label])(sourceList)
  }
}

const ServerFunctionFilter = async (props: { config: any }) => {
  const config = props.config
  const list = config?.inputs?.main_functions?.map?.(item => {
    return {
      title: item.value,
      children: item.children?.map?.(item => ({
        title: item.value,
        children: item.job_titles?.map(item => ({
          label: item.value,
          value: item['seo-value']
        })) ?? []
      })) ?? [],
    }
  })?.map?.(getSimpleTitle) ?? []
  let popularList = []
  const accessToken = cookies().get('accessToken')?.value
  if (accessToken) {
    const result = await fetchJobsPreferences({}, accessToken)
    popularList = result?.data?.data?.map(item => item.function_job_title) ?? []
  }
  const functionTitles = getFunctionTitles(list)
  const subTitlesList = functionTitles.map(fillTo3(popularList)([]))
  return { list, subTitlesList }
}


export default interpreter(serverDataScript())
  .chain(props => M.do(() => ServerFunctionFilter(props)))
  .chain(props => interpreter(buildComponentScript(props, LiftClient(FunctionFilter))))
  .run
// export default ServerFunctionFilter as any