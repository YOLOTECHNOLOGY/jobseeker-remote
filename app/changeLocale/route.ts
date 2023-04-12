
export async function POST(request, params) {
    console.log({ params })
    return new Response('Hello, Next.js!', {
        status: 301,
        headers: {
            'Set-Cookie': `accessToken=${params.accessToken}`,
            Location: process.env.NEXT_PUBLIC_HOST_PATH + params.path ?? '',
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Credentials": 'true',
            "Access-Control-Allow-Methods": "PUT,POST,GET,DELETE,OPTIONS",
            "Access-Control-Allow-Headers": "X-Requested-With"

        },

    })
}