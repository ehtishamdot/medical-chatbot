export const LANGUAGES = [
    "English", "French", "German", "Spanish", "Portuguese", "Russian", "Japanese", "Korean", "Chinese", "Arabic",
    "Italian", "Dutch", "Swedish", "Norwegian", "Danish", "Finnish", "Greek", "Turkish", "Hindi", "Bengali",
    "Thai", "Vietnamese", "Indonesian", "Malay", "Filipino", "Swahili", "Hebrew", "Persian", "Urdu", "Czech",
    "Polish", "Hungarian", "Romanian", "Slovak", "Croatian", "Bulgarian", "Serbian", "Slovenian", "Lithuanian",
    "Latvian", "Estonian", "Macedonian", "Albanian", "Maltese", "Icelandic", "Gujarati", "Tamil", "Telugu",
    "Kannada", "Marathi", "Punjabi", "Sinhala", "Nepali", "Burmese", "Khmer", "Lao"
].map(language => ({ label: language, value: language }));


interface Patient {
    patientID: string;
    firstName: string;
    lastName: string;
    dateOfBirth: string; // Consider using Date type if you need date operations
    gender: string;
    phoneNumber: string;
    email: string;
    address: string;
    medicalHistory: string;
    clinicalAssessments: string;
    medicationInformation: string;
    appointmentsAndVisits: {
        date: string; // Consider using Date type if you need date operations
        reason: string;
        doctor: string;
    }[];
    insuranceInformation: {
        insuranceProvider: string;
        policyNumber: string;
        groupNumber: string;
        policyHolder: string;
    };
}


export const PATIENTS:Patient[] = [
    {
        patientID: "P001",
        firstName: "John",
        lastName: "Doe",
        dateOfBirth: "1985-07-15",
        gender: "Male",
        phoneNumber: "555-123-4567",
        email: "johndoe@example.com",
        address: "123 Main Street, Anytown, USA",
        medicalHistory: "Allergic to penicillin, previous knee surgery",
        clinicalAssessments: "Blood pressure slightly elevated, BMI in healthy range",
        medicationInformation: "Lisinopril for blood pressure, ibuprofen as needed for pain",
        appointmentsAndVisits: [
            { date: "2024-02-10", reason: "Routine checkup", doctor: "Dr. Smith" },
            { date: "2023-12-05", reason: "Follow-up after knee surgery", doctor: "Dr. Johnson" }
        ],
        insuranceInformation: {
            insuranceProvider: "XYZ Insurance",
            policyNumber: "123456789",
            groupNumber: "987654321",
            policyHolder: "John Doe"
        }
    },
    {
        patientID: "P002",
        firstName: "Jane",
        lastName: "Smith",
        dateOfBirth: "1990-05-20",
        gender: "Female",
        phoneNumber: "555-987-6543",
        email: "janesmith@example.com",
        address: "456 Elm Street, Anycity, USA",
        medicalHistory: "None",
        clinicalAssessments: "BMI within normal range, occasional headaches",
        medicationInformation: "None",
        appointmentsAndVisits: [
            { date: "2023-11-30", reason: "Annual physical", doctor: "Dr. Patel" },
            { date: "2022-08-15", reason: "Flu symptoms", doctor: "Dr. Lee" }
        ],
        insuranceInformation: {
            insuranceProvider: "ABC Healthcare",
            policyNumber: "987654321",
            groupNumber: "123456789",
            policyHolder: "Jane Smith"
        }
    },
    {
        patientID: "P002",
        firstName: "Jane",
        lastName: "Smith",
        dateOfBirth: "1990-05-20",
        gender: "Female",
        phoneNumber: "555-987-6543",
        email: "janesmith@example.com",
        address: "456 Elm Street, Anycity, USA",
        medicalHistory: "None",
        clinicalAssessments: "BMI within normal range, occasional headaches",
        medicationInformation: "None",
        appointmentsAndVisits: [
            { date: "2023-11-30", reason: "Annual physical", doctor: "Dr. Patel" },
            { date: "2022-08-15", reason: "Flu symptoms", doctor: "Dr. Lee" }
        ],
        insuranceInformation: {
            insuranceProvider: "ABC Healthcare",
            policyNumber: "987654321",
            groupNumber: "123456789",
            policyHolder: "Jane Smith"
        }
    },
    {
        patientID: "P002",
        firstName: "Jane",
        lastName: "Smith",
        dateOfBirth: "1990-05-20",
        gender: "Female",
        phoneNumber: "555-987-6543",
        email: "janesmith@example.com",
        address: "456 Elm Street, Anycity, USA",
        medicalHistory: "None",
        clinicalAssessments: "BMI within normal range, occasional headaches",
        medicationInformation: "None",
        appointmentsAndVisits: [
            { date: "2023-11-30", reason: "Annual physical", doctor: "Dr. Patel" },
            { date: "2022-08-15", reason: "Flu symptoms", doctor: "Dr. Lee" }
        ],
        insuranceInformation: {
            insuranceProvider: "ABC Healthcare",
            policyNumber: "987654321",
            groupNumber: "123456789",
            policyHolder: "Jane Smith"
        }
    },
    {
        patientID: "P002",
        firstName: "Jane",
        lastName: "Smith",
        dateOfBirth: "1990-05-20",
        gender: "Female",
        phoneNumber: "555-987-6543",
        email: "janesmith@example.com",
        address: "456 Elm Street, Anycity, USA",
        medicalHistory: "None",
        clinicalAssessments: "BMI within normal range, occasional headaches",
        medicationInformation: "None",
        appointmentsAndVisits: [
            { date: "2023-11-30", reason: "Annual physical", doctor: "Dr. Patel" },
            { date: "2022-08-15", reason: "Flu symptoms", doctor: "Dr. Lee" }
        ],
        insuranceInformation: {
            insuranceProvider: "ABC Healthcare",
            policyNumber: "987654321",
            groupNumber: "123456789",
            policyHolder: "Jane Smith"
        }
    },
    {
        patientID: "P002",
        firstName: "Jane",
        lastName: "Smith",
        dateOfBirth: "1990-05-20",
        gender: "Female",
        phoneNumber: "555-987-6543",
        email: "janesmith@example.com",
        address: "456 Elm Street, Anycity, USA",
        medicalHistory: "None",
        clinicalAssessments: "BMI within normal range, occasional headaches",
        medicationInformation: "None",
        appointmentsAndVisits: [
            { date: "2023-11-30", reason: "Annual physical", doctor: "Dr. Patel" },
            { date: "2022-08-15", reason: "Flu symptoms", doctor: "Dr. Lee" }
        ],
        insuranceInformation: {
            insuranceProvider: "ABC Healthcare",
            policyNumber: "987654321",
            groupNumber: "123456789",
            policyHolder: "Jane Smith"
        }
    },
    {
        patientID: "P002",
        firstName: "Jane",
        lastName: "Smith",
        dateOfBirth: "1990-05-20",
        gender: "Female",
        phoneNumber: "555-987-6543",
        email: "janesmith@example.com",
        address: "456 Elm Street, Anycity, USA",
        medicalHistory: "None",
        clinicalAssessments: "BMI within normal range, occasional headaches",
        medicationInformation: "None",
        appointmentsAndVisits: [
            { date: "2023-11-30", reason: "Annual physical", doctor: "Dr. Patel" },
            { date: "2022-08-15", reason: "Flu symptoms", doctor: "Dr. Lee" }
        ],
        insuranceInformation: {
            insuranceProvider: "ABC Healthcare",
            policyNumber: "987654321",
            groupNumber: "123456789",
            policyHolder: "Jane Smith"
        }
    },
    {
        patientID: "P002",
        firstName: "Jane",
        lastName: "Smith",
        dateOfBirth: "1990-05-20",
        gender: "Female",
        phoneNumber: "555-987-6543",
        email: "janesmith@example.com",
        address: "456 Elm Street, Anycity, USA",
        medicalHistory: "None",
        clinicalAssessments: "BMI within normal range, occasional headaches",
        medicationInformation: "None",
        appointmentsAndVisits: [
            { date: "2023-11-30", reason: "Annual physical", doctor: "Dr. Patel" },
            { date: "2022-08-15", reason: "Flu symptoms", doctor: "Dr. Lee" }
        ],
        insuranceInformation: {
            insuranceProvider: "ABC Healthcare",
            policyNumber: "987654321",
            groupNumber: "123456789",
            policyHolder: "Jane Smith"
        }
    },
    // Add more patient objects as needed
];

export const DASHBOARD_PATIENTS = [
    {
        patientID: 1,
        fullName: "John Doe",
        dateOfBirth: "1985-05-15",
        gender: "Male",
        email: "john.doe@example.com",
        medicalHistory: "Hypertension, Diabetes",
        clinicalAssessment: "Routine checkup, BP slightly elevated"
    },
    {
        patientID: 2,
        fullName: "Jane Smith",
        dateOfBirth: "1990-10-20",
        gender: "Female",
        email: "jane.smith@example.com",
        medicalHistory: "Asthma, Allergies",
        clinicalAssessment: "Follow-up on asthma treatment, allergy symptoms improving"
    },
    {
        patientID: 3,
        fullName: "Michael Johnson",
        dateOfBirth: "1978-03-12",
        gender: "Male",
        email: "michael.johnson@example.com",
        medicalHistory: "Arthritis, High cholesterol",
        clinicalAssessment: "Joint pain management, cholesterol levels stable"
    },
    {
        patientID: 3,
        fullName: "Michael Johnson",
        dateOfBirth: "1978-03-12",
        gender: "Male",
        email: "michael.johnson@example.com",
        medicalHistory: "Arthritis, High cholesterol",
        clinicalAssessment: "Joint pain management, cholesterol levels stable"
    },
    {
        patientID: 3,
        fullName: "Michael Johnson",
        dateOfBirth: "1978-03-12",
        gender: "Male",
        email: "michael.johnson@example.com",
        medicalHistory: "Arthritis, High cholesterol",
        clinicalAssessment: "Joint pain management, cholesterol levels stable"
    },
    {
        patientID: 3,
        fullName: "Michael Johnson",
        dateOfBirth: "1978-03-12",
        gender: "Male",
        email: "michael.johnson@example.com",
        medicalHistory: "Arthritis, High cholesterol",
        clinicalAssessment: "Joint pain management, cholesterol levels stable"
    }
];
