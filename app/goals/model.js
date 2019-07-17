import mongoose, {Schema, mongo} from 'mongoose'
import MuscleGroupSchema from '../muscleGroups/model'

let GoalSchema = new Schema({
    user_id: Schema.Types.ObjectId,
    muscle_group_id: Number,
    duration: Number
}, {
    timestamps: true,
    toJson: {
        virtuals: true
    },
    toObject: {
        virtuals: true
    }
})

GoalSchema.virtual('muscle_group', {
    ref: 'muscle_group',
    localField: 'muscle_group_id',
    foreignField: 'id',
    justOne: true
})

export default mongoose.model('goal', GoalSchema)