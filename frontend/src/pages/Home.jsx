import LoginRegister from '../components/LoginRegister/LoginRegister'
import Planification from '../components/Planification/Planification'
import { NavBar } from '../components/NavBar/NavBar.jsx'
import { useUser } from '../context/UserContext.jsx'

function Home() {
    const { user, isAuthenticated } = useUser()

    return isAuthenticated ? (
        <>
            <NavBar />
            <Planification />
        </>
    ) : (
        <LoginRegister />
    )
}

export default Home
