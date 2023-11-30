import { Navigate, Outlet } from 'react-router-dom'
import { useUser } from './context/UserContext'

function ProtectedRoutes() {
    const { isAuthenticated, loading } = useUser()

    if (!loading && !isAuthenticated) return <Navigate to='/' replace />
    return <Outlet />
}

export default ProtectedRoutes
