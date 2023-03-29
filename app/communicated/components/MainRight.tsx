
import Resume from "./Resume"
import InterestedMe from ".//InterestedMe"
import ViewedMe from './ViewedMe'
import {fetchPersonalInfo,} from 'store/services/jobs/fetchJobsCommunicated'
import { cookies } from 'next/headers'
async function getInfo(accessToken) {
  const res = await fetchPersonalInfo({accessToken});
  return res?.data?.data || {};
}


export default async function  Page () {
  const accessToken = cookies().get('accessToken')?.value
  const infoData = await getInfo(accessToken);
  const [data] = await Promise.all([infoData]);
  return (
      <>
         <Resume  data={data}/>
            {/* @ts-expect-error Async Server Component */}
         <InterestedMe/>
         {/* @ts-expect-error Async Server Component */}
          <ViewedMe/>
      </>
    )
  }
  
