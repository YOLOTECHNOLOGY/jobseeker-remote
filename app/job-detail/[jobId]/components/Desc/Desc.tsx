import Avatar from '@mui/material/Avatar'

import styles from '../../page.module.scss'

type propsType = {
  description?: string
  requirements?: string
  skills?: Array<any>
  logo?: string
  name?: string
  chatResponseRate?: number
  lastActiveAt?: number
}

const Desc = ({
  description,
  requirements,
  skills,
  logo,
  name,
  chatResponseRate,
  lastActiveAt
}: propsType) => {
  return (
    <div className={styles.desc}>
      <div>
        <h5>Job Description</h5>
        <div>
          <div>Share</div>
          <div>Report</div>
        </div>
      </div>

      {skills.map((skill) => (
        <div key={skill.value}>{skill.value}</div>
      ))}

      <div dangerouslySetInnerHTML={{ __html: description }}></div>
      <div dangerouslySetInnerHTML={{ __html: requirements }}></div>

      <div>
        <Avatar src={logo}></Avatar>
        <span>{name}</span>
        <span>{chatResponseRate}</span>
        <span>{lastActiveAt}</span>
      </div>
    </div>
  )
}

export default Desc
