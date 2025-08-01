"use client";
import Image from "next/image";
import login from "../../../public/assets/images/authbg.jpg";
import { cn } from "@/lib/utils";
// import { Card, CardContent } from "@/components/ui/card";
import { zodResolver } from "@hookform/resolvers/zod";
import { SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "../../../components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useSendForgetPwdLink, useSendForgetPwdOtp } from "@/lib/useForgetPassword";
import { toast } from "sonner";


const FormSchema = z.object({
  pin: z.string().min(5, {
    message: "Your one-time password must be 5 characters.",
  }),
});

export interface ResetPasswordData {
  pin: string;
}

export function VerifyForm({
  className,
  imageUrl,
  ...props
}: React.ComponentProps<"div"> & {
  imageUrl?: string;
}) {
  const router = useRouter();
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      pin: "",
    },
  });

  
  const [email, setEmail] = useState("");
  const { submit, isLoading } = useSendForgetPwdOtp();
  const { submit: resendLink, isLoading:isLinkLoading } =
    useSendForgetPwdLink();

  useEffect(() => {
    setEmail(sessionStorage.getItem("forgot-pwd-email") ?? "");
  }, []);

  const onSubmit: SubmitHandler<ResetPasswordData> = async (data) => {
    console.log(data)
    const token = data?.pin;
    console.log(token)
    const expirationTime = new Date().getTime() + (60 * 30 * 1000); // 1 hour from now
    sessionStorage.setItem("forgot-pwd-token", token);
    sessionStorage.setItem("forgot-pwd-token-expiration", expirationTime.toString());
  try {
    await submit({ ...data });
    toast.success(
      `Success, OTP verified successfully. Proceed to create a new password`
    );
    // handleNext();
    router.push('/auth/reset-password')
  } catch (error) {
    toast.error(`error ${String(error)}`);
  }
};

  const resendOtp = async () => {
    try {
      await resendLink({ email });
      toast.success(`Success, OTP has been re-sent to ${email}`);
    } catch (error) {
      toast.error(`error ${String(error)}`);
    }
  };

 
  return (
    <div className={cn("flex w-full h-full font-inter", className)} {...props}>
      <div className="w-full h-full flex flex-row justify-between relative ">
        <div className="h-screen relative hidden md:flex  w-[100%] ">
          {imageUrl && (
            <Image
              fill
              src={login}
              alt="Image"
              className="absolute inset-0 h-full w-full object-cover"
              priority={true}
            />
          )}
          {/* Overlay */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 to-transparent "></div>
        </div>
        <div
          className="min-h-screen flex flex-col gap-5 max-md:px-7 justify-center w-full items-center md:mt-2"
        // className="p-6 md:p-10 mt-10 md:col-span-3 lg:col-span-2"
        >
          <div className="flex flex-col gap-6">
            <div className="flex flex-col items-center md:items-start md:mb-[10px]">
              <h1 className="text-2xl">Verify your email</h1>
              <p className="text-sm text-balance mt-1">
                Please enter the code sent to <br className="hidden md:block" />
                &quot;Sample@gmail.com&quot;
              </p>
            </div>

            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                // className="min-h-screen flex flex-col gap-5 max-md:px-7 justify-center w-full items-center md:mt-2"   
                className="w-full flex gap-3 flex-col max-md:justify-center max-md:items-center"
              >
                <FormField
                  control={form.control}
                  name="pin"
                  render={({ field }) => (
                    <FormItem>
                      {/* <FormLabel>One-Time Password</FormLabel> */}
                      <FormControl>
                        <InputOTP maxLength={6} {...field}>
                          <InputOTPGroup className="space-x-4">
                            <InputOTPSlot index={0} />
                            <InputOTPSlot index={1} />
                            <InputOTPSlot index={2} />
                            <InputOTPSlot index={3} />
                            <InputOTPSlot index={4} />
                          </InputOTPGroup>
                        </InputOTP>
                      </FormControl>
                      <FormDescription className="mt-2 text-[13px] text-black text-center md:text-left">
                        Didn&apos;t get the code?{" "}
                        <span>
                          {" "}
                          <button onClick={()=> resendOtp()}
                            className="underline underline-offset-3 font-medium"
                          >
                            Resend{" "}
                          </button>
                        </span>
                      </FormDescription>
                      <FormMessage className="text-xs" />
                    </FormItem>
                  )}
                />
                <Button type="submit" className=" mt-2 w-full h-[43px] max-w-[250px]" disabled={isLoading || isLinkLoading}>
                  <div className="flex py-3">
                    {isLoading ? 'Sending...' : 'Continue'}
                  </div>
                </Button>{" "}
                <p className="text-center text-sm mt-4">
                  Do you have an account?{" "}
                  <a
                    href="/auth/login"
                    className="underline underline-offset-3"
                  >
                    Login
                  </a>
                </p>
              </form>
            </Form>
          </div>
        </div>
      </div>
    </div>
  );
}
