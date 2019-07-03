import repo from './repository'

exports.create = async (req, res) => {
    try {
        let user = await repo.createUser(req.body)
        res.success(user)
    } catch(err) {
        res.error(err)
    }
}

exports.list = async (req, res) => {
    try {
        let users = await repo.findUsers()
        res.success(users)
    } catch(err) {
        res.error(err)
    }
}

exports.find = async (req, res) => {
    let re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    let isEmail = re.test(req.params.query)

    try {
        let user = isEmail ? await repo.findByEmail(req.params.query) : await repo.findUser(req.params.query)
        res.success(user)
    } catch(err) {
        res.error(err)
    }
}