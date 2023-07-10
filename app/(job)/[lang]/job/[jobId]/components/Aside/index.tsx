import { cookies } from 'next/headers'
import classNames from 'classnames/bind'
import AdSlot from 'app/components/AdSlot'
import Company, { propsType } from './Company/Company'
import SignUp from './SignUp/SignUp'
import SimilarJobs from './SimilarJobs/SimilarJobs'
import Search from '../Main/Search/Search'
import Btn from '../Head/Btn/Btn'
import { Avatar } from 'app/components/MUIs'
import styles from '../../page.module.scss'
import React from 'react'
import { DefaultAvatar } from 'images'
import { transState } from 'helpers/utilities'
import Link from 'next/link'
type propsT = propsType & { jobDetail: any } & {
  published_at: string
  languages: Record<string, any>
  config: Array<any>
  lang: string
}

const AsideFC = (props: propsT) => {
  const cookieStore = cookies()
  const token = cookieStore.get('accessToken')
  const { content, header, aside } = props.languages
  const { id, is_saved, chat, recruiter } = props.jobDetail
  const chatResponseRate = recruiter?.response_rate
  const lastActiveAt = recruiter?.last_active_at
  const accessToken = cookies().get('accessToken')?.value
  const user = cookies().get('user')?.value
  const isLogin = !!accessToken && !!user
  return (
    <aside className={styles.aside}>
      <Company {...props} />

      <div className={styles.jobseeker}>
        <div>
          <Avatar
            sx={{ width: '29.94px', height: '29px' }}
            src={recruiter?.avatar || DefaultAvatar}
          ></Avatar>
          <span className={styles.footer_name} title={recruiter.full_name}>
            {recruiter.full_name} <i style={{ padding: '0 4px' }}>{' · '}</i>
            {recruiter?.work_experience?.job_title || ''}
          </span>
        </div>
        <div className={styles.chatBox}>
          <span className={styles.chat}>
            {chatResponseRate}% &nbsp;{content.rate}
          </span>
          <span
            className={classNames([
              styles.lineStatus,
              transState(lastActiveAt)?.state !== 1 ? styles.notLine : null
            ])}
          >
            {transState(lastActiveAt, content?.state)?.text}
          </span>
        </div>
      </div>

      <div className={styles.upload}>
        <div className={styles.uploadTitle}>
          <span>
            <svg
              xmlns='http://www.w3.org/2000/svg'
              width='65'
              height='70'
              viewBox='0 0 65 70'
              fill='none'
            >
              <g filter='url(#filter0_d_391_827)'>
                <path
                  d='M19.0645 12.2695C19.0645 9.35925 21.4237 7 24.334 7H42.1671C43.7256 7 45.2042 7.68989 46.2054 8.88424L51.9534 15.741C52.7487 16.6897 53.1846 17.8882 53.1846 19.1262V27.4194V42.5693C53.1846 45.4795 50.8254 47.8388 47.9151 47.8388H24.334C21.4237 47.8388 19.0645 45.4795 19.0645 42.5693V12.2695Z'
                  fill='url(#paint0_linear_391_827)'
                />
                <path
                  d='M11.7621 18.0254C11.7621 15.3419 13.9376 13.1664 16.6211 13.1664H34.4542C35.8913 13.1664 37.2546 13.8026 38.1778 14.9039L43.9258 21.7606C44.6592 22.6354 45.0611 23.7405 45.0611 24.8821V33.1753V48.3251C45.0611 51.0086 42.8857 53.1841 40.2022 53.1841H16.6211C13.9376 53.1841 11.7621 51.0086 11.7621 48.3251V18.0254Z'
                  fill='url(#paint1_linear_391_827)'
                  stroke='url(#paint2_linear_391_827)'
                  stroke-width='0.821167'
                />
                <path
                  d='M17.3184 25.0078H39.5052M17.3184 30.6067H39.5052M17.3184 36.0738H39.5052M17.3184 41.3433H28.3211'
                  stroke='#2378E5'
                  stroke-width='1.58086'
                  stroke-linecap='round'
                />
              </g>
              <defs>
                <filter
                  id='filter0_d_391_827'
                  x='0.351562'
                  y='1'
                  width='63.833'
                  height='68.5947'
                  filterUnits='userSpaceOnUse'
                  color-interpolation-filters='sRGB'
                >
                  <feFlood flood-opacity='0' result='BackgroundImageFix' />
                  <feColorMatrix
                    in='SourceAlpha'
                    type='matrix'
                    values='0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0'
                    result='hardAlpha'
                  />
                  <feOffset dy='5' />
                  <feGaussianBlur stdDeviation='5.5' />
                  <feComposite in2='hardAlpha' operator='out' />
                  <feColorMatrix
                    type='matrix'
                    values='0 0 0 0 0.2 0 0 0 0 0.447059 0 0 0 0 0.976471 0 0 0 0.21 0'
                  />
                  <feBlend
                    mode='normal'
                    in2='BackgroundImageFix'
                    result='effect1_dropShadow_391_827'
                  />
                  <feBlend
                    mode='normal'
                    in='SourceGraphic'
                    in2='effect1_dropShadow_391_827'
                    result='shape'
                  />
                </filter>
                <linearGradient
                  id='paint0_linear_391_827'
                  x1='33.1681'
                  y1='3.89098'
                  x2='58.8335'
                  y2='53.7009'
                  gradientUnits='userSpaceOnUse'
                >
                  <stop stop-color='#4BBEFD' />
                  <stop offset='1' stop-color='#2853F7' />
                </linearGradient>
                <linearGradient
                  id='paint1_linear_391_827'
                  x1='41.24'
                  y1='15.8353'
                  x2='24.7275'
                  y2='39.1558'
                  gradientUnits='userSpaceOnUse'
                >
                  <stop stop-color='white' stop-opacity='0.7' />
                  <stop offset='1' stop-color='white' />
                </linearGradient>
                <linearGradient
                  id='paint2_linear_391_827'
                  x1='13.205'
                  y1='55.0218'
                  x2='46.8365'
                  y2='-5.87279'
                  gradientUnits='userSpaceOnUse'
                >
                  <stop stop-color='#CEEBFF' />
                  <stop offset='1' stop-color='white' stop-opacity='0' />
                </linearGradient>
              </defs>
            </svg>
          </span>
          <div className={styles.uploadInfo}>
            <p>{aside.uploadResume}</p>
            <span>{aside.applyJob}</span>
          </div>
        </div>
        <Link
          color='#000000'
          href={isLogin ? '/manage-profile?tab=resume' : '/quick-upload-resume'}
        >
          <span className={styles.uploadResume}>{header.uploadResume}</span>
        </Link>
      </div>

      {!token && <SignUp jobId={props.jobId} job_url={props.jobDetail?.job_url} />}

      {/* @ts-expect-error Async Server Component */}
      <SimilarJobs
        id={props.jobId}
        jobDetail={props.jobDetail}
        languages={props.languages}
        lang={props.lang}
        config={props.config}
      />

      <div className={styles.ad_container}>
        <AdSlot adSlot={'job-detail/square-banner-1'} />
      </div>

      <Search />

      <span className={styles.published_at}>
        {content.jobPostedOn} {props.published_at}
      </span>

      <div className={styles.aside_mobilesticky_btnGroup}>
        <Btn
          jobId={id}
          is_saved={is_saved}
          chat={chat}
          className={styles.aside_mobilesticky_btnGroup_change}
          jobDetail={props.jobDetail}
        />
      </div>
    </aside>
  )
}

export default AsideFC
