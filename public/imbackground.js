

const ports = []
self.onconnect = e => {
    const port = e.ports[0]
    ports.push(e.ports[0])
    port.onmessage = e => {
        console.log('worker on message ', e)
        ports.forEach(port => {
            port.postMessage('refreshMessage')
        })
    }
    
}

