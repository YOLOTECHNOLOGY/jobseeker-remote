import FunctionFilter from "."
import React from 'react'
import interpreter from "app/main-page/intepreter"
import { serverDataScript } from "app/abstractModels/FetchServierComponents"
import { buildComponentScript } from "app/abstractModels/util"

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

const ServerFunctionFilter = async (props: { config: any }) => {
  const config = props.config
  const list = config?.inputs?.main_functions?.map?.(item => {
    return {
      title: item.value,
      children: item.children?.map?.(item => ({
        title: item.value,
        children: item.job_titles?.map(item=>({
          label:item.value,
          value:item['seo-value']
        })) ?? []
      })) ?? [],
    }
  })?.map?.(getSimpleTitle) ?? []
  console.log({ config })
  const filterProps: any = await Promise.resolve({ list })
  return <FunctionFilter {...filterProps} />
}
export default interpreter(
  serverDataScript()
      .chain(props => buildComponentScript(props, ServerFunctionFilter))
).run
// export default ServerFunctionFilter as any