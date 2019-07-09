import mongoose, {Schema, mongo} from 'mongoose'
import { UserModel } from '../users/model'

let WorkoutSchema = new Schema({
    duration: Number,
    user_id: Schema.Types.ObjectId,
    muscle_group_id: Number,
    notes: String,
    date: Date
}, {
    timestamps: true,
    toJSON: {
        virtuals: true
    },
    toObject: {
        virtuals: true
    }
})

let MuscleGroupSchema = new Schema({
    id: Number,
    title: String
})

WorkoutSchema.virtual('user', {
    ref: 'user',
    localField: 'user_id',
    foreignField: '_id',
    justOne: true
})

WorkoutSchema.virtual('muscle_group', {
    ref: 'muscle_group',
    localField: 'muscle_group_id',
    foreignField: 'id',
    justOne: true
})

let WorkoutModel = mongoose.model('workout', WorkoutSchema)
let MuscleGroupModel = mongoose.model('muscle_group', MuscleGroupSchema)

export {
    WorkoutModel,
    MuscleGroupModel
}