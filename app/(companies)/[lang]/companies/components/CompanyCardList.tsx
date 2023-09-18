// Components
import CompanyCard from './CompanyCard'
import CompanyCardLoader from 'components/Loader/CompanyCard'
// import Empty from './Empty'
import Empty from 'app/components/empty/empty'
import Image from 'next/image'
// Styles
import styles from '../Companies.module.scss'
import { padArrayToMultiple } from 'app/(company)/[lang]/company/[keyword]/components/InfoList'
import { useLoginModal } from 'app/components/providers/loginModalProvider'
import { getCookie } from 'helpers/cookies'
import { useLanguage } from 'app/components/providers/languageProvider'

interface ICompanyCardList {
  companiesList: any
  isLoading?: boolean
  lang?: any
  transitions: any
  langKey: string
  config: any
  page: number
}
const canRender = (index: number, count: number) => {
  if (count <= 3 && index === 2) return true
  if (count <= 6 && index === 5) return true
  if (count > 6 && index === 5) return true
  return false
}
const CompanyCardList = (props: ICompanyCardList) => {
  const { companiesList, isLoading, transitions = {}, lang, langKey, config } = props
  const isLogin = getCookie('accessToken') ? true : false
  const loginToggle = useLoginModal();
  const { companies } = useLanguage();
  const Tips = <div className={styles.tips_wrapper}>
    <div className={styles.tips_content}>
      <Image alt={'img'} width={106} height={102}
        src={`${process.env.S3_BUCKET_URL}/companies/registerLock.svg`}
      ></Image>
      <div className={styles.tips_content_text}>
        {companies.loginNowDescription}
      </div>
      <div className={styles.tips_content_go} onClick={() => {
        loginToggle.setShowLogin(true)
      }}>
        {companies.loginNow}
      </div>
    </div>
    <div className={styles.tips_full}>
      <Image alt={'fill'} fill
        style={{ objectFit: 'contain' }}
        src={`${process.env.S3_BUCKET_URL}/companies/companies-search-bg.svg`}
      ></Image>
    </div>
  </div>

  const _list = companiesList && companiesList.length ? padArrayToMultiple(companiesList)(3) : [];
  return (
    <div className={styles.companyList}>
      {!isLoading &&
        companiesList?.length > 0 &&
        _list.map((item, index) => {
          if (!item) return <>
            <div className={styles.companyItem} style={{ opacity: 0 }} key={Math.random()}></div>
            {canRender(index, _list.length) && !isLogin && Number(props.page) === 1 && Tips}
          </>
          return <>
            <div className={styles.companyItem} key={item.id}>
              <CompanyCard
                transitions={transitions}
                config={config}
                company={item}
                langKey={langKey}
              />
            </div>
            {canRender(index, _list.length) && !isLogin && Number(props.page) === 1 && Tips}
          </>

        })}

      {!isLoading && !companiesList?.length && (
        <Empty lang={lang} description={lang?.companies?.companiesEmpty} />
      )}
    </div>
  )
}

export default CompanyCardList
