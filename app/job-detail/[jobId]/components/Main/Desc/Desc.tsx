import classNames from 'classnames/bind'

import { transState } from 'helpers/utilities'
import { DefaultAvatar } from 'images'
import { Avatar } from 'app/components/MUIs'
import JobClient from './JobClient/JobClient'

import styles from '../../../page.module.scss'

type propsType = {
  description?: string
  requirements?: string
  skills?: Array<any>
  logo?: string
  name?: string
  chatResponseRate?: number
  lastActiveAt?: number | string
  shareParams: any
}

const Desc = ({
  description,
  requirements,
  skills,
  logo,
  name,
  chatResponseRate,
  lastActiveAt,
  shareParams
}: propsType) => {
  return (
    <section className={styles.desc}>
      <div className={styles.desc_title}>
        <h5>Job Description</h5>
        <div className={styles.desc_title_change}>
          <JobClient {...shareParams} />
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
        <span
          className={classNames([
            styles.desc_footer_lineStatus,
            transState(lastActiveAt)?.text !== 'Online' ? styles.desc_footer_notLine : null
          ])}
        >
          {transState(lastActiveAt)?.text}
        </span>
      </div>
    </section>
  )
}

export default Desc
