"use client";

import { Logo } from "@/components/assets/Icons";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
import Link from "next/link";
import { useEffect, useState } from "react";
import axios, { AxiosError } from "axios";
import { useToast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";
import { signIn,useSession} from "next-auth/react";
import Image from "next/image";


export default function Landing() {
  const [inputs, setInputs] = useState({
    input: "",
    password: "",
  });
  const { toast } = useToast();
  const { push } = useRouter();
  const { data: session } = useSession();
  useEffect(() => {
    push("/chat")
  },[push])

  return (
    <div className="bg-white">
  
   
  </div>
  );
}
