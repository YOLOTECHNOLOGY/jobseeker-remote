'use client'
import React, { useState, useEffect } from 'react'
import styles from '../../../page.module.scss'
import JobClient from '../Desc/JobClient/JobClient'
import { getCookie } from 'helpers/cookies'
import { accessToken } from 'helpers/cookies'

const Menu = ({ shareParams, lang, isbenefits }: any) => {
  const token = getCookie(accessToken)
  const [current, setCurrent] = useState(0)
  const [menuNew, setMneuNew] = useState([])
  console.log(lang, isbenefits, 7777)
  const { content } = lang
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
      name: content.location,
      id: 'WorkingLocation'
    }
  ]
  useEffect(() => {
    if (isbenefits) {
      setMneuNew(menu)
    } else {
      setMneuNew(menu.splice(3, 1))
    }
  }, [isbenefits])

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
