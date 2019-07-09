import './model'
import { Router } from 'express'
import controller from './controller'

let router = Router()

router.get('/', controller.list)
router.get('/:id', controller.find)

export default router