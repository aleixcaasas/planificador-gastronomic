const { db } = require('../utils/firebase.js')

const getUser = async (user_id) => {
    const user = await db.collection('users').doc(user_id).get()
    return user.data()
}

module.exports = { getUser }
