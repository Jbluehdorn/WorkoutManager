import mongoose, {Schema, mongo} from 'mongoose'

let UserSchema = new Schema({
    name: String,
    password: String,
    role_id: Number,
    group_id: Schema.Types.ObjectId,
    email: String
}, {
    timestamps: true,
    toJSON: {
        virtuals: true
    },
    toObject: {
        virtuals: true
    }
})

let RoleSchema = new Schema({
    title: String,
    id: Number
})

UserSchema.virtual('role', {
    ref: 'role',
    localField: 'role_id',
    foreignField: 'id',
    justOne: true
})

let RoleModel = mongoose.model('role', RoleSchema)
let UserModel = mongoose.model('user', UserSchema)

export {
    RoleModel,
    UserModel
}