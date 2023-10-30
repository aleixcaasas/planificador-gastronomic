import { BrowserRouter, Routes, Route } from 'react-router-dom'
import LoginRegisterPage from './pages/LoginRegisterPage'

export default function Router() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path='/' element={<LoginRegisterPage />} />
            </Routes>
        </BrowserRouter>
    )
}
