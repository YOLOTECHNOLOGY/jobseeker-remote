"use client"
import React,{useEffect} from "react";
import styles from '../index.module.scss';
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import { useSelector } from 'react-redux'
import {updateNoticePeriod,fetchDeleteResumes,fetchPersonalInfo} from 'store/services/jobs/fetchJobsCommunicated'
import { getCookie } from 'helpers/cookies'
import Snackbar from '@mui/material/Snackbar';
import MuiAlert, { AlertProps } from '@mui/material/Alert';
import Link from 'next/link';
import DeleteForeverOutlinedIcon from '@mui/icons-material/DeleteForeverOutlined';
import { useSearchParams } from 'next/navigation'
const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(
  props,
  ref,
) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const notice_period_lists = [
  { "id": 1, "value": "Immediate" },
  { "id": 2, "value": "One week" },
  { "id": 3, "value": "Two weeks" },
  { "id": 4, "value": "Three weeks" },
  { "id": 5, "value": "One month" },
  { "id": 6, "value": "Two months or above" }
];



const Resume = ({
  resumes
}:any) => {

  const userDetail = useSelector((store: any) => store.users.fetchUserOwnDetail?.response ?? {})
  const {
    xp_lvl: xpLvl,
    full_name: fullName,
    notice_period_id: noticePeriodId,
    avatar,
    birthdate,
    educations,
  } = userDetail
  const [noticePeriodData, setNoticePeriodData] = React.useState('');
  const [open, setOpen] = React.useState(false);
  const [resumeData, setResumeData] = React.useState([]);
  const [jobData, setJobTotal] = React.useState({ 
    no_of_applied_jobs: 0,
    no_of_chats:0,
    no_of_interviews: 0,
    no_of_saved_jobs: 0,
    no_of_viewed_jobs:0});
  const accessToken = getCookie('accessToken');
  const searchParams = useSearchParams()
  const searchType = searchParams.get('unsaveId') || ''

 useEffect(()=>{
  getPersonalInfo();
 },[searchType])

  useEffect(()=>{
     if(resumes?.length){
      setResumeData(resumes)
     }
  },[resumes])
   
  useEffect(()=>{
    if(noticePeriodId){
      setNoticePeriodData(noticePeriodId)
    }
  },[noticePeriodId])


  const getPersonalInfo =()=>{
    fetchPersonalInfo({accessToken}).then(res=>{
      const  data = res?.data?.data || {};
      setJobTotal(data)
    })
  }

  const handleChange = (event: SelectChangeEvent) => {
    setNoticePeriodData(event.target.value as string);
    changeNoticePeriod(event.target.value )
  };

  const ageFun = (birthdate) => {
    return new Date().getFullYear() - new Date(birthdate).getFullYear();
  }
  const handleClose = (event: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpen(false);
  };

   const deleteResume = (e,index)=>{
     fetchDeleteResumes({
      id:e.id,
      accessToken
    }).then(res=>{
      if(res.data?.data){
        resumeData.splice(index,1)
        setResumeData([...resumeData]);
        setOpen(true);
      }
    })
   }

 const changeNoticePeriod = (id) =>{
  updateNoticePeriod({
    id,
    accessToken
  }).then(res=>{
    if(res.data?.data){
      setOpen(true);
    }
  })
 }
 
  const {
    no_of_applied_jobs: noOfAppliedJobs,
    no_of_chats:noOfChats,
    no_of_interviews: noOfInterviews,
    no_of_saved_jobs: noOfSavedJobs,
    no_of_viewed_jobs: noOfViewedJobs
  } = jobData || {}

  return (
    <>
      <div className={styles.resume}>
        <div className={styles.user}>
          <img src={avatar} />
          <div className={styles.info}>
            <p>{fullName}</p>
            {birthdate ? <span>{ageFun(birthdate)} years old</span> : null} 
            {birthdate && xpLvl ? <i>|</i> : null}
            <span> {xpLvl}</span>
            {(xpLvl || birthdate) && educations?.[0]?.field_of_study ? <i>|</i> : null}
            <span> {educations?.[0]?.field_of_study}</span>
          </div>
        </div>
        <Box sx={{ minWidth: 120 }}>
          <FormControl fullWidth>
            <InputLabel id="demo-simple-select-label">Availability</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={noticePeriodData}
              label="Availability"
              onChange={handleChange}
            > 
              {
                notice_period_lists.map(e=><MenuItem key={e.id} value={e.id}>{e.value}</MenuItem>)
              }
            </Select>
          </FormControl>
        </Box>
        <button className={styles.btn} >
          <Link href="/manage-profile?tab=resume">
          Edit online resume
          </Link>
        </button>
      </div>
      <ul className={styles.type}>
        <li> Communicated ( {noOfChats} )</li>
        <li> Exchanged ( {noOfAppliedJobs} )</li>
        <li> Saved ( {noOfSavedJobs} )</li>
        <li> Interview ( {noOfInterviews} )</li>
        <li> Viewed ( {noOfViewedJobs} )</li>
      </ul>

      <div className={styles.upload}>
        <div className={styles.header}>
           Uploaded Resumes
        </div>
        <div className={styles.uploadContainer}>
          {
            resumeData?.length ? (
               <ul>
                {
               resumeData?.map((e,index) => <li key={e.id}>
                <Link href={e.url}>{e.name}</Link>
                {
                  resumeData?.length > 1 ? <DeleteForeverOutlinedIcon onClick={()=>deleteResume(e,index)} className={styles.deleteIcoc}/> : null
                }
                </li>)   
                }  
               </ul> 
            ) :  <p className={styles.noMore}>No resume, upload now!</p>
          }
        
          <button className={styles.btn}>
           <Link href="/manage-profile?tab=resume">
              Upload resume
            </Link>
            </button>
        </div>
      </div>
      <Snackbar open={open} autoHideDuration={3000} onClose={handleClose}
        anchorOrigin={{ 
          vertical:'top', 
          horizontal:'right' }}
          >
        <Alert onClose={handleClose} severity="success" sx={{ width: '100%' }}>
          success!
        </Alert>
      </Snackbar>
     
    </>
  )
}
export default Resume;