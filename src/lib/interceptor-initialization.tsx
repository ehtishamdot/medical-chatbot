"use client";

import { useEffect } from "react";

import setup from "@/lib/httpLocalInterceptor";
export default function InterceptorInitialization() {
    useEffect(() => setup(), []);
    return null;
}
