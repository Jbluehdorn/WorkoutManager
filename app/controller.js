exports.list = (req, res) => {
    var list = ['item1', 'item2', 'item3']
    res.json(list)
    console.log('Sent list of items')
}