import {cookies} from "next/headers";

import {API_BASEURL, cookieAuth} from "@/_utils/constants";

export default async function serverFetch<T>(
    url: string,
    tags: string[],
    revalidate?: number,
    custom?: boolean,
): Promise<T> {
    const authorization = cookies().get(cookieAuth)?.value;

    const res = await fetch(custom ? url : `${API_BASEURL}${url}`, {
        headers: { authorization: `Bearer ${authorization}` },
        next: { tags: tags, revalidate: revalidate || 3600 },
    });
    console.log(res.status, "status");
    return (await res.json()) as T;
}
