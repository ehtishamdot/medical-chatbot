
type ChatHistoryItem = {
    role: 'user' | 'assistant';
    content: string;
};

export type chatSessionType = {
    id: string;
    chatHistory: ChatHistoryItem[];
    diseaseName:string;
    penalty: number;
    ragVecHit: null | any;
    chatComplete: boolean;
    report: null | any;
    userId: string;
    patientId: string;
    specialtyId: null | any;
    customBotId: string;
    createdAt: string;
    specialtyName:string;
    updatedAt: string;
};

type fetchAllChatHistoryApiResponse = chatSessionType[];
