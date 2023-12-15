const mongoose = require('mongoose');
const express = require('express');
const jwt = require('jsonwebtoken');
const { Learner, Course, Educator } = require("../db");
const { authenticateJwt, SECRET } = require("../middleware/auth");

const router = express.Router();

router.post('/signup', (req, res) => {
    const { username, password } = req.body;
    function callback(educator) {
        if (educator) {
            res.status(403).json({ message: 'Educator already exists' });
        } else {
            const obj = { username: username, password: password };
            const newEducator = new Educator(obj);
            newEducator.save();
            const token = jwt.sign({ username, role: 'educator' }, SECRET, { expiresIn: '1h' });
            res.json({ message: 'Eduactor created successfully', token });
        }
    }
    Educator.findOne({ username }).then(callback);
});

router.post('/login', async (req, res) => {
    const { username, password } = req.headers;
    const educator = await Educator.findOne({ username, password });
    if (educator) {
        const token = jwt.sign({ username, role: 'educator' }, SECRET, { expiresIn: '1h' });
        res.json({ message: 'Logged in successfully', token });
    } else {
        res.status(403).json({ message: 'Invalid username or password' });
    }
});

router.post('/courses', authenticateJwt, async (req, res) => {
    const course = new Course(req.body);
    await course.save();
    res.json({ message: 'Course created successfully', courseId: course.id });
});

router.put('/courses/:courseId', authenticateJwt, async (req, res) => {
    const course = await Course.findByIdAndUpdate(req.params.courseId, req.body, { new: true });
    if (course) {
        res.json({ message: 'Course updated successfully' });
    } else {
        res.status(404).json({ message: 'Course not found' });
    }
});

router.get('/courses', authenticateJwt, async (req, res) => {
    const courses = await Course.find({});
    res, json({ courses });
});

router.get('/course/:courseId', authenticateJwt, async (req, res) => {
    const courseId = req.params.courseId;
    const course = await Course.findById(courseId);
    res.json({ course });
});

module.exports = router