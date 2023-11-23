import { useUser } from '../../context/UserContext'
import { useState } from 'react'

export function NavBar() {
    const { user } = useUser()

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

    return (
        <nav className='bg-[#FFF] border-gray-200 z-50 bg-opacity-75'>
            <div className='max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4'>
                <a href='/' className='flex items-center space-x-3 rtl:space-x-reverse'>
                    <img src='src\assets\favicon.png' className='h-8' />
                    <span className='self-center text-2xl font-semibold whitespace-nowrap'>Menu Vital</span>
                </a>
                <div className='flex items-center space-x-3 md:space-x-0 rtl:space-x-reverse'>
                    <button
                        type='button'
                        className='flex text-sm bg-gray-800 rounded-full focus:ring-2 focus:ring-false-orange'
                        onClick={toggleUserDropdown}
                    >
                        <img
                            className='w-8 h-8 rounded-full'
                            src={user.photoURL || 'https://cdn-icons-png.flaticon.com/512/666/666201.png'}
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
                            <path
                                stroke='currentColor'
                                stroke-linecap='round'
                                stroke-linejoin='round'
                                stroke-width='2'
                                d='M1 1h15M1 7h15M1 13h15'
                            />
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
                            <b>{user.name || 'Aleix Casas'}</b>
                        </span>
                        <span className='block text-sm truncate'>{user.email}</span>
                    </div>
                    <ul className='p-2' aria-labelledby='user-menu-button'>
                        <li className='hover:bg-false-white rounded-lg'>
                            <a href='/perfil' className='block px-4 py-2 text-sm'>
                                Perfil
                            </a>
                        </li>
                        <li className='hover:bg-false-white rounded-lg'>
                            <a href='#' className='block px-4 py-2 text-sm'>
                                Cerrar sesión
                            </a>
                        </li>
                    </ul>
                </div>
                <div
                    className={`items-center justify-between w-[95%] absolute bg-[#FFF] top-16 left-1/2 -translate-x-[52%] md:w-1/2 mx-2 ${
                        !isMenuDropdownOpen ? 'hidden' : ''
                    }`}
                    id='menu-dropdown'
                >
                    <ul className='flex flex-col font-medium p-2 border border-false-light-gray shadow-md rounded-lg  '>
                        <li className='hover:bg-false-white rounded-lg'>
                            <a href='/' className='block py-2 px-3'>
                                Inicio
                            </a>
                        </li>
                        <li className='hover:bg-false-white rounded-lg'>
                            <a href='mis-recetas' className='block py-2 px-3'>
                                Mis Recetas
                            </a>
                        </li>
                        <li className='hover:bg-false-white rounded-lg'>
                            <a href='lista-compra' className='block py-2 px-3'>
                                Lista de la compra
                            </a>
                        </li>
                        <li className='hover:bg-false-white rounded-lg'>
                            <a href='explorar-recetas' className='block py-2 px-3'>
                                Explorar recetas
                            </a>
                        </li>
                    </ul>
                </div>
            </div>
        </nav>
    )
}
