
import { Metadata } from "next";
import {UserProfileUpdate} from "@/components/modules/profile";
import {getServerSession} from "next-auth";
import {getCountries} from "@/services/misc/misc.api";
import {cookies} from "next/headers";

export const metadata: Metadata = {
    title: "Whisper",
    description:
        "Your Medical Chatbot",
};

const Profile = async () => {

    return (
     <UserProfileUpdate/>
    );
};

export default Profile;
