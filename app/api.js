import usersRouter from './users/router'
import workoutsRouter from './workouts/router'

let prefix = '/api'

module.exports = app => {
    app.use(`${prefix}/users`, usersRouter)
    app.use(`${prefix}/workouts`, workoutsRouter)
}