interface botStatsType {
    createdAssistants: number;
    patientAssisted: number;
    botUsage: number;
    totalRatings: number;
    latestHistories: latestHistoryType;

}
type ChatHistoryItem = {
    role: string;
    content: string;
};

type ChatHistory = ChatHistoryItem[];

type ChatHistoryEntry = {
    id: string;
    chatHistory: ChatHistory;
    penalty: number;
    ragVecHit: any; // Adjust this type as per your actual data structure
    chatComplete: boolean;
    report: any; // Adjust this type as per your actual data structure
    userId: string;
    patientId: string;
    specialtyId: string | null;
    customBotId: string;
    createdAt: string;
    updatedAt: string;
};

type latestHistoryType = ChatHistoryEntry[];

