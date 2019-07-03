import mongoose, {Schema} from 'mongoose'

let UserSchema = new Schema({
    name: String,
    role_id: Schema.Types.ObjectId,
    group_id: Schema.Types.ObjectId,
    email: String
}, {
    timestamps: true
})

module.exports = mongoose.model('user', UserSchema)