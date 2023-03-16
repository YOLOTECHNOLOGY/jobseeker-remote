import styles from '../../page.module.scss'
type propsType = {
  title?: string
  localhost?: string
  degree?: string
  xp_lvl?: string
  jobType?: string
  salary?: string
}

const Head = ({ title, localhost, degree, xp_lvl, jobType, salary }: propsType) => {
  return (
    <section className={styles.head}>
      <div className={styles.head_main}>
        <h1>
          {title} <div className='salary'>{salary}</div>
        </h1>
        <div>
          {localhost} | {degree} | {xp_lvl} | {jobType}
        </div>
        <div>
          <div>
            <button>Save</button>
            <button>Chat now</button>
          </div>

          <div>Fill up resume online</div>
          <div>Upload resume</div>
        </div>
      </div>
    </section>
  )
}

export default Head
