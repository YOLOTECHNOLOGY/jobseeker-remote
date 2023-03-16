import { Button, Stack } from 'app/components/MUIs'

import styles from '../../page.module.scss'
type propsType = {
  title?: string
  localhost?: string
  degree?: string
  xp_lvl?: string
  jobType?: string
  salary?: string
}

const Head = ({ title, localhost, degree, xp_lvl, jobType, salary }: propsType) => {
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
            <Stack spacing={2} direction='row'>
              <Button
                variant='outlined'
                sx={{
                  width: '88px',
                  height: '44px',
                  background: '#FFFFFF',
                  border: '1px solid #136FD3',
                  borderRadius: '10px'
                }}
              >
                Save
              </Button>
              <Button
                variant='contained'
                sx={{
                  width: '115px',
                  lineHeight: '44px',
                  height: '44px',
                  background: '#136FD3',
                  borderRadius: '10px'
                }}
              >
                Chat now
              </Button>
            </Stack>
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
