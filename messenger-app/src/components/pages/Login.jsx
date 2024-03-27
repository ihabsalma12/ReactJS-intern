// import './index.css'
import "../../my-style.scss";
import { signInWithEmailAndPassword } from "firebase/auth";
import React from "react";
import { useState } from "react";
import { auth, db } from "../../firebase";
import { useNavigate, Link } from "react-router-dom";


function Login() {


    const [error, setError] = useState(false);
    const navigate = useNavigate();




    const submitHandler = async (e) => {
        e.preventDefault() //prevents automatic reload
        const email = e.target[0].value
        const password = e.target[1].value



        //submit the user to firebase
        await signInWithEmailAndPassword(auth, email, password)
            .then(async (userCredential) => {
                // Signed in 
                const user = userCredential.user;
                console.log("hello, " + user.displayName);

                navigate("/");
            })
            .catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
                setError(true);
                console.log("code: " + errorCode + "    message: " + errorMessage);
            });
    }




    return (
        <div className="login-form">
            <div className="form-container">
                <div className="form-wrapper">

                    <span className="title">Chat App</span>
                    <span className="subtitle">
                        Login
                    </span>
                    {/* <br /> */}
                    <form onSubmit={submitHandler}>
                        <input type="email" placeholder="Email Address" />

                        <input type="password" placeholder="Password" />
                        <button>Login</button>
                        {error && <span className="wrong"> Something went wrong.</span>}

                    </form>

                    <p>Don't have an account? <Link to="/register" className="link" >Sign up</Link></p>
                </div>
            </div >
        </div>
    );
}

export default Login