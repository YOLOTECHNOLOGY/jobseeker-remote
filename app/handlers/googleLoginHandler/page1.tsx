import { cookies } from "next/headers"
import GoogleLoginHandler from "./googleLoginHandler"
import { NextResponse } from "next/server"
import { redirectUrlKey } from "helpers/globalKey"

const Handler = (props: any) => {
    const accessToken = cookies().get('accessToken')?.value
    const activeKey = props?.searchParams?.active_key
    const redirectUrl = props?.searchParams?.[redirectUrlKey] ?? null
    // const remoteIp = req.connection.remoteAddress
    NextResponse.next()
    return <GoogleLoginHandler
        accessToken={accessToken}
        activeKey={activeKey}
        redirectUrl={redirectUrl}
    />
}

export default Handler



// export const getServerSideProps = wrapper.getServerSideProps((store) => async (ctx) => {
//     const { query, req } = ctx

//     const accessToken = query.access_token
//     const activeKey = query.active_key
//     const userAgent = useUserAgent(req.headers['user-agent'])
//     const remoteIp = req.connection.remoteAddress
//     return {
//         props: {
//             accessToken: accessToken,
//             activeKey,
//             userAgent,
//             remoteIp,
//             redirectUrl: query.redirectUrl ?? null
//         }
//     }
// })