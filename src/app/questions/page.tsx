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
        { id: "1", question: "What is your age?", status: "none" },
        { id: "2", question: "What is your gender??", status: "none" },
        { id: "3", question: "  What are the syptoms?", status: "none" },
      ],
    },
    {
      name: "Phase II",
      questions: [
        { id: "1", question: "What is your age?", status: "none" },
        { id: "2", question: "What is your gender?", status: "none" },
        { id: "3", question: "  What are the syptoms?", status: "none" },
      ],
    },
    {
      name: "Phase III",
      questions: [
        { id: "1", question: "What is your age?", status: "none" },
        { id: "2", question: "What is your gender?", status: "none" },
        { id: "3", question: "  What are the syptoms?", status: "none" },
      ],
    },
    {
      name: "Phase IV",
      questions: [
        { id: "1", question: "What is your age?", status: "none" },
        { id: "2", question: "What is your gender?", status: "none" },
        { id: "3", question: "  What are the syptoms?", status: "none" },
      ],
    },
    {
      name: "Phase V",
      questions: [
        { id: "1", question: "What is your age?", status: "none" },
        { id: "2", question: "What is your gender? Phase I", status: "none" },
        { id: "3", question: " What are the syptoms?", status: "none" },
      ],
    },
    {
      name: "Phase VI",
      questions: [
        { id: "1", question: "What is your age?", status: "none" },
        { id: "2", question: "What is your gender?", status: "none" },
        { id: "3", question: "  What are the syptoms?", status: "none" },
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
``