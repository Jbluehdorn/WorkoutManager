import mongoose, {Schema, mongo} from 'mongoose'
import positionGroupSchema from '../positionGroups/model'

let UserSchema = new Schema({
    name: String,
    password: String,
    role_id: Number,
    group_id: Number,
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

UserSchema.virtual('position_group', {
    ref: 'position_group',
    localField: 'group_id',
    foreignField: 'id',
    justOne: true
})

let RoleModel = mongoose.model('role', RoleSchema)
let UserModel = mongoose.model('user', UserSchema)

export {
    RoleModel,
    UserModel
}