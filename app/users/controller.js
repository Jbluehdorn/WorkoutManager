import secured from '../../middleware/secured'

exports.currUser = (req, res) => {
    res.send(res.locals)
}