import React, {useContext, createContext} from 'react';
import MyContext from './user.jsx';
import { useNavigate, useLocation } from 'react-router-dom';

const Layout = () =>{
    const { user, setUser} = useContext(MyContext);
    const navigate = useNavigate()

    function logOut(){
        setUser(null);
        navigate("/register");
    }
    
    return (
        <>   
            <header>
                <nav>
                {user !== null ? (
                    // Content to show when user is logged in
                    <>
                        <span className="home-link">
                            <a href="/" onClick={logOut}>Log out</a>
                        </span>
                        <span className="login-status">
                            Log in as {user}!
                        </span>
                    </>
                    ) : (
                    <>
                        <span className="home-link">
                            <a href="/register">Register</a>
                        </span>
                        <span className="login-status">
                            <a href="/">Log In</a>
                        </span>
                    </>
                    )}
                </nav>
            </header>
            
            <h1>Course Registering and Tracking</h1>
            
            <div className="content" >
            A site to keeping track of courses. Intend to mimic Albert features.
            </div>
        </> 
    )
}

export default Layout;