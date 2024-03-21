export type feedbackType = {
    rating: number;
    comment: string;
};

type patientFeedbackType = {
    patient:{
        id: string;
        name: string;
        email: string;
        gender: string;
        dateOfBirth: string; // You might want to use a Date type here if you're using a library like Moment.js
        phone: string;
        address: string;
        medicalHistory: string;
    }

    addedByUserId: string;
    feedback: Feedback;
};
