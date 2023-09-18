import { NextResponse } from "next/server"


export async function GET(request, { params }) {
    const { lang, keyword } = params
    console.log('Params', { lang, keyword })
    // get请求 `http://localhost:3000/${lang}/company/${keyword}`
    const res = await fetch(`http://localhost:3000/${lang}/company/${keyword}`, request)
    // 把 res 转成readableStream
    const readableStream = res.body
    // 返回一个NextResponse对象
    console.log({ res, readableStream })
    const response = new NextResponse(readableStream, { ...res })
    return response
    // return new NextResponse()
}