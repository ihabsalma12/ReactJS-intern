import Person from "../assets/person-icon.png";
import { doc, onSnapshot } from "firebase/firestore";
import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { ChatContext } from "../context/ChatContext";
import { db } from "../firebase";

function People() {

    const [chats, setChats] = useState([]);

    const { currentUser } = useContext(AuthContext);
    const { dispatch } = useContext(ChatContext);

    useEffect(() => {
        const getChats = () => {
            const unsub = onSnapshot(doc(db, "user-chats", currentUser.uid), (doc) => {
                setChats(doc.data());
            });

            return () => {
                unsub();
            };
        };
        currentUser.uid && getChats(); //currentuser id is null at beginning
    },
        [currentUser.uid]);
    // console.log("my chats: ", chats);

    const handleSelect = (u) => {
        dispatch({ type: "CHANGE_USER", payload: u });
        // console.log("user u!!", u);
    };



    return (
        <div>
            {Object.entries(chats)?.sort((a, b) => b[1].date - a[1].date).map(chat => (
                <div className="user-chat" key={chat[0]} onClick={() => handleSelect(chat[1]['user-info'])}>
                    <img src={Person} alt="" />
                    <div className="user-chat-info">
                        <span>{chat[1]['user-info'].displayName}</span>
                        <p>{chat[1].lastMessage?.text}</p>
                    </div>
                </div>

            ))
            }



        </div>
        // <div>
        //     <div className="user-chat" >
        //         <img src={Person} alt="" />
        //         <div className="user-chat-info">
        //             <span>Jane</span>
        //             <p>hello</p>
        //         </div>
        //     </div>

        //     <div className="user-chat" >
        //         <img src={Person} alt="" />
        //         <div className="user-chat-info">
        //             <span>Jane</span>
        //             <p>hello</p>
        //         </div>
        //     </div>

        // </div>
    );
}
export default People