const exp=require("express");
const mongoClient=require("mongodb").MongoClient;
const path=require("path")
const app=exp()
const cors = require('cors')
app.use(cors())
//connecting react build with express server
app.use(exp.static(path.join(__dirname, "./build")));

const dbConnectionString="mongodb+srv://madhu:madhu@clusterbackend.szevd.mongodb.net/myfirstdb?retryWrites=true&w=majority"

//connect to DB
mongoClient.connect(dbConnectionString)
.then(client=>{
  //create DB object
  const dbObj=client.db("crudpractice");
  //get collection object
  const userCollectionObject=dbObj.collection("data")
  //share userCollectionObj
  app.set("userCollectionObject",userCollectionObject)
  

  console.log("Connected to DB successfully")
})
.catch(err=>console.log("err in connecting to DB ",err))


//homepage
app.get('/', function (req, res) {
  console.log("Got a GET request for the homepage");
  res.send('Hello GET');
})

//import userApp&productApp
const userApp = require("./module/data");
const loginApp = require("./module/login")

//execute routes based on path
app.use("/user",userApp)

app.use("/login",loginApp)

//assign port
const port=4000;
app.listen(port,()=>console.log("server on port 4000..."))