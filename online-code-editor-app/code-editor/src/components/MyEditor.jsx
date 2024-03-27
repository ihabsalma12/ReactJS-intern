import React, { useState } from "react";
import Editor from "@monaco-editor/react";
import * as monaco from 'monaco-editor';



const MyEditor = ({ value, setValue, language, theme }) => {

    return (

        <div className="monaco-container">




            <Editor
                height="85vh"
                defaultLanguage={language.value || "javascript"}
                defaultValue="// Type some code..."
                value={value}
                language={language.value}
                theme={theme.value}
                onChange={(newValue) => setValue(newValue)}
            />
        </div>

    );
};


export default MyEditor;