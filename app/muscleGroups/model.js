import mongoose, {Schema, mongo} from 'mongoose'

let muscleGroupSchema = new Schema({
    id: Number,
    title: String
})

export default mongoose.model('muscle_group', muscleGroupSchema)