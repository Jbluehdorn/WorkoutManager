import './model'
import { Router } from 'express'
import controller from './controller'

let router = Router()

router.get('/', controller.list)
router.get('/:id', controller.find)
router.get('/user/:userID', controller.findByUser)
router.post('/', controller.create)
router.delete('/:id', controller.delete)

export default router