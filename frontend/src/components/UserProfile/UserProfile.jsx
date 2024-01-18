import { useSubmit } from 'react-router-dom'
import { useUser } from '../../context/UserContext.jsx'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'

export function UserProfile() {
    const { axios } = useUser()
    const [userData, setUserData] = useState(null)
    const [profile, setProfile] = useState({ full_name: '', user_name: '', password: '', confirmPassword: '' })
    const [profileImage, setProfileImage] = useState(null)
    const [imagePreview, setImagePreview] = useState(null)

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await axios.get(`${import.meta.env.VITE_API_URL}/user`)
                setUserData(response.data)
                setProfile({ ...profile, full_name: response.data.name, user_name: response.data.username })
                setImagePreview(response.data.image)
            } catch (error) {
                console.log(error)
            }
        }
        fetchUserData()
    }, [axios])

    const handleChange = (e) => {
        setProfile({ ...profile, [e.target.name]: e.target.value })
    }

    const handleImageChange = (e) => {
        const file = e.target.files[0]
        if (file) {
            setProfileImage(file)
            setImagePreview(URL.createObjectURL(file))
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (profile.password && profile.password !== profile.confirmPassword) {
            toast.warning('Las contraseñas no coinciden')
            return
        }

        const formData = new FormData()
        formData.append('full_name', profile.full_name)
        formData.append('user_name', profile.user_name)
        if (profile.password) {
            formData.append('password', profile.password)
        }
        if (profileImage) {
            formData.append('image', profileImage)
        }

        try {
            const response = await axios.put(`${import.meta.env.VITE_API_URL}/update-user`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            })
            setUserData(response.data)
            toast.success('Perfil actualizado correctamente')
        } catch (error) {
            console.log(error)
        }
    }

    return (
        <div className='w-full flex justify-center'>
            {userData && (
                <div className='relative bg-[#ffffff] rounded-xl w-11/12 flex flex-col items-center justify-center  p-3 border-false-orange border-2 shadow-2xl mb-3'>
                    <form className='p-8 pt-2 w-full flex flex-col items-center justify-center' onSubmit={handleSubmit}>
                        <h1 className='font-bold text-3xl mb-3'>Bienvenido {userData.name}</h1>
                        <img src={imagePreview} className='w-9/12 rounded-3xl' alt='Imagen de perfil' />
                        <p className='text-sm mt-1 text-false-dark-gray'>Cambiar imagen:</p>
                        <input
                            type='file'
                            className='text-sm mt-1 text-false-dark-gray hover:cursor-pointer'
                            onChange={handleImageChange}
                        />
                        <div className='py-3 px-0 w-10/12 relative flex items-center'>
                            <svg
                                className='absolute top-[1.75rem]'
                                xmlns='http://www.w3.org/2000/svg'
                                width='1em'
                                height='1em'
                                viewBox='0 0 448 512'
                            >
                                <path
                                    fill='#3d424a'
                                    d='M224 256a128 128 0 1 0 0-256a128 128 0 1 0 0 256zm-45.7 48C79.8 304 0 383.8 0 482.3C0 498.7 13.3 512 29.7 512h388.6c16.4 0 29.7-13.3 29.7-29.7c0-98.5-79.8-178.3-178.3-178.3h-91.4z'
                                />
                            </svg>
                            <input
                                type='text'
                                name='full_name'
                                className='p-3 pl-6 font-medium input w-full'
                                placeholder='Nombre'
                                value={profile.full_name}
                                onChange={handleChange}
                            />
                        </div>
                        <div className='py-3 px-0 w-10/12 relative flex items-center'>
                            <svg
                                className='absolute top-[1.75rem]'
                                xmlns='http://www.w3.org/2000/svg'
                                width='1em'
                                height='1em'
                                viewBox='0 0 24 24'
                            >
                                <path
                                    fill='#3d424a'
                                    d='m20 8l-8 5l-8-5V6l8 5l8-5m0-2H4c-1.11 0-2 .89-2 2v12a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2Z'
                                />
                            </svg>
                            <input
                                type='text'
                                name='user_name'
                                className='p-3 pl-6 w-full font-medium input'
                                placeholder='Nombre de usuario'
                                value={profile.user_name}
                                onChange={handleChange}
                            />
                        </div>
                        <div className='py-3 px-0 w-10/12 relative flex items-center'>
                            <svg
                                className='absolute top-[1.75rem]'
                                xmlns='http://www.w3.org/2000/svg'
                                width='1em'
                                height='1em'
                                viewBox='0 0 448 512'
                            >
                                <path
                                    fill='#3d424a'
                                    d='M144 144v48h160v-48c0-44.2-35.8-80-80-80s-80 35.8-80 80zm-64 48v-48C80 64.5 144.5 0 224 0s144 64.5 144 144v48h16c35.3 0 64 28.7 64 64v192c0 35.3-28.7 64-64 64H64c-35.3 0-64-28.7-64-64V256c0-35.3 28.7-64 64-64h16z'
                                />
                            </svg>
                            <input
                                type='password'
                                name='password'
                                className=' p-3 pl-6 w-full font-medium input'
                                placeholder='Contraseña'
                                onChange={handleChange}
                            />
                        </div>
                        <div className='py-3 px-0 w-10/12 relative flex items-center'>
                            <svg
                                className='absolute top-[1.75rem]'
                                xmlns='http://www.w3.org/2000/svg'
                                width='1em'
                                height='1em'
                                viewBox='0 0 448 512'
                            >
                                <path
                                    fill='#3d424a'
                                    d='M144 144v48h160v-48c0-44.2-35.8-80-80-80s-80 35.8-80 80zm-64 48v-48C80 64.5 144.5 0 224 0s144 64.5 144 144v48h16c35.3 0 64 28.7 64 64v192c0 35.3-28.7 64-64 64H64c-35.3 0-64-28.7-64-64V256c0-35.3 28.7-64 64-64h16z'
                                />
                            </svg>
                            <input
                                type='password'
                                name='confirmPassword'
                                className=' p-3 pl-6 w-full font-medium input'
                                placeholder='Repetir contraseña'
                                onChange={handleChange}
                            />
                        </div>
                        <button
                            type='submit'
                            className='submit text-base mt-8 py-3 rounded-xl bg-false-orange font-bold flex items-center justify-center w-full cursor-pointer uppercase'
                        >
                            <span>Actualizar perfil</span>
                        </button>
                    </form>
                </div>
            )}
        </div>
    )
}

export default UserProfile
