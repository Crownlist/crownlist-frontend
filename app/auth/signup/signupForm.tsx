import Image from "next/image";
import login from "../../../public/assets/images/authbg.jpg";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input, Input2 } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";

export function SignupForm({
  className,
  imageUrl,
  ...props
}: React.ComponentProps<"div"> & {
  imageUrl?: string;
}) {
  return (
    <div className={cn("flex flex-col gap-6 font-inter", className)} {...props}>
      <Card className="overflow-hidden p-0">
        <CardContent className="grid p-0 md:grid-cols-5">
          <div className="h-screen relative hidden md:block md:col-span-2 lg:col-span-3">
            {imageUrl && (
              <Image
                fill
                src={login}
                alt="Image"
                className="absolute inset-0 h-full w-full object-cover"
                priority={true}
              />
            )}
          </div>
          <form className="p-6 md:p-10 mt-10 md:col-span-3 lg:col-span-2">
            <div className="flex flex-col gap-6">
              <div className="flex flex-col items-center md:items-start text-center mb-[10px]">
                <h1 className="text-2xl">Sign up</h1>
                <p className="text-sm text-balance mt-1">
                  Enter your details below
                </p>
              </div>

              <div className="grid gap-3">
                <Label htmlFor="name">Full name</Label>
                <Input id="name" type="text" placeholder="" required />
              </div>

              <div className="grid gap-3">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" placeholder="" required />
              </div>

              <div className="grid gap-3">
                <Label htmlFor="password">Password</Label>
                <Input2 id="password" type="password" required />
              </div>

              <div className="grid gap-3">
                <Label htmlFor="confirm_password">Confirm Password</Label>
                <Input2 id="confirm_password" type="password" required />
                <p className="text-[12px] *:[a]:hover:text-primary text-center text-balance *:[a]:underline *:[a]:underline-offset-4">
                  By clicking &quot;continue&quot;, you agree to Crownlist&apos;s{" "}
                  <a
                    href="#"
                    className="underline underline-offset-3 font-medium"
                  >
                    Terms of use
                  </a>{" "}
                  and{" "}
                  <a
                    href="#"
                    className="underline underline-offset-3 font-medium"
                  >
                    Privacy Policy
                  </a>
                  .
                </p>
              </div>

              <Link href="/auth/signup/verify">
                <Button type="submit" className="w-full mt-4">
                  Continue
                </Button>
              </Link>

              <p className="text-center text-sm mt-10">
                Do you have an account?{" "}
                <a href="/auth/login" className="underline underline-offset-3">
                  Login
                </a>
              </p>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
export default SignupForm;
