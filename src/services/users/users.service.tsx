"use client"
import {useQuery} from "@tanstack/react-query";
import axios from "axios";
import {allUsers, fetchAllUsersApiResponse} from "@/lib/types/user";


export default function UsersService() {

    const useFetchAllUsers = () => {
        function fetchPatients(): Promise<fetchAllUsersApiResponse> {
            return axios.get("/api/users").then((res) => res.data);
        }
        return useQuery({
            queryFn: fetchPatients,
            queryKey: [`users`],
            retry: 0,
        });
    };
    const useFetchSingleUser = (id:string) => {
        function fetchPatients(): Promise<allUsers> {
            return axios.get(`/api/users?id=${id}`).then((res) => res.data);
        }
        return useQuery({
            queryFn: fetchPatients,
            queryKey: [`users`,id],
            retry: 0,
        });
    };

    return {
        useFetchAllUsers,
        useFetchSingleUser
    };
}
