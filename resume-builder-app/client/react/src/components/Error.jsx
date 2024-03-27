import { Link } from "react-router-dom";

function Error() {
    return (
        <div>
            <h3>You have not provided your resume details. Back to <Link to='/'>home page.</Link></h3>
        </div>
    )
}
export default Error;