import classNames from 'classnames/bind'
import { cookies } from 'next/headers'

import { transState } from 'helpers/utilities'
import { DefaultAvatar } from 'images'
import { Avatar } from 'app/components/MUIs'

import ReadMore from './ReadMore'
import React from 'react'
import { accessToken } from 'helpers/cookies'
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
  recruiter: any
  languages: Record<string, any>
}

const Desc = ({
  description,
  requirements,
  skills,
  chatResponseRate,
  lastActiveAt,
  shareParams,
  recruiter,
  languages
}: propsType) => {
  const cookieStore = cookies()
  const token = cookieStore.get(accessToken)
  const { content } = languages

  return (
    <section className={styles.desc}>
      <div className={styles.desc_mobileHead}>
        <Avatar
          sx={{ width: '50px', height: '50px', marginRight: '17px' }}
          src={recruiter?.avatar || DefaultAvatar}
        ></Avatar>
        <div className={styles.desc_mobileHead_info}>
          <span className={classNames([styles.desc_footer_name, styles.desc_mobileHead_info_name])}>
            {recruiter.full_name}
          </span>
          <span className={classNames([styles.desc_footer_chat, styles.desc_mobileHead_info_rate])}>
            {chatResponseRate}% &nbsp;{content.rate}
          </span>
          <div>
            <span
              className={classNames([
                styles.desc_footer_lineStatus,
                styles.desc_mobileHead_info_active,
                transState(lastActiveAt)?.state !== 1 ? styles.desc_footer_notLine : null
              ])}
            >
              {transState(lastActiveAt, content?.state)?.text}
            </span>
          </div>
        </div>
      </div>

      <div className={styles.desc_jobDescWrapper} id='JobDescription'>
        <div className={styles.desc_title}>
          <h5>{content.JD}</h5>
          {/* <div className={styles.desc_title_change}>
            <JobClient isLogin={Boolean(token)} {...shareParams} />
          </div> */}
        </div>

        {/* <div
          className={styles.desc_context}
          dangerouslySetInnerHTML={{ __html: description }}
        ></div> */}
        <ReadMore
          expandText={content.showMore}
          shrinkText={content.showLess}
          className={styles.desc_context}
          text={description}
          line={5}
          lineHeight={24}
        />
      </div>

      <div className={styles.desc_mobileLine}></div>

      <div
        className={classNames([styles.desc_jobDescWrapper, styles.desc_jobRequireWrapper])}
        id='KeySkills'
      >
        <div className={classNames([styles.desc_title, styles.desc_requirement])}>
          <h5 style={{ marginBottom: '0' }}>{content.keySkills}</h5>
        </div>

        <div className={styles.desc_labels}>
          {skills?.map((skill) => (
            <div key={skill.value}>{skill.value}</div>
          ))}
        </div>
      </div>

      <div
        className={classNames([styles.desc_jobDescWrapper, styles.desc_jobRequireWrapper])}
        id='Requirement'
      >
        <div className={classNames([styles.desc_title, styles.desc_requirement])}>
          <h5>{content.requirement}</h5>
        </div>
        {/* <div
          className={styles.desc_context}
          dangerouslySetInnerHTML={{ __html: requirements }}
        ></div> */}
        <ReadMore
          expandText={content.showMore}
          shrinkText={content.showLess}
          className={styles.desc_context}
          text={requirements}
          line={5}
          lineHeight={24}
        />
      </div>
      {/* <div className={styles.desc_footer}>
        <Avatar
          sx={{ width: '29.94px', height: '29px' }}
          src={recruiter?.avatar || DefaultAvatar}
        ></Avatar>
        <span className={styles.desc_footer_name}>{recruiter.full_name}</span>
        <span className={styles.desc_footer_chat}>
          {chatResponseRate}% &nbsp;{content.rate}
        </span>
        <span
          className={classNames([
            styles.desc_footer_lineStatus,
            transState(lastActiveAt)?.state !== 1 ? styles.desc_footer_notLine : null
          ])}
        >
          {transState(lastActiveAt, content?.state)?.text}
        </span>
      </div> */}
    </section>
  )
}

export default Desc
