import './config.mjs';
import './db.mjs';
import mongoose from 'mongoose';
import sanitize from 'mongo-sanitize';

import express from 'express';
import session from 'express-session';
import path from 'path';
import url from 'url';
import * as auth from './auth.mjs';
import * as course from './course.mjs'
import cors from 'cors';

const app = express();
const __dirname = path.dirname(url.fileURLToPath(import.meta.url));

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use(session({
secret: 'secret',
resave: false,
saveUninitialized: true,
}));

app.use(cors());

const loginMessages = {"PASSWORDS DO NOT MATCH": 'Incorrect password', "USER NOT FOUND": 'User doesn\'t exist'};
const registrationMessages = {"USERNAME ALREADY EXISTS": "Username already exists", "USERNAME PASSWORD TOO SHORT": "Username or password is too short"};
const courseFindMessages = {
    'ENTER SCHOOL ID, MAJOR ID, OR COURSE ID': "Must enter at least one of the following(s): School ID, Major ID, or Course ID!",
    'COURSE DO NOT FOUND': "Courses cannot be found, either enter the section(s) again or add new courses!"
}
const courseAddMessages = {
    'COURSE ALREADY EXISTS': "This course already in your schedule!",
    'NOT ENOUGH CREDITS': "Your enrolled credits exceed maximum!"
}

app.get("/", (req, res) => {
    res.send("Hello from server!")
})

app.post('/register', async (req, res) => {
try {
    const newUser = await auth.register(
    sanitize(req.body.username), 
    sanitize(req.body.email), 
    req.body.password
    );
    await auth.startAuthenticatedSession(req, newUser);
    res.json({name: req.body.username, courses: req.body.courses, errMessage: null}); //successful
} catch(err) {
    console.log(err);
    res.json({ errMessage: registrationMessages[err.message] ?? 'Register unsuccessful'}); //unsuccessful
}
});

app.post('/login', async (req, res) => {
try {
    const user = await auth.login(
    sanitize(req.body.username), 
    req.body.password
    );
    await auth.startAuthenticatedSession(req, user);
    res.json({ name: req.body.username, courses: req.body.courses, errMessage: null });
} catch(err) {
    console.log("Error message:" , err);
    res.json({errMessage: loginMessages[err.message] ?? 'Login unsuccessful'});
}
});

app.post('/course_search', async (req, res) => {
    try {
        const foundCourse = await course.findCourse(req.body) ;
        res.json({courses: foundCourse, errMessage: null});
    }
    catch(err){
        console.log("Error message:" , err);
        res.json({errMessage: courseFindMessages[err.message] ?? 'Find Course Unsuccessful. Please try again!'});
    }
})

app.post('/fetch_courses', async (req, res) => {
    const courses = await course.displayUserCourse(req.body.user);
    res.json({courses: courses});
})

app.post("/add_user_course", async (req, res) => {
    // try {
    const errMsg = await course.addCourseToUser(req.body.user, req.body.slug);
    if (errMsg.message  === null){
        res.json({errMessage: null});
    }
    else {
        console.log("Error message: ", errMsg.message);
        res.json({errMessage: courseAddMessages[errMsg.message] ?? "Adding course failed!"});
    }
})

app.post("/add_course", async (req, res) => {
    // try {
    console.log(req.body);
    const errMsg = await course.addCourse(req.body.course, req.body.user);

    if (errMsg.message  === null){
        res.json({errMessage: null});
    }
    else {
        console.log("Error message: ", errMsg);
        res.json({errMessage: errMsg.message});
    }
})

app.listen(process.env.PORT || 3000);

export default app
