import React from "react";
import styles from '../page.module.scss';

const InterstedCard = () => {
 
    return (
       <div className={styles.cardList}>
          <div className={styles.name}>
          <img src='https://tpc.googlesyndication.com/simgad/13322565777955859947' />
          <p>John Long NadfaJohn Long NadfaJohn Long Nadfa</p>
          </div>
          <p className={styles.recruite}>Recruiter, Visaya Outsourcing</p>
          <div className={styles.name}>
          <p className={styles.jobType}>John Long NadfaJohn Long NadfaJohn Long Nadfa</p>
          <span className={styles.salary}>₱175 - 180K</span>
          </div>
       </div>
    )

}

export default InterstedCard