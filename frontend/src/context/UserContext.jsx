import React, { createContext, useState, useContext, useEffect } from 'react'
import axios from 'axios'
import { toast } from 'sonner'
import Cookies from 'js-cookie'
import { auth } from '../../firebase.js'
import { getRedirectResult } from 'firebase/auth'

const UserContext = createContext()

export const useUser = () => useContext(UserContext)

export const UserProvider = ({ children }) => {
    const [user, setUser] = useState(null)
    const [isAuthenticated, setIsAuthenticated] = useState(false)
    const [loading, setLoading] = useState(true)

    axios.defaults.withCredentials = true

    useEffect(() => {
        const processRedirectResult = async () => {
            try {
                const result = await getRedirectResult(auth)
                if (result) {
                    await axios.post(`${import.meta.env.VITE_API_URL}/google-login`, result.user)
                    setIsAuthenticated(true)
                    const getVerifyToken = async () => {
                        const cookies = Cookies.get()
                        if (cookies.token) {
                            try {
                                const res = await axios.get(`${import.meta.env.VITE_API_URL}/verify-token`)
                                if (res.data) {
                                    setIsAuthenticated(true)
                                    setLoading(false)
                                    setUser(res.data)
                                }
                            } catch (error) {
                                setIsAuthenticated(false)
                                setUser(null)
                                setLoading(false)
                            }
                        }
                    }
                    getVerifyToken()
                }
            } catch (error) {
                setIsAuthenticated(false)
                setUser(null)
                toast.error('Error al iniciar sesión con Google. Por favor, intenta de nuevo.')
                console.log(error)
            }
        }

        processRedirectResult()
    }, [])

    useEffect(() => {
        const getVerifyToken = async () => {
            const cookies = Cookies.get()
            if (cookies.token) {
                try {
                    const res = await axios.get(`${import.meta.env.VITE_API_URL}/verify-token`)
                    if (res.data) {
                        setIsAuthenticated(true)
                        setLoading(false)
                        setUser(res.data)
                    }
                } catch (error) {
                    setIsAuthenticated(false)
                    setUser(null)
                    setLoading(false)
                }
            }
        }
        getVerifyToken()
    }, [isAuthenticated])

    return (
        <UserContext.Provider
            value={{ setUser, user, isAuthenticated, setIsAuthenticated, axios, setLoading, loading }}
        >
            {children}
        </UserContext.Provider>
    )
}
