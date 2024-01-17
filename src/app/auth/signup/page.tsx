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
import { useToast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";
import axios, { AxiosError } from "axios";

export default function Signup() {
  const [inputs, setInputs] = useState({
    email: "",
    username: "",
    avatar: "",
    apiKey: "",
    password: "",
  });
  const { toast } = useToast();
  const { push } = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [selectedSpecialty, setSelectedSpecialty] = useState("");

  function handleSignup() {
    const { email, apiKey, avatar, username, password } = inputs;
    if (selectedSpecialty === "") {
      toast({
        title: "Signup unsuccessfu",
        description: "please select your specialty",
      });
      return;
    }
    axios
      .post("/api/auth/signup", {
        email,
        apiKey,
        avatar,
        username,
        password,
        specialty: selectedSpecialty,
      })
      .then(({ data }) => {
        localStorage.setItem("user", JSON.stringify(data));
        push("/questions");
      })
      .catch((err) => {
        if (err instanceof AxiosError)
          toast({
            title: "Signup unsuccessful",
            description: err.response?.data.message,
          });
      });
  }

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const closeDropdown = () => {
    setIsOpen(false);
  };

  const handleSpecialtySelect = (specialty) => {
    setSelectedSpecialty(specialty);
    closeDropdown();
  };

  return (
    <div className="flex flex-col items-center h-screen">
      <span className="mt-12">{Logo}</span>
      <Card className="w-[380px] py-5 mt-20 max-[900px]:mt-10 max-[400px]:w-[95%]">
        <CardHeader>
          <CardTitle>New to Esper Wise</CardTitle>
          <CardDescription>Create your account.</CardDescription>
        </CardHeader>
        <CardContent>
          <form>
            <div className="grid w-full items-center gap-4 mt-1">
              <div className="flex flex-col gap-3  space-y-1.5">
                <Label htmlFor="email">Email </Label>
                <Input
                  value={inputs.email}
                  onChange={(e) =>
                    setInputs((prev) => ({ ...prev, email: e.target.value }))
                  }
                  id="email"
                  placeholder="john.doe@example.com"
                />
              </div>
              <div className="flex flex-col gap-3  space-y-1.5">
                <div className="w-full ">
                  <div className="relative inline-block">
                    <button
                      type="button"
                      className="px-4 py-2 text-white hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm inline-flex items-center"
                      onClick={toggleDropdown}
                    >
                      {selectedSpecialty || "Select Specialty"}
                      <svg
                        class="w-2.5 h-2.5 ml-2.5"
                        aria-hidden="true"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 10 6"
                      >
                        <path
                          stroke="currentColor"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="m1 1 4 4 4-4"
                        />
                      </svg>
                    </button>

                    {isOpen && (
                      <div className="origin-top-right absolute right-0 mt-2 w-44 rounded-lg shadow-lg bg-white ring-1 ring-black ring-opacity-5">
                        <ul
                          role="menu"
                          aria-orientation="vertical"
                          aria-labelledby="options-menu"
                        >
                          <li>
                            <a
                              href="#"
                              className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                              onClick={() =>
                                handleSpecialtySelect("orthopedic")
                              }
                            >
                              orthopedic
                            </a>
                          </li>
                          <li>
                            <a
                              href="#"
                              className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                              onClick={() =>
                                handleSpecialtySelect("neurologist")
                              }
                            >
                              neurologist
                            </a>
                          </li>
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <div className="flex flex-col gap-3  space-y-1.5">
                <Label htmlFor="username">Username</Label>
                <Input
                  value={inputs.username}
                  onChange={(e) =>
                    setInputs((prev) => ({ ...prev, username: e.target.value }))
                  }
                  id="username"
                  placeholder="johndoe"
                />
              </div>
              {/* <div className="flex flex-col gap-3  space-y-1.5">
                <Label htmlFor="avatar">
                  Avatar URL
                  <span className="text-neutral-400">(optional)</span>
                </Label>
                <Input
                  value={inputs.avatar}
                  onChange={(e) =>
                    setInputs((prev) => ({ ...prev, avatar: e.target.value }))
                  }
                  id="avatar"
                  placeholder="https://github.com/johndoe.png"
                />
              </div> */}
              {/* <div className="flex flex-col gap-3  space-y-1.5">
                <Label htmlFor="api">API key</Label>
                <Input
                  value={inputs.apiKey}
                  onChange={(e) =>
                    setInputs((prev) => ({ ...prev, apiKey: e.target.value }))
                  }
                  id="api"
                  placeholder="xy125y7Trf786Something"
                />
              </div> */}
              <div className="flex flex-col gap-3 mt-2 space-y-1.5">
                <Label htmlFor="password">Password</Label>
                <Input
                  value={inputs.password}
                  onChange={(e) =>
                    setInputs((prev) => ({ ...prev, password: e.target.value }))
                  }
                  type="password"
                  id="password"
                />
              </div>
            </div>
          </form>
        </CardContent>
        <CardFooter className="flex mt-1">
          <Button
            disabled={!inputs.email || !inputs.password || !inputs.username}
            onClick={handleSignup}
            variant="custom"
            className="w-full"
          >
            Signup
          </Button>
        </CardFooter>
      </Card>
      <span className="mt-6 text-sm max-[400px]:pb-4">
        Already have an account?{" "}
        <Link className="text-neutral-400" href="/auth/login">
          Log in
        </Link>{" "}
      </span>
    </div>
  );
}
