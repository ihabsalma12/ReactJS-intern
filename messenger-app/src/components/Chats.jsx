// import './index.css'
import "../my-style.scss";
import Messages from "./Messages.jsx";
import ChatInput from "./ChatInput.jsx";

import Cam from "../assets/cam.png";
import Add from "../assets/add.png";
import More from "../assets/more.png";
import { useContext } from "react";
import { ChatContext } from "../context/ChatContext.jsx";

function Chats() {

    const { data } = useContext(ChatContext);

    return (
        <div className="chat">
            <div className="chat-info">
                <span>{data.user?.displayName}</span>
                <div className="chat-icons">

                    <img src={Add} alt="phone-call" />
                    <img src={Cam} alt="video-call" />
                    <img src={More} alt="meatballs-menu" />
                </div>
            </div>
            <Messages />
            <ChatInput />
        </div>
    );
}

export default Chats
