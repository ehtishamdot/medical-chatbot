"use client";
import Cookies from "js-cookie";

import {userType} from "@/lib/types/user";
class TokenService {

    getUser = (): null | userType => {
        const userData = Cookies.get("user");
        if (typeof window !== "undefined" && !!userData) {
            return JSON.parse(userData);
        }
        return null;
    };
    setUser = (user: userType) => {
        Cookies.set("user", JSON.stringify(user));
    };
    updateUser = <T extends keyof userType>(
        key: T,
        value: userType[T],
    ) => {
        const userObject = this.getUser();
        if (userObject) {
            userObject[key] = value;
            this.setUser(userObject);
        } else {
            throw new Error("Error");
        }
    };
    clearStorage = () => {
        Cookies.remove("user");
    };
}
export default new TokenService();
