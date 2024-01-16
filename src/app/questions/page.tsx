import Question from "./Question";

interface Item {
  id: string;
  content: string;
}

function Page() {
  const phases = [
    {
      name: "Phase I",
      questions: [
        {
          id: "1",
          question: "Hello! How are you feeling today?",
          status: "none",
          priority: 1,
        },
        {
          id: "2",
          question: "Can you provide your age and gender for our records?",
          status: "none",
          priority: 2,
        },
        {
          id: "3",
          question:
            "Is there anything specific you would like to share or discuss regarding your health?",
          status: "none",
          priority: 3,
        },
      ],
    },
    {
      name: "Phase II",
      questions: [
        {
          id: "4",
          question:
            "Have you experienced any changes in memory or concentration?",
          status: "none",
          priority: 4,
        },
        {
          id: "5",
          question:
            "Do you have frequent headaches, and if so, can you describe the type and location?",
          status: "none",
          priority: 5,
        },
        {
          id: "6",
          question:
            "Have you noticed any weakness or numbness in any part of your body?",
          status: "none",
          priority: 6,
        },
        {
          id: "7",
          question: "Are you experiencing tremors or involuntary movements?",
          status: "none",
          priority: 7,
        },
        {
          id: "8",
          question: "Do you have difficulty coordinating your movements?",
          status: "none",
          priority: 8,
        },
        {
          id: "9",
          question:
            "Have you noticed any stiffness or rigidity in your muscles?",
          status: "none",
          priority: 9,
        },
      ],
    },
    {
      name: "Phase III",
      questions: [
        {
          id: "10",
          question: "Can you describe the episodes you believe were seizures?",
          status: "none",
          priority: 10,
        },
        {
          id: "11",
          question:
            "Are there specific triggers or patterns associated with these episodes?",
          status: "none",
          priority: 11,
        },
        {
          id: "12",
          question:
            "Have you experienced any loss of consciousness during these events?",
          status: "none",
          priority: 12,
        },
        {
          id: "13",
          question:
            "Are you experiencing tingling or burning sensations in your extremities?",
          status: "none",
          priority: 13,
        },
        {
          id: "14",
          question: "Have you noticed any weakness in your hands or feet?",
          status: "none",
          priority: 14,
        },
        {
          id: "15",
          question: "Is there a family history of similar symptoms?",
          status: "none",
          priority: 15,
        },
      ],
    },
    {
      name: "Phase IV",
      questions: [
        {
          id: "16",
          question:
            "Do you have any existing medical conditions or neurological disorders?",
          status: "none",
          priority: 16,
        },
        {
          id: "17",
          question:
            "Are you currently taking any medications for neurological issues?",
          status: "none",
          priority: 17,
        },
        {
          id: "18",
          question:
            "Have you undergone any previous neurological treatments or surgeries?",
          status: "none",
          priority: 18,
        },
      ],
    },
    {
      name: "Phase V",
      questions: [
        {
          id: "19",
          question:
            "Can you describe your daily lifestyle habits, including sleep patterns and stress levels?",
          status: "none",
          priority: 19,
        },
        {
          id: "20",
          question:
            "Do you engage in regular physical exercise, and if so, what type and frequency?",
          status: "none",
          priority: 20,
        },
        {
          id: "21",
          question:
            "Are there any specific dietary habits or restrictions you follow?",
          status: "none",
          priority: 21,
        },
      ],
    },
    {
      name: "Phase VI",
      questions: [
        {
          id: "22",
          question:
            "Are you currently taking any medications for other non-neurological conditions?",
          status: "none",
          priority: 22,
        },
        {
          id: "23",
          question:
            "Have you experienced any side effects from your current medications?",
          status: "none",
          priority: 23,
        },
        {
          id: "24",
          question: "Do you have any known allergies to medications?",
          status: "none",
          priority: 24,
        },
      ],
    },
  ];

  return (
    <div className="question-answer-container p-5">
      <h2 className="text-center text-3xl mb-14">
        Question Answers For Medical ChatBot
      </h2>
      {phases.map((phase, index) => {
        return (
          <div
            className="question-answer-wrapper p-8 md:w-100 lg:w-2/3 m-auto rounded-lg  border mb-3"
            key={index}
          >
            <Question phase={phase} />
          </div>
        );
      })}
    </div>
  );
}

export default Page;
``;
