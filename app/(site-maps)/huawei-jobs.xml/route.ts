import axios from 'axios'
import { NextResponse } from 'next/server'

export async function GET() {
  const response = await axios.get(
    process.env.ENV === 'production'
      ? 'https://assets.bossjob.com/huawei-jobs.xml'
      : 'https://dev-assets.bossjob.com/huawei-jobs.xml'
  )
  const res = new NextResponse(response.data.toString(), {
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
