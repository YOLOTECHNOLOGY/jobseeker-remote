"use client"
import React ,{ useState , useEffect } from "react"
import Header from "./Header"
import JobCard from './JobCard'
import  * as R from 'ramda';
import { getCookie } from 'helpers/cookies'
import {
    fetchChattedJobs,
    fetchResume,
    fetchResumeContact,
    fetchSaved,
    fetchViewed
} from 'store/services/jobs/fetchJobsCommunicated'
const tabList = [
    {
        tab: 'Communicated',
        value: 'communicated',
        fetchFun:fetchChattedJobs,
        children:[],
        key:'chatted_jobs',
    },
    {
        tab: 'Exchanged',
        value: 'exchanged',
        fetchFun:'',
        children:[
            {
                tab: 'Resume',
                value: 'Resume',
                fetchFun:fetchResume,
                key:'resume_exchanged_jobs'
            },
            {
                tab: 'Mobile Number',
                value: 'mobileNumber',
                fetchFun:fetchResumeContact,
                key:'contact_exchanged_jobs'
            },
        ]
    },
    {
        tab: 'Saved',
        value: 'saved',
        fetchFun:fetchSaved,
        key:'saved_jobs',
        children:[],
    },
    {
        tab: 'Viewed',
        value: 'viewed',
        fetchFun:fetchViewed,
        children:[],
        key:'viewed_jobs',
    },
]




const MainLeft = () => {
    const [tabValue,setTabValue] = useState<string>('communicated');
    const [data,setData] = useState<Array<any>>([]);
    const [tabChildren,setTabChildren] = useState<Array<any>>([]);
    const [tabValueChildren,setTabValueChidren] = useState<string>('');
    const [page] = useState<number>(1);
    const accessToken = getCookie('accessToken');

    useEffect(()=>{
      const tab  = R.find(R.propEq('value', tabValue))(tabList);
      tab.fetchFun &&  getData(tab)
    },[tabValue])

   
    useEffect(()=>{
      if(tabValueChildren){
        const tab  = R.find(R.propEq('value', tabValueChildren))(tabChildren);
        tab.fetchFun &&  getData(tab)
      }

    },[tabValueChildren])

    const getData = (tab) => { 
        tab.fetchFun({
            page,
            accessToken
        }).then(res=>{
         const data =  res.data.data[tab.key];
         setData(data)
        })
    }


    const onChangee = (e:string) => {
        const children = tabList[R.findIndex(R.propEq('value', e))(tabList)]?.children; 
        setTabValue(e)
        setTabChildren(children)
        setTabValueChidren(children?.[0]?.value || '');
    }
   
   const  handleChangeChildren = (e:string) =>{
        setTabValueChidren(e)
    }

    return (
        <>
            <Header 
              tabValue = {tabValue}
              tabList = {tabList}
              tabChildren = {tabChildren}
              tabValueChildren = {tabValueChildren}
              onChange = {onChangee}
              handleChangeChildren={handleChangeChildren}
             />
            <JobCard data ={data}/>
        </>
    )
}

export default MainLeft