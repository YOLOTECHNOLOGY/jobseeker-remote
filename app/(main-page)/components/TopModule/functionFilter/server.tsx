/* eslint-disable import/no-anonymous-default-export */
import React from 'react'
import FunctionFilter from "."
import interpreter from "app/(main-page)/intepreter"
import { serverDataScript } from "app/models/abstractModels/FetchServierComponents"
import { buildComponentScript } from "app/models/abstractModels/util"
import { flatMap } from 'lodash-es'
import { fetchJobsPreferences } from "store/services/jobs/fetchJobsForYouLogin"
import { cookies } from "next/headers"
import { ReaderTPromise as M } from "app/models/abstractModels/monads"
import { dropLast } from 'ramda'
// eslint-disable-next-line react/display-name
const LiftClient = Client => props => <Client {...props} />

const getSimpleTitle = item => {
  const title = item.title
  const map = {
    'Information Technology': 'IT',
    'Customer Service/Operations': 'CSR/Ops',
    'Finance/Audit/Tax': 'Finance',
    'Product Management': 'PM',
    'Telecommunication': 'Telecom',
    'Human Resources/Admin/Legal': 'HR/Admin/Legal',
    'Food and Beverages': 'F&B',
    'Arts/Media/Communications': 'Arts/Media',
    'Marketing/PR/Advertising': 'MKT/PR/Ads',
    'Purchasing/Trading': 'Purchasing',
    'Professional Services': 'Services',
    'Agriculture/Environment': 'Agri/Env'
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
      item => !filledList.includes(item.label) && popularList.includes(item.id)
    ) || sourceList.find(item => !filledList.includes(item.label))
    return fillTo3(popularList)([...filledList, one.label])(sourceList)
  }
}

const ServerFunctionFilter = async (props: { config: any, langKey: any }) => {
  const config = props?.config
  const list = config?.main_job_function_lists?.map?.(item => {
    return {
      ...item,
      title: item.value,
      children: item.sub_function_list?.map?.(item => ({
        ...item,
        title: item.value,
        children: item.job_titles?.map(item => ({
          ...item,
          label: item.value,
          // value: item['seo-value']
          value: String(item.id)
        })) ?? []
      })) ?? [],
    }
  })?.map?.(getSimpleTitle) ?? []
  let popularList = []
  const accessToken = cookies().get('accessToken')?.value
  if (accessToken) {
    const result = await fetchJobsPreferences({}, accessToken)
    popularList = result?.data?.data?.map(item => item.function_job_title_id) ?? []

  }
  const functionTitles = getFunctionTitles(list)
  const subTitlesList = functionTitles.map(fillTo3(popularList)([]))
  const shakeSub = (subTitles, mainWidth) => {
    if (subTitles.length <= 1) {
      return subTitles
    } else {
      const subWidth = subTitles.map(sub => sub.length * 7).reduce((a, b) => a + b + 10, 0)
      if (mainWidth + subWidth >= 572) {
        return shakeSub(dropLast(1, subTitles), mainWidth)
      } else {
        return subTitles
      }
    }
  }
  const contentWidths = list.map(mainTitle => {
    const mainWidth = mainTitle.title.length * 9 + 10
    return 482 - mainWidth
  })
  const filtered = subTitlesList.map((subTitles, index) => {
    const mainTitle = list[index].title
    const mainWidth = mainTitle.length * 9 + 10
    return shakeSub(subTitles, mainWidth)
  })
  return { list, subTitlesList: filtered, contentWidths }
}


export default (props: any) => interpreter(serverDataScript())
  .chain(props => M.do(() => ServerFunctionFilter(props)))
  .chain(props => interpreter(buildComponentScript(props, LiftClient(FunctionFilter))))
  .run(props)
// export default ServerFunctionFilter as any