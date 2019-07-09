import mongoose from 'mongoose'

let MuscleGroup = mongoose.model('muscle_group')

let findMuscleGroups = () => MuscleGroup.find()

let findMuscleGroup = id => MuscleGroup.findById(id)

module.exports = {
    findMuscleGroup,
    findMuscleGroups
}