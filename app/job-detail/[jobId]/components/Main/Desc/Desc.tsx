import classNames from 'classnames/bind'

import { transState } from 'helpers/utilities'
import { DefaultAvatar } from 'images'
import { Avatar, Stack } from 'app/components/MUIs'

import styles from '../../../page.module.scss'

type propsType = {
  description?: string
  requirements?: string
  skills?: Array<any>
  logo?: string
  name?: string
  chatResponseRate?: number
  lastActiveAt?: number | string
}

const Desc = ({
  description,
  requirements,
  skills,
  logo,
  name,
  chatResponseRate,
  lastActiveAt
}: propsType) => {
  return (
    <section className={styles.desc}>
      <div className={styles.desc_title}>
        <h5>Job Description</h5>
        <div className={styles.desc_title_change}>
          <Stack direction='row' spacing={2}>
            <div>Share</div>
            <div>Report</div>
          </Stack>
        </div>
      </div>

      <div className={styles.desc_labels}>
        {skills?.map((skill) => (
          <div key={skill.value}>{skill.value}</div>
        ))}
      </div>

      <div className={styles.desc_context} dangerouslySetInnerHTML={{ __html: description }}></div>

      <div className={classNames([styles.desc_title, styles.desc_requirement])}>
        <h5>Requirement</h5>
      </div>
      <div className={styles.desc_context} dangerouslySetInnerHTML={{ __html: requirements }}></div>

      <div className={styles.desc_footer}>
        <Avatar sx={{ width: '29.94px', height: '29px' }} src={logo || DefaultAvatar}></Avatar>
        <span className={styles.desc_footer_name}>{name}</span>
        <span className={styles.desc_footer_chat}>{chatResponseRate}% &nbsp;response rate</span>
        <span className={styles.desc_footer_lineStatus}>{transState(lastActiveAt)?.text}</span>
      </div>
    </section>
  )
}

export default Desc
