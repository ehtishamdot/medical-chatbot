
import {errorType} from "@/lib/types";
export function viewError(err: errorType) {
    if (Array.isArray(err.response.data.message)) {
        return err.response.data.message[0];
    } else {
        return err.response.data.message;
    }
}

export function truncateString(str: string, maxLength: number) {
    if (str.length <= maxLength) {
        return str;
    } else {
        return str.slice(0, maxLength) + "...";
    }
}
