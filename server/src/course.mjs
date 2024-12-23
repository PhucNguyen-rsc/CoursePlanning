import mongoose from 'mongoose';

const User = mongoose.model('User');
const Course = mongoose.model('CourseList');

const findCourse = async (data) => {
    if (data.school === "" & data.major === "" & data.course === ""){
        throw ({message: 'ENTER SCHOOL ID, MAJOR ID, OR COURSE ID'});
    }

    const filteredData = Object.fromEntries(
        Object.entries(data).filter(([key, value]) => value !== ""))

    const foundCourse = await Course.find(filteredData)
    
    if (foundCourse.length === 0){
        throw ({message: 'COURSE DO NOT FOUND'});
    }
    return foundCourse;
}

const addCourseToUser = async (user, slugNeed) => {
    try {
        const foundCourse = await Course.findOne({slug: slugNeed});
        const foundUser = await User.findOne({username: user})
    
        if (foundUser.credits < foundCourse.credits){
            throw ({ message: 'NOT ENOUGH CREDITS'});
        }

        if (foundUser.courses.includes(foundCourse._id)){
            throw ({ message: 'COURSE ALREADY EXISTS'});
        }
    
        else{
            const updatedUser = await User.findOneAndUpdate(
                { username: user},
                { $addToSet: { courses: foundCourse._id } },
                { new: true }
            );
            
            if (!updatedUser) {
                throw ({ message: 'COURSE ADDING FAILED'});
            }
        }
    
        return {message: null};
    }
    catch (err){
        return err;
    }

}

const displayUserCourse = async (user) => {
    console.log("Start finding user");
    const userWithCourses = await User.findOne({ username: user })
    .populate('courses')
    .exec();

    console.log("Found user: ", userWithCourses);
    
    return userWithCourses.courses;
}

const addCourse = async (course, user) => {
    try {
        console.log(course, user);
        const slug = `${course.schoolID}-${course.majorID}-${course.courseID}-${course.sectionID}`;
        const foundCourse = await Course.find({slug: slug});

        if (foundCourse.length > 0){
            throw ({message:"Course already exists!"})
        }

        Object.entries(course).forEach(([key, value]) => {
            if (typeof value === 'string' && value.trim() === '') {
                throw ({message: `The field ${key} must not be empty`})
            } else if (typeof value === 'number' && value === 0) {
                throw ({message: `Please select a valid value from the field ${key}`})
            }
         });

        const addCourse = new Course({
            schoolID: course.schoolID,
            majorID: course.majorID,
            courseID: course.courseID,
            sectionID: course.sectionID,
            name: course.name,
            credits: course.credits,
            instructor: course.instructor,
            description: course.description,
            instruction_mode: course.instruction_mode,
        })


        addCourse.save()
        .catch((err) => {throw (err)})

        const foundUser = await User.findOne({username: user})
    
        if (foundUser.credits < addCourse.credits){
            throw ({ message: 'NOT ENOUGH CREDITS TO ADD MORE CLASSES'});
        }

        const updatedUser = await User.findOneAndUpdate(
            { username: user},
            { $addToSet: { courses: addCourse._id } },
            { new: true }
        );
        
        if (!updatedUser) {
            throw ({ message: 'COURSE ADDING FAILED'});
        }

        // console.log("GOOOD!")
        return {message: null}
    }
    catch (err){
        return err
    }
}

export {findCourse, addCourseToUser, addCourse, displayUserCourse};