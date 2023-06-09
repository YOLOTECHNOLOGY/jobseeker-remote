
import log4js from 'log4js'
log4js.configure({
  appenders: {
    clientError: { type: "file", filename: "public/clientError.log" },
    serverError: { type: "file", filename: "public/serverError.log" },
  },
  categories: {
    clientError: { appenders: ["clientError"], level: "error", enableCallStack: false },
    serverError: { appenders: ["serverError"], level: "error", enableCallStack: false },
    default: { appenders: ["serverError"], level: "error", enableCallStack: false }
  },
});
export async function POST(request) {
  const body = await request.json()
  const logger = log4js.getLogger('clientError')

  logger.level = 'error'
  logger.error(body)
  // console.log({ params, request })
  return new Response(null, {
    status: 200,
  })
}

export async function OPTIONS() {
  return new Response(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': 'true',
      'Access-Control-Allow-Methods': 'PUT,POST,GET,DELETE,OPTIONS'
      // "Access-Control-Allow-Headers": "Set-Cookie"
    }
  })
}
