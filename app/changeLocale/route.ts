
export async function GET() {

    return new Response('Hello, Next.js!', {
        status: 301,
        headers: {
            'Set-Cookie': `token=123;domain=.bossjob.sg;path=/;SameSite=None;Secure;HttpOnly=false`,
            Location: 'https://dev.bossjob.sg',
            "Access-Control-Allow-Origin": "https://dev.bossjob.ph",
            "Access-Control-Allow-Credentials": 'true',
            "Access-Control-Allow-Methods": "PUT,POST,GET,DELETE,OPTIONS",
            "Access-Control-Allow-Headers": "X-Requested-With"

        },

    })
}