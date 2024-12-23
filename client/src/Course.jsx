import React, { useState, useEffect , useContext, createContext} from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './index.css';
import './Course.css';
import MyContext from './user.jsx';
import {REACT_APP_API_URL, BACKEND_URL} from './config.mjs';

const schoolDictionary = { //push this to MongoDB later
    1: "Tandon School of Engineering",
    2: "Stern School of Business",
    3: "College of Arts and Science",
    4: "Gallatin School of Individualized Study",
    5: "Graduate School of Arts and Science",
    6: "College of Dentistry",
    7: "Rory Meyers College of Nursing",
    8: "Steinhardt School of Culture, Education, and Human Development",
    9: "School of Law",
    10: "School of Professional Studies",
    11: "NYU Abu Dhabi",
    12: "NYU Shanghai"
}

const gradingDictionary = {
    1: "Tandon Graded",
    2: "Stern Graded",
    3: "CAS Graded",
    4: "Gallatin Graded",
    5: "GCAS Graded",
    6: "NYU DEN Graded",
    7: "NYU Meyers Graded",
    8: "Steinhardt Graded",
    9: "NYU Law Graded",
    10: "NYU SPS Graded",
    11: "NYUAD Graded",
    12: "NYUSH Graded",
}

const ShowCourseForm = () => {
    const location = useLocation(); //state: { name: data.username, courses: data.courses} --> from login app
    // console.log(location)
    const navigate = useNavigate();
    const { user } = useContext(MyContext);
    const [courses, setCourses] = useState(null);

    useEffect(() => {
        const fetchCourseData = async () => {
          try {
            const response = await fetch(BACKEND_URL + '/fetch_courses', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({user: user}),
              });
        
            const data = await response.json();
            setCourses(data.courses);
          } 
          catch (err) {
            console.log(err);
          }
        };
    
        fetchCourseData();
      }, []); 


    function sendEditForm(){
        navigate("/courses/edit") 
    }

    return (
    <div className="course-container">
        <p>Hello {user} !</p>
        <p>Below are your courses this semester: </p>
        <div className="max-h-[70vh] overflow-y-auto">
        {courses && courses.map((course, index) => (
        <div 
            key={index} 
            className="bg-orange-400 p-4 mb-2 rounded-lg shadow-sm hover:shadow-md transition-shadow"
        >
            <h3 className="text-xl font-semibold mb-2">{course.name}</h3>
            <div className="text-gray-800 max-h-[70vh] overflow-y-auto">
            <p className="mb-1">Description: {course.description}</p>
            <p className="mb-1">Professor: {course.instructor}</p>
            <p className="mb-1">Course ID: {course.courseID}</p>
            <p>Credits: {course.credits}</p>
            </div>

        </div>
        ))}
        </div>
        <a onClick = {sendEditForm} className="text-blue-500 hover:text-blue-700 active:text-purple-400 visited:text-purple-400" >Edit/ Add courses: </a>
    </div>);
}

const ShowEditForm = () => {
    // const location = useLocation();
    // const { name, courses } = location.state || {}; //state: { name: data.username, courses: data.courses} --> from ShowCourseForm
    const navigate = useNavigate();
    const { user } = useContext(MyContext);
    const [courses, setCourses] = useState(null);

    useEffect(() => {
        const fetchCourseData = async () => {
          try {
            const response = await fetch(BACKEND_URL + '/fetch_courses', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({user: user}),
              });
        
            const data = await response.json();
            setCourses(data.courses);
          } 
          catch (err) {
            console.log(err);
          }
        };
    
        fetchCourseData();
      }, []); 

    function sendAddForm(){
        navigate("/courses/edit/add")
    }

    return (
        <>
        <h1 className="font-bold text-red-500">Add Courses</h1>
        <a onClick = {sendAddForm} className="text-blue-500 hover:text-blue-700 active:text-purple-400 visited:text-purple-400">Add more courses</a>
        <div className="max-h-[70vh] overflow-y-auto">
        {courses && courses.map((course, index) => (
        <div 
            key={index} 
            className="bg-orange-400 p-4 mb-2 rounded-lg shadow-sm hover:shadow-md transition-shadow"
        >
            <h3 className="text-xl font-semibold mb-2">{course.name}</h3>
            <div className="text-gray-800">
            <p className="mb-1">Description: {course.description}</p>
            <p className="mb-1">Professor: {course.instructor}</p>
            <p className="mb-1">Course ID: {course.courseID}</p>
            <p>Credits: {course.credits}</p>
            </div>

        </div>
        ))}
        </div>     
        </>
    )
}

const AddButton = ({details}) => {
    const { user, setUser } = useContext(MyContext);
    let [message, setMessage] = useState(null);
    let [OKBtn, setOKBtn] = useState(false);

    async function add(evt){
        evt.preventDefault();

        const slugFound = `${details.schoolID}-${details.majorID}-${details.courseID}-${details.sectionID}`; //unique ID to search for classes
        
        const response = await fetch(BACKEND_URL + '/add_user_course', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({slug: slugFound, user: user}),
          });
    
          const data = await response.json();
          if (!data.errMessage) { //successful
            setOKBtn(true);
          }
          else {
            setMessage(data.errMessage);
          }
    }

    console.log("Okay btn status: ", OKBtn);

    return (
        <>
        {OKBtn ? 
        (
            <button className="text-green-600 text-xl cursor-default">
                ✓ Added
            </button>
        )   

        : (
            <>
                {message ? <div className="bg-red-200 p-1 mb-4 text-center">{message}</div> : null}
                <button onClick={add} className = "mt-6 inline-block bg-blue-300 text-white px-6 py-2 rounded hover:bg-blue-500"> 
                    Add course
                </button>
            </>
        )}
        </>
    );
}


function CourseDetails({course}) {
    return (
      <div className="p-6 border rounded-lg shadow-sm max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">{course.name}</h1>
        
        <p className="text-lg mb-8">
        {course.description}
        </p>
  
        <div className="grid grid-cols-2 gap-6 mb-8">
          <div>
            <h2 className="font-bold">School:</h2>
            <p>{schoolDictionary[course.schoolID]}</p>
          </div>
          <div>
            <h2 className="font-bold">Term:</h2>
            <p>Fall 2024</p>
          </div>
        </div>
  
        <div className="grid grid-cols-2 gap-6">
          <div>
            <p><span className="font-bold">Class#:</span> {course.courseID}</p>
            <p><span className="font-bold">Section:</span> {course.sectionID}</p>
            <p><span className="font-bold">Grading:</span> {gradingDictionary[course.schoolID]}</p>
            <p><span className="font-bold">Course Location:</span> Washington Square</p>
          </div>
          <div>
            {/* <p><span className="font-bold">Session:</span> 1 09/03/2024 - 12/12/2024</p> */}
            <p><span className="font-bold">Class Status:</span> <span className="text-green-600">Open</span></p>
            <p><span className="font-bold">Instruction Mode:</span> {course.instruction_mode}</p>
            <p><span className="font-bold">Component:</span> Lecture</p>
          </div>
        </div>
        <AddButton details = {course}/>
      </div>
    );
  }

function Popup({ courses, onClose}) {
    if (courses.length === 0) return null;
  
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white rounded-lg p-8 max-w-md w-full m-4 relative">
            <button 
              onClick={onClose}
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
            >
              ✕
            </button>
            <h2 className="text-xl font-bold mb-4">Courses</h2>
            <div className="max-h-[70vh] overflow-y-auto">
              {courses.map((course) => (
                <CourseDetails key={course.slug} course={course}/>
              ))}
            </div>
          </div>
        </div>
      );
  }

function ShowAddForm() {
    let [message, setMessage] = useState(null);
    const navigate = useNavigate();

    const [courses, setCourses] = useState([]);

    const [formData, setFormData] = useState({
        schoolID: '', // enter number
        majorID: '',
        courseID: ''
      });

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log("Submit:" , formData);
        const response = await fetch(BACKEND_URL + '/course_search', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData),
          });
    
          const data = await response.json();

          if (!data.errMessage) { //successful
            // navigate('/course/edit/add', { state: { message: null}});
            setMessage(null);
            setCourses(data.courses);
            // console.log("data received: ", data);
          }
          else {
            setMessage(data.errMessage);
            // navigate('/courses/edit/add', { state: { message: data.errMessage}});
            // message = data.errMessage;
          }
    }

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
      };

    function ShowAddNew (){
        navigate("/courses/edit/new_course");
    }

    return (
      <div className="search-container">
        {message ? <div className="bg-red-200 p-1 mb-4 text-center">{message}</div> : null}
        <Popup 
            courses={courses} 
            onClose={() => setCourses([])}
        >
        </Popup>
        <h1 className="text-red-600 text-3xl mb-8">Search courses</h1>
        
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="text-gray-700 text-xl">School ID:</label>
            <input type="text" 
            className="block w-64 p-2 border rounded"
            name="schoolID"
            value={formData.schoolID}
            onChange={handleChange} />
          </div>
  
          <div className="form-group">
            <label className="text-gray-700 text-xl">MajorID:</label>
            <input type="text" 
            className="block w-64 p-2 border rounded" 
            name='majorID'
            value={formData.majorID}
            onChange={handleChange} />

          </div>
  
          <div className="form-group">
            <label className="text-gray-700 text-xl">CourseID:</label>
            <input type="text" 
            className="block w-64 p-2 border rounded" 
            name="courseID"
            value={formData.courseID}
            onChange={handleChange} />
          </div>
  
          <button 
            type="submit" 
            className="bg-teal-500 text-white px-6 py-2 rounded hover:bg-teal-600"
          >
            Submit
          </button>
        </form>
  
        <div className="mt-8">
          <a 
            onClick = {ShowAddNew}
            className="text-blue-600 text-xl hover:underline"
          >
            Not found? Add new course here!
          </a>
        </div>
      </div>
    );
}

function ShowAddNewForm() {
    const [message, setMessage] = useState(null);
    const [OKMsg, setOKMsg] = useState(null);
    const navigate = useNavigate();
    const { user } = useContext(MyContext);

    const [formData, setFormData] = useState({
        schoolID: 0, // enter number
        majorID: '',
        courseID: 0,
        sectionID: 0,
        name: "",
        credits: 0,
        description: "",
        instructor: "",
        instruction_mode: "in-person"
      });

    const handleSubmit = async (e) => {
        e.preventDefault();
        // console.log("Add course:" , formData);
        const response = await fetch(BACKEND_URL + '/add_course', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({course: formData, user: user}),
          });
    
          const data = await response.json();

          if (!data.errMessage) { //successful
            // navigate('/course/edit/add', { state: { message: null}});
            setOKMsg("Added course successfully!")
            setMessage(null);
            // setCourses(data.courses);
            // console.log("data received: ", data);
          }
          else {
            setOKMsg(null);
            setMessage(data.errMessage);
            // console.log("error message: ", data.errMessage);
            // navigate('/courses/edit/add', { state: { message: data.errMessage}});
            // message = data.errMessage;
          }
    }

    const returnCoursePage = (e) =>{
        e.preventDefault();
        navigate("/courses");
    }

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    return (
        <>
        <div className="max-w-2xl mx-auto p-6" onSubmit={handleSubmit}>
            <h1 className="text-red-600 text-3xl font-bold mb-8">Add course</h1>
            <form className="space-y-4">
            <div className="space-y-4">
                {message ? <div className="bg-red-200 p-1 mb-4 text-center">{message}</div> : null}
                {OKMsg ? <div className="bg-lime-200 p-1 mb-4 text-center">{OKMsg}</div> : null}
                <div>
                <label className="text-gray-700 text-xl">School ID:</label>
                <select className="w-full p-2 border rounded mt-1" name="schoolID" value={formData.schoolID} onChange={handleChange}>
                    <option value="">Select school</option>
                    <option value="1">Tandon School of Engineering</option>
                    <option value="2">Stern School of Business</option>
                    <option value="3">College of Arts and Sciences</option>
                    <option value="4">Gallatin School of Individualized Study</option>
                    <option value="5">Graduate School of Arts and Science</option>
                    <option value="6">College of Dentistry</option>
                    <option value="7">Rory Meyers College of Nursing</option>
                    <option value="8">Steinhardt School of Culture, Education, and Human Development</option>
                    <option value="9">School of Law</option>
                    <option value="10">School of Professional Studies</option>
                    <option value="11">NYU Abu Dhabi</option>
                    <option value="12">NYU Shanghai</option>
                </select>
                </div>
                
                <div>
                <label className="text-gray-700 text-xl">Major ID:</label>
                <input type="text" 
                className="w-full p-2 border rounded mt-1" 
                name="majorID" 
                value={formData.majorID} 
                onChange={handleChange}/>
                </div>
                
                <div>
                <label className="text-gray-700 text-xl">Course ID:</label>
                <input type="text" 
                required className="w-full p-2 border rounded mt-1" 
                name="courseID" 
                value={formData.courseID} 
                onChange={handleChange}
                />
                </div>

                <div>
                <label className="text-gray-700 text-xl">Section ID:</label>
                <input type="text" 
                required className="w-full p-2 border rounded mt-1" 
                name="sectionID" 
                value={formData.sectionID} 
                onChange={handleChange}
                />
                </div>
                
                <div>
                <label className="text-gray-700 text-xl">Course Name:</label>
                <input type="text" 
                className="w-full p-2 border rounded mt-1" 
                name="name" 
                value={formData.name} 
                onChange={handleChange}/>
                </div>
                
                <div>
                <label className="text-gray-700 text-xl">Credits:</label>
                <select 
                    className="w-full p-2 border rounded mt-1" 
                    name="credits" 
                    value={formData.credits} 
                    onChange={handleChange}
                    >

                    <option value="">Select credits</option>
                    <option value="0">0</option>
                    <option value="1">1</option>
                    <option value="2">2</option>
                    <option value="3">3</option>
                    <option value="4">4</option>
                </select>
                </div>
                
                <div>
                <label className="text-gray-700 text-xl">Description:</label>
                <textarea 
                className="w-full p-2 border rounded mt-1" 
                rows="4" 
                name="description" 
                value={formData.description} 
                onChange={handleChange}
                />
                </div>
            
                <div>
                <label className="text-gray-700 text-xl">Instructor:</label>
                <textarea 
                className="w-full p-2 border rounded mt-1" 
                rows="4" 
                name="instructor" 
                value={formData.instructor} 
                onChange={handleChange} />
                </div>
                
                <div>
                <label className="text-gray-700 text-xl">Instruction Mode:</label>
                <select 
                className="w-full p-2 border rounded mt-1"
                name="instruction_mode" 
                value={formData.instruction_mode} 
                onChange={handleChange} >
                    <option value="">Select credits</option>
                    <option value="in-person">in-person</option>
                    <option value="virtual">virtual</option>
                </select>
                </div>
            </div>
    
                <button type="submit" className="bg-teal-500 text-white px-6 py-2 rounded hover:bg-teal-600">
                    Submit
                </button>
            </form>
        </div>
        
        <div className="flex justify-center">
            <button className="bg-teal-500 text-white px-6 py-2 rounded hover:bg-teal-600 justify-center" onClick = {returnCoursePage}>
                    Back to course editing page
            </button>
        </div>

        </>
    );
}

export {
    ShowCourseForm,
    ShowEditForm,
    ShowAddForm,
    ShowAddNewForm
}
