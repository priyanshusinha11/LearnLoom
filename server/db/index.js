const mongoose = require("mongoose");

const learnerSchema = new mongoose.Schema({
    username: String,
    password: String,
    purchasedCourses: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Course' }]
});
const educatorSchema = new mongoose.Schema({
    username: String,
    password: String
});

const courseSchema = new mongoose.Schema({
    title: String,
    description: String,
    price: String,
    imageLink: String,
    published: Boolean
});

const Learner = mongoose.model('Learner', learnerSchema);
const Educator = mongoose.model('Educator', educatorSchema);
const Course = mongoose.model('Course', courseSchema);

module.exports = {
    Learner,
    Educator,
    Course
}