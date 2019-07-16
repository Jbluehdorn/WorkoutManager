import usersRouter from './users/router'
import workoutsRouter from './workouts/router'
import muscleGroupsRouter from './muscleGroups/router'
import positionGroupsRouter from './positionGroups/router'

let prefix = '/api'

module.exports = app => {
    app.use(`${prefix}/users`, usersRouter)
    app.use(`${prefix}/workouts`, workoutsRouter)
    app.use(`${prefix}/muscleGroups`, muscleGroupsRouter)
    app.use(`${prefix}/positionGroups`, positionGroupsRouter)
}