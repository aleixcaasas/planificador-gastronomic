import './Planification.css'
import axios from 'axios'
import { useState, useEffect } from 'react'
import { Toaster, toast } from 'sonner'
import { Tabs, Tab } from '@nextui-org/react'
import { auth, provider } from '../../../firebase.js'
import { useUser } from '../../context/UserContext.jsx'
import { signInWithRedirect, getRedirectResult } from 'firebase/auth'

function Planification() {
    const { setUser, setIsAuthenticated } = useUser()

    return (
        <>
            <table>
                <th>LUNES</th>
                <th>MARTES</th>
            </table>
        </>
    )
}

export default Planification
