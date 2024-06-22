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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { useState } from "react";
import axios, { AxiosError } from "axios";
import { useRouter } from "next/navigation";
import { signIn, useSession } from "next-auth/react";
import {toast} from "sonner";
import tokenService from "@/services/token/token.service";
import DefaultLoader from "@/components/common/loaders/default-loader";

export default function Login() {
  const [inputs, setInputs] = useState({
    input: "",
    password: "",
  });
  const [isLoading,setIsLoading]=useState(false);
  const { push } = useRouter();
  const { data: session } = useSession();

  // if(session){
  //   push("/chat");
  // }

  async function handleLogin() {
    setIsLoading(true);
    const { input, password} = inputs;
    axios
      .post("/api/auth/login", { input, password })
      .then(({ data }) => {
        tokenService.setUser(data);
        push("/dashboard");

      })
      .catch((err) => {
        if (err instanceof AxiosError)
          toast(err.response?.data.message);
      }).finally(()=>{
        setIsLoading(false)
    });
  }

  return (
    <div className="flex flex-col items-center h-screen">
      <span className="mt-12">{Logo}</span>
      <Card className="w-[380px] py-5 mt-48 max-[900px]:mt-10 max-[400px]:w-[95%]">
        <CardHeader>
          <CardTitle>Welcome back</CardTitle>
          <CardDescription>Login to your account.</CardDescription>
        </CardHeader>
        <CardContent>
          <form>
            <div className="grid w-full items-center gap-4 mt-1">
              <div className="flex flex-col gap-3  space-y-1.5">
                <Label htmlFor="email">Email or username</Label>
                <Input
                  required
                  value={inputs.input}
                  onChange={(e) =>
                    setInputs((prev) => ({ ...prev, input: e.target.value }))
                  }
                  id="email"
                  placeholder="john.doe@example.com"
                />
              </div>
              <div className="flex flex-col gap-3 mt-2 space-y-1.5">
                <Label htmlFor="password">Password</Label>
                <Input
                  value={inputs.password}
                  onChange={(e) =>
                    setInputs((prev) => ({ ...prev, password: e.target.value }))
                  }
                  required
                  type="password"
                  id="password"
                />
              </div>
            </div>
          </form>
        </CardContent>
        <CardFooter className="flex mt-1">
          <Button
            onClick={() => handleLogin()}
            variant="custom"
            className="w-full"
            // disabled={!inputs.input || !inputs.password}
          >
            {isLoading?<DefaultLoader/>:"Login"}
          </Button>
        </CardFooter>
        <CardHeader style={{ textAlign: "center" }}>
          <Link className={"text-center mb-2"} href={"/auth/forgot-password"}>Forgot Password?</Link>

          <CardTitle>OR</CardTitle>
        </CardHeader>
        <CardFooter className="flex mt-1">
          <Button
            disabled
            onClick={() => signIn()}
            variant="custom"
            className="w-full"
            // disabled={!inputs.input || !inputs.password}
          >
            Google Login
          </Button>
        </CardFooter>
      </Card>
      <span className="mt-6 text-sm">
        Dont have an account?{" "}
        <Link className="text-neutral-400" href="/auth/signup">
          Sign up
        </Link>{" "}
      </span>
    </div>
  );
}
