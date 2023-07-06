import Link from 'next/link'

import Btn from './Btn/Btn'
import { Stack, Avatar } from 'app/components/MUIs'
import { cookies } from 'next/headers'
import { UploadResumeIcon, CompleteResumeIcon } from 'images'
import { FavoriteBorderIcon, FavoriteIcon } from 'app/components/MuiIcons'
import styles from '../../page.module.scss'
import classNames from 'classnames'
import JobClient from '../Main/Desc/JobClient/JobClient'

type propsType = {
  title?: string
  localhost?: string
  degree?: string
  xp_lvl?: string
  jobType?: string
  salary?: string
  jobId: number
  is_saved: boolean
  chat: any
  job_type_value: string
  status_key: string
  jobDetail?: any
  languages: Record<string, any>
  shareParams: any
}

const Head = ({
  title,
  localhost,
  degree,
  xp_lvl,
  jobType,
  salary,
  jobId,
  is_saved,
  chat,
  job_type_value,
  jobDetail,
  languages,
  shareParams
}: propsType) => {
  const accessToken = cookies().get('accessToken')?.value
  const user = cookies().get('user')?.value
  const isLogin = !!accessToken && !!user
  const { header } = languages
  const cookieStore = cookies()
  const token = cookieStore.get('accessToken')
  return (
    <section id='jobDetaiPagelHead' className={classNames([styles.head, styles.headSticky])}>
      <div className={styles.head_main}>
        <div className={styles.head_main_title}>
          <div className={styles.head_main_titleWrapper}>
            <h1>{title}</h1>
            <div className={styles.head_main_title_context}>
              <span className={styles.head_main_title_context_type}>({job_type_value})</span>
              {jobDetail.is_urgent ? (
                <span className={styles.head_main_title_context_status}>{header.urgent}</span>
              ) : null}
            </div>
          </div>
          <div className={styles.head_main_salary}>{salary}</div>
        </div>

        <div className={styles.head_main_desc}>
          {localhost} <i /> {degree} <i /> {xp_lvl} <i /> {jobType}
        </div>

        <div className={styles.head_main_change}>
          <div>
            <Btn jobId={jobId} is_saved={is_saved} chat={chat} jobDetail={jobDetail} />
          </div>

          <div className={styles.head_main_change_resume}>
            <Stack spacing={2} direction='row'>
              {isLogin && (
                <div>
                  <Link color='#000000' href='/manage-profile'>
                    <div className={styles.head_main_change_resume_btnWrapper}>
                      <Avatar
                        src={CompleteResumeIcon}
                        alt='complete resume'
                        sx={{ width: '17px', height: '17px', marginRight: '4px' }}
                        className={styles.head_main_change_resume_btnWrapper_icon}
                      />
                      <span>{header.fillUpResume}</span>
                    </div>
                  </Link>
                </div>
              )}
              {/* <div>
                <Link
                  color='#000000'
                  href={isLogin ? '/manage-profile?tab=resume' : '/quick-upload-resume'}
                >
                  <div className={styles.head_main_change_resume_btnWrapper}>
                    <Avatar
                      src={UploadResumeIcon}
                      alt='upload resume'
                      sx={{ width: '17px', height: '17px', marginRight: '4px' }}
                      className={styles.head_main_change_resume_btnWrapper_icon}
                    />
                    <span>{header.uploadResume}</span>
                  </div>
                </Link>
              </div> */}
            </Stack>
            <div className={styles.operator}>
              <span className={styles.item}>
                {is_saved ? (
                  <>
                    <FavoriteIcon sx={{ color: '#136FD3' }} />
                    <span style={{ textTransform: 'capitalize', marginLeft: '8px' }}>
                      {header.undoSave}
                    </span>
                  </>
                ) : (
                  <>
                    <FavoriteBorderIcon sx={{ color: '#136FD3' }} />
                    <span style={{ textTransform: 'capitalize', marginLeft: '8px' }}>
                      {header.save}
                    </span>
                  </>
                )}
              </span>
              <span className={styles.item}>
                <JobClient isLogin={Boolean(token)} {...shareParams} />
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Head
