'use client'
import React , { useEffect , useState } from "react";
import styles from './index.module.scss';
import {fetchJobsForYou} from '../../../../store/services/jobs/fetchJobsForYou'



const JobsCard = () =>{

   const [page] = useState({
      page:1,
      size:20,
      query_job_location:'Manila',
      main_functions:'Information Technology'
   });

   const [ jobs, setJobs] = useState([]);

   useEffect(()=>{
      fetchJobsForYou(page).then(res=>{
         console.log(res?.data?.data,7888)
         const data = res?.data?.data;
        if(data){      
         setJobs(data?.jobs || [])
        }else{
          
        }
      })
     
   },[page])

   console.log(jobs,789999999)


return (
   <>
      {
      jobs?.map(e=>{
         const {id,job_title,salary_range_value ,job_location , xp_lvl , degree ,recruiter_avatar , recruiter_full_name} = e || {}
         return (
            <div className={styles.jobCard}>
            <div className={styles.name}>
               <p>{job_title}</p>
               <span className={styles.salary}>{salary_range_value}</span>
            </div>
            <p className={styles.company}>Loop Contact Solutions Inc.</p> 

            <span className={styles.tag}>{job_location}</span>
            <span className={styles.tag}>{xp_lvl}</span>
            <span className={styles.tag}>{degree}</span>  
            <div className={styles.contact}>
               <div className={styles.avator}>
               <img  src={recruiter_avatar} alt={recruiter_full_name}/>
               </div> 
              {recruiter_full_name}
               <span className={styles.location}>{job_location}</span>
            </div>                      
         </div>
         )
       
      })
}
   </>
 
   


)

}
export default JobsCard