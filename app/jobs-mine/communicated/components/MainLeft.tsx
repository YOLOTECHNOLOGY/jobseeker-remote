'use client'
import React, { useState, useEffect ,Suspense} from 'react'
import Header from './Header'
import HeaderMobile from './mobile/header'
import MainMobile from './mobile/Main'
import JobCard from './JobCard'
import * as R from 'ramda'
import { getCookie } from 'helpers/cookies'
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
import { deleteSaveJobService } from 'store/services/jobs/deleteSaveJob'
import Snackbar from '@mui/material/Snackbar'
import MuiAlert, { AlertProps } from '@mui/material/Alert'
import styles from '../index.module.scss'
import { useRouter ,usePathname,useSearchParams} from 'next/navigation'


const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(
  props,
  ref
) {
  return <MuiAlert elevation={6} ref={ref} variant='filled' {...props} />
})
const initTabList = [
  {
    tab: 'Communicated',
    value: 'communicated',
    fetchFun: fetchChattedJobs,
    children: [],
    key: 'chatted_jobs'
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
        value: 'Mobile number',
        fetchFun: fetchResumeContact,
        key: 'contact_exchanged_jobs'
      }
    ]
  },
  {
    tab: 'Interview',
    value: 'interview',
    fetchFun: fetchInterviews,
    key: 'interviews',
    children: []
  },
  {
    tab: 'Saved',
    value: 'saved',
    fetchFun: fetchSaved,
    key: 'saved_jobs',
    children: []
  },
  {
    tab: 'Viewed',
    value: 'viewed',
    fetchFun: fetchViewed,
    children: [],
    key: 'viewed_jobs'
  }
]

const tabListIntersted = [
  {
    tab: 'Interested in me',
    value: 'interested',
    fetchFun: fetchRecruiters,
    children: [],
    key: 'saved_candidates'
  },
  {
    tab: 'Who viewed me',
    value: 'viewedMe',
    fetchFun: fetchViewedRcruiters,
    children: [],
    key: 'viewed_profiles'
  }
]

const tabListInterstedArr = ['interested','viewedMe']


const MainLeft = (props:any) => {
  const {type} = props.searchParams
  console.log(props,777)
  const [tabValue, setTabValue] = useState<string>('communicated')
  const [data, setData] = useState<Array<any>>([])
  const [tabList, setTabList] = useState<Array<any>>([])
  const [tabChildren, setTabChildren] = useState<Array<any>>([])
  const [tabValueChildren, setTabValueChidren] = useState<string>('')
  const [page, setPage] = useState<number>(1)
  const [total, setTotal] = useState<number>(0)
  const accessToken = getCookie('accessToken')
  const [open, setOpen] = useState<boolean>(false)
  const [loadingChat, setLoadingChat] = useState<boolean>(false)
  const [loadingList, setLoadingList] = useState<boolean>(true)
  const pathname = usePathname()
  const router = useRouter()
  const searchParams = useSearchParams()
  useEffect(() => {
    if (tabList?.length && tabValue) {
      const tab = R.find(R.propEq('value', tabValue))(tabList)
      if(tab?.fetchFun){
        getData(tab, page)
      }else{
        setTabChildren(tab.children)
        setTabValueChidren(tab.children?.[0]?.value || '')
      }
    }
  }, [tabValue, tabList, page])


  useEffect(() => {
    if (tabValueChildren) {
      const tab = R.find(R.propEq('value', tabValueChildren))(tabChildren)
      tab?.fetchFun && getData(tab, page)
    }
  }, [tabValueChildren])

  useEffect(() => {
    if (type && tabListInterstedArr.includes(type)) {
       setTabList(tabListIntersted)
       setTabValue(type)
    }else{
      setTabList(initTabList);
    }
  }, [type])


  const getData = (tab, page) => {
    setLoadingList(true)
    tab.fetchFun({
      page,
      accessToken
    }).then(res => {
      const data = res.data.data[tab.key]
      const total = res.data.data.total_pages
      const idList = []
      data.map(e => {
        idList.push(e.recruiter_id)
      })
      if(data.length){
        checkChates(data, total, idList)
      }else{
        setTotal(total)
        setData(data)
        setLoadingList(false)
      }
   
    })
  }

  const checkChates = (dataPar, total, idList) => {
    fetchCheckChats({
      accessToken,
      ids: idList?.join()
    }).then(res => {
      const chatList = res.data?.data
      if (chatList?.length) {
        for (let index = 0; index < dataPar.length; index++) {
          chatList.map(k => {
            if (dataPar[index].recruiter_id === k.recruiter_id) {
              dataPar[index].job = { ...dataPar[index].job, ...k }
            }
          })
        }
      }
      setTotal(total)
      const width = document.body.clientWidth;
      if (page > 1 && width < 750) {
        setData([...data, ...dataPar])
      } else {
        setData(dataPar)
      }
    }).finally(() => setLoadingList(false))
  }
  const onChange = (e: string) => {
    const children = tabList[R.findIndex(R.propEq('value', e))(tabList)]?.children
    setPage(1)
    setTabValue(e)
    setTabChildren(children)
    setTabValueChidren(children?.[0]?.value || '')
  }

  const handleChangeChildren = (e: string) => {
    setTabValueChidren(e)
  }
  const handelSave = (item,index) => {
    setLoadingChat(true)
    const { id } = item.job || {}
    deleteSaveJobService(id).then(res => {
      checkSavedData(res,index,id)
    })
    // if (saved) {
    //   deleteSaveJobService(id).then(res => {
    //     checkSavedData(res, id, false)
    //   }).finally(() => setLoadingChat(false))
    // } else {
    //   postSaveJobService({ job_id: id }).then(res => {
    //     checkSavedData(res, id, true)
    //   }).finally(() => setLoadingChat(false))
    // }
  }
 

  const checkSavedData = (res,index,id) => {
    const jobData = res?.data?.data
    if (jobData) {
     const newSearchParams = new URLSearchParams(searchParams.toString())
      newSearchParams.set('unsaveId', id)
      router.push(pathname + '?' + newSearchParams.toString(), { forceOptimisticNavigation: true })
      data.splice(index,1)
      setData([...data])
      setOpen(true)
    }
    setLoadingChat(false)
  }

  const handleClose = (event: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') {
      return
    }
    setOpen(false)
  }

  return (
    <>
      <div className={styles.pcContainer}>
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
          loadingList={loadingList}

        />
      </div>

      <div className={styles.mobile}>
        <HeaderMobile
          tabValue={tabValue}
          tabList={tabList}
          tabChildren={tabChildren}
          tabValueChildren={tabValueChildren}
          onChange={onChange}
          loadingList={loadingList}
          handleChangeChildren={handleChangeChildren}
        />
        <Suspense fallback={<h1>Loading Bar...</h1>}>
            <MainMobile
              tabValue={tabValue}
              data={data}
              page={page}
              totalPage={total}
              loadingList={loadingList}
              onChange={(e) => setPage(e)}
            />
        </Suspense>
      </div>
      <Snackbar open={open} autoHideDuration={3000} onClose={handleClose}
                anchorOrigin={{
                  vertical: 'top',
                  horizontal: 'right'
                }}
      >
        <Alert onClose={handleClose} severity='success' sx={{ width: '100%' }}>
          success!
        </Alert>
      </Snackbar>
    </>
  )
}

export default MainLeft