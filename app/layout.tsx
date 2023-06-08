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
export default ({ children }: any) => children ?? null