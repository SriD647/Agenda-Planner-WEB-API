# **Welcome to Agenda Planner**

Agenda planner is simple web API that allows a user to plan their day by creating, updating, viewing, and deleting tasks (agenda items) on a date + time of their choice. Hence, this API has full CRUD functionality.  In addition, the user is able to sign up, login, logout, update  their profile, and delete their profile. 

## **Global installations**

1. Ensure you have node.js installed. To check if you already do, run the following command on terminal:<br> 
```
node -v
```
<br><br> If not, visit the following link and download based on your OS:<br> https://nodejs.org/en/download <br>

2. Ensure you have nodemon installed globally on your computer. To check this run terminal command: <br> ``nodemon -v``<br><br> If not, install nodemon globally using terminal command: <br> ``npm install -g nodemon``

## **How to install the app on your local machine**

Please follow the following steps to install a local copy of project:<br>

1. Copy the following HTTPs link of the remote repository:<br>

   ```
   https://github.com/SriD647/Week11-Homework.git
   ```
  

2. Use following command on terminal to create local directory on computer at location of your choice. This directory will host the local repository.
 <br>``mkdir filename``<br>
 
   Make sure to be in that file using the terminal command:<br>
    ` cd filename ` <br>
  
3. Enter and run the following command on the terminal, using the link from step 1 (replace word link with actual link from step 1).<br>` git clone link `<br>  You should now have local copy of the project in the created directory. Please make sure to be in the project folder with the use of terminal command:<br> `cd unit-2-project`<br>


## **Pre-run project set up**

4. Ensure you are in the project folder unit-2-project as instructed in step 3. Install the necesessary project dependencies in project folder using terminal command:<br>``npm i``<br>

5. Create a .env file and a .gitignore file in the project folder using the following terminal command:<br> ``touch .env .gitignore``<br> The purpose of the env file is to store sensitive information and git ignore prevents whatever is mentioned in it from being pushed into github.

6. Open the project on VS Code using terminal command:<br> ``code .``<br>

7. In the .env file add the following. Make sure to paste the appropriate information as instructed :<b> 
```
MONGO_URI= <paste here  your mongoDB uri>
SECRET= < paste here your secret unhashed key>
```

## **Technologies used**
- Express 
- Javascript
- Node.js
- Mongoose
- MongoDB
- Bcrypt (password encyption) & Jsonwebtoken (token authentication)
- Jest & Supertest (API endpoint testing)
- Artillerty (load testing)
