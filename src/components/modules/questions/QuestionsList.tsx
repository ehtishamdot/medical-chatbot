"use client";
import { useEffect, useState } from "react";
import Question from "@/components/modules/questions/Questions";
import { Button } from "@/components/ui/button";
import { httpRequestLocal } from "@/lib/interceptor";
import Menu from "@/components/Menu";
import { Loader } from "lucide-react";
import {phases, phasesApiResponseType} from "@/lib/types/questions";
import {Card} from "@/components/ui/card";
import DefaultLoader from "@/components/common/loaders/default-loader";
import LoadingPage from "@/components/common/loaders/loading-page";


function QuestionsList({id,specificity,diseaseId}:{id:string;specificity:string;diseaseId:string|undefined}) {

    const [phases, setPhases] = useState<phases[]>([]);
    const [title,setTitle]=useState("");
    const [isUpdating, setIsUpdating] = useState(false);
    const [isLoading,setIsLoading]=useState(true);


    useEffect(() => {
        setIsLoading(true);
        let url=`/api/bots/?specialtyId=${id}&specificity=${specificity}`
        if(diseaseId){
            url+=`&diseaseId=${diseaseId}`
        }
        httpRequestLocal
            .get(
              url
            )
            .then(({ data }:{data:phasesApiResponseType}) => {
                console.log(data);
                const phasesData = data.phases.filter(
                    (phase) => phase.questions.length > 0
                );
                console.log(phasesData);
                setTitle(data.name)
                setPhases(phasesData);
            })
            .catch((err) => {
            })
            .finally(() => {
                setIsLoading(false);
            });
    }, []);

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
            .put("/api/bots", phases)
            .then(({ data }) => {
                console.log(data);
                setIsUpdating(false);
            })
            .catch((err) => {
            })
            .finally(() => {
                setIsUpdating(false);
            });
    };

    if(isLoading){
        return <LoadingPage/>
    }

    return (
        <div className="question-answer-container p-5 md:w-full lg:w-4/5 xl:w-2/3">
            {title!==""&&<h2 className=" text-3xl mb-10 mt-10">
                Questions For {title}
            </h2>}
            <div className="flex justify-end mb-3 pr-2">
                <Button onClick={onUpdateAllPhaseHandler} className={'bg-primary'}>
                    {isUpdating ? <DefaultLoader /> : "Update All"}
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
                    <Card
                        className="question-answer-wrapper p-8   rounded-lg   mb-3"
                        key={index}
                    >
                        <Question
                            phase={sortedPhaseData}
                            updatePhase={onUpdatePhaseHandler}
                        />
                    </Card>
                );
            })}
        </div>
    );
}

export default QuestionsList;
