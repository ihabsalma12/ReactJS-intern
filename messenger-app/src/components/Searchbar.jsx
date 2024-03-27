// import './index.css'
// import "../my-style.scss";
import Person from "../assets/person-icon.png";
import { collection, query, where, getDocs, setDoc, doc, updateDoc, serverTimestamp, getDoc, } from "firebase/firestore";
import { db } from "../firebase";
import { AuthContext } from "../context/AuthContext";
import React, { useContext, useState } from "react";
import { ChatContext } from "../context/ChatContext";


function Searchbar() {

    const { currentUser } = useContext(AuthContext); //me (logged in account)
    const { dispatch } = useContext(ChatContext);


    const [username, setUsername] = useState("") //search word
    const [user, setUser] = useState(null) //person i'm chatting to
    const [error, setError] = useState(false)

    const handleSearch = async () => {
        const q = query(
            collection(db, "users"),
            where("displayName", "==", username)
        );

        try {
            const querySnapshot = await getDocs(q);
            // Check if querySnapshot is empty
            if (querySnapshot.empty) {
                setError(true); // Set error to true if query returns nothing
            } else {
                setError(false); // Reset error to false if query returns something

                querySnapshot.forEach((doc) => {
                    setUser(doc.data());
                    // console.log("searched for user!! set user: ", doc.data())
                });
            }
        } catch (error) {
            setError(true);
        }
    };

    const handleKey = (e) => {
        e.code === "Enter" && handleSearch();
    };






    const handleSelect = async () => {
        //check whether the group(chats in firestore) exists, if not create
        const combinedId =
            currentUser.uid > user.uid
                ? currentUser.uid + user.uid
                : user.uid + currentUser.uid;
        try {
            const res = await getDoc(doc(db, "chats", combinedId));

            if (!res.exists()) {
                //create a chat in chats collection
                await setDoc(doc(db, "chats", combinedId), { messages: [] });

                //create user chats
                await updateDoc(doc(db, "user-chats", currentUser.uid), {
                    [combinedId + ".user-info"]: {
                        uid: user.uid,
                        displayName: user.displayName,
                    },
                    [combinedId + ".date"]: serverTimestamp(),
                });

                await updateDoc(doc(db, "user-chats", user.uid), {
                    [combinedId + ".user-info"]: {
                        uid: currentUser.uid,
                        displayName: currentUser.displayName,
                    },
                    [combinedId + ".date"]: serverTimestamp(),
                });
            }

            dispatch({ type: "CHANGE_USER", payload: user }); //email is passed EXTRA
            // console.log("user u!! now we change the view", user);
        } catch (error) { }

        setUser(null);
        setUsername("")
    };





    return (
        <div className="search-bar">
            <div className="search-form">
                <input
                    type="text"
                    placeholder="Find a user"
                    onKeyDown={handleKey}
                    onChange={(e) => setUsername(e.target.value)}
                    value={username}
                />
            </div>
            {error && <span className="not-found">User not found!</span>}
            {user && (
                <div className="user-chat" onClick={handleSelect}>
                    <img src={Person} alt="" />
                    <div className="user-chat-info">
                        <span>{user.displayName}</span>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Searchbar
