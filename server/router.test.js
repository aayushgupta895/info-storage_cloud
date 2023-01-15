const request = require('supertest')
const app = require('./app')
const { mongoConnect, mongoDisconnect } = require('./mongo')
describe('testing the api', () => {
    beforeAll(async () =>{
        await mongoConnect()
    })
    afterAll(async ()=>{
        await mongoDisconnect()
    })
    describe('Test GET/showAllTask', () =>{
        test('It should respond with 200 sucess request', async () =>{
            const response = await request(app).get('')
        })
    })
})
