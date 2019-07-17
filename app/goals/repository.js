import mongoose from 'mongoose'
import moment from 'moment'

let start = moment.utc().startOf('week').add(1, 'day')
let end = moment.utc().endOf('week').add(1, 'day')

let Goal = mongoose.model('goal')

let createGoal = async data => {
    let goal = new Goal(data)

    let activeGoals = await findActiveGoals()

    let query = await goal.save()

    activeGoals.forEach(async active => {
        if(active.muscle_group_id === query.muscle_group_id)
            await removeGoal(active.id)
    })

    return query
}

let findGoals = () => Goal.find()

let findActiveGoals = () => Goal.find({
    createdAt: {$gte: start, $lte: end}
})

let findGoal = id => Goal.findById(id)

let removeGoal = id => Goal.findByIdAndDelete(id)

module.exports = {
    createGoal,
    findGoals,
    findActiveGoals,
    findGoal,
    removeGoal
}