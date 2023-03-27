import Link from 'next/link'

import Btn from './Btn/Btn'
import { Stack, Avatar } from 'app/components/MUIs'

import { UploadResumeIcon, CompleteResumeIcon } from 'images'

import styles from '../../page.module.scss'
import classNames from 'classnames'
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
  status_key,
  jobDetail
}: propsType) => {
  return (
    <section className={classNames([styles.head, styles.headSticky])}>
      <div className={styles.head_main}>
        <div className={styles.head_main_title}>
          <div className={styles.head_main_titleWrapper}>
            <h1>{title}</h1>
            <div className={styles.head_main_title_context}>
              <span className={styles.head_main_title_context_type}>({job_type_value})</span>
              {status_key == 'urgent' ? (
                <span className={styles.head_main_title_context_status}>{status_key}</span>
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
              <div>
                <Link color='#000000' href='/manage-profile'>
                  <div className={styles.head_main_change_resume_btnWrapper}>
                    <Avatar
                      src={CompleteResumeIcon}
                      alt='complete resume'
                      sx={{ width: '17px', height: '17px', marginRight: '4px' }}
                    />
                    <span> Fill up resume online</span>
                  </div>
                </Link>
              </div>
              <div>
                <Link color='#000000' href='/quick-upload-resume'>
                  <div className={styles.head_main_change_resume_btnWrapper}>
                    <Avatar
                      src={UploadResumeIcon}
                      alt='upload resume'
                      sx={{ width: '17px', height: '17px', marginRight: '4px' }}
                    />
                    <span> Upload new resume</span>
                  </div>
                </Link>
              </div>
            </Stack>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Head
