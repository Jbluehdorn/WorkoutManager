import express from 'express'
import customResponses from './middleware/customResponses'
import bodyParser from 'body-parser'

const app = express()

//Configure Mongoose 
require('./mongoose/config')(app)

//Config views
app.set('view engine', 'pug')
app.set('views', `${process.cwd()}/views`)

//Config requests and responses
app.use(customResponses)
app.use(bodyParser.urlencoded({
    extended:true
}))
app.use(bodyParser.json())

//Register the api router
require('./app/api')(app)

app.get('/', (req, res) => {
    res.send('API')
})

const port = process.env.PORT
app.listen(port, () => console.log(`App listening on port ${port}`))