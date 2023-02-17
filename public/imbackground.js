

const ports = []
self.addEventListener('connect',e =>{
    console.log('onconnect',e)
    ports.push(e.ports[0])
})
 