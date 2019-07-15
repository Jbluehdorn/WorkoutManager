import mongoose from 'mongoose'

let Workout = mongoose.model('workout')

let createWorkout = async data => {
    let workout = new Workout(data)

    let query = await workout.save()

    return query
}

let findWorkouts = () => Workout.find().populate('user').populate('muscle_group')

let findWorkout = id => Workout.findById(id).populate('user').populate('muscle_group')

let deleteWorkout = id => Workout.deleteOne({_id: id})

module.exports = {
    createWorkout,
    findWorkouts,
    findWorkout,
    deleteWorkout
}