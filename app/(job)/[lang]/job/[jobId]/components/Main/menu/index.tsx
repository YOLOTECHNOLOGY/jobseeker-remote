'use client'
import React, { useState, useEffect, useRef } from 'react'
import styles from '../../../page.module.scss'
import JobClient from '../Desc/JobClient/JobClient'
import { getCookie } from 'helpers/cookies'
import { accessToken } from 'helpers/cookies'
import { useFirstRender } from 'helpers/useFirstRender'
import { throttle } from 'lodash-es'
import { addJobViewService as fetchAddJobViewService } from 'store/services/jobs/addJobView'
import { isMobile } from 'react-device-detect'
import { getDeviceUuid } from 'helpers/guest'
const Menu = ({ shareParams, lang, isbenefits, jobId, jobDetail }: any) => {
  const token = getCookie(accessToken)
  const recoFrom = getCookie('reco_from') ?? null
  const source = getCookie('source') ?? null
  const pref_job_title_id = getCookie('pref_job_title_id') ?? null
  const [current, setCurrent] = useState<number>(0)
  const [menuNew, setMneuNew] = useState<Array<any>>([])
  const firstRender = useFirstRender()
  const { content } = lang
  const [timeStamp, setTimeStamp] = useState(0)
  const scrollRef = useRef(false)
  const menu = [
    {
      name: content.JD,
      id: 'JobDescription'
    },
    {
      name: content.keySkills,
      id: 'KeySkills'
    },
    {
      name: content.requirement,
      id: 'Requirement'
    },
    {
      name: content.benefits,
      id: 'Benefits'
    },
    {
      name: content.workLocation,
      id: 'WorkingLocation'
    }
  ]

  useEffect(() => {
    const query = {
      jobId,
      status: 'public',
      serverAccessToken: null
    }

    if (token) {
      query.status = token ? 'protected' : 'public'
      query.serverAccessToken = token ?? null
    }
    const deviceUuid = getDeviceUuid()
    const tokenData = {
      source: source ? source : 'job_search',
      device: isMobile ? 'mobile_web' : 'web',
      reco_from: recoFrom ? recoFrom : null,
      device_udid: deviceUuid,
      job_title_id:pref_job_title_id
    }
    const params = Object.assign(query, tokenData)

    try {
      fetchAddJobViewService(params)
    } catch (error) {
      //
    }
  }, [])

  useEffect(() => {
    window.document.addEventListener('scroll', throttle(handleScroll, 200))
    // if (!token) {
    //   const recoFrom = getCookie('reco_from') ?? null
    //   fetchAddJobViewService({
    //     jobId,
    //     status: 'public',
    //     source: 'job_search',
    //     device: isMobile ? 'mobile_web' : 'web',
    //     reco_from: recoFrom,
    //     device_udid: localStorage.getItem('deviceUdid')
    //   })
    // }
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handleScroll = () => {
    setTimeStamp(new Date().getTime())
  }

  useEffect(() => {
    if (timeStamp) {
      const top =
        window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop
      const headerHeight = document.getElementById('jobDetaiPagelHead')?.offsetHeight

      const jobDescriptionTop = computeHeight(
        getOffsetTop('JobDescription') - 50,
        top,
        headerHeight
      )
      const keySkillsTop = computeHeight(getOffsetTop('KeySkills'), top, headerHeight)
      const requirementTop = computeHeight(getOffsetTop('Requirement'), top, headerHeight)
      const benefitsTop = computeHeight(getOffsetTop('Benefits'), top, headerHeight)
      const wrkingLocationTop = computeHeight(getOffsetTop('WorkingLocation'), top, headerHeight)

      const arr = [jobDescriptionTop, keySkillsTop, requirementTop, benefitsTop, wrkingLocationTop]
      if (!isbenefits) {
        arr.splice(3, 1)
      }
      console.log(arr)
      arr.map((e, index) => {
        if (Math.abs(e) < 80) {
          scrollRef.current = true
          setCurrent(index)
        }
      })
      if (wrkingLocationTop < -600) {
        setCurrent(arr?.length - 1)
      }
      if (top < 200) {
        setCurrent(0)
      }
    }
  }, [timeStamp])

  const computeHeight = (top, bodyTop, headerHeight) => {
    return top - headerHeight - bodyTop - 50
  }

  const getOffsetTop = (dom) => {
    return document.getElementById(dom)?.offsetTop || 0
  }

  useEffect(() => {
    if (isbenefits) {
      setMneuNew(menu)
    } else {
      setMneuNew(menu.filter((e) => e.id !== 'Benefits'))
    }
  }, [isbenefits])

  useEffect(() => {
    if (firstRender || scrollRef.current) return
    // document.getElementById('workingLocation').scrollIntoView({
    //   behavior: 'smooth'
    // })
    const domID = menuNew[current]?.id
    if (domID) {
      const domTop = document.getElementById(domID)?.offsetTop
      const headerHeight = document.getElementById('jobDetaiPagelHead')?.offsetHeight
      console.log(headerHeight, 9999)
      const position = domTop - headerHeight - (domID === 'JobDescription' ? 300 : 60)
      position && scrollSmoothTo(position)
    }
  }, [current])

  const scrollSmoothTo = function (position) {
    if (!window.requestAnimationFrame && window) {
      window.requestAnimationFrame = function (callback) {
        return setTimeout(callback, 17)
      }
    }

    let scrollTop = document.documentElement.scrollTop || document.body.scrollTop
    const step = function () {
      const distance = position - scrollTop
      scrollTop = scrollTop + distance / 5
      if (Math.abs(distance) < 1) {
        window.scrollTo(0, position)
      } else {
        window.scrollTo(0, scrollTop)
        requestAnimationFrame(step)
      }
    }
    step()
  }

  const handleClick = (index) => {
    scrollRef.current = false
    setCurrent(index)
  }

  return (
    <div className={styles.headSticky} id='jobDetaiPagelHead'>
      <div className={styles.menu}>
        <div className={styles.menuMain}>
          <ul>
            {menuNew.map((item, index) => (
              <li
                key={index}
                onClick={() => handleClick(index)}
                className={`${index === current ? styles.active : ''} `}
              >
                {item.name}
              </li>
            ))}
          </ul>
          <div className={styles.operator}>
            <JobClient isLogin={Boolean(token)} {...shareParams} />
          </div>
        </div>
      </div>
    </div>
  )
}

export default Menu
