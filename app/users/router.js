import './model'
import {Router} from 'express'
import controller from './controller'

let router = Router()

router.get('/', controller.list)
router.get('/:query', controller.find)
router.post('/', controller.create)

export default router