import Link from 'next/link'

import Btn from './Btn/Btn'
import { Stack, Avatar } from 'app/components/MUIs'
import { cookies } from 'next/headers'
import { UploadResumeIcon, CompleteResumeIcon } from 'images'
import { FavoriteBorderIcon, FavoriteIcon } from 'app/components/MuiIcons'
import styles from '../../page.module.scss'
import classNames from 'classnames'
import JobClient from '../Main/Desc/JobClient/JobClient'

type propsType = {
  title?: string
  localhost?: string
  degree?: string
  xp_lvl?: string
  jobType?: string
  salary?: string
  jobId: number
  is_saved: boolean
  chat: any
  job_type_value: string
  status_key: string
  jobDetail?: any
  languages: Record<string, any>
  shareParams: any
}

const Head = ({
  title,
  localhost,
  degree,
  xp_lvl,
  jobType,
  salary,
  jobId,
  is_saved,
  chat,
  job_type_value,
  jobDetail,
  languages,
  shareParams
}: propsType) => {
  const accessToken = cookies().get('accessToken')?.value
  const user = cookies().get('user')?.value
  const isLogin = !!accessToken && !!user
  const { header } = languages
  const cookieStore = cookies()
  const token = cookieStore.get('accessToken')
  return (
    <section id='jobDetaiPagelHead' className={classNames([styles.head, styles.headSticky])}>
      <div className={styles.head_main}>
        <div className={styles.head_main_title}>
          <div className={styles.head_main_titleWrapper}>
            <h1>{title}</h1>
            <div className={styles.head_main_title_context}>
              <span className={styles.head_main_title_context_type}>({job_type_value})</span>
              {jobDetail.is_urgent ? (
                <span className={styles.head_main_title_context_status}>{header.urgent}</span>
              ) : null}
            </div>
          </div>
          <div className={styles.head_main_salary}>{salary}</div>
        </div>

        <div className={styles.head_main_desc}>
          <i>
            <svg
              xmlns='http://www.w3.org/2000/svg'
              width='22'
              height='22'
              viewBox='0 0 22 22'
              fill='none'
            >
              <path
                fill-rule='evenodd'
                clip-rule='evenodd'
                d='M10.9998 3.67188C8.70906 3.67188 6.85201 5.52892 6.85201 7.8197C6.85201 8.3582 7.03037 9.09444 7.36365 9.93605C7.69171 10.7645 8.1477 11.64 8.65002 12.4392C9.15385 13.2408 9.68973 13.9426 10.1686 14.4335C10.4088 14.6799 10.6183 14.8562 10.7873 14.9658C10.9078 15.044 10.9764 15.068 10.9998 15.0752C11.0232 15.068 11.0919 15.044 11.2123 14.9658C11.3813 14.8562 11.5908 14.6799 11.8311 14.4335C12.3099 13.9426 12.8458 13.2408 13.3497 12.4392C13.852 11.64 14.308 10.7645 14.636 9.93605C14.9693 9.09444 15.1477 8.3582 15.1477 7.8197C15.1477 5.52892 13.2906 3.67188 10.9998 3.67188ZM5.35201 7.8197C5.35201 4.70049 7.88063 2.17188 10.9998 2.17188C14.119 2.17188 16.6477 4.70049 16.6477 7.8197C16.6477 8.6337 16.3924 9.57476 16.0307 10.4883C16.0024 10.5598 15.9733 10.6314 15.9435 10.7031H17.7945C18.6128 10.7031 19.3218 11.2701 19.5017 12.0683L20.7696 17.6933C21.0163 18.7876 20.1842 19.8281 19.0625 19.8281H2.93845C1.81671 19.8281 0.984621 18.7876 1.23128 17.6933L2.49921 12.0683C2.67914 11.2701 3.38815 10.7031 4.20638 10.7031H6.05622C6.02639 10.6314 5.99731 10.5598 5.96902 10.4883C5.60725 9.57476 5.35201 8.6337 5.35201 7.8197ZM6.77589 12.2031H4.20638C4.08949 12.2031 3.9882 12.2841 3.9625 12.3982L2.69457 18.0232C2.65933 18.1795 2.7782 18.3281 2.93845 18.3281H19.0625C19.2227 18.3281 19.3416 18.1795 19.3063 18.0232L18.0384 12.3982C18.0127 12.2841 17.9114 12.2031 17.7945 12.2031H15.2238C15.0323 12.5569 14.8291 12.9041 14.6197 13.2374C14.0777 14.0997 13.4784 14.8929 12.9049 15.4809C12.619 15.774 12.3231 16.0332 12.0289 16.2241C11.7501 16.405 11.392 16.5781 10.9998 16.5781C10.6077 16.5781 10.2496 16.405 9.97082 16.2241C9.67659 16.0332 9.38065 15.774 9.09475 15.4809C8.52128 14.8929 7.92201 14.0997 7.38003 13.2374C7.17053 12.9041 6.96742 12.5569 6.77589 12.2031ZM11.0005 6.54688C10.2583 6.54688 9.6567 7.14849 9.6567 7.89062C9.6567 8.63276 10.2583 9.23438 11.0005 9.23438C11.7426 9.23438 12.3442 8.63276 12.3442 7.89062C12.3442 7.14849 11.7426 6.54688 11.0005 6.54688ZM8.1567 7.89062C8.1567 6.32007 9.42989 5.04688 11.0005 5.04688C12.571 5.04688 13.8442 6.32007 13.8442 7.89062C13.8442 9.46118 12.571 10.7344 11.0005 10.7344C9.42989 10.7344 8.1567 9.46118 8.1567 7.89062Z'
                fill='white'
              />
            </svg>
          </i>
          {localhost}
          <i>
            <svg
              xmlns='http://www.w3.org/2000/svg'
              width='22'
              height='22'
              viewBox='0 0 22 22'
              fill='none'
            >
              <path
                fill-rule='evenodd'
                clip-rule='evenodd'
                d='M14.0871 2.95724C12.1369 2.0149 9.86303 2.0149 7.91281 2.95724L2.03095 5.79932C0.669371 6.45723 0.669368 8.39658 2.03095 9.05449L3.92356 9.96899V15.2077C3.92356 16.2287 4.38874 17.1941 5.1873 17.8304C8.54236 20.5036 13.2902 20.5364 16.6819 17.9099L16.7612 17.8485C17.5909 17.206 18.0765 16.2157 18.0765 15.1664V9.9689L19.9689 9.05449C21.3305 8.39658 21.3305 6.45723 19.9689 5.79932L14.0871 2.95724ZM16.5765 10.6937L14.0871 11.8966C12.1369 12.8389 9.86303 12.8389 7.91281 11.8966L5.42356 10.6938V15.2077C5.42356 15.772 5.68066 16.3056 6.12203 16.6573C8.93619 18.8995 12.9186 18.927 15.7635 16.7239L15.8428 16.6625C16.3056 16.3041 16.5765 15.7517 16.5765 15.1664V10.6937ZM8.56541 4.30784C10.1034 3.56471 11.8965 3.56471 13.4345 4.30784L19.3163 7.14992C19.548 7.26188 19.548 7.59193 19.3163 7.70389L13.4345 10.546C11.8965 11.2891 10.1034 11.2891 8.56541 10.546L2.68355 7.70389C2.45184 7.59193 2.45184 7.26188 2.68355 7.14992L8.56541 4.30784Z'
                fill='white'
              />
            </svg>
          </i>
          {degree}
          <i>
            {' '}
            <svg
              xmlns='http://www.w3.org/2000/svg'
              width='22'
              height='22'
              viewBox='0 0 22 22'
              fill='none'
            >
              <path
                fill-rule='evenodd'
                clip-rule='evenodd'
                d='M6.91412 1.396C4.69754 1.396 2.90065 3.19289 2.90065 5.40947V10.1681C1.71084 10.4767 0.832275 11.5579 0.832275 12.8442V17.2806C0.832275 19.0829 2.29338 20.544 4.09574 20.544H17.9039C19.7063 20.544 21.1674 19.0829 21.1674 17.2806V12.856C21.1674 11.5675 20.2896 10.484 19.0993 10.1709V5.40947C19.0993 3.19289 17.3025 1.396 15.0859 1.396H6.91412ZM17.5993 10.0797V5.40947C17.5993 4.02131 16.474 2.896 15.0859 2.896H6.91412C5.52597 2.896 4.40065 4.02131 4.40065 5.40947V10.0797H6.98905C7.15358 10.0797 7.30214 10.1782 7.36627 10.3297C8.71527 13.5171 13.1906 13.6311 14.7002 10.5165L14.7971 10.3165C14.8673 10.1717 15.014 10.0797 15.1749 10.0797H17.5993ZM7.29297 4.55425C6.87875 4.55425 6.54297 4.89004 6.54297 5.30425C6.54297 5.71847 6.87875 6.05425 7.29297 6.05425H14.7142C15.1284 6.05425 15.4642 5.71847 15.4642 5.30425C15.4642 4.89004 15.1284 4.55425 14.7142 4.55425H7.29297ZM19.6674 12.856V17.2806C19.6674 18.2545 18.8779 19.044 17.9039 19.044H4.09574C3.12181 19.044 2.33228 18.2545 2.33228 17.2806V12.8442C2.33228 12.1458 2.8984 11.5797 3.59675 11.5797H6.31735C8.40587 15.1632 13.7019 15.2174 15.8317 11.5797H18.3911C19.096 11.5797 19.6674 12.1511 19.6674 12.856Z'
                fill='white'
              />
            </svg>
          </i>
          {xp_lvl}{' '}
          <i>
            {' '}
            <svg
              xmlns='http://www.w3.org/2000/svg'
              width='22'
              height='22'
              viewBox='0 0 22 22'
              fill='none'
            >
              <path
                fill-rule='evenodd'
                clip-rule='evenodd'
                d='M11 21.0254C16.5369 21.0254 21.0254 16.5369 21.0254 11C21.0254 5.46313 16.5369 0.974609 11 0.974609C5.46313 0.974609 0.974609 5.46313 0.974609 11C0.974609 16.5369 5.46313 21.0254 11 21.0254ZM19.5254 11C19.5254 15.7084 15.7084 19.5254 11 19.5254C6.29156 19.5254 2.47461 15.7084 2.47461 11C2.47461 6.29156 6.29156 2.47461 11 2.47461C15.7084 2.47461 19.5254 6.29156 19.5254 11ZM11.748 6.18359C11.748 5.76938 11.4123 5.43359 10.998 5.43359C10.5838 5.43359 10.248 5.76938 10.248 6.18359V10.9925V11.2834L10.4443 11.4983L13.4979 14.8417C13.7773 15.1475 14.2517 15.169 14.5575 14.8897C14.8634 14.6103 14.8849 14.1359 14.6055 13.8301L11.748 10.7015V6.18359Z'
                fill='white'
              />
            </svg>
          </i>
          {jobType}
        </div>

        <div className={styles.head_main_change}>
          <div>
            <Btn jobId={jobId} is_saved={is_saved} chat={chat} jobDetail={jobDetail} />
          </div>

          <div className={styles.head_main_change_resume}>
            <Stack spacing={2} direction='row'>
              {isLogin && (
                <div>
                  <Link color='#000000' href='/manage-profile'>
                    <div className={styles.head_main_change_resume_btnWrapper}>
                      <Avatar
                        src={CompleteResumeIcon}
                        alt='complete resume'
                        sx={{ width: '17px', height: '17px', marginRight: '4px' }}
                        className={styles.head_main_change_resume_btnWrapper_icon}
                      />
                      <span>{header.fillUpResume}</span>
                    </div>
                  </Link>
                </div>
              )}
              {/* <div>
                <Link
                  color='#000000'
                  href={isLogin ? '/manage-profile?tab=resume' : '/quick-upload-resume'}
                >
                  <div className={styles.head_main_change_resume_btnWrapper}>
                    <Avatar
                      src={UploadResumeIcon}
                      alt='upload resume'
                      sx={{ width: '17px', height: '17px', marginRight: '4px' }}
                      className={styles.head_main_change_resume_btnWrapper_icon}
                    />
                    <span>{header.uploadResume}</span>
                  </div>
                </Link>
              </div> */}
            </Stack>
            {/* <div className={styles.operator}>
              <span className={styles.item}>
                {is_saved ? (
                  <>
                    <FavoriteIcon sx={{ color: '#136FD3' }} />
                    <span style={{ textTransform: 'capitalize', marginLeft: '8px' }}>
                      {header.undoSave}
                    </span>
                  </>
                ) : (
                  <>
                    <FavoriteBorderIcon sx={{ color: '#136FD3' }} />
                    <span style={{ textTransform: 'capitalize', marginLeft: '8px' }}>
                      {header.save}
                    </span>
                  </>
                )}
              </span>
              <span className={styles.item}>
                <JobClient isLogin={Boolean(token)} {...shareParams} />
              </span>
            </div> */}
          </div>
        </div>
      </div>
    </section>
  )
}

export default Head
