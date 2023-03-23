
import Resume from "./Resume"
import InterestedMe from ".//InterestedMe"
import ViewedMe from './ViewedMe'
import {
  fetchPersonalInfo,
  fetchResumes,
} from 'store/services/jobs/fetchJobsCommunicated'
import { cookies } from 'next/headers'
async function getInfo(accessToken) {
  const res = await fetchPersonalInfo({accessToken});
  return res?.data?.data || {};
}
async function getResumes(accessToken) {
  const res = await fetchResumes({accessToken});
  return res?.data?.data || {};
}


export default async function  Page () {
  const accessToken = cookies().get('accessToken')?.value
  const infoData = await getInfo(accessToken);
  const resumesData = await getResumes(accessToken);
  const [data, resumes] = await Promise.all([infoData,resumesData]);
  return (
      <>
         <Resume  data={data} resumes={resumes}/>
            {/* @ts-expect-error Async Server Component */}
         <InterestedMe/>
         {/* @ts-expect-error Async Server Component */}
          <ViewedMe/>
      </>
    )
  }
  
