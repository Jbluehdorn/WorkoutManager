import mongoose from 'mongoose'

let PositionGroup = mongoose.model('position_group')

let findPositionGroups = () => PositionGroup.find()

let findPositionGroup = id => PositionGroup.findOne({id: id})

module.exports = {
    findPositionGroups,
    findPositionGroup
}