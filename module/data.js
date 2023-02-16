const exp = require("express");
const userApp = exp.Router();
const ObjectId = require('mongodb').ObjectId;
const { validateUsername, validatePassword } = require('./joi')
const bcryptjs=require("bcryptjs")
//middleware to parse  body of req
userApp.use(exp.json());

//define routes
//route for GET req for all users
userApp.get("/get-users", async (request, response) => {
  try {
    //get usercollectionobj
    let userCollectionObject = request.app.get("userCollectionObject");
    //get data
    let users = await userCollectionObject.find().toArray();
    //send res
    response.send({ message: "users data", payload: users });
  }
  // catch error 
  catch (err) {
    response.status(500).send({ error: error.message });
    // 500 status code because internal server error
  }
});


//route for POST req
userApp.post("/create-user", async (request, response) => {
  try {
    //get usercollectionobj
    let userCollectionObject = request.app.get("userCollectionObject");

    //get userObj from client
    let userObj = request.body;

    //validating username by calling validateUsername from joi.js module
    const userValidation = await validateUsername(userObj.username);
    if (userValidation.error) {
      console.log(`Username validation error: ${userValidation.error}`);
      response.send({ message: `Username validation error: ${userValidation.error}` });
    }
  
    //validating password by calling validatePassword from joi.js module
    const passwordValidation = await validatePassword(userObj.password);
    if (passwordValidation.error) {
      response.send({ message: `password validation error: ${passwordValidation.error}` });
    }
 
    //verify existing user
    let userOfDB = await userCollectionObject.findOne({
      username: userObj.username,
    });

    
    //if user existed 409 status code for user conflict
    if (userOfDB !== null) {
      response.status(409).send({ message: "User already Present" });
    }
    //if user not existed
    else {
      userObj.password =await bcryptjs.hash(userObj.password,7)
      await userCollectionObject.insertOne(userObj);
      //send res
      response.status(201).send({ message: "New User Created" });
    }
  }
  catch (error) {
    response.status(500).send({ error: error.message });
    // 500 status code because internal server error
  }
});


//route for PUT req
userApp.put("/update-user", async (request, response) => {
  try {
    //get usercollectionobj
    let userCollectionObject = request.app.get("userCollectionObject");
    //get userObj from client
    let userObj = request.body;

    //validating username by calling validateUsername from joi.js module
    const userValidation = await validateUsername(userObj.username);
    if (userValidation.error) {
      console.log(`Username validation error: ${userValidation.error}`);

      response.status(400).send({ message: `Username validation error: ${userValidation.error}` });
      return;
    }

    //validating password by calling validatePassword from joi.js module
    const passwordValidation = await validatePassword(userObj.password);
    if (passwordValidation.error) {
      console.log('Password validation error');
      response.status(400).send({ message: `password validation error: ${passwordValidation.error}` });
      return;
    }

    let userOfDB = await userCollectionObject.findOne({
      username: userObj.username,
    });

    //if user existed 409 status code for user conflict
    if (userOfDB === null) {
      response.status(409).send({ message: "User not Present" });
    }

    let res = await userCollectionObject.updateOne(
      { username: userObj.username },
      { $set: { ...userObj } }
    );

    //send res
    if (res.modifiedCount === 1)
      response.status(200).send({ message: "Put Request Successful" });
    else
      response.status(200).send({ message: "put request failed" });
  }
  catch (error) {
    response.status(500).send({ error: error.message });
    // 500 status code because internal server error
  }
});


//route for DELETE req
userApp.delete("/remove-user/:id", async (request, response) => {
  //get usercollectionobj

  let userCollectionObject = request.app.get("userCollectionObject");
  //get url param

  let userId = request.params.id;
  //delete user
  let res = await userCollectionObject.deleteOne({ "_id": ObjectId(userId) });
  //send res
  if (res.deletedCount === 1)
    response.send({ message: "Data deleted" });
  else
    response.send({ message: "deletion unsuccessful" })
});

//export userApp
module.exports = userApp;



/*
try catch template

  try{
 get request  response.status(200).send({ message: "users data", payload: users });} 
 post request response.status(201).send({message:"post request successful / new data created"})
  }
  // catch error 
  catch(err)
  {
    response.status(500).send({ error: error.message });
    // 500 status code because internal server error
  }
  */