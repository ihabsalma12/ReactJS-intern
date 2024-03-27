import React, { useReducer, useEffect, useState } from 'react';
import Loading from "./Loading.jsx";
import axios from "axios";
import { useNavigate } from "react-router-dom";



const INITIAL_STATE = {
    fullName: "",
    currentPosition: "",
    currentLength: 1,
    currentTech: "",
    photo: null,
    companyInfo: [{ name: "", position: "" }],
};

const formReducer = (state, action) => {
    switch (action.type) {
        case "UPDATE_FORM":
            return {
                ...state, //keep other fields the same
                [action.field]: action.value //update the field 
            };
        case 'UPLOAD_PHOTO':
            return {
                ...state,
                photo: action.photo
            };
        case 'ADD_COMPANY':
            console.log(state.companyInfo);
            return {
                ...state,
                companyInfo: [...state.companyInfo, { name: "", position: "" }]
            };
        case 'REMOVE_COMPANY':
            console.log("removing... index=", action.payload.index);
            console.log(state.companyInfo);
            const list = state.companyInfo;
            list.splice(action.payload.index, 1);
            return {
                ...state,
                companyInfo: list,
            }
        case 'UPDATE_COMPANY':
            const { index, name, value } = action.payload;
            const newList = [...state.companyInfo];
            newList[index][name] = value;
            console.log("updating... index=", index, " name=", name, " value=", value);
            console.log(state.companyInfo);
            return {
                ...state,
                companyInfo: newList

            }
        // case "RESET_FORM":
        //     return {
        //         INITIAL_STATE
        //     };
        default:
            return state;
    }
};



const Home = ({ setResult }) => {



    const [state, dispatch] = useReducer(formReducer, INITIAL_STATE);
    const [loading, setLoading] = useState(false);


    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();

        const formData = new FormData();
        //send form data to the node server
        formData.append("headshotImage", state.photo);
        formData.append("fullName", state.fullName);
        formData.append("currentPosition", state.currentPosition);
        formData.append("currentLength", state.currentLength);
        formData.append("currentTech", state.currentTech);
        formData.append("workHistory", JSON.stringify(state.companyInfo));
        axios
            .post("http://localhost:4000/resume/create", formData, {})
            .then((res) => {
                if (res.data.message) {
                    console.log(res.data.data);
                    setResult(res.data.data);
                    navigate("/resume");
                }
            })
            .catch((err) => console.error(err));

        console.log(state);
        // dispatch({ type: 'RESET_FORM' });

        setLoading(true);
    };
    if (loading) {
        return <Loading />;
    }


    const handlePhotoUpload = (e) => {
        const photoFile = e.target.files[0];
        dispatch({ type: 'UPLOAD_PHOTO', photo: photoFile });
    };

    const handleAddCompany = () => dispatch({ type: "ADD_COMPANY" })
    const handleRemoveCompany = (index) => dispatch({ type: "REMOVE_COMPANY", payload: { index } })
    const handleUpdateCompany = (e, index) => {
        const { name, value } = e.target;
        dispatch({ type: 'UPDATE_COMPANY', payload: { index, name, value } });
    };


    return (
        <div>

            <form onSubmit={handleSubmit} method='POST' encType='multipart/form-data'>
                <h1>Resume Builder with Google's Gemini</h1>
                {/* <p className="description">Enter your information, and generate a resume with ChatGPT in just a few seconds!</p> */}
                <hr />
                <div className="formcontainer">

                    <div className="container">
                        <label htmlFor="fullName">Full Name: </label>
                        <input type="text" required name="fullName" id="fullName"
                            value={state.fullName} onChange={(e) => dispatch({ type: 'UPDATE_FORM', field: 'fullName', value: e.target.value })} />

                        <div className="container">
                            <label htmlFor="currentPosition">Current Position: </label>
                            <input type="text" required name="currentPosition" id="currentPosition"
                                value={state.currentPosition} onChange={(e) => dispatch({ type: 'UPDATE_FORM', field: 'currentPosition', value: e.target.value })} />

                            <label htmlFor="currentLength">For how long? (year): </label>
                            <input type="text" required name="currentLength" id="currentLength"
                                value={state.currentLength} onChange={(e) => dispatch({ type: 'UPDATE_FORM', field: 'currentLength', value: e.target.value })} />

                            <label htmlFor="currentTech">Technologies Used: </label>
                            <input type="text" required name="currentTech" id="currentTech"
                                value={state.currentTech} onChange={(e) => dispatch({ type: 'UPDATE_FORM', field: 'currentTech', value: e.target.value })} />
                        </div>

                        <label htmlFor="photo">Upload your personal photo: </label>
                        <input type="file" required name="photo" id="photo" accept="image/*"
                            onChange={handlePhotoUpload} />



                        <h3>Companies you've worked at</h3>
                        {state.companyInfo && state.companyInfo.map((company, index) => (
                            <div className='nestedContainer' key={index}>

                                <div className='companies'>
                                    <label htmlFor='name'>Company Name</label>
                                    <input
                                        type='text'
                                        name='name'
                                        required
                                        value={company.name}
                                        onChange={(e) => handleUpdateCompany(e, index)}
                                    />
                                </div>
                                <div className='companies'>
                                    <label htmlFor='position'>Position Held</label>
                                    <input
                                        type='text'
                                        name='position'
                                        required
                                        value={company.position}
                                        onChange={(e) => handleUpdateCompany(e, index)}
                                    />
                                </div>
                                <div>
                                    {state.companyInfo.length - 1 === index && state.companyInfo.length < 4 && (
                                        <button id='addBtn' onClick={handleAddCompany}>
                                            Add
                                        </button>
                                    )}
                                    {state.companyInfo.length > 1 && (
                                        <button id='deleteBtn' onClick={() => handleRemoveCompany(index)}>
                                            Delete
                                        </button>
                                    )}
                                </div>


                            </div>

                        ))}




                        <button className="submit"> CREATE RESUME </button>
                    </div>
                </div>
            </form>

        </div>
    )
}

export default Home;