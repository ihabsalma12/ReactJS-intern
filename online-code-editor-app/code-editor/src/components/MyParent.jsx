import React, { useState } from "react";
import MyEditor from "./MyEditor";
import MySidebar from "./MySidebar";
import MyTopbar from "./MyTopbar";
import { themes, languages, customStyles } from "../constants/constants";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";


const MyParent = () => {

    const [language, setLanguage] = useState(languages[0])
    const [theme, setTheme] = useState(themes[0])
    const [output, setOutput] = useState(null)
    const [code, setCode] = useState("// Type some code...")
    const [userInput, setUserInput] = useState("");
    const [processing, setProcessing] = useState(null);



    // method to poll the /submissions/${token} route.
    const checkStatus = async (token) => {
        const options = {
            method: "GET",
            url: import.meta.env.VITE_REACT_APP_RAPID_API_URL + "/" + token,
            params: { base64_encoded: "true", fields: "*" },
            headers: {
                "X-RapidAPI-Host": import.meta.env.VITE_REACT_APP_RAPID_API_HOST,
                "X-RapidAPI-Key": import.meta.env.VITE_REACT_APP_RAPID_API_KEY,
            },
        };
        try {
            let response = await axios.request(options);
            let statusID = response.data.status?.id;

            // "In Queue" and "Processing"
            if (statusID === 1 || statusID === 2) {
                setTimeout(() => {
                    checkStatus(token) //if timeout occurs, we call the checkStatus function again.
                }, 2000);
                return;
            }
            else {
                setProcessing(false);
                setOutput(response.data)
                toast.success(`Success!`, {
                    // position: "top-right",
                    // autoClose: 1000,
                    // hideProgressBar: false,
                    closeOnClick: true,
                    // pauseOnHover: true,
                    // draggable: true,
                    // progress: undefined,
                });
                // console.log("COMPILED SUCCESSFULLY!");
                // console.log('response.data', response.data);
                return;
            }
        }
        catch (err) {
            console.log("err", err);
            setProcessing(false);
            toast.error(`Something went wrong! Please try again.`, {
                // position: "top-right",
                // autoClose: 1000,
                // hideProgressBar: false,
                closeOnClick: true,
                // pauseOnHover: true,
                // draggable: true,
                // progress: undefined,
            });
        }
    };


    // method to call our Judge0 RapidAPI backend on the submissions URL
    function handleCompile() {
        setProcessing(true);
        const formData = {
            language_id: language.id,
            // to base64 encode our strings since we are using base64_encoded: true in our params to the API
            source_code: btoa(code),
            stdin: btoa(userInput),
        };
        const options = {
            method: "POST",
            url: import.meta.env.VITE_REACT_APP_RAPID_API_URL,
            params: { base64_encoded: "true", fields: "*" },
            headers: {
                "content-type": "application/json",
                "Content-Type": "application/json",
                "X-RapidAPI-Host": import.meta.env.VITE_REACT_APP_RAPID_API_HOST,
                "X-RapidAPI-Key": import.meta.env.VITE_REACT_APP_RAPID_API_KEY,
            },
            data: formData,
        };

        axios.request(options)
            .then((response) => { // successful response of the POST request
                // console.log("res.data", response.data);
                const token = response.data.token; //token can be further used to check the status of our execution.
                checkStatus(token); // we must make a GET request to check the submissions token URL..
            })
            .catch((err) => {
                // let error = err.response ? err.response.data : err; //?
                setProcessing(false);
                console.log(err);
            });


    }

    return (
        <>
            <ToastContainer
                position="top-right"
                autoClose={2000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
            />
            <div className="page-container">

                <MyTopbar onLanguageChange={setLanguage} onThemeChange={setTheme} />

                <div className="body-container">
                    <MyEditor value={code} setValue={setCode} language={language} theme={theme} />
                    <MySidebar processing={processing} output={output} input={userInput} changeInput={setUserInput} submitCompile={handleCompile} />
                </div>


            </div>
        </>
    );
};


export default MyParent;