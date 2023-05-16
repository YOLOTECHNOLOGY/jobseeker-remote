/* eslint-disable react/prop-types */
import { memo } from 'react'
import { formatJobAlertFilter } from './formatJobAlertFilters'
type MemoedFilterProps = { alert: any; config: any; lang: any }

export const MemoedFilters = memo<MemoedFilterProps>(function AlertFilters(props) {
  const { config, alert, lang } = props
  const { is_company_verified } = alert

  let companyVerify = is_company_verified == '1' ? 'Verified' : ''
  companyVerify = !companyVerify ? `` : `,${lang.alertModal.companyVerified}`

  const result = formatJobAlertFilter(config, alert) + companyVerify
  return result ? result : lang.alertModal.noFilter
})
