import { useUser } from '../../context/UserContext.jsx'
import { useState } from 'react'
import { toast } from 'sonner'

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
            const validImageTypes = ['image/jpeg', 'image/png', 'image/gif']
            if (validImageTypes.includes(file.type)) {
                setSelectedFile(file)
                setRecipe({ ...recipe, image: file.name })
                setPreview(URL.createObjectURL(file))
            } else {
                toast.error('Por favor, selecciona un archivo de imagen válido.')
                event.target.value = ''
            }
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
        if (e.target.name === 'steps') {
            const stepsArray = e.target.value.split('\n')
            setRecipe({ ...recipe, steps: stepsArray })
        } else {
            setRecipe({ ...recipe, [e.target.name]: e.target.value })
        }
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
        setRecipe({ ...recipe, parsed_ingredients: [...recipe.parsed_ingredients, ingredient] })
        toast.success('Ingrediente añadido correctamente')
    }

    const deleteIngredient = (ingredient_id) => {
        setShowAddIngredientModal(false)
        const newIngredients = recipe.parsed_ingredients.filter((ingredient) => ingredient.id !== ingredient_id)
        setRecipe({ ...recipe, parsed_ingredients: newIngredients })
        toast.success('Ingrediente eliminado correctamente')
    }

    const createRecipe = async () => {
        if (!validateRecipeForm()) {
            toast.error('Todos los campos son obligatorios')
            return
        }

        const formData = new FormData()
        for (const key in recipe) {
            if (key === 'image' && selectedFile) {
                formData.append('image_data', selectedFile)
            } else if (key === 'parsed_ingredients') {
                formData.append(key, JSON.stringify(recipe[key]))
            } else {
                formData.append(key, recipe[key])
            }
        }

        try {
            await axios.post(`${import.meta.env.VITE_API_URL}/new-recipe`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
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
            <div className='relative flex flex-col items-center justify-center mx-2 mt-2'>
                <h1 className='text-2xl font-bold leading-5'>CREA TU PROPIA RECETA</h1>

                <label className=' mt-3 text-md font-bold'>Nombre</label>
                <div className='w-full flex flex-row gap-2 items-center justify-center mb-1'>
                    <svg
                        className='mr-2'
                        xmlns='http://www.w3.org/2000/svg'
                        width='2.2em'
                        height='2.2em'
                        viewBox='0 0 16 16'
                    >
                        <path
                            fill='currentColor'
                            d='M6.5 2a.5.5 0 0 0 0 1h1v10h-1a.5.5 0 0 0 0 1h3a.5.5 0 0 0 0-1h-1V3h1a.5.5 0 0 0 0-1zM4 4h2.5v1H4a1 1 0 0 0-1 1v3.997a1 1 0 0 0 1 1h2.5v1H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2m8 6.997H9.5v1H12a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2H9.5v1H12a1 1 0 0 1 1 1v3.997a1 1 0 0 1-1 1'
                        />
                    </svg>
                    <input
                        type='text'
                        name='title'
                        value={recipe.title}
                        className='w-8/12 border-2 border-false-orange rounded-lg py-2 px-4'
                        placeholder='Nombre de la receta'
                        onChange={handleRecipeChange}
                    />
                </div>

                <label className='mt-2 text-md font-bold'>Descripción</label>
                <div className='w-full flex flex-row gap-2 items-center justify-center mb-1'>
                    <svg
                        className='mr-2'
                        xmlns='http://www.w3.org/2000/svg'
                        width='2.2em'
                        height='2.2em'
                        viewBox='0 0 20 20'
                    >
                        <path
                            fill='currentColor'
                            d='M6 10.5a.5.5 0 1 1 1 0a.5.5 0 0 1-1 0m.5 1.5a.5.5 0 1 0 0 1a.5.5 0 0 0 0-1M6 14.5a.5.5 0 1 1 1 0a.5.5 0 0 1-1 0M8.5 10a.5.5 0 0 0 0 1h5a.5.5 0 0 0 0-1zM8 12.5a.5.5 0 0 1 .5-.5h5a.5.5 0 0 1 0 1h-5a.5.5 0 0 1-.5-.5m.5 1.5a.5.5 0 0 0 0 1h5a.5.5 0 0 0 0-1zM6 2a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V7.414a1.5 1.5 0 0 0-.44-1.06l-3.914-3.915A1.5 1.5 0 0 0 10.586 2zM5 4a1 1 0 0 1 1-1h4v3.5A1.5 1.5 0 0 0 11.5 8H15v8a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1zm9.793 3H11.5a.5.5 0 0 1-.5-.5V3.207z'
                        />
                    </svg>
                    <input
                        type='text'
                        name='description'
                        value={recipe.description}
                        className='w-8/12 border-2 border-false-orange rounded-lg py-2 px-4 '
                        placeholder='Descripción'
                        onChange={handleRecipeChange}
                    />
                </div>

                <label className='mt-2 text-md font-bold'>Ingredientes</label>
                <div className='w-full flex flex-row gap-2 items-center justify-center mb-1'>
                    <svg
                        className='mr-2'
                        xmlns='http://www.w3.org/2000/svg'
                        width='2.2em'
                        height='2.2em'
                        viewBox='0 0 20 20'
                    >
                        <path
                            fill='currentColor'
                            d='M4.926 2.238a.5.5 0 0 0-.852.524L7.913 9H2.5a.5.5 0 0 0-.5.5v.5a8 8 0 0 0 16 0v-.5a.5.5 0 0 0-.5-.5h-5.413L7.926 2.238a.5.5 0 0 0-.852.524L10.913 9H9.087zM3.29 12A7.002 7.002 0 0 1 3 10h14c0 .695-.101 1.366-.29 2zm.384 1h12.652a7 7 0 0 1-12.652 0'
                        />
                    </svg>
                    <div
                        name='ingredients'
                        value={recipe.parsed_ingredients}
                        className='w-8/12 border-2 border-false-orange rounded-lg py-2 px-4 gap-1 flex flex-row flex-wrap bg-[#FFF]'
                        onClick={() => searchIngredients()}
                        onChange={handleRecipeChange}
                    >
                        {recipe.parsed_ingredients.length === 0
                            ? 'Añade ingredientes'
                            : recipe.parsed_ingredients.map((ingredient, key) => (
                                  <label
                                      key={key}
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
                </div>

                <label className='mt-2 text-md font-bold'>Pasos a seguir</label>
                <div className='w-full flex flex-row gap-2 items-center justify-center mb-1'>
                    <svg
                        xmlns='http://www.w3.org/2000/svg'
                        width='2.2em'
                        className='mr-2'
                        height='2.2em'
                        viewBox='0 0 256 256'
                    >
                        <path
                            fill='currentColor'
                            d='M224 50h-64a38 38 0 0 0-32 17.55A38 38 0 0 0 96 50H32a14 14 0 0 0-14 14v128a14 14 0 0 0 14 14h64a26 26 0 0 1 26 26a6 6 0 0 0 12 0a26 26 0 0 1 26-26h64a14 14 0 0 0 14-14V64a14 14 0 0 0-14-14M96 194H32a2 2 0 0 1-2-2V64a2 2 0 0 1 2-2h64a26 26 0 0 1 26 26v116.31A37.86 37.86 0 0 0 96 194m130-2a2 2 0 0 1-2 2h-64a37.87 37.87 0 0 0-26 10.32V88a26 26 0 0 1 26-26h64a2 2 0 0 1 2 2Zm-20-96a6 6 0 0 1-6 6h-40a6 6 0 0 1 0-12h40a6 6 0 0 1 6 6m0 32a6 6 0 0 1-6 6h-40a6 6 0 0 1 0-12h40a6 6 0 0 1 6 6m0 32a6 6 0 0 1-6 6h-40a6 6 0 0 1 0-12h40a6 6 0 0 1 6 6'
                        />
                    </svg>
                    <textarea
                        name='steps'
                        value={recipe.steps}
                        className='w-8/12 border-2 border-false-orange rounded-lg py-2 px-4'
                        placeholder='Pasos a seguir (separados por líneas / enter)'
                        onChange={handleRecipeChange}
                    />
                </div>

                <label className='mt-2 text-md font-bold'>Comida</label>
                <div className='w-full flex flex-row gap-2 items-center justify-center mb-1'>
                    <svg
                        className='mr-2'
                        xmlns='http://www.w3.org/2000/svg'
                        width='2.2em'
                        height='2.2em'
                        viewBox='0 0 16 16'
                    >
                        <path
                            fill='currentColor'
                            d='M3.5 1a.5.5 0 0 1 .5.5v3a1.5 1.5 0 0 0 1 1.415V1.5a.5.5 0 0 1 1 0v4.415A1.5 1.5 0 0 0 7 4.5v-3a.5.5 0 0 1 1 0v3a2.5 2.5 0 0 1-2 2.45v7.55a.5.5 0 0 1-1 0V6.95A2.5 2.5 0 0 1 3 4.5v-3a.5.5 0 0 1 .5-.5m6.979 1.479c.159-.16.338-.283.521-.364V7h-1V3.5c0-.337.174-.717.479-1.021M11 8v6.5a.5.5 0 0 0 1 0v-13a.5.5 0 0 0-.5-.5c-.663 0-1.283.326-1.729.771C9.326 2.217 9 2.837 9 3.5v4a.5.5 0 0 0 .5.5z'
                        />
                    </svg>
                    <select
                        name='meal'
                        className='w-8/12 border-2 border-false-orange rounded-lg py-2 px-4 '
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
                </div>

                <label className='mt-2 text-md font-bold'>Tiempo de preparación</label>
                <div className='w-full flex flex-row gap-2 items-center justify-center mb-1'>
                    <svg
                        className='mr-2'
                        xmlns='http://www.w3.org/2000/svg'
                        width='2.2em'
                        height='2.2em'
                        viewBox='0 0 24 24'
                    >
                        <path
                            fill='currentColor'
                            d='M3.5 12a8.5 8.5 0 1 1 17 0a8.5 8.5 0 0 1-17 0M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10s10-4.477 10-10S17.523 2 12 2m-.007 4.648a.75.75 0 0 0-1.493.102v6l.007.102a.75.75 0 0 0 .743.648h4l.102-.007A.75.75 0 0 0 15.25 12H12V6.75z'
                        />
                    </svg>
                    <input
                        type='number'
                        name='time'
                        value={recipe.time}
                        className='w-8/12 border-2 border-false-orange rounded-lg py-2 px-4'
                        placeholder='Tiempo en minutos'
                        onChange={handleRecipeChange}
                    />
                </div>

                <label className='mt-2 text-md font-bold'>Dificultad</label>
                <div className='w-full flex flex-row gap-2 items-center justify-center mb-1'>
                    <svg
                        className='mr-2'
                        xmlns='http://www.w3.org/2000/svg'
                        width='2.2em'
                        height='2.2em'
                        viewBox='0 0 24 24'
                    >
                        <path
                            fill='currentColor'
                            d='M12 16.77q-.31 0-.54-.23q-.23-.23-.23-.54q0-.31.23-.54q.23-.23.54-.23q.31 0 .54.23q.23.23.23.54q0 .31-.23.54q-.23.23-.54.23m0-3.54q-.213 0-.357-.143q-.143-.144-.143-.356V8q0-.213.144-.356q.144-.144.357-.144t.356.144q.143.144.143.356v4.73q0 .213-.144.357t-.357.144m-7.037-1.154q0 1.522.643 2.804q.643 1.282 2.28 2.723v-2.527q0-.213.144-.356t.356-.144q.213 0 .356.144t.144.356v3.461q0 .344-.233.576q-.232.232-.575.232H4.615q-.212 0-.356-.144t-.144-.357q0-.212.144-.356q.144-.143.356-.143h2.59q-1.793-1.561-2.518-3.073q-.725-1.511-.725-3.203q0-2.208 1.148-4.022q1.148-1.813 3.007-2.756q.196-.104.401-.034q.205.069.272.277q.068.207-.02.4q-.09.193-.28.296q-1.592.813-2.56 2.383t-.968 3.463m14.076-.154q0-1.522-.643-2.804q-.643-1.282-2.28-2.723v2.527q0 .213-.144.356t-.356.144q-.213 0-.356-.144t-.144-.356V5.462q0-.344.233-.576q.232-.232.575-.232h3.462q.212 0 .356.144t.144.357q0 .212-.144.356q-.144.143-.356.143h-2.59q1.793 1.561 2.518 3.073q.725 1.511.725 3.203q0 2.208-1.15 4.022t-3.005 2.761q-.196.104-.401.032q-.205-.072-.272-.28q-.068-.207.02-.4q.09-.193.28-.296q1.592-.813 2.56-2.383t.968-3.463'
                        />
                    </svg>
                    <select
                        name='difficulty'
                        className='w-8/12 border-2 border-false-orange rounded-lg py-2 px-4'
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
                </div>

                <label className='mt-2 text-md font-bold'>Imagen</label>
                <div className='w-full flex flex-row gap-2 items-center justify-center mb-1'>
                    <svg
                        className='mr-2'
                        xmlns='http://www.w3.org/2000/svg'
                        width='2.2em'
                        height='2.2em'
                        viewBox='0 0 28 28'
                    >
                        <path
                            fill='currentColor'
                            d='M3 6.75A3.75 3.75 0 0 1 6.75 3h14.5A3.75 3.75 0 0 1 25 6.75v14.5A3.75 3.75 0 0 1 21.25 25H6.75A3.75 3.75 0 0 1 3 21.25zM6.75 4.5A2.25 2.25 0 0 0 4.5 6.75v14.5c0 .361.085.702.236 1.005l7.866-7.688a2 2 0 0 1 2.796 0l7.866 7.688a2.26 2.26 0 0 0 .236-1.005V6.75a2.25 2.25 0 0 0-2.25-2.25zm15.435 18.797l-7.836-7.657a.5.5 0 0 0-.699 0l-7.835 7.657c.285.13.601.203.935.203h14.5c.333 0 .65-.073.934-.203M18.5 11a1 1 0 1 1 0-2a1 1 0 0 1 0 2m0 1.5a2.5 2.5 0 1 0 0-5a2.5 2.5 0 0 0 0 5'
                        />
                    </svg>
                    <div className='flex flex-col'>
                        <input id='fileInput' className='-mt-1' type='file' onChange={handleFileChange} />
                        {preview && (
                            <img
                                className=' my-1 h-40 w-full object-cover rounded-xl'
                                src={preview}
                                alt='Vista previa'
                            />
                        )}
                    </div>
                </div>

                <button
                    className='w-8/12 bg-false-orange rounded-xl px-auto py-2 my-2 font-semibold'
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
                            {searchedIngredients.length <= 0 ? (
                                <div className='w-full h-full flex flex-col items-center justify-center text-xl font-bold text-center'>
                                    Los ingredientes se están cargando...
                                </div>
                            ) : (
                                searchedIngredients.map((ingredient, index) => (
                                    <div
                                        key={ingredient.id}
                                        className={`flex flex-row w-full justify-between px-1 pb-1 ${
                                            index !== allIngredients.length - 1
                                                ? 'border-b-1 border-false-light-gray'
                                                : ''
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
                                ))
                            )}
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}

export default CreateRecipe
