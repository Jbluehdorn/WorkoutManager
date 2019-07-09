import repo from './repository'

exports.list = async (req, res) => {
    try {
        let muscleGroups = await repo.findMuscleGroups()
        console.log('All muscle groups requested')
        res.success(muscleGroups)
    } catch(err) {
        res.error(err)
    }
}

exports.find = async(req, res) => {
    try {
        let muscleGroup = await repo.findMuscleGroup(req.params.id)
        console.log(`Muscle Group ${muscleGroup.title} requested`)
        res.success(muscleGroup)
    } catch(err) {
        res.error(err)
    }
}