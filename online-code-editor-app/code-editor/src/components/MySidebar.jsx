import React from "react";

//How to use Tailwind???
// const classnames = (...args) => {
//     return args.join(" ");
// };

const MySidebar = ({ processing, output, input, changeInput, submitCompile }) => {

    const getDetails = () => {
        const statusID = output?.status?.id; //output is null at beginning
        switch (statusID) {
            //"Compilation Error"
            case 6:
                return (atob(output?.compile_output));

            //"Accepted"
            case 3:
                return (atob(output.stdout) && `${atob(output.stdout)}`);

            case 5:
                return ("Time Limit Exceeded");
            default:
                atob(output?.stderr);
        }
    }


    const getOutputClass = () => {
        const statusID = output?.status?.id;
        switch (statusID) {
            case 6:
                return "compilation-error";

            case 3:
                return "accepted";

            case 5:
                return "time-limit-exceeded";

            default:
                return "default-error"; // Default class if no specific status is matched
        }
    }


    return (

        <div className="sidebar-container">
            <h1>Output</h1>
            <pre className={`output-window ${getOutputClass()}`}>
                {output && getDetails()}

            </pre>
            <textarea
                rows="5"
                value={input}
                onChange={(e) => changeInput(e.target.value)}
                placeholder={`Custom input`}
            ></textarea>


            <button className="compile-button" onClick={submitCompile}>
                {processing ? "Processing..." : "Compile and Execute"}
            </button>


            <div className="output-details">

                <p className="text-sm">Status:<span> {output?.status?.description} </span></p>

                <p className="text-sm">Memory:<span> {output?.memory} </span></p>

                <p className="text-sm">Time: <span>{output?.time}</span></p>
            </div>


        </div>

    );
};


export default MySidebar;