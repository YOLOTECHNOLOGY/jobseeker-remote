import queryString from 'query-string'
import slugify from 'slugify'
import configuredAxios from 'helpers/configuredAxios'
import { NextResponse } from 'next/server'
export const revalidate = 60000
const constructSitemapAgencyXML = ({ id = '', name = '', created_at: createdAt = '' }) => {
  return `
    <url>
      <loc>${`https://bossjob.ph/employer/bosshunt/agency/profile/${slugify(
    name.toLowerCase()
  )}-${id}`}</loc>
      <lastmod>${new Date(createdAt).toISOString()}</lastmod>
      <priority>0.80</priority>
      <changefreq>weekly</changefreq>
    </url>
    `
}
export async function GET() {
  const axios = configuredAxios('bosshunt', 'public')
  const response = await axios.get(`companies?${queryString.stringify({ page: 1, size: 1000 })}`)
  const AgenciesXml = response.data.data.companies
    .map((agency) => {
      const agencyXML = constructSitemapAgencyXML(agency).replace(/&amp;/g, '&')
      return agencyXML
    })
    .join('')
  const xml = `
        <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9 http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">
        ${AgenciesXml}
        </urlset>
    `
  const res = new NextResponse(xml, {
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