import Image from "next/image";
import login from "../../../public/assets/images/authbg.jpg";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input2 } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";

export function ResetForm({
  className,
  imageUrl,
  ...props
}: React.ComponentProps<"div"> & {
  imageUrl?: string;
}) {
  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="overflow-hidden p-0">
        <CardContent className="grid p-0 md:grid-cols-5">
          <div className=" h-screen relative hidden md:block md:col-span-2 lg:col-span-3">
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
                <h1 className="text-2xl">Reset Password</h1>
                <p className="text-sm text-balance mt-1">
                  Please reset password with details below
                </p>
              </div>
              <div className="grid gap-3">
                <Label htmlFor="password">Password</Label>
                <Input2 id="password" type="password" required />
              </div>

              <div className="grid gap-3">
                <Label htmlFor="confirm_password">Confirm Password</Label>
                <Input2 id="confirm_password" type="password" required />
              </div>

              <Link href="/auth/login">
                <Button type="submit" className="w-full mt-4">
                  Continue
                </Button>
              </Link>

              <p className="text-center text-sm mt-10">
                Remember password?{" "}
                <a href="/auth/login" className="underline underline-offset-4">
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
