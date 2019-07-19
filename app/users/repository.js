import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'

let User = mongoose.model('user')
const DEFAULT_PASSWORD = 'GoHuskies123'

let createUser = async data => {
    data.password = !!data.password ? bcrypt.hashSync(data.password, 10) : bcrypt.hashSync(DEFAULT_PASSWORD, 10)
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