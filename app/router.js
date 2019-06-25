import {Router} from 'express'
import controller from './controller'

let router = Router()

router.get('/getList', controller.list)

module.exports = router
