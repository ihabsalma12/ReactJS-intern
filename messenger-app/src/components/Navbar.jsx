import Avatar from "../assets/person-icon.png";
import { signOut } from "firebase/auth";
import { auth } from "../firebase.js";
import { AuthContext } from "../context/AuthContext.jsx";
import React, { useContext, useState } from "react";


function Navbar() {

    const { currentUser } = useContext(AuthContext);


    const handleSignOut = () => {
        signOut(auth);
        console.log("goodbye, " + currentUser.displayName);
    }

    return (
        <div className="navbar">
            <span className="title">Chat App</span>
            <span className="user">
                <img src={Avatar} alt="person-icon" />
                {currentUser.displayName}
                <button onClick={handleSignOut}>Log Out</button>
            </span>
        </div>);
}
export default Navbar