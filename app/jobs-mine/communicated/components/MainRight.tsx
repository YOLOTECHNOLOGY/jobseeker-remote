

import Resume from "./Resume"
import InterestedMe from "./InterestedMe"
import ViewedMe from './ViewedMe'
import {
  fetchResumes,
} from 'store/services/jobs/fetchJobsCommunicated'
import { cookies } from 'next/headers'

async function getResumes(accessToken) {
  const res = await fetchResumes({accessToken});
  return res?.data?.data || {};
}

export default async function  Page () {
  const accessToken = cookies().get('accessToken')?.value
  const resumesData = await getResumes(accessToken);
  const [resumes] = await Promise.all([resumesData]);

  return (
      <>
         <Resume resumes={resumes} />
            {/* @ts-expect-error Async Server Component */}
         <InterestedMe />
         {/* @ts-expect-error Async Server Component */}
          <ViewedMe/>
      </>
    )
  }
  
