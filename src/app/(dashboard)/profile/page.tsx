
import { Metadata } from "next";
import {UserProfileUpdate} from "@/components/modules/profile";

export const metadata: Metadata = {
    title: "Whisper",
    description:
        "Your Medical Chatbot",
};

const Profile = () => {
    return (
     <UserProfileUpdate/>
    );
};

export default Profile;
