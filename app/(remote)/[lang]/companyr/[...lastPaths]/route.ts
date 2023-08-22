import { NextResponse } from "next/server"


export async function GET(request, { params }) {
    const { lastPaths } = params
    console.log({ lastPaths })
    const res = await fetch(`http://localhost:3000/companyr/_next/static/chunks/${lastPaths.join('/')}`)

    const response = NextResponse.redirect(`http://localhost:3000/${lastPaths.map(encodeURI).join('/')}`)
    return response
}