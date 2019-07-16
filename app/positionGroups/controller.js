import repo from './repository'

exports.list = async (req, res) => {
    try {
        let positionGroups = await repo.findPositionGroups()
        console.log('All position groups requested')
        res.success(positionGroups)
    } catch(err) {
        res.error(err)
    }
}

exports.find = async (req, res) => {
    try {
        console.log(req.params.id)
        let positionGroup = await repo.findPositionGroup(req.params.id)
        console.log(`Position Group ${positionGroup.title} requested`)
        res.success(positionGroup)
    } catch(err) {
        res.error(err)
    }
}