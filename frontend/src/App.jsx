import Router from './Router.jsx'
import { Toaster } from 'sonner'

function App() {
    return (
        <>
            <Router />
            <Toaster position='top-center' richColors closeButton duration={2000} />
        </>
    )
}

export default App
