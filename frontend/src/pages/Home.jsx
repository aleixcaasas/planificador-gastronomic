import LoginRegister from '../components/LoginRegister/LoginRegister'
import Planification from '../components/Planification/Planification'
import { useUser } from '../context/UserContext.jsx'

function Home() {
    const { user, isAuthenticated } = useUser()

    return isAuthenticated ? <Planification /> : <LoginRegister />
}

export default Home
