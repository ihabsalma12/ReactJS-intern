// import './index.css'
import "../my-style.scss";
import Navbar from "./Navbar.jsx";
import People from "./People.jsx";
import Searchbar from "./Searchbar.jsx";

function Sidebar() {

    return (
        <div className="sidebar">
            <Navbar />
            <Searchbar />
            <People />


        </div>
    );
}

export default Sidebar
