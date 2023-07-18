import axios from 'axios'
import { NextResponse } from 'next/server'
export const revalidate = 60000
export async function GET() {
  const response = await axios.get(
    process.env.ENV === 'production'
      ? 'https://assets.bossjob.com/jobs.xml'
      : 'https://dev-assets.bossjob.com/jobs.xml'
  )
  const res = new NextResponse(response.data, {
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
