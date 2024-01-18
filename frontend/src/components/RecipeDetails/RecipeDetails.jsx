import { useUser } from '../../context/UserContext.jsx'
import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useRecipe } from '../../context/RecipeContext.jsx'

function RecipeDetails() {
    const { user, axios } = useUser()
    const { nombreReceta } = useParams()
    const { selectedRecipeId } = useRecipe()
    const [recipe, setRecipe] = useState(null)

    useEffect(() => {
        const fetchRecipe = async () => {
            try {
                if (!selectedRecipeId) {
                    const response = await axios.get(`${import.meta.env.VITE_API_URL}/recipe/${nombreReceta}`)
                    setRecipe(response.data)
                } else {
                    const response = await axios.get(`${import.meta.env.VITE_API_URL}/recipe/${selectedRecipeId}`)
                    setRecipe(response.data)
                }
            } catch (error) {
                console.log(error)
            }
        }
        fetchRecipe()
    }, [axios, nombreReceta])

    const difficultyIcon = (difficulty) => {
        if (difficulty === 'Fácil') {
            return (
                <svg xmlns='http://www.w3.org/2000/svg' width='2em' height='2em' viewBox='0 0 24 24'>
                    <g fill='none' stroke='#000000' stroke-linejoin='round'>
                        <circle cx='12' cy='12' r='9' stroke-linecap='round' stroke-width='1.5' />
                        <path stroke-width='2.25' d='M9.01 9.5v.01H9V9.5zm6 0v.01H15V9.5z' />
                        <path
                            stroke-linecap='round'
                            stroke-width='1.5'
                            d='M15.465 14A3.999 3.999 0 0 1 12 16a3.998 3.998 0 0 1-3.465-2'
                        />
                    </g>
                </svg>
            )
        } else if (difficulty === 'Moderada') {
            return (
                <svg xmlns='http://www.w3.org/2000/svg' width='2em' height='2em' viewBox='0 0 24 24'>
                    <g fill='none' stroke='#000000'>
                        <circle
                            cx='12'
                            cy='12'
                            r='9'
                            stroke-linecap='round'
                            stroke-linejoin='round'
                            stroke-width='1.5'
                        />
                        <path stroke-linejoin='round' stroke-width='2.25' d='M9.01 9.5v.01H9V9.5zm6 0v.01H15V9.5z' />
                        <path stroke-linecap='round' stroke-width='1.5' d='M9 15h6' />
                    </g>
                </svg>
            )
        } else if (difficulty === 'Difícil') {
            return (
                <svg xmlns='http://www.w3.org/2000/svg' width='2em' height='2em' viewBox='0 0 24 24'>
                    <g fill='none' stroke='#000000' stroke-linejoin='round'>
                        <circle cx='12' cy='12' r='9' stroke-linecap='round' stroke-width='1.5' />
                        <path stroke-width='2.25' d='M9.01 9.5v.01H9V9.5zm6 0v.01H15V9.5z' />
                        <path
                            stroke-linecap='round'
                            stroke-width='1.5'
                            d='M8.535 16A3.998 3.998 0 0 1 12 14c1.48 0 2.773.804 3.465 2'
                        />
                    </g>
                </svg>
            )
        }
    }

    return (
        <div className='w-full flex justify-center'>
            {recipe && (
                <div className='relative bg-[#ffffff] rounded-xl w-11/12 flex flex-col items-center justify-center  p-3 border-false-orange border-2 shadow-2xl mb-3'>
                    <div className='flex flex-col items-center justify-center'>
                        <h1 className='text-2xl font-bold leading-5 mb-3'>{recipe.title}</h1>

                        <img
                            src={recipe.image}
                            alt={recipe.title}
                            className='rounded-xl w-full h-52 object-cover mb-3'
                        />

                        <div className='w-full flex flex-row gap-3 items-center justify-center'>
                            <div className='flex flex-col  overflow-scroll h-52 w-8/12 border-1 border-false-blue rounded-lg p-2 pl-4'>
                                <p className='w-full text-center font-bold border-b-1 border-false-light-gray'>
                                    INGREDIENTES
                                </p>
                                {recipe.parsed_ingredients.map((ingredient, index) => (
                                    <div
                                        key={index}
                                        className={`flex flex-row w-full justify-between px-1  ${
                                            index != recipe.parsed_ingredients.length - 1
                                                ? 'border-b-1 border-false-light-gray'
                                                : ''
                                        } `}
                                    >
                                        <div className='flex flex-row py-1'>
                                            <img
                                                src={ingredient.image}
                                                className='rounded w-16 h-10 object-cover mr-1'
                                            />
                                            <p className='h-full flex items-center text-sm'>{ingredient.name}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <div className='flex flex-col items-center w-4/12 gap-3'>
                                <div className='w-full flex flex-row gap-2 justify-between items-center'>
                                    <svg
                                        xmlns='http://www.w3.org/2000/svg'
                                        width='2em'
                                        height='2em'
                                        viewBox='0 0 16 16'
                                    >
                                        <path
                                            fill='#000000'
                                            d='m3.5 0l-1 5.5c-.146.805 1.782 1.181 1.75 2L4 14c-.038 1 1 1 1 1s1.038 0 1-1l-.25-6.5c-.031-.818 1.733-1.18 1.75-2L6.5 0H6l.25 4l-.75.5L5.25 0h-.5L4.5 4.5L3.75 4L4 0zM12 0c-.736 0-1.964.655-2.455 1.637C9.135 2.373 9 4.018 9 5v2.5c0 .818 1.09 1 1.5 1L10 14c-.09.996 1 1 1 1s1 0 1-1z'
                                        />
                                    </svg>
                                    <label className='px-2 py-1 w-auto bg-false-blue rounded-xl h-min '>
                                        {recipe.meal}
                                    </label>
                                </div>
                                <div className='w-full flex flex-row gap-2 justify-between items-center'>
                                    <svg
                                        xmlns='http://www.w3.org/2000/svg'
                                        width='2em'
                                        height='2em'
                                        viewBox='0 0 23 23'
                                    >
                                        <path
                                            fill='#000'
                                            d='M15 1H9v2h6V1zm-4 13h2V8h-2v6zm8.03-6.61l1.42-1.42c-.43-.51-.9-.99-1.41-1.41l-1.42 1.42A8.962 8.962 0 0 0 12 4c-4.97 0-9 4.03-9 9s4.02 9 9 9a8.994 8.994 0 0 0 7.03-14.61zM12 20c-3.87 0-7-3.13-7-7s3.13-7 7-7s7 3.13 7 7s-3.13 7-7 7z'
                                        />
                                    </svg>
                                    <label className='px-2 py-1 bg-false-orange rounded-xl h-min'>{recipe.time}</label>
                                </div>
                                <div className='w-full flex flex-row gap-2 justify-between items-center'>
                                    {difficultyIcon(recipe.difficulty)}
                                    <label className='px-2 py-1 bg-false-blue rounded-xl h-min'>
                                        {recipe.difficulty}
                                    </label>
                                </div>
                            </div>
                        </div>
                        <div className='flex flex-col mt-4 p-2 border-false-orange border-1 rounded-md shadow-lg'>
                            <p className='text-md font-bold leading-5 text-center mb-2'>INSTRUCCIONES</p>
                            <ol className=' list-decimal pl-4 text-sm'>
                                {recipe.steps.map((instruction, key) => (
                                    <li className='mb-2' key={key}>
                                        {instruction}
                                    </li>
                                ))}
                            </ol>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default RecipeDetails
