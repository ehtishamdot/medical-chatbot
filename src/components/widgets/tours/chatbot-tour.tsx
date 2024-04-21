


import 'intro.js/introjs.css';
import { Steps } from 'intro.js-react';
import React, {useState} from 'react';
import Cookies from "js-cookie";
function PatientTour() {
    const chatbot=Cookies.get("chatbot-guide")
    const [enabled,setEnabled] = useState(!!chatbot);
    const [initialStep,setInitialStep] = useState(0);

    const onExit = () => {
        setEnabled(false);
        Cookies.remove("chatbot-guide");
    }
    const options={
        scrollToElement: true,

    }

    const steps = [
        {
            element: '#createbot',
            intro: 'Click Here To Create Your First Chatbot',
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

export default PatientTour;