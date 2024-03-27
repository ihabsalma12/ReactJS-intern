// import './index.css'
import "../../my-style.scss";
import React, { useContext, useState } from "react";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth, db } from "../../firebase";
import { doc, setDoc } from "firebase/firestore";
import { useNavigate, Link } from "react-router-dom";


function Register() {

    const [password, setPassword] = useState("");
    const [passVisible, setPassVisible] = useState(false);
    const [error, setError] = useState(false);
    const navigate = useNavigate();




    const submitHandler = async (e) => {
        e.preventDefault() //prevents automatic reload
        const displayName = e.target[0].value
        const email = e.target[1].value
        const password = e.target[2].value
        const repeatPassword = e.target[3].value

        //validate repeat password


        //submit the user to firebase
        await createUserWithEmailAndPassword(auth, email, password)
            .then(async (userCredential) => {
                // Signed up 
                const user = userCredential.user;
                // any other info to add
                // user.displayName = displayName;
                await updateProfile(user, { displayName: displayName });
                console.log("hello, " + user.displayName);

                await setDoc(doc(db, "users", user.uid), {
                    uid: user.uid,
                    displayName,
                    email
                });

                await setDoc(doc(db, "user-chats", user.uid), {});

                // setError(false);
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
        <div className="register-form">
            <div className="form-container">
                <div className="form-wrapper">

                    <span className="title">Chat App</span>
                    <span className="subtitle">
                        Sign Up
                    </span>
                    {/* <br /> */}


                    <form onSubmit={submitHandler}>
                        <input type="text" placeholder="Display Name" />
                        <input type="email" placeholder="Email Address" />
                        <div className="password-input-wrapper">
                            <input
                                className="repeat-pass"
                                type={passVisible ? "text" : "password"}
                                placeholder="Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />

                            <input
                                id="check"
                                type="checkbox"
                                value={passVisible}
                                onChange={() => setPassVisible((prev) => !prev)}
                            />
                            <label htmlFor="check">Show password</label>
                        </div>





                        <input type="password" placeholder="Repeat Password" />
                        <button>Register</button>


                        {error && <span className="wrong"> Something went wrong.</span>}
                    </form>
                    <p>Already have an account? <Link className="link" to="/login">Login</Link></p>
                </div>
            </div >
        </div>
    );
}

export default Register