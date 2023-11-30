import './Planification.css'
import { useUser } from '../../context/UserContext.jsx'
import { useEffect, useState } from 'react'

function Planification() {
    const { setUser, setIsAuthenticated, axios } = useUser()
    const { planning, setPlanning } = useState()
    const [isAlternateView, setIsAlternateView] = useState(false)
    const weekdays = ['LUNES', 'MARTES', 'MIERCOLES', 'JUEVES', 'VIERNES', 'SABADO', 'DOMINGO']

    useEffect(() => {
        const fetchPlanning = async () => {
            try {
                const response = await axios.get('/planning')
                setPlanning(response.data)
            } catch (error) {
                console.log(error)
            }
        }
        fetchPlanning()
    }, [planning])

    function dailyPlanification(day) {
        return (
            <table className='w-11/12 mx-auto shadow-md rounded-lg my-2.5'>
                <thead>
                    <tr>
                        <th
                            colSpan={3}
                            className='bg-false-orange overflow- font-semibold py-1 rounded-tl-lg rounded-tr-lg'
                        >
                            {day}
                        </th>
                    </tr>
                    <tr className='text-center text-sm bg-[#FFF] bg-opacity-80'>
                        <th className='w-1/3 py-1'>DESAYUNO</th>
                        <th className='w-1/3 border-x-1 border-false-light-gray'>COMIDA</th>
                        <th className='w-1/3'>CENA</th>
                    </tr>
                </thead>
                <tbody>
                    <tr className=' h-20 bg-[#FFF] rounded-bl-lg rounded-br-lg bg-opacity-80'>
                        <td className='w-1/3 rounded-bl-lg'></td>
                        <td className='w-1/3 border-x-1 border-false-light-gray'></td>
                        <td className='w-1/3 rounded-br-lg'></td>
                    </tr>
                </tbody>
            </table>
        )
    }

    function alternateDailyPlanification() {
        return (
            <div className='grid grid-cols-10 gap-2 w-full mx-auto my-2.5'>
                <div className='col-span-1 text-sm font-semibold rounded-tl-lg py-1.5 h-8'></div>
                <div className='col-span-3 text-sm font-semibold bg-false-orange rounded-lg py-1.5 text-center h-8'>
                    DESAYUNO
                </div>
                <div className='col-span-3 text-sm font-semibold bg-false-orange rounded-lg py-1.5 text-center h-8'>
                    COMIDA
                </div>
                <div className='col-span-3 text-sm font-semibold bg-false-orange rounded-lg py-1.5 text-center rounded-tr-lg h-8'>
                    CENA
                </div>

                {weekdays.map((day, index) => (
                    <>
                        <div
                            className='col-span-1 bg-false-orange rounded-lg py-1.5 px-1 text-center h-full font-bold flex items-center justify-center'
                            style={{ writingMode: 'tb' }}
                        >
                            {day}
                        </div>
                        <div className='col-span-3 bg-[#FFF] bg-opacity-80 rounded-lg h-36'></div>
                        <div className='col-span-3 bg-[#FFF] bg-opacity-80 rounded-lg h-36'></div>
                        <div className='col-span-3 bg-[#FFF] bg-opacity-80 rounded-lg h-36'></div>
                    </>
                ))}
            </div>
        )
    }

    function toggleView() {
        setIsAlternateView(!isAlternateView)
    }

    return (
        <div
            className={`w-screen h-screen relative flex flex-col items-center justify-center px-2 pt-[22.5rem] pb-[5rem] ${
                isAlternateView ? ' overflow-y-scroll' : 'overflow-scroll pt-[24rem] pb-[4rem] '
            }`}
        >
            <div className='flex flex-row gap-10'>
                <button onClick={toggleView} className='float-left absolute -left-[-2rem] -top-[-1rem]'>
                    <svg
                        version='1.0'
                        xmlns='http://www.w3.org/2000/svg'
                        width='1.5rem'
                        height='1.5rem'
                        viewBox='0 0 50.000000 50.000000'
                        preserveAspectRatio='xMidYMid meet'
                    >
                        <g
                            transform='translate(0.000000,50.000000) scale(0.100000,-0.100000)'
                            fill='#000000'
                            stroke='none'
                        >
                            <path
                                d='M170 467 c-49 -16 -123 -93 -138 -143 -18 -61 -16 -74 13 -74 21 0
25 5 25 28 0 42 41 104 85 129 69 39 168 28 228 -26 18 -15 18 -16 -5 -21 -14
-4 -24 -14 -26 -28 -3 -21 0 -22 62 -22 l66 0 0 65 c0 59 -2 65 -21 65 -12 0
-23 -8 -26 -20 -5 -18 -7 -17 -42 11 -60 48 -141 61 -221 36z'
                            />
                            <path
                                d='M203 315 c-17 -7 -39 -25 -48 -39 -16 -24 -16 -28 0 -52 9 -14 33
-33 53 -41 32 -13 42 -14 76 -2 22 8 48 26 59 41 19 26 19 28 3 53 -17 25 -71
55 -98 55 -7 -1 -27 -7 -45 -15z m79 -32 c22 -20 23 -41 1 -65 -20 -22 -41
-23 -65 -1 -22 20 -23 41 -1 65 20 22 41 23 65 1z'
                            />
                            <path
                                d='M224 266 c-10 -26 4 -48 28 -44 17 2 23 10 23 28 0 18 -6 26 -23 28
-13 2 -25 -3 -28 -12z'
                            />
                            <path
                                d='M430 223 c0 -43 -41 -105 -85 -130 -69 -39 -168 -28 -228 26 -18 15
-18 16 5 21 14 4 24 14 26 28 3 21 0 22 -62 22 l-66 0 0 -65 c0 -58 2 -65 20
-65 15 0 20 7 20 26 l0 26 42 -36 c63 -55 137 -69 222 -44 54 16 128 90 144
144 18 61 16 74 -13 74 -21 0 -25 -5 -25 -27z'
                            />
                        </g>
                    </svg>
                </button>
                <h1 className=' text-2xl font-bold mb-2'>PLANIFICACIÓN</h1>
            </div>

            {isAlternateView ? (
                <>{weekdays.map((day) => dailyPlanification(day))}</>
            ) : (
                <>{alternateDailyPlanification()}</>
            )}
        </div>
    )
}

export default Planification
