import request from 'supertest'

describe('loading express', () => {
    let server
    beforeEach(() => {
        server = require('../server')
    })

    afterEach(() => {
        server.close()
    })

    it('responds to /', done => {
        request(server)
            .get('/')
            .expect(200, done)
    })

    it('returns JSON from Users', done => {
        request(server)
            .get('/api/users')
            .set('Accept', 'application/json')
            .expect('Content-Type', 'application/json; charset=utf-8')
            .expect(200, done)
    })
})