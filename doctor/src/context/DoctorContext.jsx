import { createContext, useState, useEffect } from "react";

export const DoctorContext = createContext();

const DoctorContextProvider = (props) => {
    const [dToken, setDToken] = useState(localStorage.getItem('dToken') ? localStorage.getItem('dToken') : '');
    const [doctorInfo, setDoctorInfo] = useState(localStorage.getItem('doctorInfo') ? JSON.parse(localStorage.getItem('doctorInfo')) : null);
    const [doctorLoading, setDoctorLoading] = useState(false);

    // Set doctor info when login is successful
    const loginDoctor = (token, doctor) => {
        localStorage.setItem('dToken', token);
        localStorage.setItem('doctorInfo', JSON.stringify(doctor));
        setDToken(token);
        setDoctorInfo(doctor);
    };

    // Clear doctor info on logout
    const logoutDoctor = () => {
        localStorage.removeItem('dToken');
        localStorage.removeItem('doctorInfo');
        setDToken('');
        setDoctorInfo(null);
    };

    const value = {
        dToken,
        setDToken,
        doctorInfo,
        setDoctorInfo,
        doctorLoading,
        setDoctorLoading,
        loginDoctor,
        logoutDoctor
    };

    return (
        <DoctorContext.Provider value={value}>
            {props.children}
        </DoctorContext.Provider>
    );
};

export default DoctorContextProvider;