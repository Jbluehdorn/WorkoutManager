import {Router} from 'express'
import controller from './controller'

let router = Router()

router.get('/current', controller.currUser)
router.get('/test', (req, res) => {
    res.send('test')
})

export default router