export type docType= {
    id: string;
    url: string;
    name: string;
    userId: string;
    createdAt: string;
    updatedAt: string;
}

export type fetchAllDocsApiResponse=docType[]