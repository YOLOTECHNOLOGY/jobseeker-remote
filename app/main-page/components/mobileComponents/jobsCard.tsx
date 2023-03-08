import React from "react";
import styles from './index.module.scss';


const JobsCard = () =>{

return (
<div className={styles.jobCard}>
            <div className={styles.name}>
                 <p>Java Developer work from...</p>
                 <span className={styles.salary}>₱75 - 80K</span>
              </div>
              <p className={styles.company}>Loop Contact Solutions Inc.</p> 

              <span className={styles.tag}>123</span>
              <span className={styles.tag}>123</span>
              <span className={styles.tag}>123</span>  
              <div className={styles.contact}>
                <div className={styles.avator}>
                 <img  src="https://assets.bossjob.com/companies/8659/cover-pictures/eed13eb0bc17daa90c817347d6216689.jpeg"/>
                </div> 
                 John · Recruiter
                 <span className={styles.location}>San Fernando Ilocos</span>
              </div>                      
         </div>

)

}
export default JobsCard