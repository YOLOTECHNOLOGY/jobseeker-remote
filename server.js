const express = require('express');
const next = require('next');
const { createProxyMiddleware } = require('http-proxy-middleware');
const env = process.argv[2]
const dev = process.argv[3] === 'dev'
const result = require('dotenv').config({ path: `.env.${env}` });
const port = dev ? 7001 : 3000
console.log({ dev, env, 'process.env.NODE_ENV': process.env.NODE_ENV })
const app = next({
    isNextDevCommand: dev,
    dev: dev,
    conf: {
        env: result.parsed
    },
    customServer: true,
});

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

    server.listen(port, (err) => {
        if (err) throw err;
        console.log(`> Ready on http://localhost:${port}`)
    });
}).catch(e => {
    console.log('next start fail:', e)
});