import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import { UserProvider } from './context/UserContext'

export default function Router() {
    return (
        <div className='h-screen w-screen'>
            <UserProvider>
                <BrowserRouter>
                    <Routes>
                        <Route path='/' element={<Home />} />
                    </Routes>
                </BrowserRouter>
            </UserProvider>
        </div>
    )
}
