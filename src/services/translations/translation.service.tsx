"use client"
import {useMutation} from "@tanstack/react-query";
import {toast} from "sonner";
import axios from "axios";
import {viewError} from "@/lib/helpers";
import {errorType} from "@/lib/types";


type translationCallbackType=(text:string)=>void;

export default function TranslationService() {

    const useHandleGetTranslatedText = () => {
        function handleTranslateToEnglish(
            data: {message:string},
        ): Promise<{message:string}> {
            return axios.post("/api/translate", data).then((res) => res.data);
        }

        const onSuccess = async (response:{message:string}) => {

        };
        const onError = (error: errorType) => {
            toast.error(viewError(error));
        };

        return useMutation({
            mutationFn: handleTranslateToEnglish,
            onError,
            onSuccess,
            retry: 0,
        });
    };
    return {
        useHandleGetTranslatedText,
    };
}
