import Question from "./Question";

interface Item {
  id: string;
  content: string;
}

function Page() {
  return (
    <div className="question-answer-container p-5">
      <h2 className="text-center text-3xl mb-14">
        Question Answers For Medical ChatBot
      </h2>
      {["Phase I", "Phase II", "Phase III", "Phase IV"].map((phase, index) => {
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
