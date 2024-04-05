
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
export function formatTitle(title:string) {
    let words = title.split('_');
    return words.map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
}