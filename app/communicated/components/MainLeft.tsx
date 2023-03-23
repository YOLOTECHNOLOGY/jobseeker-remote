"use client"
import React, { useState, useEffect } from "react"
import Header from "./Header"
import JobCard from './JobCard'
import * as R from 'ramda';
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
    fetchInterviews,
    fetchCheckChats
} from 'store/services/jobs/fetchJobsCommunicated'
import { postSaveJobService } from 'store/services/jobs/postSaveJob'
import { deleteSaveJobService } from 'store/services/jobs/deleteSaveJob'
import Snackbar from '@mui/material/Snackbar';
import MuiAlert, { AlertProps } from '@mui/material/Alert';


const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(
    props,
    ref,
) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});
const initTabList = [
    {
        tab: 'Communicated',
        value: 'communicated',
        fetchFun: fetchChattedJobs,
        children: [],
        key: 'chatted_jobs',
    },
    {
        tab: 'Exchanged',
        value: 'exchanged',
        fetchFun: '',
        children: [
            {
                tab: 'Resume',
                value: 'Resume',
                fetchFun: fetchResume,
                key: 'resume_exchanged_jobs'
            },
            {
                tab: 'Mobile Number',
                value: 'mobileNumber',
                fetchFun: fetchResumeContact,
                key: 'contact_exchanged_jobs'
            },
        ]
    },
    {
        tab: 'Interview',
        value: 'interview',
        fetchFun: fetchInterviews,
        key: 'interviews',
        children: [],
    },
    {
        tab: 'Saved',
        value: 'saved',
        fetchFun: fetchSaved,
        key: 'saved_jobs',
        children: [],
    },
    {
        tab: 'Viewed',
        value: 'viewed',
        fetchFun: fetchViewed,
        children: [],
        key: 'viewed_jobs',
    },
]

const tabListIntersted = [
    {
        tab: 'Interested in me',
        value: 'interested',
        fetchFun: fetchRecruiters,
        children: [],
        key: 'saved_candidates',
    },
    {
        tab: 'Who viewed me',
        value: 'viewedMe',
        fetchFun: fetchViewedRcruiters,
        children: [],
        key: 'viewed_profiles',
    },
]


const MainLeft = () => {
    const [tabValue, setTabValue] = useState<string>('communicated');
    const [data, setData] = useState<Array<any>>([]);
    const [tabList, setTabList] = useState<Array<any>>([]);
    const [tabChildren, setTabChildren] = useState<Array<any>>([]);
    const [tabValueChildren, setTabValueChidren] = useState<string>('');
    const [page, setPage] = useState<number>(1);
    const [total, setTotal] = useState<number>(0);
    const searchParams = useSearchParams();
    const searchType = searchParams.get('type');
    const accessToken = getCookie('accessToken');
    const [open, setOpen] = useState<boolean>(false);
    
    const [loadingChat, setLoadingChat] = useState<boolean>(false);
    const [lodingList, setLodingList] = useState<boolean>(true);

    useEffect(() => {
        if (tabList?.length && tabValue) {
            const tab = R.find(R.propEq('value', tabValue))(tabList);
            tab?.fetchFun && getData(tab, page)
        }
    }, [tabValue, tabList, page])


    useEffect(() => {
        if (tabValueChildren) {
            const tab = R.find(R.propEq('value', tabValueChildren))(tabChildren);
            tab?.fetchFun && getData(tab, page)
        }
    }, [tabValueChildren])

    useEffect(() => {
        if (searchType) {
            setTabList(tabListIntersted)
            setTabValue(searchType)
        } else {
            setTabList(initTabList)
        }
    }, [searchType])


    const getData = (tab, page) => {
        setLodingList(true)
        tab.fetchFun({
            page,
            accessToken
        }).then(res => {
            const data = res.data.data[tab.key];
            const total = res.data.data.total_pages;
            const idList = []
            data.map(e => {
                idList.push(e.recruiter_id)
            })
            checkChates(data, total, idList)
        })
    }

    const checkChates = (data, total, idList) => {
        fetchCheckChats({
            accessToken,
            ids: idList?.join()
        }).then(res => {
            const chatList = res.data?.data
            if (chatList?.length) {      
                for (let index = 0; index < data.length; index++) {
                    chatList.map(k => {
                        if (data[index].recruiter_id === k.recruiter_id) {
                            data[index].job = {... data[index].job,...k}
                        }
                    })
                }
            }
            setTotal(total)
            setData(data);
            console.log(res, data, 1234);
        }).finally(()=> setLodingList(false))
    }

    const onChange = (e: string) => {
        const children = tabList[R.findIndex(R.propEq('value', e))(tabList)]?.children;
        setPage(1);
        setTabValue(e);
        setTabChildren(children)
        setTabValueChidren(children?.[0]?.value || '');
    }

    const handleChangeChildren = (e: string) => {
        setTabValueChidren(e)
    }
    const handelSave = (item) => {
        setLoadingChat(true)
        const { is_saved: saved, id } = item.job || {};
        if (saved) {
            deleteSaveJobService(id).then(res => {
                checkSavedData(res,id,false)
            }).finally(()=>setLoadingChat(false))
        } else {
            postSaveJobService({ job_id: id }).then(res => {
                checkSavedData(res,id,true)
            }).finally(()=>setLoadingChat(false))
        }
    }

   const checkSavedData = (res,id,state)=>{
    const jobData = res?.data?.data
    console.log(jobData,'jobData')
    if (jobData) {
        const newData = data.map(e => {
            if (e.job.id === id) {
                e.job.is_saved = state
            }
            return e
        })
        setData([...newData]);
        setOpen(true);
    }
    }

    const handleClose = (event: React.SyntheticEvent | Event, reason?: string) => {
        if (reason === 'clickaway') {
            return;
        }
        setOpen(false);
    };

    return (
        <>
            <Header
                tabValue={tabValue}
                tabList={tabList}
                tabChildren={tabChildren}
                tabValueChildren={tabValueChildren}
                onChange={onChange}
                handleChangeChildren={handleChangeChildren}
            />
            <JobCard
                data={data}
                total={total}
                page={page}
                tabValue={tabValue}
                onChange={(e) => setPage(e)}
                handelSave={handelSave}
                loadingChat={loadingChat}
                loadingList={lodingList}
            />
            <Snackbar open={open} autoHideDuration={3000} onClose={handleClose}
                anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'right'
                }}
            >
                <Alert onClose={handleClose} severity="success" sx={{ width: '100%' }}>
                    success!
                </Alert>
            </Snackbar>
        </>
    )
}

export default MainLeft