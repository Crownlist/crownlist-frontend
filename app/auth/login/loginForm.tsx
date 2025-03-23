import Image from "next/image";
import login from "../../../public/assets/images/authbg.jpg";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input, Input2 } from "@/components/ui/custom-input";
import { Label } from "@/components/ui/label";
import { useRouter } from "next/navigation";


export function LoginForm({
  className,
  imageUrl,
  ...props
}: React.ComponentProps<"div"> & {
  imageUrl?: string;
}) {
  const router = useRouter()

  const handleClick = () =>{
    router.push('/')
  }
  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
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
                <h1 className="text-2xl text-crown-black">Login to Crownlist</h1>
                <p className="text-sm text-balance mt-1 text-crown-paragraph">
                  Enter your details below
                </p>
              </div>

              <div className="grid gap-3">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" placeholder="" required />
              </div>

              <div className="grid gap-3">
                <Label htmlFor="password">Password</Label>
                <Input2 id="password" type="password" required />
                
                <p className="">
                  <a
                    href="/auth/forgot-password"
                    className="mr-auto text-sm text-crown-black underline-offset-3 underline"
                  >
                    Forgot password?
                  </a>
                </p>
              </div>
              <Button type="submit" className="w-full mt-4"
              onClick={handleClick}
              >
                Login
              </Button>

              <p className="text-center text-sm mt-10 text-crown-black">
                Don&apos;t have an account?{" "}
                <a href="/auth/signup" className="underline underline-offset-4">
                  Sign up
                </a>
              </p>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
