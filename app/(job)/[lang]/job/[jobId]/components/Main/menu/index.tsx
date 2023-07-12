'use client'
import React, { useState, useEffect, useRef } from 'react'
import styles from '../../../page.module.scss'
import JobClient from '../Desc/JobClient/JobClient'
import { getCookie } from 'helpers/cookies'
import { accessToken } from 'helpers/cookies'
import { useFirstRender } from 'helpers/useFirstRender'
import { throttle } from 'lodash-es'
const Menu = ({ shareParams, lang, isbenefits }: any) => {
  const token = getCookie(accessToken)
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
    window.document.addEventListener('scroll', throttle(handleScroll, 200))
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handleScroll = () => {
    // scrollRef.current = new Date().getTime() // window.document.body.scrollTop
    // console.log(scrollRef.current, 999)
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
        if (Math.abs(e) < 100) {
          scrollRef.current = true
          setCurrent(index)
        }
      })
      if (wrkingLocationTop < -600) {
        setCurrent(arr?.length - 1)
      }
    }
  }, [timeStamp])

  const computeHeight = (top, bodyTop, headerHeight) => {
    return top - headerHeight - bodyTop - 100
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
      const position = domTop - headerHeight - 100
      console.log(position, domTop, headerHeight)
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
  )
}

export default Menu
