import React from 'react'
import styles from '../index.module.scss'
import { BossjobLogo } from 'images'
import Link from 'next/link'
import MaterialButton from 'components/MaterialButton'
const Header = (props: any) => {
  const { lang, step } = props
  return (
    <div className={styles.header}>
      <div className={styles.headerMain}>
        <Link href={'/'}>
          <img
            className={styles.headerLogoImage}
            src={BossjobLogo}
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
              <MaterialButton
                variant='outlined'
                size='medium'
                capitalize
                sx={{
                  height: '35px !important',
                  border: '1px solid #2378E5',
                  borderRadius: '10px',
                  backgroundColor: '#fff',
                  color: '#2378E5',
                  padding: '0 30px',
                  ':hover': {
                    border: '1px solid #2378E5',
                    background: '#2378E5',
                    color: '#fff'
                  }
                }}
              >
                {lang?.profile?.skip}
              </MaterialButton>
            </Link>
          )}
        </div>
      </div>
    </div>
  )
}

export default Header
