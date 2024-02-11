"use client";

import {
  LogOut,
  Menu as MenuIcon,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import axios, { AxiosError } from "axios";
import { useToast } from "./ui/use-toast";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {httpRequestLocal } from "@/lib/interceptor";
import { useSession } from "next-auth/react";

const EDIT_INITIAL = {
  username: "",
  avatar: "",
  apiKey: "",
};

export default function Menu({ clear }: { clear?: () => void }) {
  const { toast } = useToast();
  const { push } = useRouter();
  const [mode, setMode] = useState("dark");
  const [open, setOpen] = useState(false);
  const [edit, setEdit] = useState(EDIT_INITIAL);
  const { data: session } = useSession();

  useEffect(() => {
    let localMode = localStorage.getItem("mode");
    if (!localMode) {
      return;
    }
    if (localMode == "dark") {
      document.getElementById("mode")?.classList.add("dark");
      setMode("dark");
    } else {
      document.getElementById("mode")?.classList.remove("dark");
      setMode("light");
    }
  }, []);

  function handleLogout() {
    axios
      .delete("/api/auth/logout")
      .then(() => {
        localStorage.clear();
        push("/auth/login");
        toast({
          title: "Logged out",
          description: "successfuly logged out user",
        });
      })
      .catch((err) => {
        if (err instanceof AxiosError)
          toast({
            title: "Logout unsuccessful",
            description: err.response?.data.message,
          });
      });
  }

  function toggleMode() {
    document.getElementById("mode")?.classList.toggle("dark");
    const v = mode == "light" ? "dark" : "light";
    setMode(() => v);
    localStorage.setItem("mode", v);
  }

  function handleClear() {
    console.log("dsf");
    location.reload();
    httpRequestLocal
      .delete("/api/chat")
      .then(() => {
        if(clear){
          clear();
        }
      })
      .catch((err) => {
        toast({
          title: "Error",
          description: err.response?.data.message,
        });
      });
  }

  function handleUpdate() {
    httpRequestLocal
      .put("/api/profile", {
        ...edit,
      })
      .then(({ data }) => {
        localStorage.setItem("user", JSON.stringify(data));
      })
      .catch((err) => {
        toast({
          title: "Error",
          description: err.response?.data.message,
        });
      });
  }

  useEffect(() => {
    if (open) {
      setEdit(EDIT_INITIAL);
    }
  }, [open]);

  return (
    <>
      <div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              className="absolute top-7 left-5 max-[500px]:left-2 border-2 dark:border-neutral-700 dark:bg-neutral-950 bg-neutral-100 border-neutral-300"
              variant="ghost"
            >
              <MenuIcon className="w-5 h-5" />{" "}
              <span className="ml-2">Menu</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56 ml-6">
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => {
                handleLogout();
              }}
            >
              <LogOut className="mr-2 h-4 w-4" />
              <span>Log out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </>
  );
}
