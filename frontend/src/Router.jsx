import Home from './pages/Home'
import MisRecetas from './pages/MisRecetas'
import Perfil from './pages/Perfil'
import ListaCompra from './pages/ListaCompra'
import ExplorarRecetas from './pages/ExplorarRecetas'
import ProtectedRoutes from './ProtectedRoutes'
import { UserProvider } from './context/UserContext'
import { BrowserRouter, Routes, Route } from 'react-router-dom'

export default function Router() {
    return (
        <div className='h-screen w-screen'>
            <UserProvider>
                <BrowserRouter>
                    <Routes>
                        <Route path='/' element={<Home />} />
                        <Route element={<ProtectedRoutes />}>
                            <Route path='/perfil' element={<Perfil />} />
                            <Route path='/mis-recetas' element={<MisRecetas />} />
                            <Route path='/lista-compra' element={<ListaCompra />} />
                            <Route path='/explorar-recetas' element={<ExplorarRecetas />} />
                        </Route>
                    </Routes>
                </BrowserRouter>
            </UserProvider>
        </div>
    )
}
