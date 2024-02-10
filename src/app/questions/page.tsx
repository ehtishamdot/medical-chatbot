"use client";
import { useEffect, useState } from "react";
import Question from "./Question";
import { Button } from "@/components/ui/button";
import { httpRequestLocal } from "@/lib/interceptor";
import { AxiosError } from "axios";
import Menu from "@/components/Menu";
import { Loader } from "lucide-react";

interface Item {
  id: string;
  content: string;
}

function Page() {
  // const phases = [
  //   {
  //     name: "Phase I",
  //     questions: [
  //       {
  //         id: "1",
  //         question: "Hello! How are you feeling today?",
  //         status: "none",
  //         priority: 1,
  //       },
  //       {
  //         id: "2",
  //         question: "Can you provide your age and gender for our records?",
  //         status: "none",
  //         priority: 2,
  //       },
  //       {
  //         id: "3",
  //         question:
  //           "Is there anything specific you would like to share or discuss regarding your health?",
  //         status: "none",
  //         priority: 3,
  //       },
  //     ],
  //   },
  //   {
  //     name: "Phase II",
  //     questions: [
  //       {
  //         id: "4",
  //         question:
  //           "Have you experienced any changes in memory or concentration?",
  //         status: "none",
  //         priority: 4,
  //       },
  //       {
  //         id: "5",
  //         question:
  //           "Do you have frequent headaches, and if so, can you describe the types and location?",
  //         status: "none",
  //         priority: 5,
  //       },
  //       {
  //         id: "6",
  //         question:
  //           "Have you noticed any weakness or numbness in any part of your body?",
  //         status: "none",
  //         priority: 6,
  //       },
  //       {
  //         id: "7",
  //         question: "Are you experiencing tremors or involuntary movements?",
  //         status: "none",
  //         priority: 7,
  //       },
  //       {
  //         id: "8",
  //         question: "Do you have difficulty coordinating your movements?",
  //         status: "none",
  //         priority: 8,
  //       },
  //       {
  //         id: "9",
  //         question:
  //           "Have you noticed any stiffness or rigidity in your muscles?",
  //         status: "none",
  //         priority: 9,
  //       },
  //     ],
  //   },
  //   {
  //     name: "Phase III",
  //     questions: [
  //       {
  //         id: "10",
  //         question: "Can you describe the episodes you believe were seizures?",
  //         status: "none",
  //         priority: 10,
  //       },
  //       {
  //         id: "11",
  //         question:
  //           "Are there specific triggers or patterns associated with these episodes?",
  //         status: "none",
  //         priority: 11,
  //       },
  //       {
  //         id: "12",
  //         question:
  //           "Have you experienced any loss of consciousness during these events?",
  //         status: "none",
  //         priority: 12,
  //       },
  //       {
  //         id: "13",
  //         question:
  //           "Are you experiencing tingling or burning sensations in your extremities?",
  //         status: "none",
  //         priority: 13,
  //       },
  //       {
  //         id: "14",
  //         question: "Have you noticed any weakness in your hands or feet?",
  //         status: "none",
  //         priority: 14,
  //       },
  //       {
  //         id: "15",
  //         question: "Is there a family history of similar symptoms?",
  //         status: "none",
  //         priority: 15,
  //       },
  //     ],
  //   },
  //   {
  //     name: "Phase IV",
  //     questions: [
  //       {
  //         id: "16",
  //         question:
  //           "Do you have any existing medical conditions or neurological disorders?",
  //         status: "none",
  //         priority: 16,
  //       },
  //       {
  //         id: "17",
  //         question:
  //           "Are you currently taking any medications for neurological issues?",
  //         status: "none",
  //         priority: 17,
  //       },
  //       {
  //         id: "18",
  //         question:
  //           "Have you undergone any previous neurological treatments or surgeries?",
  //         status: "none",
  //         priority: 18,
  //       },
  //     ],
  //   },
  //   {
  //     name: "Phase V",
  //     questions: [
  //       {
  //         id: "19",
  //         question:
  //           "Can you describe your daily lifestyle habits, including sleep patterns and stress levels?",
  //         status: "none",
  //         priority: 19,
  //       },
  //       {
  //         id: "20",
  //         question:
  //           "Do you engage in regular physical exercise, and if so, what types and frequency?",
  //         status: "none",
  //         priority: 20,
  //       },
  //       {
  //         id: "21",
  //         question:
  //           "Are there any specific dietary habits or restrictions you follow?",
  //         status: "none",
  //         priority: 21,
  //       },
  //     ],
  //   },
  //   {
  //     name: "Phase VI",
  //     questions: [
  //       {
  //         id: "22",
  //         question:
  //           "Are you currently taking any medications for other non-neurological conditions?",
  //         status: "none",
  //         priority: 22,
  //       },
  //       {
  //         id: "23",
  //         question:
  //           "Have you experienced any side effects from your current medications?",
  //         status: "none",
  //         priority: 23,
  //       },
  //       {
  //         id: "24",
  //         question: "Do you have any known allergies to medications?",
  //         status: "none",
  //         priority: 24,
  //       },
  //     ],
  //   },
  // ];

  const speciailities = [
    {
      name: "neurologist",
      phases: [
        {
          phase: "phase1",
          questions: [
            { question: "Hello! How are you feeling today?", priority: 1 },
            {
              question: "Can you provide your age and gender for our records?",
              priority: 2,
            },
            {
              question:
                "Is there anything specific you would like to share or discuss regarding your health?",
              priority: 3,
            },
          ],
        },
        {
          phase: "phase2",
          questions: [
            {
              question:
                "Have you experienced any changes in memory or concentration?",
              priority: 4,
            },
            {
              question:
                "Do you have frequent headaches, and if so, can you describe the types and location?",
              priority: 5,
            },
            {
              question:
                "Have you noticed any weakness or numbness in any part of your body?",
              priority: 6,
            },
            {
              question:
                "Are you experiencing tremors or involuntary movements?",
              priority: 7,
            },
            {
              question: "Do you have difficulty coordinating your movements?",
              priority: 8,
            },
            {
              question:
                "Have you noticed any stiffness or rigidity in your muscles?",
              priority: 9,
            },
          ],
        },
        {
          phase: "phase3",
          questions: [
            {
              question:
                "Can you describe the episodes you believe were seizures?",
              priority: 10,
            },
            {
              question:
                "Are there specific triggers or patterns associated with these episodes?",
              priority: 11,
            },
            {
              question:
                "Have you experienced any loss of consciousness during these events?",
              priority: 12,
            },
            {
              question:
                "Are you experiencing tingling or burning sensations in your extremities?",
              priority: 13,
            },
            {
              question: "Have you noticed any weakness in your hands or feet?",
              priority: 14,
            },
            {
              question: "Is there a family history of similar symptoms?",
              priority: 15,
            },
          ],
        },
        {
          phase: "phase4",
          questions: [
            {
              question:
                "Do you have any existing medical conditions or neurological disorders?",
              priority: 16,
            },
            {
              question:
                "Are you currently taking any medications for neurological issues?",
              priority: 17,
            },
            {
              question:
                "Have you undergone any previous neurological treatments or surgeries?",
              priority: 18,
            },
          ],
        },
        {
          phase: "phase5",
          questions: [
            {
              question:
                "Can you describe your daily lifestyle habits, including sleep patterns and stress levels?",
              priority: 19,
            },
            {
              question:
                "Do you engage in regular physical exercise, and if so, what types and frequency?",
              priority: 20,
            },
            {
              question:
                "Are there any specific dietary habits or restrictions you follow?",
              priority: 21,
            },
          ],
        },
        {
          phase: "phase6",
          questions: [
            {
              question:
                "Are you currently taking any medications for other non-neurological conditions?",
              priority: 22,
            },
            {
              question:
                "Have you experienced any side effects from your current medications?",
              priority: 23,
            },
            {
              question: "Do you have any known allergies to medications?",
              priority: 24,
            },
          ],
        },
      ],
    },

    {
      name: "orthopedic",
      phases: [
        {
          phase: "phase1",
          questions: [
            { question: "Hello! How are you today?", priority: 1 },
            {
              question: "Could you please share your age and gender with us?",
              priority: 2,
            },
            {
              question:
                "Is there anything you'd like to discuss or share about your health before we proceed?",
              priority: 3,
            },
          ],
        },
        {
          phase: "phase2",
          questions: [
            {
              question:
                "Where do you feel pain, and can you describe its nature (sharp, dull, throbbing)?",
              priority: 4,
            },
            {
              question: "Did the pain start suddenly or gradually?",
              priority: 5,
            },
            {
              question: "Have you had any recent injuries or accidents?",
              priority: 6,
            },
            {
              question:
                "Which joints are affected, and do you notice any swelling or redness?",
              priority: 7,
            },
            {
              question:
                "Is the pain worse in the morning or after certain activities?",
              priority: 8,
            },
            {
              question: "Have you experienced any stiffness in the joints?",
              priority: 9,
            },
          ],
        },
        {
          phase: "phase3",
          questions: [
            {
              question:
                "Where exactly is your back pain located, and does it radiate to other areas?",
              priority: 10,
            },
            {
              question:
                "Have you noticed any weakness or numbness in your legs?",
              priority: 11,
            },
            {
              question: "Do certain movements or positions worsen the pain?",
              priority: 12,
            },
            {
              question:
                "Were there any specific incidents or accidents that led to your injury?",
              priority: 13,
            },
            {
              question:
                "Can you describe the intensity and location of the pain?",
              priority: 14,
            },
            {
              question:
                "Have you noticed any deformities or changes in the affected area?",
              priority: 15,
            },
          ],
        },
        {
          phase: "phase4",
          questions: [
            {
              question:
                "Do you have any existing medical conditions or orthopedic issues?",
              priority: 16,
            },
            {
              question:
                "Are you currently taking any medications for musculoskeletal problems?",
              priority: 17,
            },
            {
              question:
                "Have you undergone any previous orthopedic treatments or surgeries?",
              priority: 18,
            },
          ],
        },
        {
          phase: "phase5",
          questions: [
            {
              question:
                "Can you describe your daily activities and work routine?",
              priority: 19,
            },
            {
              question:
                "Do you engage in any specific exercises or physical activities regularly?",
              priority: 20,
            },
            {
              question:
                "Are there any ergonomic factors in your work or living environment that might contribute to your condition?",
              priority: 21,
            },
          ],
        },
        {
          phase: "phase6",
          questions: [
            {
              question:
                "Are you currently taking any medications for other non-orthopedic conditions?",
              priority: 22,
            },
            {
              question:
                "Have you experienced any side effects from your current medications?",
              priority: 23,
            },
            {
              question: "Do you have any known allergies to medications?",
              priority: 24,
            },
          ],
        },
      ],
    },
  ];
  const [phases, setPhases] = useState([]);
  const [isUpdating, setIsUpdating] = useState(false);

  const [user, setUser] = useState();

  // function handleEmit() {
  //   setLoading(true);
  //   setMessages((prev) => [...prev, { id: idGen(), isUser: true, message }]);
  //   const t = message;
  //   setMessage("");
  //   httpRequest
  //     .post("/api/chat", {
  //       message: t,
  //     })
  //     .then(({ data }) => {
  //       setMessages((prev) => [
  //         ...prev,
  //         { id: idGen(), isUser: false, message: data.message, isNew: true },
  //       ]);
  //     })
  //     .catch((err) => {
  //       if (err instanceof AxiosError)
  //         toast({
  //           title: "Error",
  //           description: err.response?.data.message,
  //         });
  //     })
  //     .finally(() => {
  //       setLoading(false);
  //     });
  // };

  useEffect(() => {
    setUser(JSON.parse(localStorage.getItem("user")??""));
  }, []);

  useEffect(() => {
    httpRequestLocal
      .get(
        `/api/questions/?specialty=${JSON.parse(
          localStorage.getItem("user")??""
        )?.specialty?.toLowerCase()}`
      )
      .then(({ data }) => {
        console.log(data);
        const phasesData = data.phases.filter(
          (phase) => phase.phases.length > 0
        )[0]?.phases;
        console.log(phasesData);
        setPhases(phasesData);
      })
      .catch((err) => {
        // if (err instanceof AxiosError)
        //   toa({
        //     title: "Error",
        //     description: err.response?.data.message,
        //   });
      })
      .finally(() => {
        // setLoading(false);
      });
  }, []);

  // useEffect(() => {
  //   httpRequestLocal
  //     .post("/api/questions", speciailities)
  //     .then(({ data }) => {
  //       console.log(data);
  //     })
  //     .catch((err) => {
  //       // if (err instanceof AxiosError)
  //       //   toa({
  //       //     title: "Error",
  //       //     description: err.response?.data.message,
  //       //   });
  //     })
  //     .finally(() => {
  //       // setLoading(false);
  //     });
  // }, []);

  const onUpdatePhaseHandler = (data: any) => {
    console.log(data);
    const updatedPhases = phases.map((phase) => {
      if (data.name === phase?.name) return data;
      else return phase;
    });
    console.log(updatedPhases);
    setPhases(updatedPhases);
  };

  const onUpdateAllPhaseHandler = (data: any) => {
    setIsUpdating(true);
    httpRequestLocal
      .put("/api/questions", phases)
      .then(({ data }) => {
        console.log(data);
        setIsUpdating(false);
      })
      .catch((err) => {
        // if (err instanceof AxiosError)
        //   toa({
        //     title: "Error",
        //     description: err.response?.data.message,
        //   });
      })
      .finally(() => {
        setIsUpdating(false);
      });
  };

  console.log(phases);

  return (
    <div className="question-answer-container p-5">
      <h2 className="text-center text-3xl mb-10 mt-10">
        Questions For {user?.specialty}
      </h2>
      <div className="updateButton flex justify-end md:w-100 lg:w-2/3 m-auto mb-4 px-8 sticky top-4">
        <Button onClick={onUpdateAllPhaseHandler} variant="custom" size="xl">
          {isUpdating ? <Loader /> : "Update All"}
        </Button>
      </div>
      <Menu />
      {phases?.map((phase, index) => {
        const sortedPhaseData = {
          ...phase,
          questions: [...phase.questions],
        };
        sortedPhaseData.questions.sort((a, b) => a.priority - b.priority);

        return (
          <div
            className="question-answer-wrapper p-8 md:w-100 lg:w-2/3 m-auto rounded-lg  border mb-3"
            key={index}
          >
            <Question
              phase={sortedPhaseData}
              updatePhase={onUpdatePhaseHandler}
            />
          </div>
        );
      })}
    </div>
  );
}

export default Page;
``;
