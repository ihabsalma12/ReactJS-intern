import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebase";
import { AuthContext } from "./AuthContext";
import React, { useContext, createContext, useEffect, useState, useReducer } from "react";



export const ChatContext = createContext();




export const ChatContextProvider = ({ children }) => {

    const { currentUser } = useContext(AuthContext);

    const INITIAL_STATE = {
        chatId: "null", //combined id
        user: {} //who i'm chatting to
    }

    const chatReducer = (state, action) => {
        switch (action.type) {
            case "CHANGE_USER":
                return {
                    chatId: currentUser.uid > action.payload.uid
                        ? currentUser.uid + action.payload.uid
                        : action.payload.uid + currentUser.uid,
                    user: action.payload,
                }
            default:
                return state;
        }
    }

    const [state, dispatch] = useReducer(chatReducer, INITIAL_STATE);

    return (

        <ChatContext.Provider value={{ data: state, dispatch }}>
            {children}
        </ChatContext.Provider>
    );
};