import Router from './Router.jsx'
import { Toaster } from 'sonner'

function App() {
    return (
        <>
            <Router />
            <Toaster position='top-center' richColors closeButton duration={1500} />
        </>
    )
}

export default App
