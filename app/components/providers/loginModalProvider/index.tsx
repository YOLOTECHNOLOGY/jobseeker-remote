


'use client'
import React, { createContext, useState } from 'react'
import LoginDialog from '../../LoginDialog'

export const LoginModalContext = createContext({ showLogin: false, setShowLogin: null })
const Provider = LoginModalContext.Provider

const LoginModalProvider = ({ children }: any) => {
    const [showLogin, setShowLogin] = useState(false)
    return <Provider value={{ showLogin, setShowLogin }}>
        {children}
        {
            showLogin && <LoginDialog
            open={showLogin}
            handleClose={() => setShowLogin(false)}
        />
        }        
        </Provider>
}

export default LoginModalProvider
