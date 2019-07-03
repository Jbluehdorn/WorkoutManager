import mongoose from 'mongoose'

let User = mongoose.model('user')

let createUser = async data => {
    let user = new User(data)

    let query = await user.save()

    return query
}

let findUsers = () => User.find()

let findUser = id => User.findById(id)

let findByEmail = email => User.findOne({email: email})

module.exports = {
    createUser,
    findUser,
    findUsers,
    findByEmail
}