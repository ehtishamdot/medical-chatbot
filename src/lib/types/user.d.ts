
export type userType={
  avatar:string;
  createdAt:string;
  email:string;
  id:string;
  role:"DOCTOR"|"ASSISTANT";
  specialty:string;
  updatedAt:string;
  username:string;
  jobTitle:string;
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
