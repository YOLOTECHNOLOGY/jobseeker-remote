import { NextResponse } from 'next/server'
import configuredAxios from 'helpers/configuredAxios'
import { getPublicSitemapXML } from 'scripts/getPublicSitemapXML'
import { getCountryKey, getLanguage } from 'helpers/country'
export const revalidate = 60000
export async function GET() {
  const country = getCountryKey()
  const lang = getLanguage()

  const axios = configuredAxios('config', 'public')
  const response = await axios.get(`/${country}/list?language_code?${lang}`)
  const publicSiteMap = getPublicSitemapXML(response)
  const res = new NextResponse(publicSiteMap, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': 'true',
      'Access-Control-Allow-Methods': 'GET',
      'Content-Type': 'text/xml'
    }
  })
  return res
}







