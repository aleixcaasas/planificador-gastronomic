import { useUser } from '../../context/UserContext.jsx'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import { Tabs, Tab } from '@nextui-org/react'
import { recipeCard } from '../common.jsx'
import CreateRecipe from '../CreateRecipe/CreateRecipe.jsx'

function MyRecipes() {
    const { user, axios } = useUser()

    const [recipesList, setRecipesList] = useState([])
    const [searchedRecipesList, setsearchedRecipesList] = useState([])

    const [showNewRecipe, setShowNewRecipe] = useState(false)

    useEffect(() => {
        const fetchUserRecipesList = async () => {
            try {
                const user_id = user.user_id
                const response = await axios.post(`${import.meta.env.VITE_API_URL}/user-recipes`, { user_id: user_id })
                setRecipesList(response.data)
                setsearchedRecipesList(response.data)
            } catch (error) {
                toast.error(error.message)
            }
        }
        fetchUserRecipesList()
    }, [user, axios, showNewRecipe])

    const handleCreateRecipeVisibility = (isVisible) => {
        setShowNewRecipe(isVisible)
    }

    function filterRecipes(e) {
        const search = e.target.value
        const filteredRecipes = recipesList.filter((recipe) =>
            recipe.title.toLowerCase().includes(search.toLowerCase())
        )
        setsearchedRecipesList(filteredRecipes)
    }

    const renderTabContent = (mealType) => {
        const filteredRecipes =
            searchedRecipesList?.filter((recipe) => (mealType ? recipe.meal === mealType : true)) || []
        return filteredRecipes.length > 0 ? (
            filteredRecipes.map((recipe, key) => recipeCard(recipe, key))
        ) : (
            <div className='bg-[#FFF] p-8 rounded-xl shadow-lg border-false-orange border-2 flex flex-col items-center justify-center'>
                No hay recetas a mostrar con estos filtros
                <img src='src\assets\disappointed-face.svg' height='120px' className='mt-4' alt='' />
            </div>
        )
    }

    return (
        <>
            {!showNewRecipe && (
                <div className='relative flex flex-col items-center justify-center mx-2 mt-2 '>
                    <h1 className='text-2xl font-bold leading-5'>MIS RECETAS</h1>
                    <div className='w-full flex flex-row gap-3 items-center justify-center'>
                        <input
                            className='w-7/12 border-2 border-false-orange rounded-full py-2 px-4 my-4'
                            placeholder='Nombre de la receta'
                            onChange={(e) => filterRecipes(e)}
                        />
                        <button
                            className='w-4/12 bg-false-orange rounded-xl px-auto py-2 my-4 font-semibold'
                            onClick={() => setShowNewRecipe(true)}
                        >
                            CREAR RECETA
                        </button>
                    </div>
                    <Tabs color='danger' size='lg'>
                        <Tab key='todo' title='Todo' className='w-full flex flex-col justify-center items-center gap-3'>
                            {renderTabContent(null)}
                        </Tab>
                        <Tab
                            key='desayuno'
                            title='Desayuno'
                            className='w-full flex flex-col justify-center items-center gap-3'
                        >
                            {renderTabContent('Desayuno')}
                        </Tab>
                        <Tab
                            key='comida'
                            title='Comida'
                            className='w-full flex flex-col justify-center items-center gap-3'
                        >
                            {renderTabContent('Comida')}
                        </Tab>
                        <Tab key='cena' title='Cena' className='w-full flex flex-col justify-center items-center gap-3'>
                            {renderTabContent('Cena')}
                        </Tab>
                    </Tabs>
                </div>
            )}
            {showNewRecipe && (
                <CreateRecipe visible={showNewRecipe} onVisibilityChange={handleCreateRecipeVisibility} />
            )}
        </>
    )
}

export default MyRecipes
