import { BrowserRouter, Routes, Route } from 'react-router-dom'
import LoginRegisterPage from './pages/LoginRegisterPage'
import { UserProvider } from './context/UserContext'

export default function Router() {
    return (
        <div className='h-screen w-screen'>
            <UserProvider>
                <BrowserRouter>
                    <Routes>
                        <Route path='/' element={<LoginRegisterPage />} />
                    </Routes>
                </BrowserRouter>
            </UserProvider>
        </div>
    )
}
