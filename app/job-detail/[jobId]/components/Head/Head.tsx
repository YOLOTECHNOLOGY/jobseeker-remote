import Link from 'next/link'

import Btn from './Btn/Btn'
import { Stack, Avatar } from 'app/components/MUIs'

import { UploadResumeIcon, CompleteResumeIcon } from 'images'

import styles from '../../page.module.scss'
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
  chat
}: propsType) => {
  return (
    <section className={styles.head}>
      <div className={styles.head_main}>
        <h1>
          {title} <div className={styles.head_main_salary}>{salary}</div>
        </h1>

        <div className={styles.head_main_desc}>
          {localhost} | {degree} | {xp_lvl} | {jobType}
        </div>

        <div className={styles.head_main_change}>
          <div>
            <Btn jobId={jobId} is_saved={is_saved} chat={chat} />
          </div>

          <div className={styles.head_main_change_resume}>
            <Stack spacing={2} direction='row'>
              <div>
                <Link color='#000000' href='/get-started'>
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
                <Link color='#000000' href='/manage-profile'>
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
