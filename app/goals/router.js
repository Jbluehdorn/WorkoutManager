import './model'
import { Router } from 'express'
import controller from './controller'

let router = Router()

router.post('/', controller.create)
router.get('/', controller.list)
router.get('/:id', controller.find)

export default router