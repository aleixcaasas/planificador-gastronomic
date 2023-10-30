import { BrowserRouter, Routes, Route } from 'react-router-dom'
import LoginRegisterPage from './pages/LoginRegisterPage'

export default function Router() {
    return (
        <div className='h-screen w-screen'>
            <BrowserRouter>
                <Routes>
                    <Route path='/' element={<LoginRegisterPage />} />
                </Routes>
            </BrowserRouter>
        </div>
    )
}
