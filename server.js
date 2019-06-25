import express from 'express'
import path from 'path'
import customResponses from './middleware/CustomResponses'
import bodyParser from 'body-parser'

const app = express()

app.use(express.static(path.join(__dirname, 'client/build')))
app.use(customResponses)
app.use(bodyParser.urlencoded({
    extended:true
}))

app.use('/api', require('./app/router'))

//Handles any requests that don't match the above
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '/client/build/index.html'))
})

const port = process.env.PORT
app.listen(port, () => console.log(`App listening on port ${port}`))