import React, { createContext, useState, useContext, useEffect } from 'react'
import axios from 'axios'

const UserContext = createContext()

export const useUser = () => useContext(UserContext)

export const UserProvider = ({ children }) => {
    const [user, setUser] = useState(null)
    const [isAuthenticated, setIsAuthenticated] = useState(false)

    axios.defaults.withCredentials = true

    return (
        <UserContext.Provider value={{ setUser, user, isAuthenticated, setIsAuthenticated, axios }}>
            {children}
        </UserContext.Provider>
    )
}
