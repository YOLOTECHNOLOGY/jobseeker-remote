const config = {
    client: [
        {
            id: 'chat',
            url: process.env.REMOTE_CHAT_URL
        },
        {
            id: 'chat-service',
            url: process.env.REMOTE_CHAT_URL
        },
        {
            id: 'chat-worker',
            url: process.env.REMOTE_CHAT_URL
        }
    ]
}
export default config