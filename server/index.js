const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const educatorRouter = require("./routes/educator");
const learnerRouter = require("./routes/learner");
// const MongoClient = require('mongodb').MongoClient;

const app = express();
app.use(cors());
app.use(express.json());
app.use("/educator", educatorRouter)
app.use("/learner", learnerRouter)

app.get("/", (req, res) => res.json({ message: "this might work" }));
mongoose.connect('mongodb://127.0.0.1:27017/LearnLoom', { useNewUrlParser: true, useUnifiedTopology: true, dbName: "LearnLoom" });
// const mongoURI = 'mongodb://127.0.0.1:27017/LearnLoom';
// mongoose.connect(mongoURI, { dbName: 'LearnLoom' });
// mongoose.Promise = global.Promise;
// const db = mongoose.connection;
// db.on('error', console.error.bind(console, 'MongoDB connection error:'));
// db.once('open', function () {
//     console.log('Connected successfully to MongoDB');
//     mongoose.connection.close();
// });

app.listen(3000, () => console.log('Server running on port 3000'));