// import './index.css'
import "../../my-style.scss";
import Chats from "../Chats.jsx";
import Sidebar from "../Sidebar.jsx";



function Home() {

    return (
        <div className="home">
            <div className="container">
                <Sidebar />
                <Chats />
            </div>
        </div>
    );
}

export default Home
