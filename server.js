const express = require('express');
const next = require('next');
const { createProxyMiddleware } = require('http-proxy-middleware');
const env = process.argv[2]
const dev = process.argv[3] === 'dev'
const result = require('dotenv').config({ path: `.env.${env}` });

console.log({ result })
const app = next({ isNextDevCommand: dev, env: result.parsed });

const handle = app.getRequestHandler();

app.prepare().then(async () => {
    const server = express();
    const { default: { client } } = await import('./bossjob.config.mjs');
    console.log({ client })
    client.forEach(
        config => {
            server.use(`/${config.id}`, createProxyMiddleware({
                target: config.url, // 目标服务器地址
                changeOrigin: true, // 需要虚拟主机站点
            }));
        }
    )
    server.get('*', (req, res) => {
        return handle(req, res);
    });

    server.listen(3004, (err) => {
        if (err) throw err;
        console.log('> Ready on http://localhost:3004')
    });
}).catch(e => {
    console.log('next start fail:', e)
});