
import 'intro.js/introjs.css';
import { Steps } from 'intro.js-react';
import React, {useState} from 'react';
import Cookies from "js-cookie";
function DashboardTour() {
    const dashboard=Cookies.get("dashboard-guide");
    const [enabled,setEnabled] = useState(!!dashboard);
    const [initialStep,setInitialStep] = useState(0);

    const onExit = () => {
        setEnabled(false);
        Cookies.remove("dashboard-guide");
    }
    const options={
        scrollToElement: true,

    }

    const steps = [
        {
            element: '#created-assistant',
            intro: 'Here you can see the no. of assistants created by the doctor',
            position: 'right',
        },
        {
            element: '#patient-assist',
            intro: 'Here you can see the no. of patients assisted  by the doctor',
            position: 'right',
        },
        {
            element: '#satisfaction',
            intro: 'Here ypu can see the patient satisfactory percentage of of all the chatbots created',
        },
        {
            element: '#usage',
            intro: 'Here you can see how many bots are used',
        },
        {
            element: '#chart-one',
            intro: 'Here is the visualization of Patients Satisfaction and Bots Usage ',
        },
        {
            element: '#chart-two',
            intro: "Here you can see the most used specialization bots "
        },
        {
            element: '#patient-overview',
            intro: 'List of newly created patients',
        },
        {
            element: '#bot-history',
            intro: 'History of patients conversations with the bot',
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

export default DashboardTour;