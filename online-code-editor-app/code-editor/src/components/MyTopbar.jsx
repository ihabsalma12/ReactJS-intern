import Select from "react-select";
import { themes, languages, customStyles } from "../constants/constants";






const MyTopbar = ({ onLanguageChange, onThemeChange }) => {

    const onSelectLanguage = (option) => {
        onLanguageChange(option);
    };

    const onSelectTheme = (option) => {
        onThemeChange(option);
    };


    return (
        <div className="topbar-container" >

            <Select

                placeholder={`Language`}
                options={languages}
                styles={customStyles}
                defaultValue={languages[0]}
                onChange={(option) => onSelectLanguage(option)}
            />
            <Select
                placeholder={`Select Theme`}
                options={themes}
                styles={customStyles}
                defaultValue={themes[0]}
                onChange={(option) => onSelectTheme(option)}
            />

        </div>
    );
}

export default MyTopbar;