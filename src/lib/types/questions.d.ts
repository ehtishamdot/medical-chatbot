export type phasesApiResponseType={
    phases:phasesType[];
};
export type phasesType={
    id:string;
    name:string;
    createdAt:string;
    updatedAt:string;
    phases:phases[]
}
export type phases={
    id:string;
    name:string;
    specialityId:string;
    createdAt:string;
    updatedAt:string;
    questions:questionsType[];
}

export type questionsType={
    id:string;
    phaseId:string;
    question:string;
    priority:number;
    status:string;
    createdAt:string;
    updatedAt:string;
}
