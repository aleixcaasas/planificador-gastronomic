import { useUser } from '../../context/UserContext'
import { useState } from 'react'
import Cookies from 'js-cookie'
import { Link } from 'react-router-dom'
import favicon from '../../assets/favicon.png'

export function NavBar() {
    const { user, axios, setIsAuthenticated, setUser } = useUser()

    const [isUserDropdownOpen, setUserDropdownOpen] = useState(false)
    const [isMenuDropdownOpen, setMenuDropdownOpen] = useState(false)

    const toggleUserDropdown = () => {
        setUserDropdownOpen(!isUserDropdownOpen)
        setMenuDropdownOpen(false)
    }
    const toggleMenuDropdown = () => {
        setMenuDropdownOpen(!isMenuDropdownOpen)
        setUserDropdownOpen(false)
    }

    const signOut = async () => {
        const cookies = Cookies.get()
        if (cookies.token) {
            try {
                await axios.post(`${import.meta.env.VITE_API_URL}/logout`)
                Cookies.remove('token')
                setIsAuthenticated(false)
                setUser(null)
            } catch (error) {
                console.log(error)
            }
        }
    }

    return (
        <nav className='bg-[#FFF] border-gray-200 z-50 bg-opacity-75'>
            <div className='max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4'>
                <Link to='/' className='flex items-center space-x-3 rtl:space-x-reverse'>
                    <img src={favicon} className='h-8' />
                    <span className='self-center text-2xl font-semibold whitespace-nowrap'>Menu Vital</span>
                </Link>
                <div className='flex items-center space-x-3 md:space-x-0 rtl:space-x-reverse'>
                    <button
                        type='button'
                        className='flex text-sm bg-gray-800 rounded-full focus:ring-2 focus:ring-false-orange'
                        onClick={toggleUserDropdown}
                    >
                        <img
                            className='w-8 h-8 rounded-full'
                            src={
                                user !== null && user.image !== null
                                    ? user.image
                                    : 'https://cdn-icons-png.flaticon.com/512/666/666201.png'
                            }
                            alt='user photo'
                        />
                    </button>
                    <button
                        data-collapse-toggle='navbar-user'
                        type='button'
                        className='inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-500 rounded-lg hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-false-orange '
                        onClick={toggleMenuDropdown}
                    >
                        <svg
                            className='w-5 h-5'
                            aria-hidden='true'
                            xmlns='http://www.w3.org/2000/svg'
                            fill='none'
                            viewBox='0 0 17 14'
                        >
                            <path stroke='currentColor' d='M1 1h15M1 7h15M1 13h15' />
                        </svg>
                    </button>
                </div>
                <div
                    className={`absolute left-1/2 top-10 my-4 text-base list-none bg-[#FFF] divide-y divide-gray-100 rounded-lg shadow-md z-50 ${
                        !isUserDropdownOpen ? 'hidden' : ''
                    }`}
                    id='user-dropdown'
                >
                    <div className='px-4 py-3'>
                        <span className='block text-sm'>
                            <b>{user !== null && user.full_name !== null ? user.full_name : ''}</b>
                        </span>
                        <span className='block text-sm truncate'>
                            {user !== null && user.email !== null ? user.email : ''}
                        </span>
                    </div>
                    <ul className='p-2' aria-labelledby='user-menu-button'>
                        <li className='hover:bg-false-white rounded-lg'>
                            <Link to='/perfil' className='block px-4 py-2 text-sm'>
                                Perfil
                            </Link>
                        </li>
                        <li className='hover:bg-false-white rounded-lg'>
                            <a onClick={signOut} className='block px-4 py-2 text-sm hover:cursor-pointer'>
                                Cerrar sesión
                            </a>
                        </li>
                    </ul>
                </div>
                <div
                    className={`items-center justify-between w-[95%] absolute top-16 left-1/2 -translate-x-[52%] md:w-1/2 mx-2 z-50 ${
                        !isMenuDropdownOpen ? 'hidden' : ''
                    }`}
                    id='menu-dropdown'
                >
                    <ul className='flex flex-col font-medium p-2 border border-false-light-gray shadow-md rounded-lg bg-[#FFF]'>
                        <li className='hover:bg-false-white rounded-lg'>
                            <Link to='/' className='block py-2 px-3'>
                                Inicio
                            </Link>
                        </li>
                        <li className='hover:bg-false-white rounded-lg'>
                            <Link to='/mis-recetas' className='block py-2 px-3'>
                                Mis Recetas
                            </Link>
                        </li>
                        <li className='hover:bg-false-white rounded-lg'>
                            <Link to='/lista-compra' className='block py-2 px-3'>
                                Lista de la compra
                            </Link>
                        </li>
                        <li className='hover:bg-false-white rounded-lg'>
                            <Link to='/explorar-recetas' className='block py-2 px-3'>
                                Explorar recetas
                            </Link>
                        </li>
                    </ul>
                </div>
            </div>
        </nav>
    )
}
