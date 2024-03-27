import { useContext, useEffect, useRef } from "react";
import Person from "../assets/person-icon.png";
import { AuthContext } from "../context/AuthContext.jsx";
import { ChatContext } from "../context/ChatContext.jsx";


function Message({ message }) {

    // console.log("message type: ", message.date.seconds);
    const { currentUser } = useContext(AuthContext);
    const { data } = useContext(ChatContext);

    const ref = useRef();

    useEffect(() => {
        ref.current?.scrollIntoView({ behavior: "smooth" });
    }, [message]);

    return (
        <div ref={ref} className={`message ${message.senderId === currentUser.uid && "owner"}`}>

            <div className="message-content">
                <span className="message-time">just now</span>
                <span className="message-text">{message.text}</span>
            </div>
        </div>
    );
}

export default Message