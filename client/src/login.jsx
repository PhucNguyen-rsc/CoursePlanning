import React, { useState, useEffect, useContext, createContext } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './index.css';
import './Login.css';
import {REACT_APP_API_URL, BACKEND_URL} from './config.mjs';
import MyContext from './user.jsx';
import { Outlet } from 'react-router-dom';

const LoginForm = () => {
  const { user, setUser } = useContext(MyContext);

  const location = useLocation();
  let [message, setMessage] = useState(null);

  useEffect(() => {
    if (location.state?.message) {
      setMessage(location.state.message);
    }
  }, [location]);

  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });
  
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  
  const handleSubmit = async (e) => {
      e.preventDefault();
      const response = await fetch(BACKEND_URL + '/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!data.errMessage) { //successful
        setUser(formData.username);
        navigate('/courses', { state: { name: formData.username}});
      }
      else {
        navigate('/', { state: { message: data.errMessage}});
        // message = data.errMessage;
      }
  };

  return (  
    <form onSubmit={handleSubmit}>
      {message ? <div className="error">{message}</div> : null}
      <h2 class="text-4xl font-bold text-black mb-4">
        Log In
      </h2>
      <div>
        <label htmlFor="username">Username:</label>
        <input 
          type="text" 
          id="username" 
          name="username" 
          value={formData.name}
          onChange={handleChange}
        />
      </div>
      <div>
        <label htmlFor="password">Password:</label>
        <input 
          type="password" 
          id="password" 
          name="password" 
          value={formData.password}
          onChange={handleChange}
        />
      </div>
      <div>
        <input type="submit" value="Login" />
      </div>
    </form>
  );
};

const RegisterForm = () => {
  const location = useLocation();
  let [message, setMessage] = useState(null);
  const { user, setUser } = useContext(MyContext);

  useEffect(() => {
    if (location.state?.message) {
      setMessage(location.state.message);
    }
  }, [location]);

  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
  });
  
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  
  const handleSubmit = async (e) => {
      e.preventDefault();
      console.log("FormDATA")
      const response = await fetch(BACKEND_URL + '/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!data.errMessage) { //successful
        setUser(formData.username);
        navigate('/courses', { state: { name: formData.username}});
      }
      else {
        navigate('/register', { state: { message: data.errMessage}});
        // message = data.errMessage;
      }
  };

  return (  
    <form onSubmit={handleSubmit}>
      {message ? <div className="error">{message}</div> : null}
      <h2 class="text-4xl font-bold text-black mb-4">
        Register
      </h2>
      <div>
        <label htmlFor="username">Username:</label>
        <input 
          type="text" 
          id="username" 
          name="username" 
          value={formData.name}
          onChange={handleChange}
        />
      </div>
      <div>
        <label htmlFor="email">Email:</label>
        <input 
          type="text" 
          id="email" 
          name="email" 
          value={formData.email}
          onChange={handleChange}
        />
      </div>
      <div>
        <label htmlFor="password">Password:</label>
        <input 
          type="password" 
          id="password" 
          name="password" 
          value={formData.password}
          onChange={handleChange}
        />
      </div>
      <div>
        <input type="submit" value="Register" />
      </div>
    </form>
  );
};

const NotAccessForm = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="text-center p-8 bg-white rounded-lg shadow-md">
        <p className="text-2xl text-gray-700 mb-6">
          404 - You have to log in / sign up first to access more pages
        </p>
        <button 
          onClick={() => window.location.href = '/'} 
          className="bg-teal-500 text-white px-6 py-2 rounded hover:bg-teal-600 transition-colors"
        >
          Back to log in
        </button>
      </div>
    </div>
  )
}

const ProtectedRoute = ({ user }) => {
  if (user === null) {
    return <NotAccessForm />;
  }
  return <Outlet />;
};

export {LoginForm, RegisterForm, NotAccessForm, ProtectedRoute};