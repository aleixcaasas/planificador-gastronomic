import React from 'react'
import { storage } from '../../firebase.js'

export const handleUpload = (image) => {
    const uploadTask = storage.ref(`images/${image.name}`).put(image)
    uploadTask.on(
        'state_changed',
        (snapshot) => {
            const progress = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100)
        },
        (error) => {
            console.log(error)
        },
        () => {
            storage
                .ref('images')
                .child(image.name)
                .getDownloadURL()
                .then((url) => {
                    setUrl(url)
                })
        }
    )
}

export function recipeCard(recipe, key) {
    return (
        <div key={key} className='w-11/12 bg-[#FFF] rounded-xl shadow-md'>
            <img src={recipe.image} className=' h-40 w-full object-cover rounded-t-xl' />
            <div className='py-3 px-3 flex flex-row justify-between'>
                <h1 className=' w-8/12 h-full font-bold text-lg flex items-center '>{recipe.title}</h1>
                <div className=' flex flex-col gap-2 items-end'>
                    <label className='px-2 w-auto bg-false-blue rounded-xl'>{recipe.meal}</label>
                    <label className='px-2 bg-false-orange rounded-xl'>{recipe.time}</label>
                </div>
            </div>
        </div>
    )
}

export default function Common() {
    return <div></div>
}
