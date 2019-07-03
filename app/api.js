import usersRouter from './users/router'

let prefix = '/api'

module.exports = app => {
    app.use(`${prefix}/users`, usersRouter)
}