import './Planification.css'
import { useUser } from '../../context/UserContext.jsx'
import { useEffect, useState } from 'react'
import { WeeklyPlan } from '../../models/user.model.jsx'
import { toast } from 'sonner'
import { Button } from '@nextui-org/react'
import { formatRecipeTitleForUrl } from '../common.jsx'

function Planification() {
    const { user, axios } = useUser()
    const [planning, setPlanning] = useState()
    const [isAlternateView, setIsAlternateView] = useState(true)
    const weekdays = {
        monday: 'LUNES',
        tuesday: 'MARTES',
        wednesday: 'MIERCOLES',
        thursday: 'JUEVES',
        friday: 'VIERNES',
        saturday: 'SABADO',
        sunday: 'DOMINGO'
    }

    const [showAddRecipeModal, setShowAddRecipeModal] = useState(false)
    const [recipes, setRecipes] = useState([])
    const [actualMeal, setActualMeal] = useState([])
    const [searchedRecipes, setSearchedRecipes] = useState([])

    const [showDeletePlanningModal, setShowDeletePlanningModal] = useState(false)

    useEffect(() => {
        const fetchPlanning = async () => {
            try {
                const user_id = user.user_id
                const response = await axios.post(`${import.meta.env.VITE_API_URL}/planning`, { user_id: user_id })
                const plan = new WeeklyPlan(response.data)
                setPlanning(plan)
            } catch (error) {
                console.log(error)
            }
        }
        fetchPlanning()
    }, [])

    async function addRecipe(recipe) {
        try {
            const user_id = user.user_id
            const recipe_id = recipe['id']
            const recipe_title = recipe['title']
            const recipe_image = recipe['image']
            const recipe_time = recipe['time']
            const [day, meal] = actualMeal
            const response = await axios.post(`${import.meta.env.VITE_API_URL}/add-meal`, {
                user_id,
                recipe_id,
                day,
                meal,
                recipe_title,
                recipe_image,
                recipe_time
            })
            const plan = new WeeklyPlan(response.data)
            setPlanning(plan)
            setShowAddRecipeModal(false)
            setActualMeal([])
        } catch (error) {
            toast.error('Error al añadir la receta')
            console.log(error)
        }
    }

    async function deleteRecipe(day, meal, recipe) {
        try {
            const user_id = user.user_id
            const recipe_id = recipe['recipe_id']
            const response = await axios.post(`${import.meta.env.VITE_API_URL}/delete-meal`, {
                user_id,
                recipe_id,
                day,
                meal
            })
            const plan = new WeeklyPlan(response.data)
            setPlanning(plan)
        } catch (error) {
            toast.error('Error al eliminar la receta')
            console.log(error)
        }
    }

    async function deletePlanning() {
        try {
            const user_id = user.user_id
            const response = await axios.post(`${import.meta.env.VITE_API_URL}/delete-planning`, { user_id })
            const plan = new WeeklyPlan(response.data)
            setPlanning(plan)
            setShowDeletePlanningModal(false)
        } catch (error) {
            toast.error('Error al eliminar la planificación')
            console.log(error)
        }
    }

    async function addPlanningToShoppingList() {
        try {
            const user_id = user.user_id
            const response = await axios.post(`${import.meta.env.VITE_API_URL}/add-planning`, {
                user_id
            })
            toast.success('Todos los ingredientes se han añadido a la lista de la compra')
        } catch (error) {
            toast.error('Error al añadir la planificación a la lista de la compra')
            console.log(error)
        }
    }

    function filterRecipes(e) {
        const search = e.target.value
        const filteredRecipes = recipes.filter((recipe) => recipe.title.toLowerCase().includes(search.toLowerCase()))
        setSearchedRecipes(filteredRecipes)
    }

    async function searchRecipes(day, meal) {
        setShowAddRecipeModal(true)
        setActualMeal([day, meal])
        try {
            const response = await axios.get(`${import.meta.env.VITE_API_URL}/recipes`)
            setRecipes(response.data.sort((a, b) => (a.title > b.title ? 1 : -1)))
            setSearchedRecipes(response.data.sort((a, b) => (a.title > b.title ? 1 : -1)))
        } catch (error) {
            toast.error('Error al añadir la receta')
            console.log(error)
        }
    }

    const formatTime = (time) => {
        if (!time) {
            return 'No disponible'
        }
        const parts = time.split(' ')
        if (parts.length >= 2) {
            return `${parts[0]} ${parts[1].substring(0, 3)}`
        }
        return time
    }

    function dishCard(meals, day, meal) {
        if (!meals || meals.length === 0)
            return (
                <div className='w-full h-full flex items-center justify-center'>
                    <button onClick={() => searchRecipes(day, meal)}>
                        <svg xmlns='http://www.w3.org/2000/svg' width='2.5em' height='2.5em' viewBox='0 0 24 24'>
                            <path
                                fill='#7a7979'
                                d='M12 4c4.411 0 8 3.589 8 8s-3.589 8-8 8s-8-3.589-8-8s3.589-8 8-8m0-2C6.477 2 2 6.477 2 12s4.477 10 10 10s10-4.477 10-10S17.523 2 12 2zm5 9h-4V7h-2v4H7v2h4v4h2v-4h4v-2z'
                            />
                        </svg>
                    </button>
                </div>
            )
        else
            return (
                <>
                    <div className='h-full flex justify-center mx-2'>
                        <button onClick={() => searchRecipes(day, meal)}>
                            <svg xmlns='http://www.w3.org/2000/svg' width='1em' height='1em' viewBox='0 0 24 24'>
                                <path
                                    fill='#7a7979'
                                    d='M12 4c4.411 0 8 3.589 8 8s-3.589 8-8 8s-8-3.589-8-8s3.589-8 8-8m0-2C6.477 2 2 6.477 2 12s4.477 10 10 10s10-4.477 10-10S17.523 2 12 2zm5 9h-4V7h-2v4H7v2h4v4h2v-4h4v-2z'
                                />
                            </svg>
                        </button>
                    </div>
                    {meals.map((dish) => (
                        <div
                            key={dish['recipe_id']}
                            className={`w-32 bg-[#F4F6F7]  shadow-md rounded-md my-1 p-1 flex flex-col items-center ${
                                !isAlternateView ? 'mr-2 justify-start ' : 'mx-auto'
                            } `}
                        >
                            <a href={`/receta/${formatRecipeTitleForUrl(dish['recipe_title'])}`}>
                                <img
                                    src={dish['recipe_image']}
                                    className='rounded h-16 min-h-[4rem] w-24 object-cover'
                                />
                            </a>

                            <div className='w-full rounded-md bg-opacity-80'>
                                <div className=' text-xs flex flex-row py-1 text-[#7a7979] items-center justify-between'>
                                    <div className='flex flex-row'>
                                        <svg
                                            className='h-4 mr-1'
                                            xmlns='http://www.w3.org/2000/svg'
                                            width='1.1em'
                                            height='1.1em'
                                            viewBox='0 0 23 23'
                                        >
                                            <path
                                                fill='#000'
                                                d='M15 1H9v2h6V1zm-4 13h2V8h-2v6zm8.03-6.61l1.42-1.42c-.43-.51-.9-.99-1.41-1.41l-1.42 1.42A8.962 8.962 0 0 0 12 4c-4.97 0-9 4.03-9 9s4.02 9 9 9a8.994 8.994 0 0 0 7.03-14.61zM12 20c-3.87 0-7-3.13-7-7s3.13-7 7-7s7 3.13 7 7s-3.13 7-7 7z'
                                            />
                                        </svg>
                                        <p className='h-4 leading-[1.125rem] '>{formatTime(dish['recipe_time'])}</p>
                                    </div>
                                    <button onClick={() => deleteRecipe(day, meal, dish)}>
                                        <svg
                                            xmlns='http://www.w3.org/2000/svg'
                                            width='1.1em'
                                            height='1.1em'
                                            viewBox='0 0 23 23'
                                        >
                                            <path
                                                fill='#000'
                                                d='M9 3v1H4v2h1v13a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V6h1V4h-5V3H9M7 6h10v13H7V6m2 2v9h2V8H9m4 0v9h2V8h-2Z'
                                            />
                                        </svg>
                                    </button>
                                </div>
                                <a href={`/receta/${formatRecipeTitleForUrl(dish['recipe_title'])}`}>
                                    <p className='text-sm  font-black text-center'>{dish['recipe_title']}</p>
                                </a>
                            </div>
                        </div>
                    ))}
                </>
            )
    }

    function dailyPlanification() {
        if (!planning) {
            return <div>Cargando...</div>
        }

        return Object.entries(planning).map(([day, meals]) => (
            <table key={day} className='w-11/12 mx-auto shadow-md rounded-lg my-2.5'>
                <thead>
                    <tr>
                        <th
                            colSpan={3}
                            className='bg-false-orange overflow- font-semibold py-1 rounded-tl-lg rounded-tr-lg'
                        >
                            {weekdays[day]}
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
                        <td className='w-1/3 rounded-bl-lg'>{dishCard(meals.breakfast, day, 'breakfast')}</td>
                        <td className='w-1/3 border-x-1 border-false-light-gray'>
                            {dishCard(meals.lunch, day, 'lunch')}
                        </td>
                        <td className='w-1/3 rounded-br-lg'>{dishCard(meals.dinner, day, 'dinner')}</td>
                    </tr>
                </tbody>
            </table>
        ))
    }

    function alternateDailyPlanification() {
        return (
            <div className='gap-2 mx-auto my-2.5 flex flex-row'>
                <div className='flex flex-col gap-2 w-10 min-w-max'>
                    <div className='text-sm font-semibold rounded-tl-lg py-1.5 h-8'></div>
                    {Object.keys(planning).map((day) => (
                        <div
                            className='col-span-1 bg-false-orange rounded-lg py-1.5 px-1 text-center h-36 font-bold flex items-center justify-center'
                            style={{ writingMode: 'tb' }}
                        >
                            {weekdays[day]}
                        </div>
                    ))}
                </div>
                <div className='flex flex-row gap-2'>
                    <div className='w-auto min-w-[10rem] flex flex-col gap-2'>
                        <div className=' text-sm font-semibold bg-false-orange rounded-lg py-1.5 text-center h-8'>
                            DESAYUNO
                        </div>
                        {Object.entries(planning).map(([day, meals]) => (
                            <div className='bg-[#FFF] bg-opacity-80 rounded-lg h-36 flex flex-row justify-center'>
                                {dishCard(meals.breakfast, day, 'breakfast')}
                            </div>
                        ))}
                    </div>

                    <div className='w-auto min-w-[10rem] flex flex-col gap-2'>
                        <div className=' text-sm font-semibold bg-false-orange rounded-lg py-1.5 text-center h-8'>
                            COMIDA
                        </div>
                        {Object.entries(planning).map(([day, meals]) => (
                            <div className='bg-[#FFF] bg-opacity-80 rounded-lg h-36 flex flex-row justify-center'>
                                {dishCard(meals.lunch, day, 'lunch')}
                            </div>
                        ))}
                    </div>

                    <div className='w-auto min-w-[10rem] flex flex-col gap-2'>
                        <div className='col-span-3 text-sm font-semibold bg-false-orange rounded-lg py-1.5 text-center rounded-tr-lg h-8'>
                            CENA
                        </div>
                        {Object.entries(planning).map(([day, meals]) => (
                            <div className='bg-[#FFF] bg-opacity-80 rounded-lg h-36 flex flex-row justify-center'>
                                {dishCard(meals.dinner, day, 'dinner')}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        )
    }

    function toggleView() {
        setIsAlternateView(!isAlternateView)
    }

    return (
        <>
            <div className='relative flex flex-col items-center justify-center mx-2 my-2 h-full overflow-scroll '>
                <div className='flex flex-row items-center justify-between w-11/12'>
                    <Button
                        isIconOnly
                        color='danger'
                        variant='ghost'
                        aria-label='Eliminar todos los ingredientes'
                        onClick={toggleView}
                        className='flex items-center justify-center'
                    >
                        <svg
                            version='1.0'
                            xmlns='http://www.w3.org/2000/svg'
                            width='1.4rem'
                            height='1.4rem'
                            viewBox='0 0 50.000000 50.000000'
                            preserveAspectRatio='xMidYMid meet'
                        >
                            <g
                                transform='translate(0.000000,50.000000) scale(0.100000,-0.100000)'
                                fill='#000000'
                                stroke='none'
                            >
                                <path d='M170 467 c-49 -16 -123 -93 -138 -143 -18 -61 -16 -74 13 -74 21 0 25 5 25 28 0 42 41 104 85 129 69 39 168 28 228 -26 18 -15 18 -16 -5 -21 -14 -4 -24 -14 -26 -28 -3 -21 0 -22 62 -22 l66 0 0 65 c0 59 -2 65 -21 65 -12 0 -23 -8 -26 -20 -5 -18 -7 -17 -42 11 -60 48 -141 61 -221 36z' />
                                <path d='M203 315 c-17 -7 -39 -25 -48 -39 -16 -24 -16 -28 0 -52 9 -14 33 -33 53 -41 32 -13 42 -14 76 -2 22 8 48 26 59 41 19 26 19 28 3 53 -17 25 -71 55 -98 55 -7 -1 -27 -7 -45 -15z m79 -32 c22 -20 23 -41 1 -65 -20 -22 -41 -23 -65 -1 -22 20 -23 41 -1 65 20 22 41 23 65 1z' />
                                <path d='M224 266 c-10 -26 4 -48 28 -44 17 2 23 10 23 28 0 18 -6 26 -23 28 -13 2 -25 -3 -28 -12z' />
                                <path d='M430 223 c0 -43 -41 -105 -85 -130 -69 -39 -168 -28 -228 26 -18 15 -18 16 5 21 14 4 24 14 26 28 3 21 0 22 -62 22 l-66 0 0 -65 c0 -58 2 -65 20 -65 15 0 20 7 20 26 l0 26 42 -36 c63 -55 137 -69 222 -44 54 16 128 90 144 144 18 61 16 74 -13 74 -21 0 -25 -5 -25 -27z' />
                            </g>
                        </svg>
                    </Button>

                    <h1 className=' text-2xl font-bold leading-5'>PLANIFICACIÓN</h1>
                    <div className='flex gap-2'>
                        <Button
                            isIconOnly
                            color='danger'
                            variant='ghost'
                            aria-label='Eliminar todos los ingredientes'
                            onClick={() => addPlanningToShoppingList()}
                            className='flex items-center justify-center'
                        >
                            <svg xmlns='http://www.w3.org/2000/svg' width='1.5rem' height='1.5rem' viewBox='0 0 24 24'>
                                <path
                                    fill='#000000'
                                    d='M7 22q-.825 0-1.412-.587T5 20q0-.825.588-1.412T7 18q.825 0 1.413.588T9 20q0 .825-.587 1.413T7 22m10 0q-.825 0-1.412-.587T15 20q0-.825.588-1.412T17 18q.825 0 1.413.588T19 20q0 .825-.587 1.413T17 22M6.15 6l2.4 5h7l2.75-5zM5.2 4h14.75q.575 0 .875.513t.025 1.037l-3.55 6.4q-.275.5-.737.775T15.55 13H8.1L7 15h11q.425 0 .713.288T19 16q0 .425-.288.713T18 17H7q-1.125 0-1.7-.987t-.05-1.963L6.6 11.6L3 4H2q-.425 0-.712-.288T1 3q0-.425.288-.712T2 2h1.625q.275 0 .525.15t.375.425zm3.35 7h7z'
                                />
                            </svg>
                        </Button>
                        <Button
                            isIconOnly
                            color='danger'
                            variant='ghost'
                            aria-label='Eliminar todos los ingredientes'
                            onClick={() => setShowDeletePlanningModal(true)}
                            className='flex items-center justify-center'
                        >
                            <svg xmlns='http://www.w3.org/2000/svg' width='1.5rem' height='1.5rem' viewBox='0 0 24 24'>
                                <path
                                    fill='#000'
                                    d='M9 3v1H4v2h1v13a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V6h1V4h-5V3H9M7 6h10v13H7V6m2 2v9h2V8H9m4 0v9h2V8h-2Z'
                                />
                            </svg>
                        </Button>
                    </div>
                </div>
                {isAlternateView ? dailyPlanification() : alternateDailyPlanification()}
            </div>
            {showAddRecipeModal && (
                <div
                    className='fixed inset-0 flex justify-center items-center bg-false-blue bg-opacity-70'
                    onClick={() => setShowAddRecipeModal(false)}
                >
                    <div
                        className='bg-[#FFF] p-8 rounded-xl shadow-lg border-false-orange border-2 w-11/12 h-4/6'
                        onClick={(e) => e.stopPropagation()}
                    >
                        <h2 className='text-center font-bold text-2xl font-mono'>Añadir receta</h2>
                        <form action=''>
                            <input
                                className=' border-2 border-false-orange rounded-full py-2 px-4 w-full my-4'
                                type='search'
                                name='recipe-title'
                                id=''
                                placeholder='Nombre de la receta'
                                onChange={(e) => filterRecipes(e)}
                                style={{ outline: 'none' }}
                            />
                        </form>
                        <div className='flex flex-col gap-2 overflow-y-scroll h-5/6'>
                            {searchedRecipes.map((recipe, index) => (
                                <div
                                    className={`flex flex-row w-full justify-between px-1 pb-1 ${
                                        index != recipes.length - 1 ? 'border-b-1 border-false-light-gray' : ''
                                    } `}
                                >
                                    <div className='flex flex-row'>
                                        <img src={recipe.image} className='rounded w-24 h-16 object-cover mr-1' />
                                        <div>
                                            <p>{recipe.title}</p>
                                            <p>{formatTime(recipe.time)}</p>
                                        </div>
                                    </div>
                                    <button onClick={() => addRecipe(recipe)}>
                                        <svg
                                            xmlns='http://www.w3.org/2000/svg'
                                            width='1.5em'
                                            height='1.5em'
                                            viewBox='0 0 23 23'
                                        >
                                            <path
                                                fill='#7a7979'
                                                d='M12 4c4.411 0 8 3.589 8 8s-3.589 8-8 8s-8-3.589-8-8s3.589-8 8-8m0-2C6.477 2 2 6.477 2 12s4.477 10 10 10s10-4.477 10-10S17.523 2 12 2zm5 9h-4V7h-2v4H7v2h4v4h2v-4h4v-2z'
                                            />
                                        </svg>
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}
            {showDeletePlanningModal && (
                <div
                    className='fixed inset-0 flex justify-center items-center bg-false-blue bg-opacity-70'
                    onClick={() => setShowDeletePlanningModal(false)}
                >
                    <div
                        className='bg-[#FFF] w-11/12 p-8 rounded-xl shadow-lg border-false-orange border-2'
                        onClick={(e) => e.stopPropagation()}
                    >
                        <h2 className='text-center font-bold text-2xl font-mono mb-2'>
                            Estas seguro que quieres eliminar la planificación?
                        </h2>
                        <div className='flex flex-row gap-3 w-full items-center justify-center'>
                            <button
                                className='bg-[#d2d2d2] rounded-lg py-1.5 px-3 text-white font-bold'
                                onClick={() => setShowDeletePlanningModal(false)}
                            >
                                Cancelar
                            </button>
                            <button
                                className='bg-danger rounded-lg py-1.5 px-3 text-white font-bold'
                                onClick={() => deletePlanning()}
                            >
                                Eliminar Planificación
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}

export default Planification
