import './LoginRegister.css'
import { Tabs, Tab } from '@nextui-org/react'

function LoginRegister() {
    return (
        <div className='flex items-center justify-center h-screen w-screen'>
            <div className='relative screen'>
                <div className=' relative h-full z-10 flex flex-col items-center'>
                    <Tabs className='flex flex-row items-center justify-center gap-2 pt-10 w-80' color='danger'>
                        <Tab key='Login' title='Iniciar sesión' className='px-4 py-3 rounded-md '>
                            <form className='login-form w-80 p-8 pt-2'>
                                <div className=' py-5 px-0 relative flex items-center'>
                                    <svg
                                        className='absolute top-[2.25rem]'
                                        xmlns='http://www.w3.org/2000/svg'
                                        width='1em'
                                        height='1em'
                                        viewBox='0 0 448 512'
                                    >
                                        <path
                                            fill='#7875b5'
                                            d='M224 256a128 128 0 1 0 0-256a128 128 0 1 0 0 256zm-45.7 48C79.8 304 0 383.8 0 482.3C0 498.7 13.3 512 29.7 512h388.6c16.4 0 29.7-13.3 29.7-29.7c0-98.5-79.8-178.3-178.3-178.3h-91.4z'
                                        />
                                    </svg>
                                    <input
                                        type='text'
                                        className='p-3 pl-6 font-medium w-[75%] input'
                                        placeholder='Correo electrónico'
                                    />
                                </div>
                                <div className='pt-5 px-0 relative flex items-center'>
                                    <svg
                                        className='absolute top-[2.25rem]'
                                        xmlns='http://www.w3.org/2000/svg'
                                        width='0.88em'
                                        height='1em'
                                        viewBox='0 0 448 512'
                                    >
                                        <path
                                            fill='#7875b5'
                                            d='M144 144v48h160v-48c0-44.2-35.8-80-80-80s-80 35.8-80 80zm-64 48v-48C80 64.5 144.5 0 224 0s144 64.5 144 144v48h16c35.3 0 64 28.7 64 64v192c0 35.3-28.7 64-64 64H64c-35.3 0-64-28.7-64-64V256c0-35.3 28.7-64 64-64h16z'
                                        />
                                    </svg>
                                    <input
                                        type='password'
                                        className=' p-3 pl-6 font-medium w-[75%] input'
                                        placeholder='Contraseña'
                                    />
                                </div>
                                <a href='' className='text-xs underline'>
                                    He olvidado mi contraseña
                                </a>
                                <button className='submit text-base mt-8 py-3 rounded-full font-bold flex items-center justify-center w-full cursor-pointer uppercase'>
                                    <span>Iniciar Sesión</span>
                                </button>

                                <div className='line'></div>
                                <button className='text-base mt-8 py-1 rounded-full flex items-center justify-center w-full cursor-pointer bg-[white] border-1 border-false-dark-gray'>
                                    <svg
                                        className='m-2'
                                        xmlns='http://www.w3.org/2000/svg'
                                        width='1.5rem'
                                        height='1.5rem'
                                        viewBox='0 0 32 32'
                                        fill='none'
                                    >
                                        <path
                                            d='M30.0014 16.3109C30.0014 15.1598 29.9061 14.3198 29.6998 13.4487H16.2871V18.6442H24.1601C24.0014 19.9354 23.1442 21.8798 21.2394 23.1864L21.2127 23.3604L25.4536 26.58L25.7474 26.6087C28.4458 24.1665 30.0014 20.5731 30.0014 16.3109Z'
                                            fill='#4285F4'
                                        />
                                        <path
                                            d='M16.2863 29.9998C20.1434 29.9998 23.3814 28.7553 25.7466 26.6086L21.2386 23.1863C20.0323 24.0108 18.4132 24.5863 16.2863 24.5863C12.5086 24.5863 9.30225 22.1441 8.15929 18.7686L7.99176 18.7825L3.58208 22.127L3.52441 22.2841C5.87359 26.8574 10.699 29.9998 16.2863 29.9998Z'
                                            fill='#34A853'
                                        />
                                        <path
                                            d='M8.15964 18.769C7.85806 17.8979 7.68352 16.9645 7.68352 16.0001C7.68352 15.0356 7.85806 14.1023 8.14377 13.2312L8.13578 13.0456L3.67083 9.64746L3.52475 9.71556C2.55654 11.6134 2.00098 13.7445 2.00098 16.0001C2.00098 18.2556 2.55654 20.3867 3.52475 22.2845L8.15964 18.769Z'
                                            fill='#FBBC05'
                                        />
                                        <path
                                            d='M16.2864 7.4133C18.9689 7.4133 20.7784 8.54885 21.8102 9.4978L25.8419 5.64C23.3658 3.38445 20.1435 2 16.2864 2C10.699 2 5.8736 5.1422 3.52441 9.71549L8.14345 13.2311C9.30229 9.85555 12.5086 7.4133 16.2864 7.4133Z'
                                            fill='#EB4335'
                                        />
                                    </svg>
                                    <p className='label_google'>Sign In With Google</p>
                                </button>
                            </form>
                        </Tab>
                        <Tab key='Register' title='Crear cuenta' className='px-4 py-3 rounded-md'>
                            <form className='register-form w-80 p-8 pt-2'>
                                <div className=' py-3 px-0 relative flex items-center'>
                                    <svg
                                        className='absolute top-[1.75rem]'
                                        xmlns='http://www.w3.org/2000/svg'
                                        width='1em'
                                        height='1em'
                                        viewBox='0 0 448 512'
                                    >
                                        <path
                                            fill='#7875b5'
                                            d='M224 256a128 128 0 1 0 0-256a128 128 0 1 0 0 256zm-45.7 48C79.8 304 0 383.8 0 482.3C0 498.7 13.3 512 29.7 512h388.6c16.4 0 29.7-13.3 29.7-29.7c0-98.5-79.8-178.3-178.3-178.3h-91.4z'
                                        />
                                    </svg>
                                    <input
                                        type='text'
                                        className='p-3 pl-6 font-medium w-[75%] input'
                                        placeholder='Nombre'
                                    />
                                </div>
                                <div className=' py-3 px-0 relative flex items-center'>
                                    <svg
                                        className='absolute top-[1.75rem]'
                                        xmlns='http://www.w3.org/2000/svg'
                                        width='1em'
                                        height='1em'
                                        viewBox='0 0 24 24'
                                    >
                                        <path
                                            fill='#7875b5'
                                            d='m20 8l-8 5l-8-5V6l8 5l8-5m0-2H4c-1.11 0-2 .89-2 2v12a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2Z'
                                        />
                                    </svg>
                                    <input
                                        type='text'
                                        className='p-3 pl-6 font-medium w-[75%] input'
                                        placeholder='Correo electrónico'
                                    />
                                </div>
                                <div className='pt-3 px-0 relative flex items-center'>
                                    <svg
                                        className='absolute top-[1.75rem]'
                                        xmlns='http://www.w3.org/2000/svg'
                                        width='0.88em'
                                        height='1em'
                                        viewBox='0 0 448 512'
                                    >
                                        <path
                                            fill='#7875b5'
                                            d='M144 144v48h160v-48c0-44.2-35.8-80-80-80s-80 35.8-80 80zm-64 48v-48C80 64.5 144.5 0 224 0s144 64.5 144 144v48h16c35.3 0 64 28.7 64 64v192c0 35.3-28.7 64-64 64H64c-35.3 0-64-28.7-64-64V256c0-35.3 28.7-64 64-64h16z'
                                        />
                                    </svg>
                                    <input
                                        type='password'
                                        className=' p-3 pl-6 font-medium w-[75%] input'
                                        placeholder='Repetir contraseña'
                                    />
                                </div>
                                <div className='pt-3 px-0 relative flex items-center'>
                                    <svg
                                        className='absolute top-[1.75rem]'
                                        xmlns='http://www.w3.org/2000/svg'
                                        width='0.88em'
                                        height='1em'
                                        viewBox='0 0 448 512'
                                    >
                                        <path
                                            fill='#7875b5'
                                            d='M144 144v48h160v-48c0-44.2-35.8-80-80-80s-80 35.8-80 80zm-64 48v-48C80 64.5 144.5 0 224 0s144 64.5 144 144v48h16c35.3 0 64 28.7 64 64v192c0 35.3-28.7 64-64 64H64c-35.3 0-64-28.7-64-64V256c0-35.3 28.7-64 64-64h16z'
                                        />
                                    </svg>
                                    <input
                                        type='password'
                                        className=' p-3 pl-6 font-medium w-[75%] input'
                                        placeholder='Contraseña'
                                    />
                                </div>
                                <button className='submit text-base mt-8 py-3 rounded-full font-bold flex items-center justify-center w-full cursor-pointer uppercase'>
                                    <span>Crear cuenta</span>
                                </button>
                            </form>
                        </Tab>
                    </Tabs>
                </div>
                <div className='absolute top-0 left-0 right-0 bottom-0 z-0 background'>
                    <span className='shape shape4'></span>
                    <span className='shape shape3'></span>
                    <span className='shape shape2'></span>
                    <span className='shape shape1'></span>
                </div>
            </div>
        </div>
    )
}

export default LoginRegister