"use client"
import React ,{ useState , useEffect } from "react"
import Header from "./Header"
import JobCard from './JobCard'
import  * as R from 'ramda';
import { getCookie } from 'helpers/cookies'
import { useSearchParams } from 'next/navigation'
import {
    fetchChattedJobs,
    fetchResume,
    fetchResumeContact,
    fetchSaved,
    fetchViewed,
    fetchRecruiters,
    fetchViewedRcruiters,
    fetchInterviews
} from 'store/services/jobs/fetchJobsCommunicated'

const initTabList = [
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
        tab: 'Interview',
        value: 'interview',
        fetchFun:fetchInterviews,
        key:'interviews',
        children:[],
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

const tabListIntersted = [
    {
        tab: 'Interested in me',
        value: 'interested',
        fetchFun:fetchRecruiters,
        children:[],
        key:'saved_candidates',
    },
    {
        tab: 'Who viewed me',
        value: 'viewedMe',
        fetchFun:fetchViewedRcruiters,
        children:[],
        key:'viewed_profiles',
    },
]


const MainLeft = () => {
    const [tabValue,setTabValue] = useState<string>('communicated');
    const [data,setData] = useState<Array<any>>([]);
    const [tabList,setTabList] =  useState<Array<any>>([]);
    const [tabChildren,setTabChildren] = useState<Array<any>>([]);
    const [tabValueChildren,setTabValueChidren] = useState<string>('');
    const [page,setPage] = useState<number>(1);
    const [total,setTotal] = useState<number>(0);
    const searchParams = useSearchParams();
    const searchType = searchParams.get('type');
    const accessToken = getCookie('accessToken');
    console.log(searchType,7777999)

    useEffect(()=>{
        if(tabList?.length && tabValue){
            const tab  = R.find(R.propEq('value', tabValue))(tabList);
            tab?.fetchFun &&  getData(tab,page)
        }
    },[tabValue,tabList,page])

   
    useEffect(()=>{
      if(tabValueChildren){
        const tab  = R.find(R.propEq('value', tabValueChildren))(tabChildren);
        tab?.fetchFun &&  getData(tab,page)
      }
    },[tabValueChildren])

     useEffect(()=>{
      if(searchType){
        setTabList(tabListIntersted)
        setTabValue(searchType)
      }else{
        setTabList(initTabList)
      }
     },[searchType])


    const getData = (tab,page) => { 
        tab.fetchFun({
            page,
            accessToken
        }).then(res=>{
         const data =  res.data.data[tab.key];
         const total =  res.data.data.total_pages;
         setTotal(total)
         setData(data);
        })
    }


    const onChange = (e:string) => {
        const children = tabList[R.findIndex(R.propEq('value', e))(tabList)]?.children; 
        setPage(1);
        setTabValue(e);
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
              onChange = {onChange}
              handleChangeChildren={handleChangeChildren}
             />
            <JobCard data ={data} total={total} page={page}  onChange = {(e)=>setPage(e)}/>
        </>
    )
}

export default MainLeft