'use client'
import React, { useState, useEffect } from 'react'
import styles from '../../../page.module.scss'
import JobClient from '../Desc/JobClient/JobClient'
import { getCookie } from 'helpers/cookies'
import { accessToken } from 'helpers/cookies'
import { useFirstRender } from 'helpers/useFirstRender'
const Menu = ({ shareParams }: any) => {
  const token = getCookie(accessToken)
  const [current, setCurrent] = useState(0)
  const firstRender = useFirstRender()
  const menu = [
    {
      name: 'Job Description',
      id: 'JobDescription'
    },
    {
      name: 'Key Skills',
      id: 'KeySkills'
    },
    {
      name: 'Requirement',
      id: 'Requirement'
    },
    {
      name: 'Benefits',
      id: 'Benefits'
    },
    {
      name: 'Working  Location',
      id: 'WorkingLocation'
    }
  ]

  useEffect(() => {
    if (current === 0) return
    // document.getElementById('workingLocation').scrollIntoView({
    //   behavior: 'smooth'
    // })
    const domID = menu[current]?.id
    console.log(domID, 9999)
    if (domID) {
      const domTop = document.getElementById(domID)?.offsetTop
      const headerHeight = document.getElementById(domID)?.offsetHeight
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
    // 当前滚动高度
    let scrollTop = document.documentElement.scrollTop || document.body.scrollTop
    // 滚动step方法
    const step = function () {
      // 距离目标滚动距离
      const distance = position - scrollTop
      // 目标滚动位置
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
          {menu.map((item, index) => (
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
