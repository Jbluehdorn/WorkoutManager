import mongoose from 'mongoose'

let config = {
    host: '127.0.0.1',
    port: process.env.SERVER_PORT,
    mongoUrl: `mongodb://${process.env.DB_USER}:${process.env.DB_PASS}@ds245927.mlab.com:${process.env.DB_PORT}/workout_manager`
}

module.exports = app => {
    mongoose.connect(config.mongoUrl, {useNewUrlParser: true})

    process.on('SIGINT', cleanup)
    process.on('SIGTERM', cleanup)
    process.on('SIGHUP', cleanup)

    if(app) {
        app.set('mongoose', mongoose)
    }
}

function cleanup() {
    mongoose.connection.close(() => {
        process.exit(0)
    })
}