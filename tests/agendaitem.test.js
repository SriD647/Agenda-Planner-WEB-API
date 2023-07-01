const request = require('supertest')
const mongoose = require('mongoose')
const { MongoMemoryServer } = require('mongodb-memory-server')
const app = require('../app')
const server = app.listen(8080, () => console.log('Lets get ready to test'))
const User = require('../models/user')
const AgendaItem = require('../models/agendaItem')
let mongoServer

beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create()
    await mongoose.connect(mongoServer.getUri())
})

afterAll(async () => {
    await mongoose.connection.close()
    mongoServer.stop() 
    server.close()
})

//Positive cases
describe('Test the agendaItems endpoints- Positive cases', () => {
    test('It should create a new agenda item', async () => {
        const user = new User({ name: 'Jeff Escobar', email: 'j.escobar@example.com', password: '123', isLoggedIn: true })
        await user.save()
        const token = await user.generateAuthToken()
        // const agendaItem = new AgendaItem({ title: 'Reading', startdate: '2023-08-08', enddate: '2023-08-08', starttime: '07:01 PM', endtime: '08:01 PM', user: user._id })
        // await agendaItem.save()
        // console.log(agendaItem)
        
        const response = await request(app)
            .post('/agendaItems/new')
            .set('Authorization', `Bearer ${token}`)
            .send ({ title: 'Reading', startDate: '2023-08-08', endDate: '2023-08-08', startTime: '07:01 PM', endTime: '08:01 PM', user: user._id })
        expect(response.statusCode).toBe(200)
        expect(response.body.title).toEqual('Reading')
        expect(response.body.startDate).toEqual('2023-08-08')
        expect(response.body.endDate).toEqual('2023-08-08')
        expect(response.body.startTime).toEqual('07:01 PM')
        expect(response.body.endTime).toEqual('08:01 PM')
        expect(response.body).toHaveProperty('user')                
})
//     test('Get a specific agenda item', async () => {
//         const user = new User({ name: 'Donald Trump', email: 'd.trump@example.com', password: '123' })
//         await user.save()
//         const agendaItem = new AgendaItem({ title: 'Reading', startDate: '2023-06-30', endDate: '2023-06-30', startTime: '07:00 PM', endTime: '08:00 PM', user: user._id })
//         await agendaItem.save()
//         const token = await user.generateAuthToken()
//         const response = await request(app)
//             .get(`/agendaItems/${user._id}`)
//             .set('Authorization', `Bearer ${token}`)
//             .send(agendaItem)
    

//         expect(response.statusCode).toBe(200)
//         // expect(response.body.title).toEqual('Reading')
//         // expect(response.body.startDate).toEqual('2023-06-30')
//         // expect(response.body.endDate).toEqual('2023-06-30')
//         // expect(response.body.startTime).toEqual('07:00 PM')
//         // expect(response.body.endTime).toEqual('08:00 PM')               
// })


})