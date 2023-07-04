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
        const user = new User({ name: 'Jeff Escobar', email: 'j.escobar@example.com', password: '123a'})
        await user.save()
        const token = await user.generateAuthToken()        
        const response = await request(app)
            .post('/agendaItems/new')
            .set('Authorization', `Bearer ${token}`)
            .send ({ title: 'Reading', startDate: '2023-08-08', endDate: '2023-08-08', startTime: '07:01 PM', endTime: '08:01 PM', user: user._id })
            console.log(user, response.body)
        expect(response.statusCode).toBe(200)
        expect(response.body.title).toEqual('Reading')
        expect(response.body.startDate).toEqual('2023-08-08')
        expect(response.body.endDate).toEqual('2023-08-08')
        expect(response.body.startTime).toEqual('07:01 PM')
        expect(response.body.endTime).toEqual('08:01 PM')
        expect(response.body).toHaveProperty('user')
        expect(response.body).toHaveProperty('_id')                    
})
    test('Get a specific agenda item', async () => {
        const user = new User({ name: 'Donald Trump', email: 'd.trump@example.com', password: '123a' })
        await user.save()
        const agendaItem = new AgendaItem({ title: 'Reading', startDate: '2023-06-30', endDate: '2023-06-30', startTime: '07:00 PM', endTime: '08:00 PM', user: user._id })
        await agendaItem.save()
        const token = await user.generateAuthToken()
        const response = await request(app)
            .get(`/agendaItems/${agendaItem._id}`)
            .set('Authorization', `Bearer ${token}`)
        console.log(response.body)   
        expect(response.statusCode).toBe(200)
        expect(response.body.title).toEqual('Reading')
        expect(response.body.startDate).toEqual('2023-06-30')
        expect(response.body.endDate).toEqual('2023-06-30')
        expect(response.body.startTime).toEqual('07:00 PM')
        expect(response.body.endTime).toEqual('08:00 PM')
        expect(response.body).toHaveProperty('user')
        expect(response.body).toHaveProperty('_id')                 
})

    test('Get all agenda items in particular start date', async () => {
        const user = new User({ name: 'Will Smith', email: 'w.smith@example.com', password: '123a' })
        await user.save()
        const agendaItem1 = new AgendaItem({ title: 'Reading', startDate: '2023-07-30', endDate: '2023-07-30', startTime: '07:00 PM', endTime: '08:00 PM', user: user._id })
        await agendaItem1.save()
        const agendaItem2 = new AgendaItem({ title: 'Yoga', startDate: '2023-08-30', endDate: '2023-08-30', startTime: '08:00 PM', endTime: '09:00 PM', user: user._id })
        await agendaItem2.save()
        const token = await user.generateAuthToken()
        const response = await request(app)
            .get(`/agendaItems/date/2023-07-30`)
            .set('Authorization', `Bearer ${token}`) 
            console.log(response.body)
            expect(response.statusCode).toEqual(200)
            expect(response.body[0].title).toEqual('Reading');
            expect(response.body[0].startDate).toEqual('2023-07-30');
            expect(response.body[0].endDate).toEqual('2023-07-30');
            expect(response.body[0].startTime).toEqual('07:00 PM');
            expect(response.body[0].endTime).toEqual('08:00 PM');
            expect(response.body[0]).toHaveProperty('user');
            expect(response.body[0]).toHaveProperty('_id');
            // nothing from agendaItem 2 will be sent as expected as it does not have a startDate of 2023-07-30
      
})
    test('Get all agenda items that belong to user', async () => {
        const user = new User({ name: 'Ron Weasley', email: 'r.weasley@example.com', password: '123q' })
        await user.save()
        const agendaItem1 = new AgendaItem({ title: 'Reading', startDate: '2023-09-30', endDate: '2023-09-30', startTime: '07:00 PM', endTime: '08:00 PM', user: user._id })
        await agendaItem1.save()
        const agendaItem2 = new AgendaItem({ title: 'Yoga', startDate: '2023-09-30', endDate: '2023-09-30', startTime: '08:00 PM', endTime: '09:00 PM', user: user._id })
        await agendaItem2.save()
        const token = await user.generateAuthToken()
        const response = await request(app)
            .get(`/agendaItems/entireAgenda/${user._id}`)
            .set('Authorization', `Bearer ${token}`) 
        console.log(response.body)
            expect(response.statusCode).toEqual(200)
            expect(response.body[0].title).toEqual('Reading');
            expect(response.body[0].startDate).toEqual('2023-09-30');
            expect(response.body[0].endDate).toEqual('2023-09-30');
            expect(response.body[0].startTime).toEqual('07:00 PM');
            expect(response.body[0].endTime).toEqual('08:00 PM');
            expect(response.body[0]).toHaveProperty('user');
            expect(response.body[0]).toHaveProperty('_id');

            expect(response.body[1]).toBeDefined();

            // expect(response.body[1].title).toEqual('Yoga');
            // expect(response.body[1].startDate).toEqual('2023-09-30');
            // expect(response.body[1].endDate).toEqual('2023-09-30');
            // expect(response.body[1].startTime).toEqual('08:00 PM');
            // expect(response.body[1].endTime).toEqual('09:00 PM');
            // expect(response.body[1]).toHaveProperty('user');
            // expect(response.body[1]).toHaveProperty('_id');          
})

    test('Delete all agenda items that belond to a user', async () => {
        const user = new User({ name: 'Lemony Snickett', email: 'l.snickket@example.com', password: '123a' })
        await user.save()
        const agendaItem1 = new AgendaItem({ title: 'Reading', startDate: '2023-07-30', endDate: '2023-07-30', startTime: '07:00 PM', endTime: '08:00 PM', user: user._id })
        await agendaItem1.save()
        const agendaItem2 = new AgendaItem({ title: 'Yoga', startDate: '2023-07-30', endDate: '2023-07-30', startTime: '08:00 PM', endTime: '09:00 PM', user: user._id })
        await agendaItem2.save()
        const token = await user.generateAuthToken()
       
        const response = await request(app)
            .delete(`/agendaItems/clearAgenda/${user._id}`)
            .set('Authorization', `Bearer ${token}`)
        console.log(response.body)
        expect(response.statusCode).toBe(200)
        expect(response.body.message).toEqual('All agenda items associated with user sucessfully deleted')
    }) 

    test('Delete a specific agenda item', async () => {
        const user = new User({ name: 'Anderson Silva', email: 'a.silva@example.com', password: '123a' })
        await user.save()
        const agendaItem1 = new AgendaItem({ title: 'Reading', startDate: '2023-07-30', endDate: '2023-07-30', startTime: '07:00 PM', endTime: '08:00 PM', user: user._id })
        await agendaItem1.save()
        const token = await user.generateAuthToken()
        const response = await request(app)
            .delete(`/agendaItems/${agendaItem1._id}`)
            .set('Authorization', `Bearer ${token}`)
        console.log(response.body)
        expect(response.statusCode).toBe(200)
        expect(response.body.message).toEqual('Agenda item sucessfully deleted')
    }) 
    
    test('It should update a specific agenda item', async () => {
        const user = new User({ name: 'Humpty Dumpty', email: 'h.dumpty@example.com', password: '123@3ac$%^'})
        await user.save()
        const agendaItem1 = new AgendaItem({ title: 'Reading', startDate: '2023-07-30', endDate: '2023-07-30', startTime: '07:00 PM', endTime: '08:00 PM', user: user._id })
        await agendaItem1.save()
        const token = await user.generateAuthToken()

        const response = await request(app)
            .put(`/agendaItems/${agendaItem1._id}`)
            .set('Authorization', `Bearer ${token}`)
            .send({ startTime: '01:13 PM', endTime: '02:20 PM'})
            console.log(response.body)
        expect(response.statusCode).toBe(200)
        expect(response.body.title).toEqual('Reading')
        expect(response.body.startDate).toEqual('2023-07-30')
        expect(response.body.endDate).toEqual('2023-07-30')
        expect(response.body.startTime).toEqual('01:13 PM')
        expect(response.body.endTime).toEqual('02:20 PM')
    })
})
//Negative cases
describe('Test the agendaItems endpoints- Negatives cases', () => {
    test('Negative case for creating a new agenda item with invalid parameters', async () => {
        const user = new User({ name: 'Jeff Escobar', email: 'j.e@example.com', password: '123a'})
        await user.save()
        const token = await user.generateAuthToken()        
        const response = await request(app)
            .post('/agendaItems/new')
            .set('Authorization', `Bearer ${token}`)
            .send ({ title: 123, endDate: '202308-08', startTime: '', endTime: '08:01 P', user: user._id })
        console.log(response.body)
        expect(response.statusCode).toBe(400)
        expect(response.body).toHaveProperty('message')                    
})
    test('Negative case for geting a specific agenda item with invalid  agendaItem :id', async () => {
        const user = new User({ name: 'Donald Trump', email: 'donald.trump@example.com', password: '12j3' })
        await user.save()
        const agendaItem = new AgendaItem({ title: 'Reading', startDate: '2023-06-30', endDate: '2023-06-30', startTime: '07:00 PM', endTime: '08:00 PM', user: user._id })
        await agendaItem.save()
        const token = await user.generateAuthToken()
        const response = await request(app)
            .get(`/agendaItems/somethingwrong`)
            .set('Authorization', `Bearer ${token}`)
        console.log(response.body)   
        expect(response.statusCode).toBe(400)
        expect(response.body.message).toEqual('User has no agenda item with such id')                 
})
     /// same logic applies when we try to update with invalid date as well!
     test(' Negative case for getting all agenda items with invalid date', async () => {
        const user = new User({ name: 'Will Smith', email: 'w.s.mith@example.com', password: 'l123' })
        await user.save()
        const agendaItem1 = new AgendaItem({ title: 'Reading', startDate: '2023-07-30', endDate: '2023-07-30', startTime: '07:00 PM', endTime: '08:00 PM', user: user._id })
        await agendaItem1.save()
        const agendaItem2 = new AgendaItem({ title: 'Yoga', startDate: '2023-07-30', endDate: '2023-07-30', startTime: '08:00 PM', endTime: '09:00 PM', user: user._id })
        await agendaItem2.save()
        const token = await user.generateAuthToken()
        const response = await request(app)
            .get(`/agendaItems/date/2023-07-3`)
            .set('Authorization', `Bearer ${token}`) 
            console.log(response.body)
            expect(response.statusCode).toEqual(400)
            expect(response.body.message).toEqual('Invalid date format')  

     })
    //  same logic for updating and deleting when not authorized !! :) 
     test(' Negative test to get all agenda items of user when not authorized', async () => {
        const user = new User({ name: 'Ron Weasley', email: 'r.w.easley@example.com', password: '12l3' })
        await user.save()
        const agendaItem1 = new AgendaItem({ title: 'Reading', startDate: '2023-09-30', endDate: '2023-09-30', startTime: '07:00 PM', endTime: '08:00 PM', user: user._id })
        await agendaItem1.save()
        const agendaItem2 = new AgendaItem({ title: 'Yoga', startDate: '2023-09-30', endDate: '2023-09-30', startTime: '08:00 PM', endTime: '09:00 PM', user: user._id })
        await agendaItem2.save()
        const response = await request(app)
            .get(`/agendaItems/entireAgenda/${user._id}`)
            console.log(response.body)
            expect(response.statusCode).toEqual(401)
            expect(response.body.message).toEqual('Not authorized')   
   })

   test('Negative case of updating a specigic agenda item when :id is invalid', async () => {
        const user = new User({ name: 'Humpty Dumpty', email: 'h.d.umpty@example.com', password: '12a3'})
        await user.save()
        const agendaItem1 = new AgendaItem({ title: 'Reading', startDate: '2023-07-30', endDate: '2023-07-30', startTime: '07:00 PM', endTime: '08:00 PM', user: user._id })
        await agendaItem1.save()
        const token = await user.generateAuthToken()

        const response = await request(app)
            .put(`/agendaItems/somethingwrong`)
            .set('Authorization', `Bearer ${token}`)
            .send({ startTime: '01:13 PM', endTime: '02:20 PM'})
            console.log(response.body)
        expect(response.statusCode).toBe(400)
        expect(response.body.message).toEqual('User has no agenda item with such id')  
   })

   test('Negative case for deleting a specific agenda item with invalid id', async () => {
        const user = new User({ name: 'Anderson Silva', email: 'a.silva.@example.com', password: '1v23' })
        await user.save()
        const agendaItem1 = new AgendaItem({ title: 'Reading', startDate: '2023-07-30', endDate: '2023-07-30', startTime: '07:00 PM', endTime: '08:00 PM', user: user._id })
        await agendaItem1.save()
        const token = await user.generateAuthToken()
        const response = await request(app)
            .delete(`/agendaItems/1245`)
            .set('Authorization', `Bearer ${token}`)
            console.log(response.body)
        expect(response.statusCode).toBe(400)
        expect(response.body.message).toEqual('User has no agenda item with such id')   
    })
    
      test('Negative case for deleting all user agenda items when not authorized', async () => {
        const user = new User({ name: 'Lemony Snickett', email: 'l.s.nickket@example.com', password: '123a' })
        await user.save()
        const agendaItem1 = new AgendaItem({ title: 'Reading', startDate: '2023-07-30', endDate: '2023-07-30', startTime: '07:00 PM', endTime: '08:00 PM', user: user._id })
        await agendaItem1.save()
        const agendaItem2 = new AgendaItem({ title: 'Yoga', startDate: '2023-07-30', endDate: '2023-07-30', startTime: '08:00 PM', endTime: '09:00 PM', user: user._id })
        await agendaItem2.save()
       
        const response = await request(app)
            .delete(`/agendaItems/clearAgenda/${user._id}`)
        console.log(response.body)
        expect(response.statusCode).toEqual(401)
        expect(response.body.message).toEqual('Not authorized')
    }) 
   
   
})   