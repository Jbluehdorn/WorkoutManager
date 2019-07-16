import mongoose, {Schema, mongo} from 'mongoose'

let positionGroupSchema = new Schema({
    id: String,
    title: String
})

export default mongoose.model('position_group', positionGroupSchema)