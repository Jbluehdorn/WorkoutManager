import session from 'express-session'
import passport from 'passport'
import Auth0Strategy from 'passport-auth0'

module.exports = (app) => {
    //Create the session
    const sess = {
        secret: 'secret',
        cookie: {},
        resave: false,
        saveUninitialized: true
    }

    if(app.get('env') === 'production') {
        sess.cookie.secure = true
    }

    app.use(session(sess))

    //Configure passport to use Auth0
    let strategy = new Auth0Strategy(
        {
            domain: process.env.AUTH0_DOMAIN,
            clientID: process.env.AUTH0_CLIENT_ID,
            clientSecret: process.env.AUTH0_CLIENT_SECRET,
            callbackURL: process.env.AUTH0_CALLBACK_URL || 'http://localhost:3000/callback'
        },
        (accessToken, refreshToken, extraParams, profile, done) => {
            return done(null, profile)
        }
    )

    passport.use(strategy)

    app.use(passport.initialize())
    app.use(passport.session())

    passport.serializeUser((user, done) => {
        done(null, user)
    })

    passport.deserializeUser((user, done) => {
        done(null, user)
    })
}