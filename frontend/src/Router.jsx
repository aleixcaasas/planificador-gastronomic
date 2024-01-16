import Home from './pages/Home'
import MisRecetas from './pages/MisRecetas'
import Perfil from './pages/Perfil'
import ListaCompra from './pages/ListaCompra'
import ExplorarRecetas from './pages/ExplorarRecetas'
import ProtectedRoutes from './ProtectedRoutes'
import { UserProvider } from './context/UserContext'
import { RecipeProvider } from './context/RecipeContext'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import DetallesReceta from './pages/DetallesReceta'

export default function Router() {
    return (
        <UserProvider>
            <RecipeProvider>
                <BrowserRouter>
                    <Routes>
                        <Route path='/' element={<Home />} />
                        <Route element={<ProtectedRoutes />}>
                            <Route path='/perfil' element={<Perfil />} />
                            <Route path='/mis-recetas' element={<MisRecetas />} />
                            <Route path='/lista-compra' element={<ListaCompra />} />
                            <Route path='/explorar-recetas' element={<ExplorarRecetas />} />
                            <Route path='/receta/:nombreReceta' element={<DetallesReceta />} />
                        </Route>
                    </Routes>
                </BrowserRouter>
            </RecipeProvider>
        </UserProvider>
    )
}
