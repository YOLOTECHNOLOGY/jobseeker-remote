

import { NextResponse } from 'next/server'
import fs from 'fs'

export async function GET(request) {
    const file = fs.readFileSync('public/serverInfo.log')
    const response = new NextResponse(file, {
        status: 200,
        headers: {
            "Access-Control-Allow-Headers": "Set-Cookie",
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Credentials': 'true',
            'Access-Control-Allow-Methods': 'PUT,POST,GET,DELETE,OPTIONS',
        },

    })

    return response
}


