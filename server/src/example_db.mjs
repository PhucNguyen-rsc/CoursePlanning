import './config.mjs';
import './db.mjs';
import mongoose from 'mongoose';

console.log(process.env.DSN)
mongoose.connect(process.env.DSN);

//examples to first populate the database

const CourseList = mongoose.model('CourseList');

const newCourse = new CourseList({
    schoolID: 8,
    majorID: "NUTR-UE",
    courseID: 85,
    sectionID: 1,
    name: "Intro to Foods and Food Science",
    credits: 4,
    instructor: "Robin Chu",
    description: "Introduction to cooking class for Nutritionist Major",
    instruction_mode: 'in-person',
    time: [
      {time_date: 'monday', time_start: 10, time_end: 12},
      {time_date: 'wednesday', time_start: 10, time_end: 12}
    ],
});
  
  // Save the course to the database
newCourse.save()
.then((savedCourse)=> console.log(savedCourse))
// .then(mongoose.connection.close())