




import 'intro.js/introjs.css';
import { Steps } from 'intro.js-react';
import React, {useState} from 'react';
import Cookies from "js-cookie";
function ChatbotQuestionTour() {
    const chatbot=Cookies.get("chatbot-question-guide")
    const [enabled,setEnabled] = useState(!!chatbot);
    const [initialStep,setInitialStep] = useState(0);

    const onExit = () => {
        setEnabled(false);
        Cookies.remove("chatbot-question-guide");
    }
    const options={
        scrollToElement: true,

    }

    const steps = [
        {
            element: '#question',
            intro: 'You Can Drag the questions up and down to set their priority',
            position: 'right',
        },
        {
            element: '#edit',
            intro: 'You Can Change the content of the question',
            position: 'right',
        },
        {
            element: '#save',
            intro: 'You Can Save Changes Made To The Question',
            position: 'right',
        },
        {
            element: '#delete',
            intro: 'You Can Delete the question',
            position: 'right',
        },
        {
            element: '#updateall',
            intro: 'You Can Update All The Changes Made To The Questions',
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

export default ChatbotQuestionTour;