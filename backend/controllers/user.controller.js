const { db, auth, updatePassword, getDownloadURL, ref, storage, uploadBytesResumable } = require('../utils/firebase.js')

const getUser = async (req, res) => {
    try {
        const userFound = req.user
        res.status(200).json({
            name: userFound.full_name,
            email: userFound.email,
            image: userFound.image,
            username: userFound.user_name
        })
    } catch (error) {
        console.error(error)
        return res.status(500).json({ error: 'Error interno del servidor' })
    }
}

const updateUser = async (req, res) => {
    const userFound = req.user
    const { full_name, user_name, newPassword, confirmNewPassword } = req.body

    try {
        const userRef = db.collection('users').doc(userFound.user_id)
        const updateData = {}

        if (full_name !== undefined) updateData.full_name = full_name
        if (user_name !== undefined) updateData.user_name = user_name

        if (req.file) {
            const storageRef = ref(storage, `images/users/${userFound.user_id}`)
            const metadata = {
                contentType: req.file.mimetype
            }
            await uploadBytesResumable(storageRef, req.file.buffer, metadata)
            const downloadURL = await getDownloadURL(storageRef)
            updateData.image = downloadURL
        }

        if (newPassword && newPassword === confirmNewPassword) {
            await updatePassword(auth.currentUser, newPassword)
        }

        if (Object.keys(updateData).length > 0) {
            await userRef.update(updateData)
        }

        res.status(200).json({
            updated: true,
            name: updateData.full_name,
            email: updateData.email,
            image: updateData.image,
            username: updateData.user_name
        })
    } catch (error) {
        console.error(error)
        return res.status(500).json({ error: 'Error interno del servidor' })
    }
}

module.exports = { getUser, updateUser }
