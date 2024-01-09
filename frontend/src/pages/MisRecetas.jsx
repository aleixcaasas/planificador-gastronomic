import { NavBar } from '../components/NavBar/NavBar.jsx'
import MyRecipes from '../components/MyRecipes/MyRecipes.jsx'
import { Toaster } from 'sonner'

function MisRecetas() {
    return (
        <>
            <div className='w-[29.375rem] h-[29.375rem] left-[-3.5rem] top-[40rem] fixed bg-false-blue bg-opacity-70 rounded-full -z-10' />
            <div className='w-[31.25rem] h-[31.25rem] left-[-12.5rem] top-[15.625rem] fixed bg-false-blue bg-opacity-30 rounded-full -z-10' />
            <div className='w-[26.25rem] h-[26.25rem] left-[3.1875rem] top-[0.625rem] fixed bg-false-blue bg-opacity-70 rounded-full -z-10' />
            <NavBar />
            <MyRecipes />
            <Toaster position='top-center' richColors />
        </>
    )
}

export default MisRecetas
