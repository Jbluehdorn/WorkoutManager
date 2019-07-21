import mongoose from 'mongoose'
import moment from 'moment'
import _ from 'lodash'

let start = moment().startOf('week').add(1, 'day')
let end = moment().endOf('week').add(1, 'day')

let Goal = mongoose.model('goal')

let createGoal = async data => {
    let goal = new Goal(data)

    let activeGoals = await findActiveGoals()

    let query = await goal.save()

    activeGoals.forEach(async active => {
        if(active.muscle_group_id === query.muscle_group_id && _.isEqual(query.user_id, active.user_id))
            await removeGoal(active.id)
    })

    return query
}

let findGoals = () => Goal.find().populate('muscle_group')

let findActiveGoals = () => Goal.find({
    createdAt: {$gte: start, $lte: end}
}).populate('muscle_group')

let findGoal = id => Goal.findById(id).populate('muscle_group')

let removeGoal = id => Goal.findByIdAndDelete(id).populate('muscle_group')

module.exports = {
    createGoal,
    findGoals,
    findActiveGoals,
    findGoal,
    removeGoal
}