const exp = require("express");
const userApp = exp.Router();
const ObjectId = require('mongodb').ObjectId;
const { validateUsername, validatePassword } = require('./joi');


//middleware to parse  body of req
userApp.use(exp.json());

//define routes
//route for GET req for all users
userApp.get("/get-users", async (request, response) => {
  //get usercollectionobj
  let userCollectionObject = request.app.get("userCollectionObject");
  //get data
  let users = await userCollectionObject.find().toArray();
  //send res
  response.send({ message: "users data", payload: users });
});



//route for POST req
userApp.post("/create-user", async (request, response) => {
  //get usercollectionobj
  let userCollectionObject = request.app.get("userCollectionObject");
  //get userObj from client
  let userObj = request.body;

  //validating username by calling validateUsername from joi.js module
  const userValidation = await validateUsername(userObj.username);
  if (userValidation.error) {
    console.log(`Username validation error: ${userValidation.error}`);

    response.send({ message: `Username validation error: ${userValidation.error}` });
    return;
  }

  //validating password by calling validatePassword from joi.js module
  const passwordValidation = await validatePassword(userObj.password);
  if (passwordValidation.error) {
    console.log('Password validation error');
    response.send({ message: `password validation error: ${passwordValidation.error}` });
    return;
  }


  //verify existing user
  let userOfDB = await userCollectionObject.findOne({
    username: userObj.username,
  });



  //if user existed
  if (userOfDB !== null) {
    response.send({ message: "User already Present" });
  }
  //if user not existed
  else {
    await userCollectionObject.insertOne(userObj);
    //send res
    response.send({ message: "New User Created" });
  }
});



//route for PUT req
userApp.put("/update-user", async (request, response) => {
  //get usercollectionobj
  let userCollectionObject = request.app.get("userCollectionObject");
  //get userObj from client
  let userObj = request.body;


  //validating username by calling validateUsername from joi.js module
  const userValidation = await validateUsername(userObj.username);
  if (userValidation.error) {
    console.log(`Username validation error: ${userValidation.error}`);

    response.send({ message: `Username validation error: ${userValidation.error}` });
    return;
  }

  //validating password by calling validatePassword from joi.js module
  const passwordValidation = await validatePassword(userObj.password);
  if (passwordValidation.error) {
    console.log('Password validation error');
    response.send({ message: `password validation error: ${passwordValidation.error}` });
    return;
  }


  let res = await userCollectionObject.updateOne(
    { username: userObj.username },
    { $set: { ...userObj } }
  );

  //send res
  if (res.modifiedCount === 1)
    response.send({ message: "Put Request Successful" });
  else
    response.send({ message: "put request failed" });
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
