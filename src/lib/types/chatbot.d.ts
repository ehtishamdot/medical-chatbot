
export type createChatbotApiResponse = {
        id: string;
        name: string;
        countryAndLanguage: string;
        addedByUserId: string;
        createdAt: string;
        updatedAt: string;
        specificity:string;
        diseaseId:string;
};

export type diseasesType = {
        id: string;
        name: string;
        specialtyId: string;
        createdAt: string;
        updatedAt: string;
};

export type generalphasesType = {
        id: string;
        name: string;
        phaseType: string;
        specialtyId: string;
        diseaseId: string | null;
        createdAt: string;
        updatedAt: string;
};

export  type fetchAllChatbotsApiResponse = {
        id: string;
        name: string;
        countryAndLanguage: string;
        addedByUserId: string;
        createdAt: string;
        updatedAt: string;
        diseases: diseasesType[];
        generalPhases: generalphasesType[];
};
