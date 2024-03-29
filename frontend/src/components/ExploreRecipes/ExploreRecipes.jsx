import { useUser } from '../../context/UserContext.jsx'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import { Tabs, Tab } from '@nextui-org/react'
import { RecipeCard } from '../common.jsx'
import disappointedFace from '../../assets/disappointed-face.svg'

function ExploreRecipes() {
    const { user, axios } = useUser()

    const [recipesList, setRecipesList] = useState([])
    const [searchedRecipesList, setsearchedRecipesList] = useState([])

    useEffect(() => {
        const fetchUserRecipesList = async () => {
            try {
                const response = await axios.get(`${import.meta.env.VITE_API_URL}/recipes`)
                setRecipesList(response.data)
                setsearchedRecipesList(response.data)
            } catch (error) {
                toast.error(error.message)
            }
        }
        fetchUserRecipesList()
    }, [user, axios])

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
            filteredRecipes.map((recipe, index) => <RecipeCard recipe={recipe} key={index} />)
        ) : (
            <div className='bg-[#FFF] p-8 rounded-xl shadow-lg border-false-orange border-2 flex flex-col items-center justify-center'>
                No hay recetas a mostrar con estos filtros
                <img src={disappointedFace} height='120px' className='mt-4' alt='' />
            </div>
        )
    }

    return (
        <div className='relative flex flex-col items-center justify-center mx-2 mt-2 '>
            <h1 className='text-2xl font-bold leading-5'>EXPLORAR RECETAS</h1>
            <div className='w-full flex flex-row gap-3 items-center justify-center'>
                <input
                    className='w-11/12 border-2 border-false-orange rounded-full py-2 px-4 my-4'
                    placeholder='Nombre de la receta'
                    onChange={(e) => filterRecipes(e)}
                />
            </div>
            <Tabs color='danger' size='lg'>
                <Tab key='todo' title='Todo' className='w-full flex flex-col justify-center items-center gap-4'>
                    {renderTabContent(null)}
                </Tab>
                <Tab key='desayuno' title='Desayuno' className='w-full flex flex-col justify-center items-center gap-4'>
                    {renderTabContent('Desayuno')}
                </Tab>
                <Tab key='comida' title='Comida' className='w-full flex flex-col justify-center items-center gap-4'>
                    {renderTabContent('Comida')}
                </Tab>
                <Tab key='cena' title='Cena' className='w-full flex flex-col justify-center items-center gap-4'>
                    {renderTabContent('Cena')}
                </Tab>
            </Tabs>
        </div>
    )
}

export default ExploreRecipes
