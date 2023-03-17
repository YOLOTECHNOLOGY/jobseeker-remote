import React from 'react'
import styles from '../page.module.scss'
import { JoinUs } from 'images'
import Image from 'next/image'
const Card = () => {
  return (
    <>
    <div className={styles.noData}>
    <Image className={styles.noDataImg} src={JoinUs} alt='暂无数据' width={362} height={247} />
    <button className={styles.seeJob}>See job reco</button>
    </div>

    <div  className={styles.detail} >
      <div className={styles.header}>
        <img src='https://tpc.googlesyndication.com/simgad/13322565777955859947' className={styles.avator} />
        <span className={styles.name}>John doe  
        <span className={styles.nameLine}> |</span>  
          Hiring Manager</span>
        <div className={styles.chatBox}> </div>
      </div>
      <div className={styles.info}>
        <div className={styles.leftContent}>
          <div className={styles.developer}>
            <p className={styles.title}>Senior Java Developer Workm homeWork from m homeWork from m homeWork from  from homeWork from homeWork from homeWork from home</p>
            <p className={styles.salary}>₱175 - 180K</p>
          </div>
          <span className={styles.tag}>Bonifacio Global City</span>
          <span className={styles.tag}>3 - 5 Yrs Exp</span>
          <span className={styles.tag}>High/ Senior High school</span>
        </div>
        <div className={styles.rightContent}>
          <div className={styles.company}>
          <img src='https://tpc.googlesyndication.com/simgad/13322565777955859947' className={styles.logo} />
          Loop Contact Solutions Inc.
          </div>
          <span className={styles.tag}>Accountng</span>
          <span className={styles.tag}>500 - 999 Employees</span>
          <span className={styles.tag}>A class</span>
        </div>
      </div>
    </div>
    <div  className={styles.detail} >
      <div className={styles.header}>
        <img src='https://tpc.googlesyndication.com/simgad/13322565777955859947' className={styles.avator} />
        <span className={styles.name}>John doe  
        <span className={styles.nameLine}> |</span>  
          Hiring Manager</span>
        <div className={styles.chatBox}> </div>
      </div>
      <div className={styles.info}>
        <div className={styles.leftContent}>
          <div className={styles.developer}>
            <p className={styles.title}>Senior Java Developer Workm homeWork from m homeWork from m homeWork from  from homeWork from homeWork from homeWork from home</p>
            <p className={styles.salary}>₱175 - 180K</p>
          </div>
          <span className={styles.tag}>Bonifacio Global City</span>
          <span className={styles.tag}>3 - 5 Yrs Exp</span>
          <span className={styles.tag}>High/ Senior High school</span>
        </div>
        <div className={styles.rightContent}>
          <div className={styles.company}>
          <img src='https://tpc.googlesyndication.com/simgad/13322565777955859947' className={styles.logo} />
          Loop Contact Solutions Inc.
          </div>
          <span className={styles.tag}>Accountng</span>
          <span className={styles.tag}>500 - 999 Employees</span>
          <span className={styles.tag}>A class</span>
        </div>
      </div>
    </div>
    </>
  )
}

export default Card
