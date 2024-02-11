import { useMutation } from "@tanstack/react-query";
import {toast} from "sonner";
import {useRouter} from "next/navigation";
import axios from "axios";
import {signUpFormType} from "@/lib/types/auth";
import {viewError} from "@/lib/helpers";
import {errorType} from "@/lib/types";
import {userType} from "@/lib/types/user";
import {z} from "zod";
import {profileFormSchema} from "@/components/modules/profile/profile-update-form";
import {securityFormSchema} from "@/components/modules/profile/account-settings-form";
import {httpRequest, httpRequestLocal} from "@/lib/interceptor";
import tokenService from "@/services/token/token.service";
import {axiosInstanceLocal} from "@/lib/httpLocalInterceptor";

export default function AuthServices() {
    const router=useRouter();
    //User Sign up
    const useHandleSignUpService = () => {
        function handleSignupRequest(
            data: signUpFormType,
        ): Promise<userType> {
            return axios.post("/api/auth/signup", data).then((res) => res.data);
        }

        const onSuccess = async (response: userType) => {
            toast.success("Account Created Successfully");
            tokenService.setUser(response);
            router.push(`/dashboard`);
        };
        const onError = (error: errorType) => {
            toast.error(viewError(error));
        };

        return useMutation({
            mutationFn: handleSignupRequest,
            onError,
            onSuccess,
            retry: 0,
        });
    };
    const useHandleUpdateProfileService = () => {
        function handleSignupRequest(
            data: z.infer<typeof profileFormSchema>,
        ): Promise<userType> {
            return axiosInstanceLocal.put("/api/auth/profile", data).then((res) => res.data);
        }

        const onSuccess = async (response: userType) => {
            toast.success("Profile Updated Successfully");
        };
        const onError = (error: errorType) => {
            toast.error(viewError(error));
        };

        return useMutation({
            mutationFn: handleSignupRequest,
            onError,
            onSuccess,
            retry: 0,
        });
    };
    const useHandleUpdateSecuritySettings = () => {
        function handleSignupRequest(
            data: z.infer<typeof securityFormSchema>,
        ): Promise<userType> {
            return axiosInstanceLocal.put("/api/auth/security", data).then((res) => res.data);
        }

        const onSuccess = async (response: userType) => {
            toast.success("Security Details Updated Successfully");
        };
        const onError = (error: errorType) => {
            toast.error(viewError(error));
        };

        return useMutation({
            mutationFn: handleSignupRequest,
            onError,
            onSuccess,
            retry: 0,
        });
    };
    return {
        useHandleSignUpService,
        useHandleUpdateProfileService,
        useHandleUpdateSecuritySettings
    };
}
