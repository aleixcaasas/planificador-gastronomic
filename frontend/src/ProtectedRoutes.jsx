import { Navigate, Outlet } from 'react-router-dom'
import { useUser } from './context/UserContext'

function ProtectedRoutes() {
    const { isAuthenticated } = useUser()

    if (!isAuthenticated) return <Navigate to='/' replace />

    return <Outlet />
}

export default ProtectedRoutes
