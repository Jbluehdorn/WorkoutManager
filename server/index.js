import express from 'express'
import customResponses from '../middleware/customResponses'
import bodyParser from 'body-parser'
import path from 'path'
import fs from 'fs'

import React from 'react'
import ReactDOMServer from 'react-dom/server'
import { StaticRouter } from 'react-router-dom'

import App from '../src/App'

const app = express()

//Config views
app.set('view engine', 'pug')
app.set('views', `${process.cwd()}/views`)

//Config requests and responses
app.use(customResponses)
app.use(bodyParser.urlencoded({
    extended:true
}))

//Include auth
require('./auth')(app)

//Register Middleware
import userInViews from '../middleware/userInViews'
import secured from '../middleware/secured'
app.use(userInViews())

//Register the api router
app.use('/api', require('../app/router'))

//Register routes
app.use('/', require('../auth/auth'), secured())

app.get('/*', (req, res) => {
    const context = {}
    const app = ReactDOMServer.renderToString(
        <StaticRouter location={req.url} context={context}>
            <App />
        </StaticRouter>
    )

    const indexFile = path.resolve('./public/index.html')
    fs.readFile(indexFile, 'utf8', (err, data) => {
        if(err) {
            console.error('Something went wrong:', err)
            return res.status(500).send('Something went wrong')
        }

        return res.send(
            data.replace('<div id="app"></div>', `<div id="app">${app}</div>`)
        )
    })
})

const port = process.env.PORT
app.listen(port, () => console.log(`App listening on port ${port}`))