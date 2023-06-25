import React from 'react'
import styles from '../index.module.scss'
import { BossjobLogoWhite } from 'images'
import Link from 'next/link'
const Header = (props: any) => {
  const { lang, step } = props
  console.log({ step })
  return (
    <div className={styles.header}>
      <div className={styles.headerMain}>
        <Link href={'/'}>
          <img
            className={styles.headerLogoImage}
            src={BossjobLogoWhite}
            title='Bossjob logo'
            alt='Bossjob logo'
            style={{
              marginTop: '3px'
            }}
          />
        </Link>
        <div>
          {/* <Link href={'/'}>
            <MaterialButton
              variant='outlined'
              size='medium'
              capitalize
              sx={{
                width: '76px',
                height: '35px !important',
                border: '1.5px solid #FFFFFF',
                borderRadius: '10px',
                maxWidth: '153px',
                paddingLeft: '0',
                paddingRight: '0',
                backgroundColor: '#136FD3',
                ':hover': {
                  border: '1px solid #fff'
                }
              }}
            >
              <Text textStyle='base' style={{ fontWeight: '400' }} textColor='white' bold>
              {lang?.profile?.skip}
              </Text>
            </MaterialButton>
          </Link> */}
          {step === 1 && (
            <Link style={{ marginLeft: '20px' }} href={process.env.BOSSHUNT_URL + '/boss'}>
              {lang?.profile?.ImHiring}
            </Link>
          )}
        </div>
      </div>
    </div>
  )
}

export default Header
