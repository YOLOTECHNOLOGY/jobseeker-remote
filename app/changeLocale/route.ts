
export async function GET(request) {
    const accessToken = request.cookies.get('accessToken')?.value
    console.log({accessToken,request,path:process.env.NEXT_PUBLIC_HOST_PATH, })

    return new Response(null, {
        status: 301,
        headers: {
            'Set-Cookie': `accessToken=${accessToken}`,
            Location: process.env.NEXT_PUBLIC_HOST_PATH,
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Credentials": 'true',
            "Access-Control-Allow-Methods": "PUT,POST,GET,DELETE,OPTIONS",
            // "Access-Control-Allow-Headers": "Set-Cookie"

        },

    })
}
export async function OPTIONS() {
    return new Response(null, {
        status: 204,
        headers: {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Credentials": 'true',
            "Access-Control-Allow-Methods": "PUT,POST,GET,DELETE,OPTIONS",
            // "Access-Control-Allow-Headers": "Set-Cookie"

        },

    })
}