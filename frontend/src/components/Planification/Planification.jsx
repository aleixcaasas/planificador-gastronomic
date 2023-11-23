import './Planification.css'
import axios from 'axios'
import { useState, useEffect } from 'react'
import { Toaster, toast } from 'sonner'
import { useUser } from '../../context/UserContext.jsx'

function Planification() {
    const { setUser, setIsAuthenticated } = useUser()

    return (
        <>
            <p>LUNES</p>
            <p>MARTES</p>
        </>
    )
}

export default Planification
