
import 'intro.js/introjs.css';
import { Steps } from 'intro.js-react';
import React, {useState} from 'react';
import Cookies from "js-cookie";
function PatientTour() {
    const patient=Cookies.get("patient-guide")
    const [enabled,setEnabled] = useState(!!patient);
    const [initialStep,setInitialStep] = useState(0);

    const onExit = () => {
        setEnabled(false);
        Cookies.remove("patient-guide");
    }
    const options={
        scrollToElement: true,

    }

    const steps = [
        {
            element: '#invite',
            intro: 'You Can Invite The Patient To Use A Chatbot Created By The Doctor',
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