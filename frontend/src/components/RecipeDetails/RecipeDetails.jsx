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
                            <div className='flex flex-col items-center justify-center w-4/12'>
                                <label className='px-2 w-auto bg-false-blue rounded-xl'>{recipe.meal}</label>
                                <label className='px-2 bg-false-orange rounded-xl'>{recipe.time}</label>
                                <label className='px-2 bg-false-blue rounded-xl'>{recipe.difficulty}</label>
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
