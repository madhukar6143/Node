 const exp = require("express");
const loginApp = exp.Router();
const validateCredentials = require('./joiasfunction')
const bcryptjs = require("bcryptjs")
const jwt = require("jsonwebtoken")
require('dotenv').config();
const secretKey = process.env.SECRET_KEY;

loginApp.use(exp.json());

loginApp.post("/login", async (request, response) => {
    try {
        //importing mongoclient object
        let userCollectionObject = await request.app.get("userCollectionObject");

        //get userObj from client
        let userObj = request.body;
        let bearerToken=request.headers.authorization;
        console.log(bearerToken)

        //validating Credentials  by calling validateCredentails function from joiasfunction module
        // 401 status code if data is unauthorized
        const userValidation = await validateCredentials(userObj.username, userObj.password);
        if (userValidation)
            response.status(401).send({ message: `validation error: ${userValidation}` });


        // check whether user present or not
        let userOfDB = await userCollectionObject.findOne({ username: userObj.username });
        if (userOfDB == null) {
            response.status(404).send({ message: "User not found" })
        }
        // if user present checkpassword
        let result = await bcryptjs.compare(userObj.password, userOfDB.password)
        // false indicate mismatch
        if (result === false) {
            response.status(401).send({ message: "Invalid pass/ UnAuthorized Access" })
        }
        else {
            //create token
            let tokened = jwt.sign({ username: userObj.username }, secretKey , { expiresIn: 1000 })
            response.status(201).send({ message: "Login successful", token: tokened, username: userObj.username })
        }
    }
    // catch error 
    catch (error) {
        response.status(500).send({ error: error.message });
        // 500 status code because internal server error
    }
})

module.exports = loginApp;