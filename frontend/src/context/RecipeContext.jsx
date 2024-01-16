import { createContext, useState, useContext } from 'react'

const RecipeContext = createContext()

export const useRecipe = () => useContext(RecipeContext)

export const RecipeProvider = ({ children }) => {
    const [selectedRecipeId, setSelectedRecipeId] = useState(null)
    const [selectedRecipeUrlName, setSelectedRecipeUrlName] = useState(null)

    return (
        <RecipeContext.Provider
            value={{ selectedRecipeId, setSelectedRecipeId, selectedRecipeUrlName, setSelectedRecipeUrlName }}
        >
            {children}
        </RecipeContext.Provider>
    )
}
