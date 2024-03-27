import React, { useRef } from "react";
import Error from "./Error";
import { useReactToPrint } from 'react-to-print';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';



const Resume = ({ result }) => {

    const componentRef = useRef();


    const replaceWithBr = (string) => {
        return string.replace(/\n/g, "<br />");
    };

    if (JSON.stringify(result) === "{}") {
        return < Error />
    }


    const handlePrint = useReactToPrint({
        content: () => componentRef.current,
        documentTitle: `${result.fullName} Resume`,
        onAfterPrint: () => {
            toast.success("Print Successful!");
        },
    });


    return (
        <div>
            <ToastContainer />
            <div>


                <button onClick={handlePrint}>Print Page</button>
                <main className='resume-container' ref={componentRef}>
                    <header className='resume-header'>
                        <div>

                            <h1>{result.fullName}</h1>
                            <p className='resume-title header-title'>

                                {result.currentPosition} ({result.currentTech})
                            </p>
                            <p className='resume-title'>
                                {result.currentLength} year(s) work experience
                            </p>
                        </div>
                        <div>
                            <img
                                src={result.image_url}
                                alt={result.fullName}
                                className='resume-image'
                            />
                        </div>
                    </header>
                    <div className='resume-body'>
                        <div>
                            <h2 className='resume-body-title'>PROFILE SUMMARY</h2>
                            <p
                                dangerouslySetInnerHTML={{
                                    __html: replaceWithBr(result.objective),
                                }}
                                className='resume-body-content'
                            />
                        </div>
                        <div>
                            <h2 className='resume-body-title'>WORK HISTORY</h2>
                            {result.workHistory.map((work) => (
                                <p className='resume-body-content' key={work.name}>
                                    <span style={{ fontWeight: "bold" }}>{work.name}</span> -{" "}
                                    {work.position}
                                </p>
                            ))}
                        </div>
                        <div>
                            <h2 className='resume-body-title'>JOB PROFILE</h2>
                            <p
                                dangerouslySetInnerHTML={{
                                    __html: replaceWithBr(result.jobResponsibilities),
                                }}
                                className='resume-body-content'
                            />
                        </div>
                        <div>
                            <h2 className='resume-body-title'>JOB RESPONSIBILITIES</h2>
                            <p
                                dangerouslySetInnerHTML={{
                                    __html: replaceWithBr(result.keypoints),
                                }}
                                className='resume-body-content'
                            />
                        </div>
                    </div>
                </main>
            </div>
        </div>
    )
}
export default Resume;