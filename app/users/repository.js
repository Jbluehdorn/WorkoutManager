import mongoose from 'mongoose'

let User = mongoose.model('user')

let createUser = async data => {
    let user = new User(data)

    let query = await user.save()

    return query
}

let findUsers = () => User.find().populate('role').populate('position_group')

let findUser = id => User.findById(id).populate('role').populate('position_group')

let findByEmail = email => User.findOne({email: email}).populate('role').populate('position_group')

module.exports = {
    createUser,
    findUser,
    findUsers,
    findByEmail
}