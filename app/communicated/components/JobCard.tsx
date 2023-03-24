"use client"
import React from 'react'
import styles from '../index.module.scss'
import { JoinUs } from 'images'
import Image from 'next/image'
import Pagination from '@mui/material/Pagination';
import JobCardNormal from './JobCardNormal';
import JobCardInterview from './JobCardInterview';
import Link from 'next/link';
import Box from '@mui/material/Box'
import Skeleton from '@mui/material/Skeleton'
import CardHeader from '@mui/material/CardHeader';
import {isSameDay} from 'helpers/utilities'
interface cardProps {
  data: Array<any>,
  onChange: Function,
  total: number,
  page: number,
  tabValue: string,
  handelSave: Function,
  loadingChat: boolean,
  loadingList: boolean
}

const Card = ({
  data,
  onChange,
  total,
  page,
  tabValue,
  handelSave,
  loadingChat,
  loadingList,
}: cardProps) => {



  const handleChange = (event: React.ChangeEvent<unknown>, value: number) => {
    onChange(value)
  };

  const normalCard = () => {
    return data?.map((e, index) => {
      const same = isSameDay(e.created_at, data[index - 1]?.created_at)
      return (
        <div key={e.id}>
          {
            !same && e.created_at && <p className={styles.time}>{e.created_at?.substr(0, 10)}</p>
          }
          <JobCardNormal data={e} handelSave={handelSave} loadingChat={loadingChat} />
        </div>
      )
    }
    )
  }

  const InterviewCard = () => {
    return data?.map((e, index) => {

      const same = isSameDay(e.interviewed_at, data[index - 1]?.interviewed_at)
      return (
        <div key={e.id}>
          {
            !same && e.interviewed_at && <p className={styles.time}>{e.interviewed_at?.substr(0, 10)}</p>
          }
          <JobCardInterview data={e} />
        </div>
      )
    }
    )
  }
  return (
    <>
      {
        !loadingList ? (<>
          {
            data?.length ? <>
              {tabValue === 'interview' ? InterviewCard() : normalCard()}
              {
                total > 1 && (
                  <div className={styles.page}>
                    <Pagination count={total} page={page} variant="outlined" shape="rounded" onChange={handleChange} />
                  </div>
                )
              }
            </>
              : <div className={styles.noData}>
                <Image className={styles.noDataImg} src={JoinUs} alt='暂无数据' width={362} height={247} />
                <button className={styles.seeJob}>
                  <Link href="/jobs-hiring/manila-jobs?page=1">
                    See job reco
                  </Link>
                </button>
              </div>
          }

        </>) : (
          <Box sx={{ width: '100%' }}>
            {
          [1,2,3,4,5,6].map(() => {
            return (
              <>
              <CardHeader
              avatar={<Skeleton animation="wave" variant="circular" width={30} height={30} />}
              title={<Skeleton animation="wave" height={16} width="80%" />}
              subheader={<Skeleton animation="wave" height={16} width="40%" />}
            />
            <Skeleton animation="wave" height={20} style={{ marginBottom: 6 }} />
            <Skeleton animation="wave" height={20} style={{ marginBottom: 6 }} />
              </>
            )
          })
            }            
          </Box>      
        )
      }


    </>
  )
}

export default Card
