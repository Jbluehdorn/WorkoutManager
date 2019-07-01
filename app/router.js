import {Router} from 'express'
import controller from './controller'

import usersRouter from './users/router'

let router = Router()

router.get('/getList', controller.list)

router.use('/users', usersRouter)

module.exports = router
