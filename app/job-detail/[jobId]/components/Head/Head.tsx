import Btn from './Btn/Btn'
import { Stack } from 'app/components/MUIs'

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
              <div>Fill up resume online</div>
              <div>Upload resume</div>
            </Stack>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Head
