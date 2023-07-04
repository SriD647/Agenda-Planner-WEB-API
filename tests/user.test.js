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
describe('Test the users endpoints- Positive cases', () => {
    test('It should create a new user', async () => {
        const response = await request(app)
            .post('/users')
            .send({ name: 'Jason Bourne', email: 'j.bourne@example.com', password: '1233$a' })
        console.log(response.body)
        expect(response.statusCode).toBe(200)
        expect(response.body.user.name).toEqual('Jason Bourne')
        expect(response.body.user.email).toEqual('j.bourne@example.com')
        expect(response.body.user.isLoggedIn).toEqual(false)
        expect(response.body.user.agendaItems).toEqual([])
        expect(response.body.user).toHaveProperty('password')
        
    }) 
    test('It should allow a user to login', async () => {
        const user = new User({ name: 'Lara Croft' , email: 'l.croft@example.com', password: '123a' })
        await user.save()
        const response = await request(app)
            .post('/users/login')
            .send({ email: user.email, password: '123a' })
        console.log(response.body)
        expect(response.statusCode).toBe(200)
        expect(response.body.user.name).toEqual('Lara Croft')
        expect(response.body.user.email).toEqual('l.croft@example.com')
        expect(response.body.user.password).toEqual(user.password)
        expect(response.body.user.isLoggedIn).toEqual(true)
        expect(response.body.user).toHaveProperty('agendaItems')
        expect(response.body).toHaveProperty('token')
        
    })

    test("It should get specific user", async ()=>{
        const user = new User({ name: 'Ethan' , email: 'e.hunt@example.com', password: '123a', isLoggedIn: true || false })
        await user.save()
        
        const response =  await request(app).get(`/users/${user._id}`)
        console.log(response.body)
        expect(response.statusCode).toBe(200);
        expect(response.body.name).toEqual('Ethan')
        expect(response.body.email).toEqual('e.hunt@example.com')
        expect(response.body.isLoggedIn).toEqual(true || false) 
        expect(response.body).toHaveProperty('password')
        expect(response.body).toHaveProperty('agendaItems')
        
    })
    test('It should update a user', async () => {
        const user = new User({ name: 'Joe Schmo', email: 'j.schmo@example.com', password: '123a'})
        await user.save()
        const token = await user.generateAuthToken()

        const response = await request(app)
            .put(`/users/${user._id}`)
            .set('Authorization', `Bearer ${token}`)
            .send({ name: 'Harry Potter', password: "1234a" })
            console.log(response.body)
        expect(response.statusCode).toBe(200)
        expect(response.body.name).toEqual('Harry Potter')
        expect(response.body).toHaveProperty('password')
        expect(response.body).toHaveProperty('agendaItems')
        expect(response.body).toHaveProperty('isLoggedIn') 
    })
    test('It should delete a user', async () => {
        const user = new User({ name: 'Goku', email: 'goku@example.com', password: '123%$a##2' })
        await user.save()
        const token = await user.generateAuthToken()

        const response = await request(app)
            .delete(`/users/${user._id}`)
            .set('Authorization', `Bearer ${token}`)
        console.log(response.body)
        expect(response.statusCode).toBe(200)
        expect(response.body.message).toEqual('User successfully deleted');
    })
    test('It should log out a user', async () => {
        const user = new User({ name: 'John Wick', email: 'j.wick@gmail.com', password: 'heiscoming12' });
        const token = await user.generateAuthToken() 
        await user.save();         
        const response = await request(app)
        .post('/users/logout')
        .set('Authorization', `Bearer ${token}`);
        console.log(user, response.body)
        expect(response.statusCode).toBe(200);
        expect(response.body.message).toEqual("User logged out successfully!");
    
    })
})

// // Negative cases
describe('Test the users endpoints- Negative cases', () => {
    test("Negative case of creating a user with invalid credentials (same logic would apply to updating a user with invalid credentials", async () => {
        const response = await request(app).post("/users").send({ name: "123", email: "akongmail.com", password: "123" });
        console.log(response.body)
        expect(response.statusCode).toBe(400);
        expect(response.body).toHaveProperty("message");
    })
    test("Negative case of creating a user with a non unique email (same logic for updating a user", async () => {
        const user = new User({ name: 'Joe Schmo', email: 'j.s.chmo@example.com', password: '123a'})
        await user.save()
        const response = await request(app).post("/users").send({ name: "Akon", email: "j.s.chmo@example.com", password: "123a" });
        console.log(response.body)
        expect(response.statusCode).toBe(400);
        expect(response.body.message).toEqual("A user with that email already exists!");
    })
    test('Negative case of a user trying to login with incorrect credentials', async () => {
        const user = new User({ name: 'Homer Simpson' , email: 'h.simpson@example.com', password: '123a' })
        await user.save()
        const response = await request(app)
            .post('/users/login')
            .send({ email: "h.simpson@example.com", password: '123' })
        console.log(response.body)
        expect(response.statusCode).toBe(400);
        expect(response.body.message).toEqual('Incorrect Login Credentials');    

    })

    test("Negative case of getting a user when :id is invalid", async ()=>{
        const user = new User({ name: 'Evelyn Salt' , email: 'e.salt@example.com', password: '123@a1' })
        await user.save()
        
        const response =  await request(app).get(`/users/somethingincorect`)
        console.log(response.body)
        expect(response.statusCode).toBe(400);
        expect(response.body.message).toEqual("No user exists with such id")
    })
    test('Negative case of updating user when not authorized (same logic for logging out and deleting when not authorized)', async () => {
        const user = new User({ name: 'James Bond', email: 'j.bond@example.com', password: '123a' })
        await user.save()

        const response = await request(app)
            .put(`/users/${user._id}`)

            .send({ name: 'John Lennon', email: 'j.lennon@example.com' })
        console.log(response.body)
        expect(response.statusCode).toBe(401)   
        expect(response.body.message).toEqual('Not authorized')
   
    })

    test('Negative case of updating a user with invalid new credientials', async () => {
        const user = new User({ name: 'John Dillinger', email: 'j.dillinger@gmail.com', password: '123a' })
        await user.save()
        const token = await user.generateAuthToken()

        const response = await request(app)
            .put(`/users/${user._id}`)
            .set('Authorization', `Bearer ${token}`)
            .send({ name: '', email: 'j.bdexample.com', password: 123 })
        console.log(response.body)
        expect(response.statusCode).toBe(400)
        expect(response.body).toHaveProperty('message')
    })

    test('Negative case of deleting a user when not authorized', async () => {
        const user = new User({ name: 'Goku', email: 'goku@example.com', password: '123a'})
        await user.save()

        const response = await request(app)
            .delete(`/users/${user._id}`)
        console.log(response.body)
        expect(response.statusCode).toBe(401)
        expect(response.body.message).toEqual('Not authorized')
    })
    test('Negative case of deleting a user when not logged in (same logic would apply when updating and logging out when not logged in)', async () => {
        const user = new User({ name: 'DB Cooper', email: 'db.cooper@example.com', password: '123a'})
        await user.save()
        const token = await user.generateAuthToken()
        user.isLoggedIn = false
        await user.save()

        const response = await request(app)
            .delete(`/users/${user._id}`)
            .set('Authorization', `Bearer ${token}`)
        console.log(response.body)
        expect(response.statusCode).toBe(400)
        expect(response.body.message).toEqual("Log back in!")
    })
})