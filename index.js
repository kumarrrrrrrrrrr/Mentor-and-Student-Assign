const express = require("express");
const app = express();
const mongodb = require("mongodb");
const mongoClient = mongodb.MongoClient;
const dotenv = require('dotenv').config()
const URL = process.env.DB;

//middleware
app.use(express.json());

app.get("/", (req, res) =>
  res.send(`Server Running Sucessfully`)
);


//Create Mentor
app.post("/mentor", async function (request, response) {
  try {
    const connection = await mongoClient.connect(URL);
    const db = connection.db("studentTeacher");
    await db.collection("mentors").insertOne(request.body);
    await connection.close();

    response.json({
      message: "Mentor added!!!",
    });
  } catch (error) {
    console.log(error);
  }
});

//Create Student
app.post("/student", async function (request, response) {
  try {
    const connection = await mongoClient.connect(URL);
    const db = connection.db("studentTeacher");
    await db.collection("students").insertOne(request.body);
    await connection.close();

    response.json({
      message: "student added!!!",
    });
  } catch (error) {
    console.log(error);
  }
});

//Get Mentors
app.get("/mentors", async function (request, response) {
  try {
    const connection = await mongoClient.connect(URL);
    const db = connection.db("studentTeacher");
    const mentors = await db.collection("mentors").find().toArray();
    await connection.close();

    response.json(mentors);
  } catch (error) {
    console.log(error);
  }
});

//get students
app.get("/students", async function (request, response) {
  try {
    const connection = await mongoClient.connect(URL);
    const db = connection.db("studentTeacher");
    const students = await db.collection("students").find().toArray();
    await connection.close();

    response.json(students);
  } catch (error) {
    console.log(error);
  }
});

//assign students to mentor
app.put("/mentor/:id", async function (request, response) {
  try {
    const connection = await mongoClient.connect(URL);
    const db = connection.db("studentTeacher");
    await db
      .collection("mentors")
      .updateOne(
        { _id: mongodb.ObjectId(request.params.id) },
        { $push: { students: mongodb.ObjectId(request.body) } }
      );
    response.json({
      message: "Updated students",
    });
  } catch (error) {
    console.log(error);
  }
});

//assign mentor to student
app.put("/student/:id", async function (request, response) {
  try {
    const connection = await mongoClient.connect(URL);
    const db = connection.db("studentTeacher");
    await db.collection("students").updateOne(
      { _id: mongodb.ObjectId(request.params.id) },
      // { $push: { mentor: request.body } }
      { $set: { mentor: request.body } }
    );
    response.json({
      message: "Updated mentor",
    });
  } catch (error) {
    console.log(error);
  }
});

//get student for particular mentor
app.get("/mentor/:id/assignedstudents", async function (request, response) {
  try {
    const connection = await mongoClient.connect(URL);
    const db = connection.db("studentTeacher");
    const mentors = await db
      .collection("mentors")
      .find(
        { _id: mongodb.ObjectId(request.params.id) },
        { name: 1, students: 1, _id: 0 }
      )
      .toArray();
    await connection.close();

    response.json(mentors);
  } catch (error) {
    console.log(error);
  }
});

//get students without mentor
app.get("/no-mentors", async function (request, response) {
  try {
    const connection = await mongoClient.connect(URL);
    const db = connection.db("studentTeacher");
    const students = await db
      .collection("students")
      .find({ mentor: undefined })
      .toArray();
    await connection.close();

    response.json(students);
  } catch (error) {
    console.log(error);
  }
});

app.listen(process.env.PORT || 3001 ,()=>
  console.log("server running ")
);
