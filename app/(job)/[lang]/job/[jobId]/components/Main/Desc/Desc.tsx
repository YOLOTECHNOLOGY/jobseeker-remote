"use client"
import React, { useEffect, useState } from 'react'

import classNames from 'classnames/bind'
import { isMobile } from 'react-device-detect'

import ReadMore from './ReadMore'
import { DefaultAvatar } from 'images'
import { Avatar } from 'app/components/MUIs'
import { transState } from 'helpers/utilities'

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
  recruiter,
  languages
}: propsType) => {
  const { content } = languages
  const [requirementTopNear, setRequirementTopNear] = useState<number>(0)

  useEffect(() => {

    const debounce = (func, delay) => {
      let timer;
      return (...args) => {
        clearTimeout(timer);
        timer = setTimeout(() => {
          func(...args);
        }, delay);
      };
    };

    const handleWatchScrollY = () => {
      const headClientHight = document.querySelector("#head")?.clientHeight ?? 0
      let near = (document.querySelector("#Requirement") as any )?.offsetTop;

      if (!isMobile) {
        near -= headClientHight
      }

      if (near) {
        setRequirementTopNear(near)
      }
    }

    const debouncedHandleWatchScrollY = debounce(handleWatchScrollY, 300);

    window.addEventListener("scroll", debouncedHandleWatchScrollY);

    return () => window.removeEventListener("scroll", debouncedHandleWatchScrollY);
  }, [isMobile])


  return (
    <section className={styles.desc} id='JobDescription'>
      <div className={styles.desc_mobileHead}>
        <Avatar
          sx={{ width: '50px', height: '50px', marginRight: '17px' }}
          src={recruiter?.avatar || DefaultAvatar}
        ></Avatar>
        <div className={styles.desc_mobileHead_info}>
          <span className={classNames([styles.desc_footer_name, styles.desc_mobileHead_info_name])}>
            {recruiter?.full_name || ''}
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

      <div className={styles.desc_jobDescWrapper} id="jd" >
        <div className={styles.desc_title}>
          <h5>
            {content.JD}

            <div>
              {/* <JobClient isLogin={Boolean(token)} showText={false} {...shareParams} /> */}
            </div>
          </h5>
        </div>
        <ReadMore
          key={'description'}
          expandText={content.showMore}
          shrinkText={content.showLess}
          className={styles.desc_context}
          text={description}
          line={15}
          lineHeight={24}
          isScroll={{
            top: 0
          }}
        />
      </div>

      <div className={styles.desc_mobileLine}></div>

      <div className={styles.jobseeker}>
        <div className={styles.avatatBox}>
          <Avatar
            sx={{ width: '29.94px', height: '29px' }}
            src={recruiter?.avatar || DefaultAvatar}
          ></Avatar>
          <span className={styles.footer_name} title={recruiter?.full_name}>
            {recruiter?.full_name} <i style={{ padding: '0 4px' }}>{' · '}</i>
            {recruiter?.work_experience?.job_title || ''}
          </span>
          <span className={styles.chat}>
            {chatResponseRate}% &nbsp;{content.rate}
          </span>
        </div>
        <div className={styles.chatBox}>
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
          key={'requirement'}
          expandText={content.showMore}
          shrinkText={content.showLess}
          className={styles.desc_context}
          text={requirements}
          line={15}
          lineHeight={24}
          isScroll={{
            top: requirementTopNear
          }}
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
