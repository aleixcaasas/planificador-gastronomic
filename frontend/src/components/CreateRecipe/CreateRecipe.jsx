import { useUser } from '../../context/UserContext.jsx'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import handleUpload from '../common.jsx'

function CreateRecipe({ visible, onVisibilityChange }) {
    const { user, axios } = useUser()
    const [allIngredients, setAllIngredients] = useState([])
    const [searchedIngredients, setSearchedIngredients] = useState([])

    const [recipe, setRecipe] = useState({
        title: '',
        description: '',
        parsed_ingredients: [],
        steps: [],
        difficulty: 'Fácil' || 'Media' || 'Difícil',
        meal: 'Desayuno' || 'Comida' || 'Cena',
        time: '',
        image: ''
    })

    const [selectedFile, setSelectedFile] = useState(null)
    const [preview, setPreview] = useState(null)

    const handleClose = () => {
        onVisibilityChange(false)
    }

    const handleFileChange = (event) => {
        const file = event.target.files[0]
        if (file) {
            setSelectedFile(file)
            setRecipe({ ...recipe, image: file.name })
            setPreview(URL.createObjectURL(file))
        }
    }

    const [showAddIngredientModal, setShowAddIngredientModal] = useState(false)

    function filterIngredients(e) {
        const search = e.target.value
        const filteredIngredients = allIngredients.filter((ingredient) =>
            ingredient.name.toLowerCase().includes(search.toLowerCase())
        )
        setSearchedIngredients(filteredIngredients)
    }

    const handleRecipeChange = (e) => {
        setRecipe({ ...recipe, [e.target.name]: e.target.value })
    }

    const validateRecipeForm = () => {
        const { title, description, parsed_ingredients, steps, difficulty, meal, time, image } = recipe

        if (title === '' || description === '' || parsed_ingredients.length === 0 || steps.length === 0) {
            return false
        }

        if (difficulty !== 'Fácil' && difficulty !== 'Media' && difficulty !== 'Difícil') {
            return false
        }

        if (meal !== 'Desayuno' && meal !== 'Comida' && meal !== 'Cena') {
            return false
        }

        if (time === '' || image === '') {
            return false
        }

        return true
    }

    async function searchIngredients() {
        setShowAddIngredientModal(true)
        if (allIngredients.length === 0) {
            try {
                const response = await axios.get(`${import.meta.env.VITE_API_URL}/ingredients`)
                setAllIngredients(response.data.sort((a, b) => (a.name > b.name ? 1 : -1)))
                setSearchedIngredients(response.data.sort((a, b) => (a.name > b.name ? 1 : -1)))
            } catch (error) {
                toast.error('Error al buscar los ingredientes')
                console.log(error)
            }
        }
    }

    const addIngredient = (ingredient) => {
        setRecipe({ ...recipe, ingredients: [...recipe.ingredients, ingredient] })
        toast.success('Ingrediente añadido correctamente')
    }

    const deleteIngredient = (ingredient_id) => {
        setShowAddIngredientModal(false)
        const newIngredients = recipe.ingredients.filter((ingredient) => ingredient.id !== ingredient_id)
        setRecipe({ ...recipe, ingredients: newIngredients })
        toast.success('Ingrediente eliminado correctamente')
    }

    const createRecipe = async () => {
        if (!validateRecipeForm()) {
            toast.error('Todos los campos son oblgaotorios')
            return
        }

        try {
            handleUpload(selectedFile)
            const response = await axios.post(`${import.meta.env.VITE_API_URL}/new-recipe`, {
                ...recipe,
                user_id: user.user_id
            })
            toast.success('Receta creada correctamente')
            handleClose()
        } catch (error) {
            toast.error('Error al crear la receta')
            console.log(error)
        }
    }

    return (
        <>
            <div className='relative flex flex-col items-center justify-center mx-2 mt-2 '>
                <h1 className='text-2xl font-bold leading-5'>CREA TU PROPIA RECETA</h1>
                <input
                    type='text'
                    name='title'
                    value={recipe.title}
                    className='w-7/12 border-2 border-false-orange rounded-lg py-2 px-4 my-4'
                    placeholder='Nombre de la receta'
                    onChange={handleRecipeChange}
                />

                <input
                    type='text'
                    name='description'
                    value={recipe.description}
                    className='w-7/12 border-2 border-false-orange rounded-lg py-2 px-4 my-4'
                    placeholder='Descripción'
                    onChange={handleRecipeChange}
                />

                <div
                    name='ingredients'
                    value={recipe.ingredients}
                    className='w-7/12 border-2 border-false-orange rounded-lg py-2 px-4 my-4 gap-1 flex flex-row flex-wrap bg-[#FFF]'
                    onClick={() => searchIngredients()}
                    onChange={handleRecipeChange}
                >
                    {recipe.parsed_ingredients.length === 0
                        ? 'Añade ingredientes'
                        : recipe.parsed_ingredients.map((ingredient, key) => (
                              <label
                                  id={key}
                                  className='px-2 w-auto bg-false-orange rounded-xl flex justify-center items-center gap-1'
                              >
                                  {ingredient.name}
                                  <button
                                      onClick={(e) => {
                                          e.stopPropagation()
                                          deleteIngredient(ingredient.id)
                                      }}
                                  >
                                      <svg
                                          xmlns='http://www.w3.org/2000/svg'
                                          width='1em'
                                          height='1.1em'
                                          viewBox='0 0 23 23'
                                      >
                                          <path
                                              fill='#000'
                                              d='M9 3v1H4v2h1v13a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V6h1V4h-5V3H9M7 6h10v13H7V6m2 2v9h2V8H9m4 0v9h2V8h-2Z'
                                          />
                                      </svg>
                                  </button>
                              </label>
                          ))}
                </div>

                <input
                    type='textarea'
                    name='steps'
                    value={recipe.steps}
                    className='w-7/12 border-2 border-false-orange rounded-lg py-2 px-4 my-4'
                    placeholder='Pasos a seguir'
                    onChange={handleRecipeChange}
                />

                <select
                    name='meal'
                    className='w-7/12 border-2 border-false-orange rounded-lg py-2 px-4 my-4'
                    onChange={handleRecipeChange}
                    defaultValue=''
                >
                    <option value='' disabled>
                        Selecciona una comida
                    </option>
                    <option value='Desayuno'>Desayuno</option>
                    <option value='Comida'>Comida</option>
                    <option value='Cena'>Cena</option>
                </select>

                <input
                    type='number'
                    name='time'
                    value={recipe.time}
                    className='w-7/12 border-2 border-false-orange rounded-lg py-2 px-4 my-4'
                    placeholder='Tiempo en minutos'
                    onChange={handleRecipeChange}
                />

                <select
                    name='difficulty'
                    className='w-7/12 border-2 border-false-orange rounded-lg py-2 px-4 my-4'
                    onChange={handleRecipeChange}
                    defaultValue=''
                >
                    <option value='' disabled>
                        Selecciona una dificultad
                    </option>
                    <option value='Fácil'>Fácil</option>
                    <option value='Media'>Media</option>
                    <option value='Difícil'>Difícil</option>
                </select>

                <input type='file' onChange={handleFileChange} />
                {preview && (
                    <img className=' my-3 h-40 w-full object-cover rounded-xl' src={preview} alt='Vista previa' />
                )}

                <button
                    className='w-7/12 bg-false-orange rounded-xl px-auto py-2 my-4 font-semibold'
                    onClick={() => createRecipe()}
                >
                    CREAR RECETA
                </button>
            </div>
            {showAddIngredientModal && (
                <div
                    className='fixed inset-0 flex justify-center items-center bg-false-blue bg-opacity-70'
                    onClick={() => setShowAddIngredientModal(false)}
                >
                    <div
                        className='bg-[#FFF] p-8 rounded-xl shadow-lg border-false-orange border-2 w-11/12 h-5/6'
                        onClick={(e) => e.stopPropagation()}
                    >
                        <h2 className='text-center font-bold text-2xl font-mono'>Añadir ingrediente</h2>
                        <form action=''>
                            <input
                                className=' border-2 border-false-orange rounded-full py-2 px-4 w-full my-4'
                                placeholder='Nombre de la receta'
                                onChange={(e) => filterIngredients(e)}
                                style={{ outline: 'none' }}
                            />
                        </form>
                        <div className='flex flex-col gap-2 overflow-y-scroll h-5/6'>
                            {searchedIngredients.map((ingredient, index) => (
                                <div
                                    key={ingredient.id}
                                    className={`flex flex-row w-full justify-between px-1 pb-1 ${
                                        index !== allIngredients.length - 1 ? 'border-b-1 border-false-light-gray' : ''
                                    }`}
                                >
                                    <div className='flex flex-row'>
                                        <img
                                            src={ingredient.image}
                                            alt={ingredient.name}
                                            className='rounded w-24 h-16 object-cover mr-1'
                                        />
                                        <p>{ingredient.name}</p>
                                    </div>
                                    {recipe.parsed_ingredients.find((i) => i.id === ingredient.id) ? (
                                        <button>
                                            <svg
                                                xmlns='http://www.w3.org/2000/svg'
                                                width='1.5em'
                                                height='1.5em'
                                                viewBox='0 0 23 23'
                                            >
                                                <path
                                                    fill='#80cf5b'
                                                    d='M12 2C6.486 2 2 6.486 2 12s4.486 10 10 10 10-4.486 10-10S17.514 2 12 2zm0 18c-4.411 0-8-3.589-8-8s3.589-8 8-8 8 3.589 8 8-3.589 8-8 8z'
                                                ></path>
                                                <path
                                                    fill='#80cf5b'
                                                    d='M9.999 13.587 7.7 11.292l-1.412 1.416 3.713 3.705 6.706-6.706-1.414-1.414z'
                                                ></path>
                                            </svg>
                                        </button>
                                    ) : (
                                        <button onClick={() => addIngredient(ingredient)}>
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
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}

export default CreateRecipe
