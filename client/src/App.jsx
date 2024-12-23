import { useEffect, useState, useContext, createContext  } from 'react';
import {LoginForm, RegisterForm, ProtectedRoute} from './login.jsx'
import {ShowCourseForm, ShowEditForm, ShowAddForm, ShowAddNewForm} from './Course.jsx'
import { Routes, Route } from "react-router-dom";
import MyContext from './user.jsx';
import './App.css';
import Layout from './layout.jsx'


function App() {
  let [user, setUser] = useState(null);
  return (
      <MyContext.Provider value={{ user, setUser }}>
        <div id="outer" >
        <Layout />
        <Routes path = "/">
          <Route index element={<LoginForm />} />
          <Route path="register" element={<RegisterForm />} />

          <Route element={<ProtectedRoute user={user} />}>
              <Route path="courses">
              <Route index element={<ShowCourseForm />} />

              <Route path="edit">
                <Route index element={<ShowEditForm />} />
                <Route path="add" element={<ShowAddForm />} />
                <Route path="new_course" element = {<ShowAddNewForm />}></Route>

              </Route>
            </Route>
          </Route>

        </Routes>
        </div>
      </MyContext.Provider>
  );
}

export default App;