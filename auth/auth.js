import express from 'express'
import passport from 'passport'
import dotenv from 'dotenv'
import util from 'util'
import { URL } from 'url'
import querystring from 'querystring'

let router = express.Router()

dotenv.config()

router.get('/login', passport.authenticate('auth0', {
    scope: 'openid email profile'
}), (req, res) => {
    res.redirect('/')
})

router.get('/callback', (req, res, next) => {
    passport.authenticate('auth0', (err, user, info) => {
        if(err) {return next(err)}
        if(!user) { return res.redirect('/login') }
        req.logIn(user, err => {
            if(err) { return next(err) }
            const returnTo = req.session.returnTo
            delete req.session.returnTo
            res.redirect(returnTo || '/user')
        })
    })(req, res, next)
})

router.get('/logout', (req, res) => {
    req.logout()

    let returnTo = req.protocol + '://' + req.hostname
    let port = req.connection.localPort
    if(port !== undefined && port !== 80 && port !== 443) {
        returnTo += ':' + port
    }
    let logoutURL = new URL(
        util.format('https://%s/logout', process.env.AUTH0_DOMAIN)
    )
    let searchString = querystring.stringify({
        client_id: process.env.AUTH0_CLIENT_ID,
        returnTo: returnTo
    })
    logoutURL.search = searchString
    res.redirect(logoutURL)
})

module.exports = router