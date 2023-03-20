
import Resume from "./Resume"
import InterestedMe from ".//InterestedMe"
import ViewedMe from './ViewedMe'
import {fetchPersonalInfo} from 'store/services/jobs/fetchJobsCommunicated'
import { cookies } from 'next/headers'
async function getInfo(accessToken) {
  const res = await fetchPersonalInfo({accessToken});
  return res.data;
}

export default async function  Page () {
  const accessToken = cookies().get('accessToken')?.value
  const data: any = await getInfo(accessToken);
    return (
      <>
         <Resume data={data?.data || {}}/>
         <InterestedMe/>
         <ViewedMe/>
      </>
    )
  }
  
