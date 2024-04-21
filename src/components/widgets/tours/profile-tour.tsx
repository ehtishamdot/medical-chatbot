"use client";
import 'intro.js/introjs.css';
import { Steps } from 'intro.js-react';
import React, {useState} from 'react';
import Cookies from "js-cookie";
function ProfileTour() {
    const profile=Cookies.get("profile-intro");
    const [enabled,setEnabled] = useState(!!profile);
    const [initialStep,setInitialStep] = useState(0);

    const onExit = () => {
        setEnabled(false);
        Cookies.remove("profile-guide");
    }
    const options={
        scrollToElement: true,

    }

    const steps = [
        {
            element: '#profile',
            intro: 'Here You Can Change Your General Profile Information',
            position: 'right',
        },
        {
            element: '#account',
            intro: 'Here You Can Change Your Username & Password',
            position: 'right',
        },

    ];

    return (
        <div className="App">
            <Steps
                enabled={enabled}
                options={options}
                steps={steps}
                initialStep={initialStep}
                onExit={onExit}
            />
        </div>
    );
}

export default ProfileTour;