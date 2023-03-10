'use client'
import { useFirstRender } from 'helpers/useFirstRender'
import React, { useEffect } from 'react'
import { initFireBase } from 'helpers/fireBaseManager'
const runInClient = () => {
    if (!(window as any)?.imSharedWorker && window.SharedWorker) {
        (window as any).imSharedWorker = new SharedWorker('/imbackground.js', 'imbackground')
    }
    const devTools = (window as any).__REACT_DEVTOOLS_GLOBAL_HOOK__
    if (!!devTools && devTools['inject']) {
        devTools['inject'] = Function.prototype
    }
    initFireBase()

}

const InitialClient = () => {
    const firstRender = useFirstRender()
    useEffect(() => {
        if (firstRender) {
            runInClient()
        }
    }, [firstRender])
    return <>
   
     </>
}

export default InitialClient
