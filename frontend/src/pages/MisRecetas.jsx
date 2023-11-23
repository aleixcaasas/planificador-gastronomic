import LoginRegister from '../components/LoginRegister/LoginRegister'
import { NavBar } from '../components/NavBar/NavBar.jsx'
import { useUser } from '../context/UserContext.jsx'

function MisRecetas() {
    const { user, isAuthenticated } = useUser()

    return isAuthenticated ? (
        <>
            <div className='w-[29.375rem] h-[29.375rem] left-[-3.5rem] top-[40rem] absolute bg-false-blue bg-opacity-70 rounded-full' />
            <div className='w-[31.25rem] h-[31.25rem] left-[-12.5rem] top-[15.625rem] absolute bg-false-blue bg-opacity-30 rounded-full' />
            <div className='w-[26.25rem] h-[26.25rem] left-[3.1875rem] top-[0.625rem] absolute bg-false-blue bg-opacity-70 rounded-full' />
            <NavBar />
        </>
    ) : (
        <>
            <div className='w-[29.375rem] h-[29.375rem] left-[-3.5rem] top-[40rem] absolute bg-false-blue bg-opacity-70 rounded-full -z-10' />
            <div className='w-[31.25rem] h-[31.25rem] left-[-12.5rem] top-[15.625rem] absolute bg-false-blue bg-opacity-30 rounded-full -z-10' />
            <div className='w-[26.25rem] h-[26.25rem] left-[3.1875rem] top-[0.625rem] absolute bg-false-blue bg-opacity-70 rounded-full -z-10' />
            <LoginRegister />
        </>
    )
}

export default MisRecetas
