const express = require('express');
const jwt = require('jsonwebtoken');
const { Learner, Course, Educator } = require("../db");
const { authenticateJwt, SECRET } = require("../middleware/auth");

const router = express.Router();

router.post('/signup'.replace, async (req, res) => {
    const { username, password } = req.body;
    const learner = await Learner.findOne({ username });
    if (learner) {
        res.status(403).json({ message: 'Learner already exists' });
    } else {
        const newLearner = new Learner({ username, password });
        await newLearner.save();
        const token = jwt.sign({ username, role: 'learner' }, SECRET, { expiresIn: '1h' });
        res.json({ message: 'Learner created successfully', token });
    }
});

router.post('/login', async (req, res) => {
    const { username, password } = req.headers;
    const learner = await Learner.findOne({ username, password });
    if (learner) {
        const token = jwt.sign({ username, role: 'learner' }, SECRET, { expiresIn: '1h' });
        res.json({ message: 'Logged in successfully', token });
    } else {
        res.status(403).json({ message: 'Invalid username or password' });
    }
});

router.get('/courses', authenticateJwt, async (req, res) => {
    const courses = await Course.find({ published: true });
    res.json({ courses });
});

router.post('/courses/:courseId', authenticateJwt, async (req, res) => {
    const course = await Course.findById(req.params.courseId);
    console.log(course);
    if (course) {
        const learner = await Learner.findOne({ username: req.learner.username });
        if (learner) {
            learner.purchasedCourses.push(course);
            await learner.save();
            res.json({ message: 'Course purchased successfully' });
        } else {
            res.status(403).json({ message: 'Learner not found' });
        }
    } else {
        res.status(404).json({ message: 'Course not found' });
    }
})

router.get('/purchasedCourses', authenticateJwt, async (req, res) => {
    const learner = await Learner.findOne({ username: req.learner.username }).populate('purchasedCourses');
    if (learner) {
        res.json({ purchasedCourses: learner.purchasedCourses || [] });
    } else {
        res.status(403).json({ message: 'Learner not found' });
    }
});

module.exports = router