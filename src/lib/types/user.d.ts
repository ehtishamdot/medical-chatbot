
export type userType={
  avatar:string;
  createdAt:string;
  email:string;
  id:string;
  role:"DOCTOR"|"ASSISTANT";
  specialty:string[];
  updatedAt:string;
  username:string;
  jobTitle:string;
  name:string;
  placeOfWork:string;
  licenseNumber:string;
  countryAndLanguage:string;
  countryOfPractice:string;
  preferredLanguage:string;
}


type doctorSpecialtyType = {
  id: string;
  name: string;
  diseases: Disease[];
  generalPhases: Phase[];
  countryAndLanguage: string;
  addedByUser: userType;
  addedByUserId: ObjectId;
  createdAt: Date;
  updatedAt: Date;
};
export type fetchAllSpecialtyApiResponse=doctorSpecialtyType[];



export type allUsers= {
  id: string;
  username: string;
  email: string;
  password: string;
  jobTitle: string;
  placeOfWork: string;
  licenseNumber: string;
  countryAndLanguage: string;
  countryOfPractice: string;
  preferredLanguage: string;
  role: string;
  queries: any[];
  createdAt: string;
  updatedAt: string;
  Patient: any[];
  Specialty: any[];
  Assistant: any[];
  history: any[];
  Appointment: any[];
  documents: any[];
}

export type fetchAllUsersApiResponse=allUsers[];
