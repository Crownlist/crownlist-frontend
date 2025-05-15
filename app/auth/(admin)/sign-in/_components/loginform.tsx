/* eslint-disable */
"use client"
import Image from "next/image";
import login from "../../../public/assets/images/authbg.jpg";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input, Input2 } from "@/components/ui/custom-input";
import { Label } from "@/components/ui/label";
import { useRouter } from "next/navigation";


export function LoginForm({
  className,
}: React.ComponentProps<"div"> ) {
  const router = useRouter()

  const handleClick = (e : any) => {
    e.preventDefault();
    router.push('/admin/dashboard')
  }
  return (
    <div className={cn("flex justify-center  h-full font-inter", className)}>
      <div className="w-full h-full flex flex-row justify-center relative ">
        <form className="min-h-screen flex max-md:px-7 justify-center w-full items-center md:mt-2">
          <div className="flex flex-col gap-6 justify-center w-full  max-w-3xl md:px-20">
            <div className="flex flex-col items-start md:items-center text-start mb-[10px]">
              <h1 className="text-2xl text-crown-black font-semibold">Login to Crownlist</h1>
              <p className="text-sm text-balance mt-3 text-crown-paragraph">
                Enter your details below
              </p>
            </div>

            <div className="grid gap-3">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" placeholder="" required className="p-3" />
            </div>

            <div className="grid gap-3 ">
              <Label htmlFor="password">Password</Label>
              <Input2 id="password" type="password" required  className="p-3"/>

              <p className="">
                <a
                  href="/auth/forgetpassword"
                  className="mr-auto text-sm text-crown-black underline-offset-3 underline"
                >
                  Forgot password?
                </a>
              </p>
            </div>
            <Button type="submit" className="w-full h-full mt-3"
              onClick={handleClick}
            >
              <div className="flex flex-row gap-3 py-1 items-center ">
                Login</div>
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
