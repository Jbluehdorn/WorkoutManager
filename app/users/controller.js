import repo from './repository'

exports.create = async (req, res) => {
    try {
        let user = await repo.createUser(req.body)
        console.log(`${user.name} created`)
        res.success(user)
    } catch(err) {
        res.error(err)
    }
}

exports.list = async (req, res) => {
    let type = !!req.query.type ? req.query.type : undefined
    try {
        let users = await repo.findUsers()
        if(type && type.toLowerCase() === 'players') {
            users = users.filter(user => {
                return user.role_id === 1
            })

            console.log('All players requested')
            res.success(users)
        } else {
            console.log('All users requested')
            res.success(users)
        }
    } catch(err) {
	    console.log(err)
        res.error(err)
    }
}

exports.find = async (req, res) => {
    let re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    let isEmail = re.test(req.params.query)

    try {
        let user = isEmail ? await repo.findByEmail(req.params.query) : await repo.findUser(req.params.query)
        console.log(`User #${user.id} requested`)
        res.success(user)
    } catch(err) {
        res.error(err)
    }
}
