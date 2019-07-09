import repo from './repository'

exports.create = async (req, res) => {
    try {
        let workout = await repo.createWorkout(req.body)
        console.log('Workout created')
        res.success(workout)
    } catch (err) {
        res.erorr(err)
    }
}

exports.list = async (req, res) => {
    try {
        let workouts = await repo.findWorkouts()
        console.log('All workouts requested')
        res.success(workouts)
    } catch(err) {
        res.error(err)
    }
}

exports.find = async (req, res) => { 
    try {
        let workout = await repo.findWorkout(req.params.id)
        console.log(`Workout #${workout.id} requested`)
        res.success(workout)
    } catch(err) {
        res.error(err)
    }
}