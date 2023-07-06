# **Welcome to Agenda Planner**

Agenda planner is simple web API that allows a user to plan their day by creating, updating, viewing, and deleting tasks (agenda items) on a date + time of their choice. In addition, the user is able to sign up, login, logout, update  their profile, and delete their profile. Hence, this API has full CRUD functionality on both data entities (agenda items and user profile). 

---


## **<u>Wireframes and relationship diagram</u>**<br>

  <img src="images/Wireframe 1- Login page.png" alt="Login page"><br>

  <img src="images/Wireframe 3- Home page.png" alt="Home page"><br>


<p>For more wireframes and more in-depth project journey details, please refer to my <a href="https://trello.com/b/nmL8ffzH/unit-2-project-trello-board">Trello board</a>.</p>

---


## **<u>Global installations**</u>

1. Ensure you have node.js installed. To check if you already do, run the following command on terminal:<br> <br>``node -v``<br><br> If not, visit the following link and download based on your OS:<br> https://nodejs.org/en/download <br><br>

2. Ensure you have nodemon installed globally on your computer. To check this run terminal command: <br><br>
 ``nodemon -v``<br><br> 
 If not, install nodemon globally using terminal command: <br><br> ``npm install -g nodemon``

---

## **<u>How to install the app on your local machine**</u>

Please follow the following steps to install a local copy of project:<br>

1. Copy the following HTTPs link of the remote repository:<br>

   `` https://github.com/SriD647/Week11-Homework.git``<br>
  

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
<br>


```
MONGO_URI= <paste here your mongoDB uri>
SECRET= <paste here your secret unhashed key>
```
<br>

---

## <u>**Running the application in dev mode**</u> <br>

Making sure we are still in the root directory of the project please run the following terminal command:<br><br>` npm run dev`<br><br>

If the app is running correctly, you will see the following messages on the terminal:<br>

``We are kickin' it on port: 3000``  <br>

``Mongo is lit!``<br>

The former indicate the server is up and running and the latter indicates you are successfully connected to the database.

---

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
