import { Timestamp, arrayUnion, doc, serverTimestamp, updateDoc } from "firebase/firestore";
import { useState, useContext } from "react";
import { db } from "../firebase";
import { v4 as uuid } from "uuid";
import { AuthContext } from "../context/AuthContext";
import { ChatContext } from "../context/ChatContext";

function ChatInput() {

    const { currentUser } = useContext(AuthContext);
    const { data } = useContext(ChatContext);


    const [text, setText] = useState(""); //text message. image message can be added the same way


    const handleSend = async () => {
        try {
            await updateDoc(doc(db, "chats", data.chatId), {
                messages: arrayUnion({
                    id: uuid(),
                    text,
                    senderId: currentUser.uid,
                    date: Timestamp.now(),
                })
            })

            await updateDoc(doc(db, "user-chats", currentUser.uid), {
                [data.chatId + ".lastMessage"]: {//nested object
                    text
                },
                [data.chatId + ".date"]: serverTimestamp(),
            })

            await updateDoc(doc(db, "user-chats", data.user.uid), {
                [data.chatId + ".lastMessage"]: {//nested object
                    text
                },
                [data.chatId + ".date"]: serverTimestamp(),
            })
            console.log("message success");
        }
        catch (error) { console.log(error); }
        setText("");
    }

    return (
        <div className="chat-input">
            <input
                type="text"
                placeholder="Type a message"
                onChange={e => setText(e.target.value)}
                value={text}
            />
            <button onClick={handleSend}>Send</button>
        </div>
    );
}
export default ChatInput