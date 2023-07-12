'use client'
import React, { useState, useEffect, useRef } from 'react'
import styles from '../../../page.module.scss'
import JobClient from '../Desc/JobClient/JobClient'
import { getCookie } from 'helpers/cookies'
import { accessToken } from 'helpers/cookies'
import { useFirstRender } from 'helpers/useFirstRender'
import { throttle } from 'lodash-es'
const Menu = ({ shareParams, lang, isbenefits, jobDetail }: any) => {
  console.log({ jobDetail })
  const token = getCookie(accessToken)
  const [current, setCurrent] = useState<number>(0)
  const [menuNew, setMneuNew] = useState<Array<any>>([])
  console.log(lang, isbenefits, 7777)
  const firstRender = useFirstRender()
  const { content } = lang
  const scrollRef = useRef(null)

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
    window.document.addEventListener('scroll', throttle(handleScroll, 500))
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handleScroll = () => {
    // scrollRef.current = new Date().getTime() // window.document.body.scrollTop
    // console.log(scrollRef.current, 999)
  }

  useEffect(() => {
    console.log(scrollRef.current, 666)
    if (scrollRef.current) {
      const jobDescriptionTop = document.getElementById('JobDescription')?.offsetTop
      const keySkillsTop = document.getElementById('KeySkills')?.offsetTop
      const requirementTop = document.getElementById('Requirement')?.offsetTop
      const benefitsTop = document.getElementById('Benefits')?.offsetTop
      const wrkingLocationTop = document.getElementById('WorkingLocation')?.offsetTop

      // const position = domTop - headerHeight - 100

      console.log(
        computeHeight(jobDescriptionTop),
        computeHeight(keySkillsTop),
        computeHeight(requirementTop),
        computeHeight(benefitsTop),
        computeHeight(wrkingLocationTop)
      )
    }
  }, [scrollRef.current])

  const computeHeight = (top) => {
    const headerHeight = document.getElementById('jobDetaiPagelHead')?.offsetHeight
    return top - headerHeight - 100
  }

  useEffect(() => {
    if (isbenefits) {
      setMneuNew(menu)
    } else {
      setMneuNew(menu.filter((e) => e.id !== 'Benefits'))
    }
  }, [isbenefits])

  useEffect(() => {
    if (firstRender) return
    // document.getElementById('workingLocation').scrollIntoView({
    //   behavior: 'smooth'
    // })
    const domID = menuNew[current]?.id
    console.log(domID, 9999)
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
