const ports = []
self.onconnect = e => {
    const port = e.ports[0]
    ports.push(port)
    port.onmessage = e => {
        otherPort.forEach(otherPort => {
            if (otherPort !== port) {
                port.postMessage('refreshMessage')
            }
        })
    }
}
