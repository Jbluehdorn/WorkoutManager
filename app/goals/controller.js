import repo from './repository'

exports.create = async(req, res) => {
    try {
        let goal = await repo.createGoal(req.body)
        console.log(`Goal created`)
        res.success(goal)
    } catch(err) {
        res.error(err)
    }
}

exports.list = async(req, res) => {
    let onlyActive = req.query.active
    console.log(req.query.active)
    try {
        let goals = onlyActive ? await repo.findActiveGoals() : await repo.findGoals()
        console.log(`${onlyActive ? 'Active' : 'All'} Goals requested`)
        res.success(goals)
    } catch(err) {
        console.log(err)
        res.error(err)
    }
}

exports.find = async (req, res) => {
    try {
        let goal = await repo.findGoal(req.params.id)
        console.log(`Goal ${goal.id} requested`)
        res.success(goal)
    } catch(err) {
        res.error(err)
    }
}