import React, { createContext, useState, useContext, useEffect } from 'react'

const UserContext = createContext()

export const useUser = () => useContext(UserContext)

export const UserProvider = ({ children }) => {
    const [user, setUser] = useState(null)
    const [isAuthenticated, setIsAuthenticated] = useState(false)

    return (
        <UserContext.Provider value={{ setUser, user, isAuthenticated, setIsAuthenticated }}>
            {children}
        </UserContext.Provider>
    )
}
