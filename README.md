# **Welcome to Agenda Planner**

Agenda planner is simple web API that allows a user to plan their day by creating, updating, viewing, and deleting tasks (agenda items) on a date + time of their choice. In addition, the user is able to sign up, login, logout, update  their profile, and delete their profile. Hence, this API has full CRUD functionality on both data entities (agenda items and user profile). 

---


## **<u>Trello Board</u>**<br>

<p align="center">
<img src="Project images/Wireframe 1- Login page.png" alt="Login page" style="height: 350px; width: 350px ">
</p><br>

<p align="center">
<img src="Project images/Wireframe 3- Home page.png" alt="Home page" style="height: 350px; width: 350px">
</p><br> 

<p>For the rest of the wireframes, relationship diagrams, and in-depth project journey details, please refer to my <a href="https://trello.com/b/nmL8ffzH/unit-2-project-trello-board">Trello board</a>.</p>

---


## **<u>Global installations**</u>

1. Ensure you have node.js installed. To check if you already do, run the following command on terminal:<br> <br>``node -v``<br><br> If not, visit the following link and download based on your OS: <a href="https://nodejs.org/en/download">Node.js</a> <br>

2. Ensure you have nodemon installed globally on your computer. To check this run terminal command: <br><br>
 ``nodemon -v``<br><br> 
 If not, install nodemon globally using terminal command: <br><br> ``npm install -g nodemon``

---

## **<u>How to install the app on your local machine**</u>

Please follow the following steps to install a local copy of project:<br>

1. Copy the following HTTPs link of the remote repository: <a href="https://github.com/SriD647/Week11-Homework.git">SSD</a><br>
  
2. Use following command on terminal to create local directory on computer at location of your choice. This directory will host the local repository.
 <br><br>``mkdir filename``<br>
 
   Make sure to be in that file using the terminal command:<br><br>``cd filename `` <br>
  
3. Enter and run the following command on the terminal, using the link from step 1 (replace word link with actual link from step 1).<br><br>` git clone link `<br><br>  You should now have local copy of the project in the created directory. Please make sure to be in the project folder with the use of terminal command:<br><br> `cd unit-2-project`<br>

---


## **<u>Pre-run project set up**</u>

1. Ensure you are in the project folder unit-2-project as instructed in step 3 from above. Install the necesessary project dependencies in project folder using terminal command:<br><br>``npm i``<br>

2. Create a .env file and a .gitignore file in the project folder using the following terminal command:<br><br> ``touch .env .gitignore``<br><br> The purpose of the env file is to store sensitive information and git ignore prevents whatever is mentioned in it from being pushed into github.

3. Open the project on VS Code using terminal command:<br><br> ``code .``<br>

4. In the .env file add the following. Make sure to paste the appropriate information as instructed :<br>

```
MONGO_URI= <paste here your mongoDB uri>
SECRET= <paste here your secret unhashed key>
```

---
## <u>**Running the application in dev mode**</u> <br>

Making sure we are still in the root directory of the project please run the following terminal command:<br><br>` npm run dev`<br>

If the app is running correctly, you will see the following messages on the terminal:<br>

``We are kickin' it on port: 3000``  <br>

``Mongo is lit!``<br>

The former indicates the server is up and running and the latter indicates you are successfully connected to the database.

---
## <u>**Understanding the data entities and their schemas**</u> <br>

It is important to satisfy the requirements of the Mongoose schema for both entities, as all instances will be stored in  the data base with this blueprint. If schema says something is required and/or must be unique (something else cannot have the same value) this must be respected or the request will fail.

The following is the Mongoose schema for the user data entity:<br>


<img src="Project images/User schema.png" alt="PM 1" style="height: 250px"><br>

The following table helps us understand the user schema better when we create a new user. It includes the key, data type, example format, if it is required, and if it must be unique:<br>

```
Name     | String | "Firstname Lastname" | Required | Uniqueness not required
Email    | String | "abc@gmail.com"      | Required | Uniqueness required
Password | String | "123a"               | Required | Uniqueness not required

```

Please note all only the keys of name, email, and password are required when creating a user. For logging in, name is no longer required and the email + password can suffice.

The following is the Mongoose schema for the agenda item data entity:<br>

<img src="Project images/AI schema.png" alt="PM 1" style="height: 250px"><br>

The following table, similar to above helps us understand the agenda item schema better for when we create a new agenda item.<br>

```
title       | String | "Working"    | Required     | Uniqueness not required
description | String | "Leg day"    | Not required | Uniqueness not required
date        | String | "2023-07-08" | Required     | Uniqueness not required
startTime   | String | "07:00 AM"   | Required     | Uniqueness not required
endTime     | String | "07:00 AM"   | Required     | Uniqueness not required
```
<br>

Please note that desciption is optional and the only key from the table not required when creating a new item. It is also important to know that no two agenda items can have the same date, startTime, and endTime (as described in the controller).


## <u>**List of API requests**</u> <br>

As mentioned the web api has full CRUD functionality in both of the data entities. This is made possible through the API requests that make this happen.<br>

It is important to note that most API requests require the user to be logged in and authorized (via JWT authentication). A JWT token is generated only when the user `creates a user` profile and when the user `logs in`. This token enables the user to make the requests that require this authorization. <br>

The following shows all the API requests the web api is capabale of for both entities. It includes, the http request method, url, intended operation, and clarifies which API requests require JWT authentication: <br>

### **Users**
```
POST   | localhost:3000/users        | Creates a user                    | Creates a JWT
POST   | localhost:3000/users/login  | Logs in a user                    | Creates a JWT
POST   | localhost:3000/users/logout | Logs out a user                   | Requires a JWT
GET    | localhost:3000/:id          | Views a user profile by user id   | Requires a JWT
PUT    | localhost:3000/:id          | Updates a user profile by user id | Requires a JWT
DELETE | localhost:3000/:id          | Deletes a user profile by user id | Requires a JWT
```

### **Agenda items**
```
POST   | localhost:3000/agendaItems/new                | Creates a new agenda item for user           | Requires a JWT 
GET    | localhost:3000/agendaItems/:id                | Views a user agenda item by its id           | Requires a JWT 
GET    | localhost:3000/agendaItems/entireAgenda       | Views all user agenda items                  | Requires a JWT
GET    | localhost:3000/agendaItems/date/:id           | Views all user agenda items on specific date | Requires a JWT
PUT    | localhost:3000/agendaItems/:id                | Updates a user agenda item by its id         | Requires a JWT
DELETE | localhost:3000/agendaItems/:id                | Deletes a user agenda item by its id         | Requires a JWT
DELETE | localhost:3000/agendaItems/entireAgenda/clear | Deletes all agenda items of user             | Requires a JWT
```

All API requests should return a status code and a response body. Successful requests return 200 series status codes with the intended information as the response body. Unsuccessful requests return status codes of 400 series with an error message as the response body.<br>


---

## **Examples of how to run API request on POSTMAN**

The following are two examples with step by step instructions and screenshots on how to run API requests on POSTMAN. Please visit their website for instructions on how to use browser edition and/or desktop edition:  <a href="https://www.postman.com/">POSTMAN</a>



### **Creating a user**

Start off by choosing the HTTP method as POST. In the URL bar, paste the appropriate URL for creating a user (as mentioned in previous section): `localhost:3000/users`. In the body tab choose `raw` and `JSON`. Copy the following code into the request body, and click send. Note that the request body follows the requirements of the user schema.:<br>

```
{
    "name": "FirstName LastName",
    "email": "first.last@gmail.com",
    "password": "123a"
}
```

Refer to the following screen shot:

<img src="Project images/Postman 1.png" alt="PM 1" style="width: 800px;height: 250px"><br>

Notice the response body and status code that are returned:<br>

<img src="Project images/Postman 2.png" alt="PM 2"><br>

Important details:<br>

- Status code of 200 and intended response of user + token objects, indicating a successful request
- An _id key which stores the unique id of this user object
- The name, email, and password passed into the request body. Note the password is now hashed.
- The agendaItems key in the user object which stores the id's of all agenda items the user creates
- isLoggedIn key in user object is set to true, meaning the user is now logged in
- A token key, which stores the JWT. Please copy this token as it will be used for any future API request that requires authenthorization (e.g. creating an agenda item). <br>

A user object with this information will now exist in the database.

### **Creating an agenda item**

Start off by choosing the HTTP method as POST. In the URL bar, paste the appropriate URL for creating a new agenda item: `localhost:3000/agendaItems/new`.Copy the following code below into the request body. Note that the request body follows the requirements of the agenda item schema.:<br>

```
{
    "title": "Study",
    "description": "Unit 1 and 2 review",
    "date": "2023-07-08",
    "startTime": "08:00 AM",
    "endTime": "10:00 AM"
}
```
Refer to the following screen shot:

<img src="Project images/Postman 3.png" alt="PM 3" style="width: 800px;height: 250px"><br>

Before clicking send, we must add the authentication token copied from previous step (create a user). This is because creating an agenda item is a request that requires the user to be authorized. Go to the authorization tab in Postman and from the type dropdown, select the option "Bearer Token". Then paste the token into the form bar. Refer to the screenshot below <br>

<img src="Project images/Postman 5.png" alt="PM 3"><br>

Once the token is pasted, click send to send the API request. Notice the response body and status code that are returned:<br>

<img src="Project images/Postman 4.png" alt="PM 4"><br>

Important details:<br>

- Status code of 200 and intended response of agenda item object, indicating a successful request
- The title, desciption, date, startTime, and endTime from the request body 
- A user key which stores the id of the user this agenda item belongs to (same id from previous step)
- An _id key which stores the unique id of this agenda item object <br>

An agenda item object with this information will now exist in the database.<br><br>

## **How to run tests**

Jest and Supertest were used to test for the API endpoints for both data entities and ensure the expected behavior and correctness of the server's responses. Both successful and negative cases were tested for (29 total) and all resulted in a pass. To run Jest and Supertest run the following command in the terminal (please make sure you are in the project directory unit-2-project): `npm run test`<br><br>

## **How to start the app without dev mode**

To start the app without dev mode, once again make sure you are in the right directory (unit-2-project) and run the following terminal command: `npm start`



## **Technologies used**
- Express 
- Javascript 
- Node.js
- Mongoose
- MongoDB 
- Bcrypt (password encyption) & Jsonwebtoken (token authentication)
- Jest & Supertest (API endpoint testing)
- Artillerty (load testing)
- POSTMAN (manual testing)
- Excalidraw (wireframes) and Trello (project journey)

---
