import { useUser } from '../../context/UserContext.jsx'
import { useEffect, useState } from 'react'
import { Button } from '@nextui-org/react'
import { toast } from 'sonner'

function ShoppingList() {
    const { user, axios } = useUser()
    const [showAddIngredientModal, setShowAddIngredientModal] = useState(false)
    const [shoppingList, setShoppingList] = useState([])

    const [ingredients, setIngredients] = useState([])
    const [searchedIngredients, setSearchedIngredients] = useState([])

    useEffect(() => {
        const fetchShoppingList = async () => {
            try {
                const response = await axios.get(`${import.meta.env.VITE_API_URL}/shoppingList`)
                setShoppingList(response.data.shoppingList)
            } catch (error) {
                toast.error(error.message)
            }
        }
        fetchShoppingList()
    }, [user, axios])

    async function addIngredient(ingredient) {
        try {
            const response = await axios.post(`${import.meta.env.VITE_API_URL}/add-ingredient`, {
                ingredient: ingredient
            })
            setShoppingList(response.data.shoppingList)
            toast.success('Ingrediente añadido correctamente')
        } catch (error) {
            toast.error('Este ingrediente ya está en la lista de la compra')
            console.log(error)
        }
    }

    async function deleteIngredient(ingredient_id) {
        try {
            const response = await axios.post(`${import.meta.env.VITE_API_URL}/delete-ingredient`, {
                ingredient_id
            })
            setShoppingList(response.data.shoppingList)
            toast.success('Ingrediente eliminado correctamente')
        } catch (error) {
            toast.error('Error al eliminar el ingrediente')
            console.log(error)
        }
    }

    function filterIngredients(e) {
        const search = e.target.value
        const filteredIngredients = ingredients.filter((ingredient) =>
            ingredient.name.toLowerCase().includes(search.toLowerCase())
        )
        setSearchedIngredients(filteredIngredients)
    }

    async function searchIngredients() {
        setShowAddIngredientModal(true)
        if (ingredients.length === 0) {
            try {
                const response = await axios.get(`${import.meta.env.VITE_API_URL}/ingredients`)
                setIngredients(response.data.sort((a, b) => (a.name > b.name ? 1 : -1)))
                setSearchedIngredients(response.data.sort((a, b) => (a.name > b.name ? 1 : -1)))
            } catch (error) {
                toast.error('Error al buscar los ingredientes')
                console.log(error)
            }
        }
    }

    async function deleteShoppingList() {
        try {
            const response = await axios.delete(`${import.meta.env.VITE_API_URL}/delete-shoppingList`)
            setShoppingList(response.data.shoppingList)
            toast.success('Ingredientes eliminados correctamente')
        } catch (error) {
            toast.error('Error al eliminar los ingredientes')
            console.log(error)
        }
    }

    return (
        <>
            <div className='relative flex flex-col items-center justify-center mx-2 mt-2 h-[86vh]'>
                <div className='flex flex-col items-center justify-center w-10/12 bg-[#FFF] bg-opacity-80 rounded-xl border-2 border-false-orange py-6 px-2 min-h-4/6 h-full'>
                    <h1 className=' text-2xl font-bold leading-5'>LISTA DE LA COMPRA</h1>
                    <div className='flex flex-col w-[95%] h-full bg-[#FFF] rounded-lg my-5 px-2 overflow-auto'>
                        {shoppingList.length <= 0 ? (
                            <div className='w-full h-full flex flex-col items-center justify-center text-xl font-bold text-center'>
                                Aún no has añadido ningún ingrediente a la lista de la compra
                                <img src='src\assets\disappointed-face.svg' height='120px' className='mt-4' alt='' />
                            </div>
                        ) : (
                            shoppingList.map((ingredient, index) => (
                                <div
                                    key={ingredient.id}
                                    className={`flex flex-row w-full justify-between px-1 py-2 ${
                                        index !== shoppingList.length - 1 ? 'border-b border-false-light-gray' : ''
                                    }`}
                                >
                                    <div className='flex flex-row items-center'>
                                        <img src={ingredient.image} className='rounded w-24 h-16 object-cover mr-2 ' />
                                        <p>{ingredient.name}</p>
                                    </div>
                                    <button onClick={() => deleteIngredient(ingredient.id)}>
                                        <svg
                                            xmlns='http://www.w3.org/2000/svg'
                                            width='1.5em'
                                            height='1.5em'
                                            viewBox='0 0 23 23'
                                        >
                                            <path
                                                fill='#000'
                                                d='M9 3v1H4v2h1v13a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V6h1V4h-5V3H9M7 6h10v13H7V6m2 2v9h2V8H9m4 0v9h2V8h-2Z'
                                            />
                                        </svg>
                                    </button>
                                </div>
                            ))
                        )}
                    </div>
                    <div className='flex flex-row gap-4'>
                        <button
                            className='bg-false-orange rounded-xl px-14 py-2.5 font-semibold'
                            onClick={() => searchIngredients()}
                        >
                            AÑADIR INGREDIENTE
                        </button>
                        <Button
                            isIconOnly
                            color='danger'
                            variant='ghost'
                            aria-label='Eliminar todos los ingredientes'
                            onClick={() => deleteShoppingList()}
                            className='flex items-center justify-center'
                        >
                            <svg xmlns='http://www.w3.org/2000/svg' width='1.5em' height='1.5em' viewBox='0 0 24 24'>
                                <path
                                    fill='#000'
                                    d='M9 3v1H4v2h1v13a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V6h1V4h-5V3H9M7 6h10v13H7V6m2 2v9h2V8H9m4 0v9h2V8h-2Z'
                                />
                            </svg>
                        </Button>
                    </div>
                </div>
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
                                            index != ingredients.length - 1 ? 'border-b-1 border-false-light-gray' : ''
                                        } `}
                                    >
                                        <div className='flex flex-row'>
                                            <img
                                                src={ingredient.image}
                                                className='rounded w-24 h-16 object-cover mr-1'
                                            />
                                            <p>{ingredient.name}</p>
                                        </div>
                                        {shoppingList.find((i) => i.id === ingredient.id) ? (
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

export default ShoppingList
